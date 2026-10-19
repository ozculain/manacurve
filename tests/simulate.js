#!/usr/bin/env node
// Offline respondent simulation for The Mana Curve.
// Boots index.html once per worker thread (and scoring engine) in jsdom, then
// drives many synthetic respondents through Rounds 1-3 using the page's own
// handlers and scoring code (unchanged). The respondent models live in
// tests/_lib/respondent.js.
// Usage: node tests/simulate.js [--n 200] [--p 0.8[,0.9,...]] [--neither 0.05] [--seed 1[,2,...]]
//          [--model ideal|misspecified|mixed | --models both|all|a,b] [--engine 3 | --engine 1,2,3]
//          [--r3 page,q=0.85,tour,...] [--gaming] [--workers auto] [--out tests/out/simulation.json]
//          [--five-band 20] [--rows] [path/to/another/index.html]
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const ROOT = path.resolve(__dirname, '..');
const { bootPage } = require('./_lib/load');
const { runRespondent, calibrateMisspecified, signalAt, MIXED, MODEL_NAMES } = require('./_lib/respondent');

// The page's default engine (3); ?engine=1 selects the win-rate engine and ?engine=2
// the likelihood engine with Round 3 answers weighed as in scoring version 2, for one release.
const ENGINES = [1, 2, 3];
const DEFAULT_ENGINE = 3;
// The instrument version the page stamps on a finished result (INSTRUMENT_VERSION in
// index.html): 11 since the result pages, question lines, Round 3 situations and interface strings were rewritten (10 since the Red answers were rewritten as conviction and the counter said
// "of up to" (9 for Round 3's short situations for the matchups players meet, 8 for the
// second naive-reader round of the questions, 7 for the
// questions rewritten from naive readers, 6 for the persona check of all questions, 5 for the Round 1 and 2 real-stakes items, 4 for the
// Plain screens copy, 3 for the Round 1 and 2 copy rewrite, 2 for the Phase 3 quiz copy).
const INSTRUMENT_VERSION = 11;
const engineUrl = (engine) => (engine === DEFAULT_ENGINE ? 'http://localhost/' : `http://localhost/?engine=${engine}`);

// ---------- CLI ----------
function fail(msg) { console.error(msg); process.exit(2); }
function parseArgs(argv) {
  const o = { n: 200, p: [0.8], neither: 0.05, seeds: [1], workers: 0, models: ['ideal'], engines: [DEFAULT_ENGINE], gaming: false, rows: false, out: null, r3: null, htmlPath: null, dataPath: null, fiveBand: null };
  const num = (k, v) => { const x = Number(v); if (v === undefined || v === '' || !Number.isFinite(x)) fail('Bad value for --' + k); return x; };
  for (let i = 0; i < argv.length; i++) {
    // Another build's index.html (its data.js beside it), as the page tests take one.
    if (!argv[i].startsWith('--') && /\.html?$/i.test(argv[i])) {
      o.htmlPath = path.resolve(argv[i]); o.dataPath = path.join(path.dirname(o.htmlPath), 'data.js'); continue;
    }
    const k = argv[i].replace(/^--/, '');
    if (k === 'gaming') { o.gaming = true; continue; } // a flag: takes no value
    if (k === 'rows') { o.rows = true; continue; }     // a flag: takes no value
    const v = argv[++i];
    if (['n', 'neither', 'workers'].includes(k)) o[k] = num(k, v);
    else if (k === 'seed' || k === 'seeds') o.seeds = String(v).split(',').map((x) => num('seed', x));
    else if (k === 'p') o.p = String(v).split(',').map((x) => num('p', x));
    else if (k === 'model') o.models = [String(v)];
    else if (k === 'models') o.models = v === 'both' ? ['ideal', 'misspecified'] : v === 'all' ? [...MODEL_NAMES] : String(v).split(',');
    else if (k === 'engine' || k === 'engines') o.engines = v === 'all' ? [...ENGINES] : String(v).split(',').map((x) => num('engine', x));
    else if (k === 'r3') { if (!v) fail('Bad value for --r3'); o.r3 = String(v).split(',').map(parseVariant); }
    else if (k === 'out') { if (!v) fail('Bad value for --out'); o.out = path.resolve(v); }
    // The Five-colour band the checks and the report assume, for a build that
    // uses another one (the page's FIVE_COLOUR_BAND; default below).
    else if (k === 'five-band') { o.fiveBand = num(k, v); if (!(o.fiveBand >= 0 && o.fiveBand <= 100)) fail('--five-band is in printed points, 0 to 100'); }
    else fail('Unknown option ' + argv[i - 1]);
  }
  for (const m of o.models) if (!MODEL_NAMES.includes(m)) fail(`Unknown model "${m}"; expected ${MODEL_NAMES.join(', ')}, or --models both or all`);
  for (const e of o.engines) if (!ENGINES.includes(e)) fail(`Unknown engine "${e}"; expected ${ENGINES.join(', ')}, or a list such as --engine 2,3`);
  for (const p of o.p) if (p < 0 || p > 1) fail('--p values must lie between 0 and 1');
  if (o.r3 && o.engines.some((e) => e < 2)) fail('--r3 varies the likelihood engine (2 or 3) only; drop --engine 1');
  if (o.htmlPath && !fs.existsSync(o.htmlPath)) fail('No such build: ' + o.htmlPath);
  o.n = Math.max(1, Math.floor(o.n));
  o.p = [...new Set(o.p)];
  o.seeds = [...new Set(o.seeds)];
  o.models = [...new Set(o.models)];
  o.engines = [...new Set(o.engines)];
  if (o.r3) {
    const names = o.r3.map((v) => v.name);
    if (new Set(names).size !== names.length) fail('--r3 lists a variant twice');
  }
  return o;
}

