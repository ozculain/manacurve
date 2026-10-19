#!/usr/bin/env node
'use strict';
// Round 3 coverage: of the Round 3 questions players meet, how many are short authored
// situations (POOL_B and POOL_C in index.html) and how many fall back to one of the eight
// generic situations with an answer for each of the 31 identities (ROUND2_SCENARIOS in data.js).
//
// Round 3 plays each pair of the top four candidates once (a tiebreak can add up to two more
// matches on the top two). For each match the page first looks for a short situation that
// covers the pair (getPoolScenarioForMatchup: one of the two identities owns it and both appear
// among its options, and it has not been used earlier in the same Round 3); otherwise it falls
// back to the generic rotation. A match's scenario id says which: a short situation's is
// POOLB:<owner>:<n> or POOLC:<owner>:<n>, a generic one's a bare word (CRISIS, PIVOT, ...).
//
// Simulated respondents (tests/_lib/respondent.js: the ideal, misspecified and mixed models)
// go through the real Rounds 1 to 3 on the page as tests/_lib/load.js boots it, with the page's
// own handlers and scoring, and every match in state.tournament.matchHistory is recorded. The
// report gives, for each model and p, the questions played and the share a short situation
// covered, then the pairs played with a generic situation, most frequent first. For each such
// pair, "written" counts the short situations that cover it at all: 0 means none does, and a
// number means they were all used by other matches of the same Round 3 first.
//
// Usage: node tools/round3-coverage.js [--n 4] [--seed 1] [--models ideal,misspecified,mixed]
//          [--p 0.65,0.8] [--engine 4] [--top 40] [--json file] [path/to/index.html]
//   --n      respondents per identity for each model and p
//   --top    how many uncovered pairs to list (0 lists them all)
//   --json   also write every match played, per respondent, to this file
// With a path to another build's index.html (its data.js beside it), that build is measured.
// Synthetic respondents say which matchups the scoring brings together, not what people make of
// the situations.
const fs = require('fs');
const path = require('path');
const { bootPage } = require('../tests/_lib/load');
const { runRespondent, calibrateMisspecified, MODEL_NAMES } = require('../tests/_lib/respondent');

// ---------- options ----------
function fail(msg) { console.error(msg); process.exit(2); }
function parseArgs(argv) {
  const o = { n: 4, seed: 1, models: [...MODEL_NAMES], p: [0.65, 0.8], engine: 4, top: 40, json: null, htmlPath: null, dataPath: null };
  const num = (k, v) => { const x = Number(v); if (v === undefined || v === '' || !Number.isFinite(x)) fail('Bad value for --' + k); return x; };
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--') && /\.html?$/i.test(argv[i])) {
      o.htmlPath = path.resolve(argv[i]); o.dataPath = path.join(path.dirname(o.htmlPath), 'data.js'); continue;
    }
    const k = argv[i].replace(/^--/, '');
    const v = argv[++i];
    if (k === 'n' || k === 'seed' || k === 'top' || k === 'engine') o[k] = num(k, v);
    else if (k === 'models' || k === 'model') o.models = v === 'all' ? [...MODEL_NAMES] : String(v).split(',');
    else if (k === 'p') o.p = String(v).split(',').map((x) => num('p', x));
    else if (k === 'json') { if (!v) fail('Bad value for --json'); o.json = path.resolve(v); }
    else fail('Unknown option ' + argv[i - 1]);
  }
  for (const m of o.models) if (!MODEL_NAMES.includes(m)) fail(`Unknown model "${m}"; expected ${MODEL_NAMES.join(', ')} or all`);
  for (const p of o.p) if (!(p >= 0 && p <= 1)) fail('--p values must lie between 0 and 1');
  if (![1, 2, 3, 4].includes(o.engine)) fail('--engine is 1, 2, 3 or 4');
  if (!(o.n >= 1)) fail('--n is at least 1');
  return o;
}

// ---------- reading the page ----------
const isShort = (scenarioId) => /^POOL[BC]:/.test(String(scenarioId || ''));
const pairKey = (a, b) => [a, b].sort().join(' v ');

// How many short situations cover each pair: one of the two owns the situation and both are
// among its options (the rule in getPoolScenarioForMatchup).
function writtenCoverage(win) {
  const counts = new Map();
  for (const pool of ['POOL_B', 'POOL_C']) {
    const entries = win.eval(pool);
    for (const [owner, list] of Object.entries(entries)) {
      for (const sc of list) {
        for (const o of sc.r) {
          if (o.g === owner) continue;
          const k = pairKey(owner, o.g);
          counts.set(k, (counts.get(k) || 0) + 1);
        }
      }
    }
  }
  return counts;
}

// ---------- the run ----------
const yieldToEventLoop = () => new Promise((resolve) => setImmediate(resolve));

async function measure(opts) {
  const url = opts.engine === 4 ? 'http://localhost/' : `http://localhost/?engine=${opts.engine}`;
  const { win, h, errors } = bootPage({
    url, seed: opts.seed, stubs: { calculating: 'skip' }, fastStyles: true,
    htmlPath: opts.htmlPath || undefined, dataPath: opts.dataPath || undefined,
  });
  const ids = Object.keys(h.PROFILES);
  const written = writtenCoverage(win);
  const runs = [];
  for (const model of opts.models) {
    for (const p of opts.p) {
      const params = { model, p, neither: 0.05, seed: opts.seed };
      if (model !== 'ideal') params.calibration = calibrateMisspecified(p);
      const respondents = [];
      for (const id of ids) {
        for (let idx = 0; idx < opts.n; idx++) {
          const r = runRespondent(win, id, idx, params);
          const t = h.state.tournament;
          respondents.push({
            trueId: id, idx, result: r.recovered,
            candidates: t ? t.candidates.map((c) => c.id) : [],
            matches: t ? t.matchHistory.map((m) => ({ a: m.a.id, b: m.b.id, scenarioId: m.scenarioId, type: m.type })) : [],
          });
          await yieldToEventLoop();
        }
      }
      runs.push({ model, p, respondents });
    }
  }
  win.close();
  return { runs, written, errors };
}