// ---------- Round 3 decision variants (--r3) ----------
// A variant changes how engine 2 turns the Round 3 answers into the reported
// identity, so its trade-offs are measured on the same respondents:
//   page     the build as it is
//   q=X      Round 3 discrimination fixed at X: the page's round3LogLikelihoods
//            gets qGrid [X] wherever the page passes no grid of its own (as
//            built it averages q over ROUND3_Q_GRID). The posterior changes,
//            and with it the tiebreak questions, so this runs on the page.
//   pm       the candidate with the highest final posterior: what engine 2
//            reported before round3RecordRanking, so on this build pm is the
//            "before" of that change and page the "after"
//   tour     the tournament winner (the page's getTournamentWinner on the same
//            matches) when it beat the posterior maximum head-to-head (won more
//            of their matches than it lost)
//   lostall  the best-posterior candidate that did not lose every match, when
//            the posterior maximum lost every match it played
//   losing   the best-posterior candidate without a losing record, when the
//            posterior maximum has one (fewer wins than losses)
//   net      as losing, but the margin below is raised to the power of the
//            posterior maximum's net losses (losses minus wins)
//   rule:M   ...unless the posterior maximum's posterior is at least M times
//            the runner-up's (the next candidate by posterior)
//   losing:M:M0  as losing:M, with M0 in place of M when the posterior maximum
//            won no match at all
// Round 3 models, written out here so a variant does not lean on the page's
// own code; any of these parts replaces the page's round3LogLikelihoods with
// this file's (round3ModelLogLik), on the page, so the posterior, the tiebreak
// questions it asks for and the result all follow it:
//   jaccard  the sign of a match for identity S from Jaccard similarity: +1
//            when the winner's colours are closer to S's, -1 when the loser's
//            are, 0 on a tie (the page's sign, on engines 2 and 3; the default)
//   symdiff  the sign from the colours where the winner and loser differ: the
//            share of them on which S agrees with the winner minus the share
//            on which it agrees with the loser, so -1 to +1, and a split is 0
//   qg=A:B   q averaged over A, A + 0.05, ..., B instead of the page's
//            ROUND3_Q_GRID (q=X with any of these parts: q fixed at X); so on
//            the current build jaccard is engine 3 and jaccard+qg=0.55:0.9 is
//            engine 2
//   own      a match counts only for the two identities that played it
//   cap=X    no identity's Round 3 term more than X nats below the best one's
// A sign s weighs a match as P(winner | S) = 1/2 + (q - 1/2) s, which is the
// page's q, 1 - q or 1/2 at s = +1, -1 or 0.
// Parts combine with '+' (q=0.85+losing:4, symdiff+qg=0.55:0.75); several
// rules are tried in order and the first that changes the result decides it.
// The rules act after the last answer, so they change no question: they are
// applied to what the page recorded at its own decision, with the confidence
// label the page would have given the identity they pick (its posterior, the
// cycle rule and both caps).
const RULES = ['pm', 'tour', 'lostall', 'losing', 'net'];
const Q_STEP = 0.05;
function parseVariant(spec) {
  const v = { name: String(spec).trim(), rules: [] };
  const model = {};
  for (const part of v.name.split('+')) {
    let m;
    if (part === 'page') continue;
    if ((m = /^q=?(\d*\.?\d+)$/.exec(part))) {
      model.q = Number(m[1]);
      if (!(model.q >= 0.5 && model.q < 1)) fail(`--r3 ${part}: q must lie in [0.5, 1)`);
    } else if (part === 'jaccard' || part === 'symdiff') {
      if (model.sign) fail(`--r3 ${v.name}: one sign, jaccard or symdiff`);
      model.sign = part;
    } else if ((m = /^qg=(\d*\.?\d+):(\d*\.?\d+)$/.exec(part))) {
      const [lo, hi] = [Number(m[1]), Number(m[2])];
      if (!(lo >= 0.5 && lo <= hi && hi < 1)) fail(`--r3 ${part}: the grid runs from A to B, 0.5 <= A <= B < 1`);
      model.grid = [];
      for (let k = 0; lo + k * Q_STEP <= hi + 1e-9; k++) model.grid.push(Math.round((lo + k * Q_STEP) * 1000) / 1000);
    } else if (part === 'own') {
      model.own = true;
    } else if ((m = /^cap=(\d*\.?\d+)$/.exec(part))) {
      model.cap = Number(m[1]);
      if (!(model.cap > 0)) fail(`--r3 ${part}: the cap is in nats, above 0`);
    } else if ((m = /^([a-z]+)(?::(\d*\.?\d+))?(?::(\d*\.?\d+))?$/.exec(part)) && RULES.includes(m[1])) {
      const [margin, margin0] = [m[2], m[3]].map((x) => (x === undefined ? undefined : Number(x)));
      if ([margin, margin0].some((x) => x !== undefined && !(x >= 1))) fail(`--r3 ${part}: a margin is a posterior ratio, at least 1`);
      if (margin0 !== undefined && m[1] !== 'losing') fail(`--r3 ${part}: only losing takes a second margin`);
      v.rules.push({ kind: m[1], margin, margin0 });
    } else fail(`Unknown --r3 variant "${part}"; expected page, q=X, jaccard, symdiff, qg=A:B, own, cap=X, ${RULES.join(', ')} (optionally rule:M, losing:M:M0), joined with +`);
  }
  if (model.q !== undefined && model.grid) fail(`--r3 ${v.name}: q=X and qg=A:B both set the grid`);
  // The model the page runs: null for the page's own; { q } for the page's own
  // function at one q; otherwise this file's, from its parts.
  model.sim = !!(model.sign || model.grid || model.own || model.cap !== undefined);
  const key = [model.sign, model.q !== undefined ? 'q=' + model.q : null, model.grid ? `qg=${model.grid[0]}:${model.grid[model.grid.length - 1]}` : null,
    model.own ? 'own' : null, model.cap !== undefined ? 'cap=' + model.cap : null].filter(Boolean).join('+');
  v.model = key ? { ...model, key } : null;
  v.modelKey = key || 'page';
  return v;
}

// Round 3 log-likelihoods of every identity under a --r3 model, marginalised
// over its grid, in the shape of the page's round3LogLikelihoods.
const WUBRG_COLOURS = ['W', 'U', 'B', 'R', 'G'];
function jaccardOf(a, b) {
  const inter = a.filter((c) => b.includes(c)).length;
  return inter / (a.length + b.length - inter);
}
function round3Sign(model, S, W, L) {
  if (model.sign === 'symdiff') {
    const differ = WUBRG_COLOURS.filter((c) => W.includes(c) !== L.includes(c));
    if (!differ.length) return 0;
    const withWinner = differ.filter((c) => S.includes(c) === W.includes(c)).length;
    return (2 * withWinner - differ.length) / differ.length;
  }
  return Math.sign(jaccardOf(W, S) - jaccardOf(L, S));
}
// log(2 P(winner | S)): exactly the page's terms at s = +1, -1 and 0.
const matchTerm = (q, s) => (s === 1 ? Math.log(2 * q) : s === -1 ? Math.log(2 * (1 - q)) : s === 0 ? 0 : Math.log(1 + (2 * q - 1) * s));
function round3ModelLogLik(win, matchHistory, model) {
  const P = win.__h.PROFILES;
  const grid = model.grid || (model.q !== undefined ? [model.q] : win.eval('ROUND3_Q_GRID'));
  const matches = (matchHistory || []).filter((m) => m && m.winner && m.loser && P[m.winner.id] && P[m.loser.id]);
  const out = {};
  for (const id of Object.keys(P)) {
    const S = P[id].colors;
    const signs = matches.map((m) => (model.own && m.winner.id !== id && m.loser.id !== id ? 0
      : round3Sign(model, S, P[m.winner.id].colors, P[m.loser.id].colors)));
    out[id] = win.logMeanExp(grid.map((q) => signs.reduce((sum, s) => sum + matchTerm(q, s), 0)));
  }
  if (model.cap !== undefined) {
    const top = Math.max(...Object.values(out));
    for (const id of Object.keys(out)) out[id] = Math.max(out[id], top - model.cap);
  }
  return out;
}

// Installed on a page only when --r3 is given. Top-level functions of the
// page's script are properties of its window, and the page calls them through
// the global scope, so these wrappers see every call.
function installRound3Hooks(win) {
  const loglik = win.round3LogLikelihoods, decide = win.applyPosteriorDecision;
  if (typeof loglik !== 'function' || typeof decide !== 'function') throw new Error('--r3 needs the likelihood engine (round3LogLikelihoods, applyPosteriorDecision) in this build');
  win.round3LogLikelihoods = function (matchHistory, opts) {
    const model = win.__simR3 ? win.__simR3.model : null;
    if (!model) return loglik(matchHistory, opts);
    if (model.sim) return round3ModelLogLik(win, matchHistory, model);
    return loglik(matchHistory, opts && opts.qGrid ? opts : Object.assign({}, opts, { qGrid: [model.q] }));
  };
  // What the page knew when it decided: the tournament winner (finishRound3Tournament
  // asks getTournamentWinner first and hands its result in), every candidate's
  // final posterior, and the label each would get as the result.
  win.applyPosteriorDecision = function (result, tournament) {
    const tw = result && result.winner ? result.winner.id : null;
    const out = decide(result, tournament);
    const st = win.__h.state, post = out.posterior;
    const ids = tournament.candidates.map((c) => c.id);
    const conf = {};
    for (const c of tournament.candidates) {
      const as = { winner: c, cycle: result.cycle, confidence: win.confidenceFromPosterior(post[c.id]) };
      if (as.cycle && as.cycle.includes(c.id)) as.confidence = 'LOW';
      win.applyScenarioContradictionGuard(as, st.activationSorted);
      win.applyContextAgreementGuard(as);
      conf[c.id] = as.confidence;
    }
    win.__simR3facts = { tw, ids, post: Object.fromEntries(ids.map((id) => [id, post[id]])), conf };
    return out;
  };
}
function round3Facts(win) {
  const t = win.__h.state.tournament, f = win.__simR3facts;
  if (!t || !f) return null;
  return {
    ...f,
    rec: Object.fromEntries(t.candidates.map((c) => [c.id, [c.wins || 0, c.losses || 0]])),
    m: t.matchHistory.map((x) => [x.winner.id, x.loser.id]),
  };
}

// Candidates by final posterior, best first; ties keep the seeding order, as
// the page's stable sort does.
const rankByPosterior = (f) => f.ids.map((id, i) => [id, i]).sort((a, b) => f.post[b[0]] - f.post[a[0]] || a[1] - b[1]).map(([id]) => id);
const lostEvery = (rec) => rec[0] === 0 && rec[1] > 0;
const losingRecord = (rec) => rec[0] < rec[1];
function headToHead(matches, a, b) {
  let s = 0;
  for (const [w, l] of matches) { if (w === a && l === b) s++; else if (w === b && l === a) s--; }
  return s;
}
function decideRound3(f, rules) {
  const order = rankByPosterior(f), pm = order[0], ru = order[1];
  for (const rule of rules) {
    if (rule.kind === 'pm') continue;
    const [w, l] = f.rec[pm];
    const margin = rule.margin === undefined ? undefined
      : rule.kind === 'net' ? rule.margin ** Math.max(0, l - w)
      : rule.margin0 !== undefined && w === 0 ? rule.margin0 : rule.margin;
    if (margin !== undefined && ru && f.post[pm] >= margin * f.post[ru]) continue;
    let alt = null;
    if (rule.kind === 'tour') alt = f.tw && f.tw !== pm && headToHead(f.m, f.tw, pm) > 0 ? f.tw : null;
    else if (rule.kind === 'lostall') alt = lostEvery(f.rec[pm]) ? order.find((id) => !lostEvery(f.rec[id])) : null;
    else if (rule.kind === 'losing' || rule.kind === 'net') alt = losingRecord(f.rec[pm]) ? order.find((id) => !losingRecord(f.rec[id])) : null;
    if (alt) return alt;
  }
  return pm;
}
function variantRun(run, v) {
  if (!v.rules.length || !run.r3) return run;
  const id = decideRound3(run.r3, v.rules);
  return id === run.recovered ? run : { ...run, recovered: id, confidence: run.r3.conf[id] };
}

// ---------- Worker ----------
// One jsdom page per worker thread and engine (not per respondent). Every
// respondent has its own seeded streams, so results do not depend on how work
// is sharded. The worker yields to the event loop after each respondent: the
// page's MutationObservers (progress chrome only) queue a record per DOM
// change, and run back to back the queue held every removed node, about
// 1.7 MB per respondent, until the heap ran out.
const yieldToEventLoop = () => new Promise((resolve) => setImmediate(resolve));
async function workerMain() {
  const { configs, tasks, htmlPath, dataPath } = workerData;
  const t = Date.now();
  const pages = {};
  for (const engine of [...new Set(tasks.map(([ci]) => configs[ci].engine))]) {
    pages[engine] = bootPage({ url: engineUrl(engine), stubs: { calculating: 'skip' }, fastStyles: true, htmlPath: htmlPath || undefined, dataPath: dataPath || undefined });
    if (configs.some((c) => c.r3)) installRound3Hooks(pages[engine].win);
  }
  const bootMs = Date.now() - t;
  const one = (ci, id, i) => {
    const c = configs[ci], win = pages[c.engine].win;
    if (c.r3) { win.__simR3 = { model: c.r3model }; win.__simR3facts = null; }
    const r = { ci, ...runRespondent(win, id, i, c) };
    if (c.r3) r.r3 = round3Facts(win);
    return r;
  };
  // Independence check, per page: replaying a respondent after a different one
  // on the same page must reproduce its first result exactly.
  let independent = true;
  for (const engine of Object.keys(pages)) {
    const mine = configs.map((c, ci) => ci).filter((ci) => String(configs[ci].engine) === engine);
    const ids = Object.keys(pages[engine].win.__h.PROFILES);
    const probe = JSON.stringify(one(mine[0], ids[0], 0));
    one(mine[mine.length - 1], ids[ids.length - 1], 1);
    if (JSON.stringify(one(mine[0], ids[0], 0)) !== probe) independent = false;
  }
  const runs = [];
  if (independent) {
    for (const [ci, id, i] of tasks) { runs.push(one(ci, id, i)); await yieldToEventLoop(); }
  }
  const errors = Object.values(pages).flatMap((pg) => pg.errors);
  Object.values(pages).forEach((pg) => pg.win.close());
  parentPort.postMessage({ runs, errors, bootMs, independent });
}

// ---------- Main ----------
const TYPE_NAMES = { 1: 'mono', 2: 'guild', 3: 'three', 4: 'four', 5: 'five' };
const TYPES = ['mono', 'guild', 'three', 'four', 'five'];
const LABELS = ['HIGH', 'MODERATE', 'LOW'];
const WUBRG = ['W', 'U', 'B', 'R', 'G'];
const ENEMY_GUILDS = ['ORZHOV', 'IZZET', 'GOLGARI', 'SIMIC', 'BOROS'];
const ALLIED_GUILDS = ['AZORIUS', 'DIMIR', 'RAKDOS', 'GRUUL', 'SELESNYA'];
const pct = (x) => (x === null || x === undefined || Number.isNaN(x) ? '    -' : (100 * x).toFixed(1).padStart(5) + '%');
const pp = (x) => (x === null || x === undefined || Number.isNaN(x) ? '     -' : ((x >= 0 ? '+' : '') + (100 * x).toFixed(1)).padStart(6));
const share = (k, n) => (n ? k / n : null);

async function main(opts) {
  const t0 = Date.now();
  if (opts.fiveBand !== null) FIVE_COLOUR_BAND = opts.fiveBand;
  const vm = require('vm');
  const sandbox = {}; vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(opts.dataPath || path.join(ROOT, 'data.js'), 'utf-8') + '\n;this.__P = PROFILES;', sandbox);
  const ids = Object.keys(sandbox.__P);
  const colorsOf = Object.fromEntries(ids.map(id => [id, [...sandbox.__P[id].colors]]));

  // One page configuration per p, model, engine, Round 3 model (with --r3;
  // 'page' = the page's own) and seed. Rule variants share the run of their model.
  const r3models = opts.r3 ? [...new Map(opts.r3.map((v) => [v.modelKey, v.model])).entries()] : [[null, null]];
  const configs = [];
  for (const p of opts.p) for (const model of opts.models) for (const engine of opts.engines) for (const [r3key, r3model] of r3models) for (const seed of opts.seeds) {
    const c = { model, p, neither: opts.neither, seed, engine, gaming: opts.gaming };
    if (opts.r3) Object.assign(c, { r3: true, r3key, r3model });
    // The mixed model is the misspecified one with flatter weights, at the same sharpness.
    if (model !== 'ideal') c.calibration = calibrateMisspecified(p);
    configs.push(c);
  }
  const tasks = [];
  for (let ci = 0; ci < configs.length; ci++) for (const id of ids) for (let i = 0; i < opts.n; i++) tasks.push([ci, id, i]);
  const W = Math.max(1, Math.min(opts.workers || os.availableParallelism(), tasks.length));
  const shards = Array.from({ length: W }, (_, w) => tasks.filter((_, k) => k % W === w));
  const parts = await Promise.all(shards.map(shard => new Promise((resolve, reject) => {
    const w = new Worker(__filename, { workerData: { configs, tasks: shard, htmlPath: opts.htmlPath, dataPath: opts.dataPath } });
    w.once('message', resolve); w.once('error', reject);
  })));
  if (!parts.every(p => p.independent)) { console.error('State leaks between respondents on the same page; aborting.'); process.exit(1); }
  const byKey = new Map(parts.flatMap(p => p.runs).map(r => [r.ci + '#' + r.trueId + '#' + r.idx, r]));
  const errors = parts.flatMap(p => p.errors);
  const meta = {
    elapsedSeconds: +((Date.now() - t0) / 1000).toFixed(1),
    bootSeconds: +(Math.max(...parts.map(p => p.bootMs)) / 1000).toFixed(1),
    workers: W, errors,
  };
  const runsOf = (ci) => {
    const runs = [];
    for (const id of ids) for (let i = 0; i < opts.n; i++) runs.push(byKey.get(ci + '#' + id + '#' + i));
    return runs;
  };
  // Seeds pool: one report per p, model and engine (and --r3 variant) over the
  // respondents of every seed.
  const groups = [];
  for (const p of opts.p) for (const model of opts.models) for (const engine of opts.engines) {
    const cis = configs.map((c, ci) => ci).filter((ci) => configs[ci].p === p && configs[ci].model === model && configs[ci].engine === engine);
    groups.push({ p, model, engine, cis });
  }
  const reports = [];
  for (const g of groups) {
    const config = { ...configs[g.cis[0]], seed: opts.seeds.length === 1 ? opts.seeds[0] : opts.seeds.join(',') };
    if (!opts.r3) {
      const runs = g.cis.flatMap(runsOf);
      const report = summarise({ config, opts, ids, colorsOf, runs, meta });
      // --rows: each respondent's seed, true identity, index and result, so two
      // builds run on the same respondents can be compared pair by pair.
      if (opts.rows) report.rows = runs.map((r) => [configs[r.ci].seed, r.trueId, r.idx, r.recovered]);
      reports.push(report);
      continue;
    }
    let first = null;
    for (const v of opts.r3) {
      const mine = g.cis.filter((ci) => configs[ci].r3key === v.modelKey);
      const bySeed = mine.map((ci) => ({ seed: configs[ci].seed, runs: runsOf(ci).map((r) => variantRun(r, v)) }));
      const runs = bySeed.flatMap((s) => s.runs);
      const report = summarise({ config: { ...config, r3key: v.modelKey }, opts, ids, colorsOf, runs, meta });
      report.variant = v.name;
      report.round3 = round3Summary(runs);
      report.perSeed = bySeed.map((s) => ({ seed: s.seed, overallExact: share(s.runs.filter((r) => r.recovered === r.trueId).length, s.runs.length) }));
      if (opts.rows) report.rows = runs.map((r) => [configs[r.ci].seed, r.trueId, r.idx, r.recovered]);
      // The first variant is the reference: the same respondents, scored both
      // ways, for exact recovery and the two ways a result can say less than
      // Round 1 and 2 or the bars (shiftFlags).
      const key = (r) => configs[r.ci].seed + '#' + r.trueId + '#' + r.idx;
      const flags = (r) => ({ exact: r.recovered === r.trueId ? 1 : 0, ...shiftFlags(r, colorsOf) });
      if (!first) first = new Map(runs.map((r) => [key(r), flags(r)]));
      const paired = (k) => {
        const d = runs.map((r) => flags(r)[k] - first.get(key(r))[k]);
        const mean = d.reduce((a, x) => a + x, 0) / d.length;
        const sd = Math.sqrt(d.reduce((a, x) => a + (x - mean) ** 2, 0) / Math.max(1, d.length - 1));
        return { diff: mean, se: sd / Math.sqrt(d.length) };
      };
      report.vsFirst = { variant: opts.r3[0].name, ...paired('exact'), nestedDown: paired('nestedDown'), barsSayMore: paired('barsSayMore') };
      reports.push(report);
    }
  }

  const out = [];
  for (const p of opts.p) {
    const atP = reports.filter(r => r.params.p === p);
    if (opts.r3) out.push(textRound3(atP, ids, meta, opts));
    else out.push(atP.length === 1 ? textReport(atP[0], ids, meta) : textComparison(atP, ids, meta, opts));
  }
  if (opts.r3) out.push(textRound3AcrossP(reports, opts));
  else if (opts.p.length > 1) out.push(textAcrossP(reports, opts));
  console.log(out.join('\n\n' + '='.repeat(78) + '\n\n'));

  const outFile = opts.out || path.join(__dirname, 'out', 'simulation.json');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const json = reports.length === 1 ? reports[0] : { runs: reports };
  fs.writeFileSync(outFile, JSON.stringify(json, null, 2) + '\n');
  // A page error, or a result that breaks the scoring contract, makes the run
  // suspect: fail, so the smoke run in npm test catches it.
  const violations = reports.reduce((a, r) => a + r.contract.violations, 0);
  if (violations) {
    console.error(`\n${violations} results broke the state.result contract; first: ${reports.flatMap(r => r.contract.examples)[0]}`);
  }
  if (errors.length) {
    console.error(`\nThe page reported ${errors.length} console/jsdom errors; exiting with status 1.`);
  }
  const mismatched = reports.reduce((a, r) => a + (r.round3 ? r.round3.labelMismatches : 0), 0);
  if (mismatched) console.error(`\n${mismatched} --r3 results carry a label the recorded facts do not give them; exiting with status 1.`);
  if (violations || errors.length || mismatched) process.exit(1);
}