// ---------- the report ----------
const pct = (x) => (100 * x).toFixed(1).padStart(5) + '%';

function summarise(run) {
  let questions = 0, short = 0, tiebreaks = 0;
  for (const r of run.respondents) {
    for (const m of r.matches) {
      questions++;
      if (isShort(m.scenarioId)) short++;
      if (m.type === 'POOL_TIEBREAK') tiebreaks++;
    }
  }
  return { questions, short, tiebreaks, coverage: questions ? short / questions : 0 };
}

function report(opts, { runs, written, errors }) {
  const L = [];
  const people = runs.reduce((n, r) => n + r.respondents.length, 0);
  L.push('Round 3 coverage: short situations (POOL_B, POOL_C) against the 31-answer lists (ROUND2_SCENARIOS)');
  L.push(`engine ${opts.engine}, seed ${opts.seed}, ${opts.n} respondent${opts.n === 1 ? '' : 's'} per identity for each model and p (${people} in all)`);
  L.push('');
  L.push('model          p     questions   short  coverage  tiebreaks');
  let all = { questions: 0, short: 0, tiebreaks: 0 };
  const rows = [];
  for (const run of runs) {
    const s = summarise(run);
    rows.push({ model: run.model, p: run.p, ...s });
    all = { questions: all.questions + s.questions, short: all.short + s.short, tiebreaks: all.tiebreaks + s.tiebreaks };
    L.push(`${run.model.padEnd(14)} ${String(run.p).padEnd(5)} ${String(s.questions).padStart(9)} ${String(s.short).padStart(7)}  ${pct(s.coverage).padStart(8)}  ${String(s.tiebreaks).padStart(9)}`);
  }
  const allCoverage = all.questions ? all.short / all.questions : 0;
  L.push(`${'all'.padEnd(20)} ${String(all.questions).padStart(9)} ${String(all.short).padStart(7)}  ${pct(allCoverage).padStart(8)}  ${String(all.tiebreaks).padStart(9)}`);
  const lowest = rows.reduce((m, r) => (r.coverage < m.coverage ? r : m), rows[0]);
  L.push(`lowest: ${lowest.model} at p ${lowest.p}, ${pct(lowest.coverage).trim()}`);

  // The pairs played with a generic situation, most frequent first.
  const uncovered = new Map();
  for (const run of runs) {
    for (const r of run.respondents) {
      for (const m of r.matches) {
        if (isShort(m.scenarioId)) continue;
        const k = pairKey(m.a, m.b);
        const u = uncovered.get(k) || { pair: k, n: 0, byRun: {} };
        u.n++;
        const rk = run.model + ' ' + run.p;
        u.byRun[rk] = (u.byRun[rk] || 0) + 1;
        uncovered.set(k, u);
      }
    }
  }
  const ranked = [...uncovered.values()].sort((a, b) => b.n - a.n || a.pair.localeCompare(b.pair));
  const shown = opts.top ? ranked.slice(0, opts.top) : ranked;
  L.push('');
  L.push(`Pairs played with a 31-answer list: ${ranked.length}, ${all.questions - all.short} questions. Most frequent first`);
  L.push('("cum" is the coverage if this pair and those above it were all covered; "written" counts the short');
  L.push('situations that cover the pair at all: 0 = none, otherwise all used up by other matches first)');
  L.push('  rank  pair                       n   share     cum  written');
  let cum = all.short;
  ranked.forEach((u, i) => {
    cum += u.n;
    if (i >= shown.length) return;
    L.push(`  ${String(i + 1).padStart(4)}  ${u.pair.padEnd(24)} ${String(u.n).padStart(3)}  ${pct(u.n / all.questions)}  ${pct(cum / all.questions)}  ${String(written.get(u.pair) || 0).padStart(7)}`);
  });
  if (shown.length < ranked.length) L.push(`  ... ${ranked.length - shown.length} more pairs (--top 0 lists them all)`);
  const none = ranked.filter((u) => !written.get(u.pair));
  const usedUp = ranked.filter((u) => written.get(u.pair));
  L.push('');
  L.push(`Of the ${all.questions - all.short} questions on a 31-answer list, ${none.reduce((n, u) => n + u.n, 0)} were on a pair no short situation covers`
    + ` and ${usedUp.reduce((n, u) => n + u.n, 0)} on a pair whose short situations were already used.`);
  if (errors.length) { L.push(''); L.push(`Page errors: ${errors.length}; first: ${errors[0]}`); }
  return { text: L.join('\n'), rows, all: { ...all, coverage: allCoverage }, ranked };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const t0 = Date.now();
  const measured = await measure(opts);
  const out = report(opts, measured);
  console.log(out.text);
  console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  if (opts.json) {
    fs.mkdirSync(path.dirname(opts.json), { recursive: true });
    fs.writeFileSync(opts.json, JSON.stringify({ options: { ...opts, json: undefined }, summary: out.rows, all: out.all, runs: measured.runs }, null, 1));
  }
  if (measured.errors.length) process.exit(1);
}

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });

module.exports = { isShort, pairKey, writtenCoverage, measure, summarise, report };