// The neighbourhood ("next door") of a result, from the five activation values
// only: the result itself, the result plus its strongest unlit colour, and the
// result minus its weakest lit colour. Ties go to WUBRG order.
function neighbourhood(resultId, activation, colorsOf, idOfColors) {
  const lit = colorsOf[resultId];
  if (!lit) return [];
  const act = Object.fromEntries(activation || []);
  const strength = (c) => act[c] || 0;
  const set = [resultId];
  const unlit = WUBRG.filter(c => !lit.includes(c));
  if (unlit.length) {
    const add = unlit.reduce((best, c) => (strength(c) > strength(best) ? c : best), unlit[0]);
    set.push(idOfColors([...lit, add]));
  }
  if (lit.length > 1) {
    const ordered = WUBRG.filter(c => lit.includes(c));
    const drop = ordered.reduce((worst, c) => (strength(c) < strength(worst) ? c : worst), ordered[0]);
    set.push(idOfColors(lit.filter(c => c !== drop)));
  }
  return set.filter(Boolean);
}

// How far a result is from the story its bars tell (docs/SCORING_CONTRACT.md,
// "The name matches the bars"): the strongest colour it leaves out minus the
// weakest colour it holds, or, when it holds all five, the spread of the five
// (strongest minus weakest) minus FIVE_COLOUR_BAND. Written out here, not read
// from the page, so the check does not lean on the code it checks. On the bars
// as the results screen prints them (whole percentages, finalShown, recorded
// on the page as it prints them), in points: over 0 breaks the contract. On
// the bars behind them (finalActivation, 3 dp), in bar units, the report also
// gives how often it is over one answer and over half an answer.
let FIVE_COLOUR_BAND = 20;     // the page's FIVE_COLOUR_BAND, in printed points (--five-band sets another)
const ONE_ANSWER = 1 / 12;     // the page's ONE_ANSWER_BY_VERSION
const BARS_ROUNDING = 0.001;   // finalActivation is recorded to 3 dp
function barsMargin(resultId, bars, colorsOf, band) {
  const lit = colorsOf[resultId];
  if (!lit) return Infinity;
  const bar = (c) => bars[c] || 0;
  const out = WUBRG.filter((c) => !lit.includes(c));
  const weakestIn = Math.min(...lit.map(bar));
  return out.length ? Math.max(...out.map(bar)) - weakestIn : Math.max(...lit.map(bar)) - weakestIn - band;
}
const printed = (shown) => Object.fromEntries(WUBRG.map((c, i) => [c, (shown || [])[i] || 0]));
const printedText = (shown) => WUBRG.map((c, i) => c + (shown || [])[i]).join(' ');
const rawMargin = (r, colorsOf) => barsMargin(r.recovered, Object.fromEntries(r.finalActivation || []), colorsOf, FIVE_COLOUR_BAND / 100);
const printedMargin = (r, colorsOf) => barsMargin(r.recovered, printed(r.finalShown), colorsOf, FIVE_COLOUR_BAND);
const spreadOf = (shown) => Math.max(...shown) - Math.min(...shown);

// state.result must carry the contract's fields (docs/SCORING_CONTRACT.md),
// the printed bars must allow its identity, and the Round 1 bars, which an
// early result shows, the identity an early offer makes.
function contractProblems(r, engine, colorsOf) {
  const bad = [];
  if (!r.recovered) bad.push('no identity');
  if (!LABELS.includes(r.confidence)) bad.push('confidence ' + r.confidence);
  if (r.scoringVersion !== engine) bad.push(`scoringVersion ${r.scoringVersion} on engine ${engine}`);
  if (r.instrumentVersion !== INSTRUMENT_VERSION) bad.push('instrumentVersion ' + r.instrumentVersion);
  if (engine >= 2) {
    if (r.posteriorIds !== 31) bad.push('posterior over ' + r.posteriorIds + ' identities');
    else if (Math.abs(r.posteriorSum - 1) > 1e-9) bad.push('posterior sums to ' + r.posteriorSum);
  }
  if (r.recovered) {
    const m = printedMargin(r, colorsOf);
    if (m > 0) {
      bad.push(`${r.recovered} under bars ${printedText(r.finalShown)} (${colorsOf[r.recovered].length === 5
        ? `a spread of ${spreadOf(r.finalShown)} points; Five-colour needs ${FIVE_COLOUR_BAND} or less`
        : `a colour it leaves out prints ${m} points above one it holds`})`);
    }
  }
  if (r.earlyOffer && r.earlyOfferId && barsMargin(r.earlyOfferId, printed(r.r1Shown), colorsOf, FIVE_COLOUR_BAND) > 0) {
    bad.push(`early offer of ${r.earlyOfferId} under Round 1 bars ${printedText(r.r1Shown)}`);
  }
  return bad;
}

function summarise({ config, opts, ids, colorsOf, runs, meta }) {
  const idByKey = Object.fromEntries(ids.map(id => [WUBRG.filter(c => colorsOf[id].includes(c)).join(''), id]));
  const idOfColors = (cols) => idByKey[WUBRG.filter(c => cols.includes(c)).join('')] || null;
  const typeOf = (id) => TYPE_NAMES[colorsOf[id].length];
  const exactOf = (rs) => share(rs.filter(r => r.recovered === r.trueId).length, rs.length);
  const covered = (r) => neighbourhood(r.recovered, r.finalActivation, colorsOf, idOfColors).includes(r.trueId);
  const perTrue = runs.length / ids.length; // respondents per identity, over every seed

  const perIdentity = {};
  for (const id of ids) {
    const mine = runs.filter(r => r.trueId === id);
    perIdentity[id] = {
      type: typeOf(id), colors: colorsOf[id].join(''),
      exact: exactOf(mine),
      round1Alone: share(mine.filter(r => r.round1Pick === id).length, mine.length),
      neighbourhood: share(mine.filter(covered).length, mine.length),
    };
  }
  const avgOver = (members, k) => members.reduce((a, id) => a + perIdentity[id][k], 0) / (members.length || 1);
  const byType = {};
  for (const t of TYPES) {
    const members = ids.filter(id => perIdentity[id].type === t);
    byType[t] = { identities: members.length, exact: avgOver(members, 'exact'), round1Alone: avgOver(members, 'round1Alone'), neighbourhood: avgOver(members, 'neighbourhood') };
  }
  const guilds = {
    enemy: { identities: ENEMY_GUILDS, exact: avgOver(ENEMY_GUILDS, 'exact'), round1Alone: avgOver(ENEMY_GUILDS, 'round1Alone') },
    allied: { identities: ALLIED_GUILDS, exact: avgOver(ALLIED_GUILDS, 'exact'), round1Alone: avgOver(ALLIED_GUILDS, 'round1Alone') },
  };
  // Confidence labels: how often each is given, and how often it is right.
  const confidence = {};
  for (const r of runs) {
    const c = confidence[r.confidence] || (confidence[r.confidence] = { count: 0, correct: 0 });
    c.count++; if (r.recovered === r.trueId) c.correct++;
  }
  for (const c of Object.values(confidence)) { c.share = c.count / runs.length; c.accuracy = c.correct / c.count; }
  // Early-result offer: how often it fires, and how often the offered identity is right.
  const offers = runs.filter(r => r.earlyOffer);
  const earlyOffer = {
    count: offers.length, share: offers.length / runs.length,
    correct: offers.filter(r => r.earlyOfferId === r.trueId).length,
  };
  earlyOffer.precision = share(earlyOffer.correct, offers.length);
  const confusionCounts = {};
  for (const r of runs) if (r.recovered !== r.trueId) {
    const k = r.trueId + '\t' + r.recovered; confusionCounts[k] = (confusionCounts[k] || 0) + 1;
  }
  const topConfusions = Object.entries(confusionCounts)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 10)
    .map(([k, count]) => { const [from, to] = k.split('\t'); return { true: from, recovered: to, count, shareOfTrue: count / perTrue }; });
  const contract = { violations: 0, examples: [] };
  for (const r of runs) {
    const bad = contractProblems(r, config.engine, colorsOf);
    if (bad.length) { contract.violations++; if (contract.examples.length < 5) contract.examples.push(`${r.trueId} #${r.idx}: ${bad.join(', ')}`); }
  }
  // The result against its own bars: more than one answer or half an answer
  // from the story they tell, or against them as printed (an unlit bar printed
  // above a lit one, or, for Five-colour, the five printed further apart than
  // FIVE_COLOUR_BAND), which breaks the contract.
  const margins = runs.map((r) => rawMargin(r, colorsOf));
  const bars = {
    overOneAnswer: share(margins.filter((m) => m > ONE_ANSWER + BARS_ROUNDING).length, runs.length),
    overHalfAnswer: share(margins.filter((m) => m > ONE_ANSWER / 2 + BARS_ROUNDING).length, runs.length),
    shownOutOfOrder: share(runs.filter((r) => printedMargin(r, colorsOf) > 0).length, runs.length),
  };
  // Five-colour: how often the true five-colour respondents get it (recall),
  // how often a Five-colour result is right (precision), how often it is given,
  // where the true five-colour respondents go otherwise, and how often the
  // printed bars are flat enough to allow it. spread*: the printed spread
  // (strongest bar minus weakest), counted 0 to 100, of the true five-colour
  // respondents and of everyone else, so another band can be read off.
  const fiveId = ids.find((id) => colorsOf[id].length === 5);
  const fiveTrue = runs.filter((r) => r.trueId === fiveId), fiveGiven = runs.filter((r) => r.recovered === fiveId);
  const widthOf = (id) => (colorsOf[id] ? colorsOf[id].length : 0);
  const histogram = (rs) => { const hst = new Array(101).fill(0); rs.forEach((r) => { hst[spreadOf(r.finalShown)]++; }); return hst; };
  const fiveColour = {
    truth: fiveTrue.length, given: fiveGiven.length, right: fiveGiven.filter((r) => r.trueId === fiveId).length,
    truthToFour: share(fiveTrue.filter((r) => widthOf(r.recovered) === 4).length, fiveTrue.length),
    truthToThreeOrFewer: share(fiveTrue.filter((r) => widthOf(r.recovered) <= 3).length, fiveTrue.length),
    flat: share(runs.filter((r) => spreadOf(r.finalShown) <= FIVE_COLOUR_BAND).length, runs.length),
    flatTruth: share(fiveTrue.filter((r) => spreadOf(r.finalShown) <= FIVE_COLOUR_BAND).length, fiveTrue.length),
    band: FIVE_COLOUR_BAND,
    spreadTruth: histogram(fiveTrue), spreadOthers: histogram(runs.filter((r) => r.trueId !== fiveId)),
  };
  fiveColour.recall = share(fiveColour.right, fiveColour.truth);
  fiveColour.precision = share(fiveColour.right, fiveColour.given);
  fiveColour.share = share(fiveColour.given, runs.length);
  const params = { model: config.model, engine: config.engine, n: opts.n, p: config.p, neither: config.neither, seed: config.seed, gaming: config.gaming };
  if (config.r3) params.round3Model = config.r3key || 'page';
  if (config.calibration) params.calibration = config.calibration;
  if (config.model === 'mixed' && config.calibration) params.mixedSignal = signalAt(config.calibration, MIXED);
  return {
    params,
    respondents: runs.length,
    elapsedSeconds: meta.elapsedSeconds,
    bootSeconds: meta.bootSeconds,
    workers: meta.workers,
    independentOnReusedPage: true,
    overallExact: exactOf(runs),
    round1AloneExact: share(runs.filter(r => r.round1Pick === r.trueId).length, runs.length),
    neighbourhoodCoverage: share(runs.filter(covered).length, runs.length),
    earlyOfferShare: earlyOffer.share,
    earlyOffer,
    bars,
    fiveColour,
    shift: shiftSummary(runs, colorsOf),
    byType, guilds, perIdentity, topConfusions, confidence, contract,
    pageErrorCount: meta.errors.length,
    pageErrors: meta.errors.slice(0, 20),
  };
}

// What Round 3 did to Round 1 and 2's answer, and whether the result says less
// than the bars. The leader is r12Top, the first candidate Round 3 played: on
// engine 2 the one of the four the bars allow that the Round 1 + Round 2
// posterior rates highest (Round 3 can report no other identity).
//   overturned     the result is not the leader
//   nested down    the result's colours are a proper subset of the leader's
//   nested up      the leader's colours are a proper subset of the result's
//   bars say more  the result leaves out a colour whose printed bar is at least
//                  50 and at least 25 points above every other colour it leaves
//                  out (so a result of one to three colours; the bars always
//                  allow the result with that colour added)
const properSubset = (a, b) => a.length < b.length && a.every((c) => b.includes(c));
function barsSayMoreColour(r, colorsOf) {
  const lit = colorsOf[r.recovered];
  if (!lit || !r.finalShown) return null;
  const bars = printed(r.finalShown);
  const out = WUBRG.filter((c) => !lit.includes(c)).sort((a, b) => bars[b] - bars[a]);
  if (out.length < 2) return null;
  return bars[out[0]] >= 50 && bars[out[0]] - bars[out[1]] >= 25 ? out[0] : null;
}
function shiftFlags(r, colorsOf) {
  const lead = r.r12Top && colorsOf[r.r12Top], got = r.recovered && colorsOf[r.recovered];
  return {
    overturned: lead && got && r.recovered !== r.r12Top ? 1 : 0,
    nestedDown: lead && got && properSubset(got, lead) ? 1 : 0,
    nestedUp: lead && got && properSubset(lead, got) ? 1 : 0,
    barsSayMore: barsSayMoreColour(r, colorsOf) ? 1 : 0,
  };
}
function shiftSummary(runs, colorsOf) {
  const rs = runs.filter((r) => r.r12Top && r.recovered);
  const idOf = (cols) => Object.keys(colorsOf).find((id) => colorsOf[id].length === cols.length && cols.every((c) => colorsOf[id].includes(c))) || null;
  const of = (k) => rs.filter((r) => shiftFlags(r, colorsOf)[k]);
  const right = (xs, f) => share(xs.filter(f).length, xs.length);
  const resultRight = (r) => r.recovered === r.trueId, leaderRight = (r) => r.r12Top === r.trueId;
  const over = of('overturned'), down = of('nestedDown'), up = of('nestedUp'), more = of('barsSayMore');
  return {
    respondents: rs.length,
    leaderRight: right(rs, leaderRight),
    // the Round 1 + Round 2 leader over all 31 is not one the bars allow (so not played)
    leaderOutsideBars: share(rs.filter((r) => r.r12Leader && r.r12Leader !== r.r12Top).length, rs.length),
    overturned: share(over.length, rs.length), overturnedRight: right(over, resultRight), overturnedLeaderRight: right(over, leaderRight),
    nestedDown: share(down.length, rs.length), nestedDownRight: right(down, resultRight), nestedDownLeaderRight: right(down, leaderRight),
    nestedUp: share(up.length, rs.length), nestedUpRight: right(up, resultRight), nestedUpLeaderRight: right(up, leaderRight),
    barsSayMore: share(more.length, rs.length), barsSayMoreRight: right(more, resultRight),
    // ...and how often the result with that colour added is the true identity
    barsSayMoreAddedRight: right(more, (r) => idOf([...colorsOf[r.recovered], barsSayMoreColour(r, colorsOf)]) === r.trueId),
  };
}

// Round 3 face validity (--r3): the reported identity's record among the
// candidates; where the posterior maximum (PM) and the tournament winner (TW)
// disagree, which was right; and what a rule changed.
function round3Summary(runs) {
  const rs = runs.filter((r) => r.r3);
  const s = {
    respondents: rs.length, losing: 0, lostAll: 0, lostAllThree: 0, lostAllRight: 0, notBest: 0,
    disagree: 0, pmRight: 0, twRight: 0, neitherRight: 0, changed: 0, changedRight: 0, changedPmRight: 0,
    // Results whose label differs from the one the recorded facts give that
    // identity: nonzero means the rule variants' labels cannot be trusted.
    labelMismatches: 0,
  };
  const ratios = [];
  for (const r of rs) {
    const f = r.r3, pm = rankByPosterior(f)[0];
    if (f.conf[r.recovered] !== r.confidence) s.labelMismatches++;
    const rec = f.rec[r.recovered] || [0, 0];
    const played = f.ids.filter((id) => f.rec[id][0] + f.rec[id][1] > 0);
    // "Best record" as the results screen reads it: wins minus losses among the
    // candidates that played.
    if (played.length && rec[0] - rec[1] < Math.max(...played.map((id) => f.rec[id][0] - f.rec[id][1]))) s.notBest++;
    if (losingRecord(rec)) s.losing++;
    if (lostEvery(rec)) {
      s.lostAll++;
      if (rec[1] >= 3) s.lostAllThree++; // 0-3 or worse; 0-1 and 0-2 come from clinched tournaments
      if (r.recovered === r.trueId) s.lostAllRight++;
      ratios.push(f.post[r.recovered] / Math.max(...f.ids.filter((id) => id !== r.recovered).map((id) => f.post[id])));
    }
    if (f.tw && pm !== f.tw) {
      s.disagree++;
      if (pm === r.trueId) s.pmRight++; else if (f.tw === r.trueId) s.twRight++; else s.neitherRight++;
    }
    if (r.recovered !== pm) {
      s.changed++;
      if (r.recovered === r.trueId) s.changedRight++; else if (pm === r.trueId) s.changedPmRight++;
    }
  }
  const n = rs.length;
  ratios.sort((a, b) => a - b);
  Object.assign(s, {
    losingShare: share(s.losing, n), lostAllShare: share(s.lostAll, n), lostAllThreeShare: share(s.lostAllThree, n), notBestShare: share(s.notBest, n),
    lostAllAccuracy: share(s.lostAllRight, s.lostAll),
    // Reported identities that lost every match: their posterior over the best other candidate's.
    lostAllRatioMin: ratios.length ? ratios[0] : null,
    lostAllRatioMedian: ratios.length ? ratios[Math.floor(ratios.length / 2)] : null,
    disagreeShare: share(s.disagree, n),
    pmRightWhenDisagree: share(s.pmRight, s.disagree), twRightWhenDisagree: share(s.twRight, s.disagree),
    neitherRightWhenDisagree: share(s.neitherRight, s.disagree),
    changedShare: share(s.changed, n),
  });
  return s;
}

function calibrationLine(r) {
  const c = r.params.calibration;
  if (!c) return null;
  const s = r.params.mixedSignal;
  return `Misspecified calibration: item sharpness k=${c.k.toFixed(2)}, Round 3 sharpness k3=${c.k3.toFixed(2)}` +
    (c.target !== r.params.p ? ` (p capped at ${c.target})` : '') +
    (s ? `; mixed respondents at that sharpness: items ${s.items.toFixed(2)}, Round 3 ${s.round3.toFixed(2)}` : '');
}
const runLabel = (r) => `model=${r.params.model}  engine=${r.params.engine}`;
const gamingNote = (r) => (r.params.gaming ? '  gaming=on' : '');

// ---------- Text: one model and engine at one p ----------
function textReport(report, ids, meta) {
  const { byType, perIdentity, topConfusions, params } = report;
  const L = [];
  L.push(`Mana Curve respondent simulation  ${runLabel(report)}  n=${params.n}/identity  p=${params.p}  neither=${params.neither}  seed=${params.seed}${gamingNote(report)}`);
  L.push(`${report.respondents} respondents across ${ids.length} identities in ${meta.elapsedSeconds}s (${meta.workers} workers, boot ${meta.bootSeconds}s)`);
  const cal = calibrationLine(report); if (cal) L.push(cal);
  L.push('');
  L.push('Exact recovery                      final   R1 alone   next door');
  for (const t of TYPES) {
    L.push(`  ${t.toUpperCase().padEnd(32)} ${pct(byType[t].exact)}    ${pct(byType[t].round1Alone)}     ${pct(byType[t].neighbourhood)}   (type average)`);
    for (const id of ids.filter(i => perIdentity[i].type === t)) {
      L.push(`    ${id.padEnd(10)} ${perIdentity[id].colors.padEnd(19)} ${pct(perIdentity[id].exact)}    ${pct(perIdentity[id].round1Alone)}     ${pct(perIdentity[id].neighbourhood)}`);
    }
  }
  L.push('');
  L.push(`Overall exact recovery:        ${pct(report.overallExact)}`);
  L.push(`Round 1 alone (candidate #1):  ${pct(report.round1AloneExact)}`);
  L.push(`Enemy-pair guilds / allied:    ${pct(report.guilds.enemy.exact)} / ${pct(report.guilds.allied.exact).trim()}`);
  L.push(`Neighbourhood coverage:        ${pct(report.neighbourhoodCoverage)}   (truth is the result, +strongest unlit or -weakest lit colour)`);
  L.push(`Result against its bars:       ${pct(report.bars.overOneAnswer)} over one answer, ${pct(report.bars.overHalfAnswer).trim()} over half an answer, ${pct(report.bars.shownOutOfOrder).trim()} against them as printed`);
  const F = report.fiveColour;
  L.push(`Five-colour:                   ${pct(F.recall)} recall (${F.right}/${F.truth}), precision ${pct(F.precision).trim()} (${F.right}/${F.given}), given to ${pct(F.share).trim()} of results`);
  L.push(`                               true five-colour to a four ${pct(F.truthToFour).trim()}, to three colours or fewer ${pct(F.truthToThreeOrFewer).trim()}; printed bars within ${F.band} points: ${pct(F.flat).trim()} of all, ${pct(F.flatTruth).trim()} of true five-colour`);
  L.push(`Early-result offer shown:      ${pct(report.earlyOffer.share)}   precision ${pct(report.earlyOffer.precision).trim()} (${report.earlyOffer.correct}/${report.earlyOffer.count} offered identities right)`);
  const S = report.shift;
  L.push(`Round 3 against Round 1 + 2:   lead (the first candidate played) right ${pct(S.leaderRight).trim()}; overturned ${pct(S.overturned).trim()} (right ${pct(S.overturnedRight).trim()}, lead was right ${pct(S.overturnedLeaderRight).trim()})`);
  L.push(`                               nested down ${pct(S.nestedDown).trim()} (lead was right ${pct(S.nestedDownLeaderRight).trim()}), nested up ${pct(S.nestedUp).trim()} (lead was right ${pct(S.nestedUpLeaderRight).trim()})`);
  L.push(`Bars say more:                 ${pct(S.barsSayMore)}   (a colour left out printed at 50+ and 25+ above the rest left out; result right ${pct(S.barsSayMoreRight).trim()})`);
  L.push('');
  L.push('Confidence labels       count   share   accuracy');
  for (const k of LABELS) {
    const v = report.confidence[k] || { count: 0, share: 0, accuracy: null };
    L.push(`  ${k.padEnd(9)} ${String(v.count).padStart(12)}  ${pct(v.share)}  ${pct(v.accuracy)}`);
  }
  L.push('');
  L.push('Top 10 confusions (true -> recovered)');
  for (const c of topConfusions) {
    L.push(`  ${(c.true + ' -> ' + c.recovered).padEnd(24)} ${String(c.count).padStart(5)}  (${pct(c.shareOfTrue).trim()} of ${c.true})`);
  }
  if (report.contract.violations) { L.push(''); L.push(`${report.contract.violations} results broke the state.result contract; e.g. ${report.contract.examples[0]}`); }
  if (meta.errors.length) { L.push(''); L.push(`Page reported ${meta.errors.length} console/jsdom errors; first: ${meta.errors[0]}`); }
  return L.join('\n');
}

// ---------- Text: several runs side by side at one p ----------
// With several engines, each model's columns are followed by "e2-e1" (engine 2
// minus engine 1, in percentage points). With one engine and several models,
// gap = first model minus each other model, in percentage points.
function textComparison(reports, ids, meta, opts) {
  const multiEngine = new Set(reports.map(r => r.params.engine)).size > 1;
  const multiModel = new Set(reports.map(r => r.params.model)).size > 1;
  const short = { ideal: 'ideal', misspecified: 'misspec', mixed: 'mixed' };
  const label = (r) => (multiEngine ? (multiModel ? `${short[r.params.model] || r.params.model} e${r.params.engine}` : `engine ${r.params.engine}`) : r.params.model);
  const deltas = [];
  if (multiEngine) {
    for (const model of [...new Set(reports.map(r => r.params.model))]) {
      const mine = reports.filter(r => r.params.model === model).sort((a, b) => a.params.engine - b.params.engine);
      for (const r of mine.slice(1)) deltas.push({ name: (multiModel ? (short[model] || model) + ' ' : '') + `e${r.params.engine}-e${mine[0].params.engine}`, a: r, b: mine[0] });
    }
  } else {
    const [base, ...rest] = reports;
    for (const r of rest) deltas.push({ name: rest.length === 1 ? 'gap (pp)' : 'gap ' + r.params.model.slice(0, 8), a: base, b: r });
  }
  const col = (s) => String(s).padStart(14);
  const head = (title) => title.padEnd(34) + reports.map(r => col(label(r))).join('') + deltas.map(d => col(d.name)).join('');
  const row = (title, get) => title.padEnd(34) + reports.map(r => col(pct(get(r)))).join('')
    + deltas.map(d => { const a = get(d.a), b = get(d.b); return col(a === null || b === null ? pp(null) : pp(a - b)); }).join('');
  const base = reports[0];
  const { params } = base;
  const L = [];
  const what = multiEngine ? `engines=${[...new Set(reports.map(r => r.params.engine))].join(',')}  models=${[...new Set(reports.map(r => r.params.model))].join(',')}` : `models=${reports.map(r => r.params.model).join(',')}  engine=${params.engine}`;
  L.push(`Mana Curve respondent simulation  ${what}  n=${params.n}/identity  p=${params.p}  neither=${params.neither}  seed=${params.seed}${gamingNote(base)}`);
  L.push(`${reports.reduce((a, r) => a + r.respondents, 0)} respondents across ${ids.length} identities in ${meta.elapsedSeconds}s (${meta.workers} workers, boot ${meta.bootSeconds}s)`);
  const cals = [...new Set(reports.map(calibrationLine).filter(Boolean))];
  for (const cal of cals) L.push(cal);
  L.push(multiEngine ? 'eX-eY = engine X minus engine Y, in percentage points' : `gap = ${base.params.model} minus ${reports.slice(1).map(r => r.params.model).join(' / ')}, in percentage points`);
  L.push('');
  L.push(head('Exact recovery, final'));
  for (const t of TYPES) {
    L.push(row(`  ${t.toUpperCase()} (type average)`, r => r.byType[t].exact));
    for (const id of ids.filter(i => base.perIdentity[i].type === t)) {
      L.push(row(`    ${id.padEnd(10)} ${base.perIdentity[id].colors}`, r => r.perIdentity[id].exact));
    }
  }
  L.push(row('  OVERALL', r => r.overallExact));
  L.push(row('  enemy-pair guilds', r => r.guilds.enemy.exact));
  L.push(row('  allied guilds', r => r.guilds.allied.exact));
  L.push('');
  L.push(head('Round 1 alone (candidate #1)'));
  for (const t of TYPES) L.push(row(`  ${t.toUpperCase()} (type average)`, r => r.byType[t].round1Alone));
  L.push(row('  OVERALL', r => r.round1AloneExact));
  L.push(row('  enemy-pair guilds', r => r.guilds.enemy.round1Alone));
  L.push(row('  allied guilds', r => r.guilds.allied.round1Alone));
  L.push('');
  L.push(head('Neighbourhood coverage'));
  for (const t of TYPES) L.push(row(`  ${t.toUpperCase()} (type average)`, r => r.byType[t].neighbourhood));
  L.push(row('  OVERALL', r => r.neighbourhoodCoverage));
  L.push('');
  L.push(head('Result against its bars'));
  L.push(row('  over one answer', r => r.bars.overOneAnswer));
  L.push(row('  over half an answer', r => r.bars.overHalfAnswer));
  L.push(row('  against them as printed', r => r.bars.shownOutOfOrder));
  L.push('');
  L.push(head(`Five-colour (band ${FIVE_COLOUR_BAND} points)`));
  L.push(row('  recall (true five given five)', r => r.fiveColour.recall));
  L.push(row('  precision (five given, right)', r => r.fiveColour.precision));
  L.push(row('  given to (share of results)', r => r.fiveColour.share));
  L.push(row('  true five given a four', r => r.fiveColour.truthToFour));
  L.push(row('  printed bars within the band', r => r.fiveColour.flat));
  L.push(row('  ...of true five-colour', r => r.fiveColour.flatTruth));
  L.push('');
  L.push(head('Round 3 against Round 1 + 2'));
  L.push(row('  lead (first candidate) right', r => r.shift.leaderRight));
  L.push(row('  overturned', r => r.shift.overturned));
  L.push(row('  ...result right', r => r.shift.overturnedRight));
  L.push(row('  nested down', r => r.shift.nestedDown));
  L.push(row('  ...lead was right', r => r.shift.nestedDownLeaderRight));
  L.push(row('  nested up', r => r.shift.nestedUp));
  L.push(row('  bars say more', r => r.shift.barsSayMore));
  L.push('');
  L.push(head('Confidence labels'));
  for (const k of LABELS) L.push(row(`  ${k} share`, r => (r.confidence[k] || { share: 0 }).share));
  for (const k of LABELS) L.push(row(`  ${k} accuracy`, r => (r.confidence[k] ? r.confidence[k].accuracy : null)));
  L.push('');
  L.push(head('Early-result offer'));
  L.push(row('  shown', r => r.earlyOffer.share));
  L.push(row('  precision (offered = true)', r => r.earlyOffer.precision));
  L.push('  offers (right/shown)'.padEnd(34) + reports.map(r => col(`${r.earlyOffer.correct}/${r.earlyOffer.count}`)).join(''));
  for (const r of reports) {
    L.push('');
    L.push(`Top 5 confusions, ${label(r)} (true -> recovered)`);
    for (const c of r.topConfusions.slice(0, 5)) {
      L.push(`  ${(c.true + ' -> ' + c.recovered).padEnd(24)} ${String(c.count).padStart(5)}  (${pct(c.shareOfTrue).trim()} of ${c.true})`);
    }
  }
  const violations = reports.reduce((a, r) => a + r.contract.violations, 0);
  if (violations) { L.push(''); L.push(`${violations} results broke the state.result contract; e.g. ${reports.flatMap(r => r.contract.examples)[0]}`); }
  if (meta.errors.length) { L.push(''); L.push(`Page reported ${meta.errors.length} console/jsdom errors; first: ${meta.errors[0]}`); }
  return L.join('\n');
}

// ---------- Text: summary across p ----------
function textAcrossP(reports, opts) {
  const L = ['Exact recovery by p (type averages)'];
  L.push('  ' + 'p'.padEnd(6) + 'model'.padEnd(14) + 'engine'.padEnd(8) + TYPES.map(t => t.toUpperCase().padStart(8)).join('') + 'OVERALL'.padStart(10) + 'HIGH'.padStart(8) + 'MOD'.padStart(8) + 'LOW'.padStart(8)
    + 'NEXT'.padStart(8) + 'BARS'.padStart(8) + 'PRINT'.padStart(8) + '5 REC'.padStart(8) + '5 PREC'.padStart(8));
  const acc = (r, k) => (r.confidence[k] ? r.confidence[k].accuracy : null);
  for (const p of opts.p) for (const r of reports.filter(x => x.params.p === p)) {
    L.push('  ' + String(p).padEnd(6) + r.params.model.padEnd(14) + String(r.params.engine).padEnd(8) + TYPES.map(t => pct(r.byType[t].exact).padStart(8)).join('') + pct(r.overallExact).padStart(10)
      + LABELS.map(k => pct(acc(r, k)).padStart(8)).join('') + pct(r.neighbourhoodCoverage).padStart(8) + pct(r.bars.overHalfAnswer).padStart(8) + pct(r.bars.shownOutOfOrder).padStart(8)
      + pct(r.fiveColour.recall).padStart(8) + pct(r.fiveColour.precision).padStart(8));
  }
  L.push('  (HIGH / MOD / LOW: accuracy of each confidence label; NEXT: neighbourhood coverage; BARS: results over half an answer from');
  L.push(`  their bars; PRINT: against them as printed, which breaks the contract; 5 REC / 5 PREC: Five-colour recall and precision, band ${FIVE_COLOUR_BAND})`);
  return L.join('\n');
}

// ---------- Text: Round 3 decision variants (--r3) ----------
const f1 = (x, w = 6) => (x === null || x === undefined || Number.isNaN(x) ? '-' : (100 * x).toFixed(1)).padStart(w);
const twoSe = (a, n) => 2 * Math.sqrt(a * (1 - a) / n);
function textRound3(reports, ids, meta, opts) {
  const base = reports[0];
  const { params } = base;
  const models = [...new Set(reports.map((r) => r.params.model))];
  const seeds = opts.seeds.length;
  const L = [];
  L.push(`Mana Curve respondent simulation, Round 3 decision variants  p=${params.p}  engine=${params.engine}  n=${opts.n}/identity  seeds=${opts.seeds.join(',')}  neither=${params.neither}${gamingNote(base)}`);
  L.push(`${base.respondents} respondents per row (${ids.length} identities x ${opts.n} x ${seeds} seed${seeds > 1 ? 's' : ''}); ${new Set(reports.map((r) => r.params.round3Model)).size * models.length * base.respondents} simulated in ${meta.elapsedSeconds}s (${meta.workers} workers, boot ${meta.bootSeconds}s)`);
  for (const cal of [...new Set(reports.map(calibrationLine).filter(Boolean))]) L.push(cal);
  L.push('In percent. OVERALL ±: two binomial standard errors. Δ: minus the first variant on the same respondents, ± two paired standard errors.');
  L.push('PM: the candidate with the highest final posterior. TW: the tournament winner (getTournamentWinner on the same matches).');
  const block = (title, head, cells) => {
    L.push('');
    L.push(title.padEnd(24) + head);
    for (const model of models) {
      L.push(model);
      for (const r of reports.filter((x) => x.params.model === model)) L.push('  ' + r.variant.padEnd(22) + cells(r));
    }
  };
  block('Exact recovery', TYPES.map((t) => t.toUpperCase().padStart(6)).join('') + '   OVERALL     ' + opts.seeds.map((s) => ('seed ' + s).padStart(7)).join('') + '      Δ (pp)',
    (r) => TYPES.map((t) => f1(r.byType[t].exact)).join('') + f1(r.overallExact, 8) + ' ±' + (100 * twoSe(r.overallExact, r.respondents)).toFixed(1).padEnd(4)
      + r.perSeed.map((s) => f1(s.overallExact, 7)).join('')
      + (r.variant === r.vsFirst.variant ? '' : `   ${((r.vsFirst.diff >= 0 ? '+' : '') + (100 * r.vsFirst.diff).toFixed(1)).padStart(5)} ±${(200 * r.vsFirst.se).toFixed(1)}`));
  block('Reported identity, R3', '  losing  lost all  (0-3)  (right)  min ratio   not best   changed  (right / PM was)',
    (r) => { const s = r.round3; return f1(s.losingShare, 8) + f1(s.lostAllShare, 10) + f1(s.lostAllThreeShare, 7) + f1(s.lostAllAccuracy, 9)
      + (s.lostAllRatioMin === null ? '-' : s.lostAllRatioMin.toFixed(2)).padStart(11) + f1(s.notBestShare, 11) + f1(s.changedShare, 10)
      + `  (${f1(share(s.changedRight, s.changed), 0).trim()} / ${f1(share(s.changedPmRight, s.changed), 0).trim()})`; });
  block('PM and TW disagree', '   share  PM right  TW right  neither',
    (r) => { const s = r.round3; return f1(s.disagreeShare, 8) + f1(s.pmRightWhenDisagree, 10) + f1(s.twRightWhenDisagree, 10) + f1(s.neitherRightWhenDisagree, 9); });
  const delta = (r, k) => (r.variant === r.vsFirst.variant ? ''.padStart(12)
    : `${((r.vsFirst[k].diff >= 0 ? '+' : '') + (100 * r.vsFirst[k].diff).toFixed(1)).padStart(6)} ±${(200 * r.vsFirst[k].se).toFixed(1).padEnd(4)}`);
  block('Round 1+2 leader, R3', ' lead ok  overturned (ok / lead was)   down (lead was / ok)        Δ   up (lead was / ok)  bars say more (ok / +1 ok)        Δ',
    (r) => { const s = r.shift; return f1(s.leaderRight, 8)
      + f1(s.overturned, 11) + `  (${f1(s.overturnedRight, 0).trim()} / ${f1(s.overturnedLeaderRight, 0).trim()})`.padEnd(15)
      + f1(s.nestedDown, 7) + `  (${f1(s.nestedDownLeaderRight, 0).trim()} / ${f1(s.nestedDownRight, 0).trim()})`.padEnd(15) + delta(r, 'nestedDown')
      + f1(s.nestedUp, 6) + `  (${f1(s.nestedUpLeaderRight, 0).trim()} / ${f1(s.nestedUpRight, 0).trim()})`.padEnd(15)
      + f1(s.barsSayMore, 6) + `  (${f1(s.barsSayMoreRight, 0).trim()} / ${f1(s.barsSayMoreAddedRight, 0).trim()})`.padEnd(15) + delta(r, 'barsSayMore'); });
  const lab = (r, k) => r.confidence[k] || { share: 0, accuracy: null };
  block('Confidence and next door', '  HIGH share acc   MOD share acc   LOW share acc   next door',
    (r) => LABELS.map((k) => f1(lab(r, k).share, 8) + f1(lab(r, k).accuracy, 6) + ' ').join('') + f1(r.neighbourhoodCoverage, 11));
  L.push('');
  L.push('losing: fewer wins than losses. lost all: no wins (0-3: of those, the ones that lost three or more; the others lost the one or');
  L.push('two they played before a clinch; right: how many were the true identity; min ratio: the smallest posterior ratio of such an');
  L.push('identity to the best other candidate). not best: below the best wins-minus-losses. changed: the result is not PM (right: the');
  L.push('new result is true; PM was: PM was true and the change lost it).');
  L.push('lead: the first candidate Round 3 played, the one of the four the Round 1 + 2 posterior rates highest (ok: it is the true');
  L.push('identity). overturned: the result is not the lead. down: the result\'s colours are a proper subset of the lead\'s; up: the');
  L.push('reverse. bars say more: the result leaves out a colour printed at 50 or more and 25 or more above every other colour it');
  L.push('leaves out (+1 ok: the result with that colour added is the true identity). ok: the result is the true identity.');
  const mismatched = reports.reduce((a, r) => a + r.round3.labelMismatches, 0);
  if (mismatched) { L.push(''); L.push(`${mismatched} results carry a label the recorded facts do not give them: the rule variants' labels are suspect.`); }
  const violations = reports.reduce((a, r) => a + r.contract.violations, 0);
  if (violations) { L.push(''); L.push(`${violations} results broke the state.result contract; e.g. ${reports.flatMap(r => r.contract.examples)[0]}`); }
  if (meta.errors.length) { L.push(''); L.push(`Page reported ${meta.errors.length} console/jsdom errors; first: ${meta.errors[0]}`); }
  return L.join('\n');
}
function textRound3AcrossP(reports, opts) {
  const models = [...new Set(reports.map((r) => r.params.model))];
  const cols = [];
  for (const model of models) for (const p of opts.p) cols.push({ model, p });
  const L = ['Round 3 variants: overall exact / losing-record share / lost-all share / nested down / bars say more, in percent'];
  L.push('  ' + 'variant'.padEnd(22) + cols.map((c) => `${c.model.slice(0, 7)} p=${c.p}`.padStart(34)).join(''));
  for (const v of opts.r3) {
    L.push('  ' + v.name.padEnd(22) + cols.map((c) => {
      const r = reports.find((x) => x.variant === v.name && x.params.model === c.model && x.params.p === c.p);
      return `${f1(r.overallExact, 0)} / ${f1(r.round3.losingShare, 0)} / ${f1(r.round3.lostAllShare, 0)} / ${f1(r.shift.nestedDown, 0)} / ${f1(r.shift.barsSayMore, 0)}`.padStart(34);
    }).join(''));
  }
  return L.join('\n');
}

if (isMainThread) main(parseArgs(process.argv.slice(2))).catch(e => { console.error(e); process.exit(1); });
else workerMain().catch(e => { console.error(e); process.exit(1); });
