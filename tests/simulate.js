#!/usr/bin/env node
// Offline respondent simulation for The Mana Curve.
// Boots index.html once in jsdom, then drives many synthetic respondents through
// Rounds 1-3 using the page's own handlers and scoring code (unchanged).
// Usage: node tests/simulate.js [--n 200] [--p 0.8] [--neither 0.05] [--seed 1] [--workers auto]
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const ROOT = path.resolve(__dirname, '..');
const { JSDOM, VirtualConsole } = require(path.join(ROOT, 'node_modules', 'jsdom'));

// ---------- CLI ----------
function parseArgs(argv) {
  const o = { n: 200, p: 0.8, neither: 0.05, seed: 1, workers: 0 };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i].replace(/^--/, '');
    if (!(k in o)) { console.error('Unknown option ' + argv[i]); process.exit(2); }
    const v = Number(argv[++i]);
    if (!Number.isFinite(v)) { console.error('Bad value for --' + k); process.exit(2); }
    o[k] = v;
  }
  o.n = Math.max(1, Math.floor(o.n));
  return o;
}
const opts = parseArgs(process.argv.slice(2));

// ---------- PRNG ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// FNV-1a over the parts, so every respondent gets its own reproducible streams
// regardless of run order.
function hashSeed(...parts) {
  let h = 2166136261;
  for (const ch of parts.join('|')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// ---------- Boot one page ----------
function buildHtml() {
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  const dataJs = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf-8');
  html = html.replace('<script src="data.js"></script>', '<!-- data.js inlined below -->');
  html = html.replace(/<!-- data\.js inlined below -->[\s\S]*?<script>/, () => '<script>\n' + dataJs + '\n');
  html = html.replace(/<script src="https:\/\/unpkg\.com\/html-to-image[^>]*><\/script>/, '');
  // Injected inside the script scope: skip transition/calculating timers and the
  // results render (scoring is complete once state.result is set), expose state
  // and the answer handlers. No scoring function is touched.
  const helpers = `
showRoundTransition = (a, b, cb) => cb();
lockAnswers = () => {};
showCalculating = () => {};
window.__h = {
  get state() { return state; },
  restart, startAssessment, answerQ, answerNeither, continueToRound2,
  selectRefinementChoice, continueToStage2, selectTournamentChoice,
  PROFILES,
};
`;
  const marker = '// === SCRIPT END — all functions defined ===';
  if (!html.includes(marker)) throw new Error('SCRIPT END marker missing from index.html');
  return html.replace(marker, () => helpers + '\n' + marker);
}

function bootPage() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('error', (...a) => errors.push(a.map(String).join(' ')));
  vc.on('jsdomError', (e) => errors.push(e.message));
  const dom = new JSDOM(buildHtml(), { url: 'http://localhost/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
  const win = dom.window;
  win.Element.prototype.scrollIntoView = function () {};
  win.HTMLElement.prototype.scrollTo = function () {};
  win.scrollTo = function () {};
  // jsdom validates every `style.background = <gradient>` through css-tree, which
  // throws and catches internally and dominates run time (the progress bar is
  // repainted on every answer). Store the value without validating it; this is
  // presentation only and touches no scoring code.
  for (let proto = Object.getPrototypeOf(win.document.body.style); proto && proto !== win.Object.prototype; proto = Object.getPrototypeOf(proto)) {
    if (Object.getOwnPropertyDescriptor(proto, 'background')) {
      const store = new WeakMap();
      Object.defineProperty(proto, 'background', {
        configurable: true, enumerable: true,
        get() { return store.get(this) || ''; },
        set(v) { store.set(this, String(v)); },
      });
      break;
    }
  }
  return { win, errors };
}

// ---------- Respondent model ----------
// Prefer an option in C with probability p; if all or none are in C, uniform.
function chooseOption(options, inC, rnd, p) {
  const pref = options.filter(inC), other = options.filter(o => !inC(o));
  const pool = (pref.length === 0 || other.length === 0) ? options : (rnd() < p ? pref : other);
  return pool[Math.floor(rnd() * pool.length)];
}
function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  let inter = 0; for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

function runRespondent(win, trueId, idx) {
  const h = win.__h;
  win.Math.random = mulberry32(hashSeed(opts.seed, trueId, idx, 'page'));
  const rnd = mulberry32(hashSeed(opts.seed, trueId, idx, 'resp'));
  const C = h.PROFILES[trueId].colors;
  const inC = (o) => C.includes(o.c);
  const visible = (id) => { const el = win.document.getElementById(id); return !!el && !el.classList.contains('hidden'); };

  h.restart(); // the page's own "Start fresh" path: rebuilds state, hides all screens
  const s0 = h.state;
  s0.mode = 'draft'; s0.audience = 'consumer'; s0.gamingFamiliar = false; s0.disclaimerAcknowledged = true;
  h.startAssessment();

  // Round 1
  let guard = 0;
  while (h.state.stage === 1 && guard++ < 60) {
    const s = h.state, q = s.poolA[s.qNum];
    if (rnd() < opts.neither) h.answerNeither(q);
    else { const o = chooseOption(q.r, inC, rnd, opts.p); h.answerQ(o, q.r.indexOf(o)); }
  }
  const rc = h.state.round1Candidates;
  const round1Pick = rc && rc[0] ? rc[0].id : null;
  let earlyOffer = false;
  if (visible('screen-early-offer')) { earlyOffer = true; h.continueToRound2(); }

  // Round 2
  guard = 0;
  while (h.state.stage === 'refinement' && h.state.qNum < (h.state.refinementQuestions || []).length && guard++ < 60) {
    const s = h.state, q = s.refinementQuestions[s.qNum];
    const o = chooseOption(q.r, inC, rnd, opts.p);
    h.selectRefinementChoice(o.c, q.pair);
  }
  if (!h.state.result && h.state.stage !== 3) h.continueToStage2();

  // Round 3
  guard = 0;
  while (!h.state.result && guard++ < 60) {
    const m = h.state.tournament && h.state.tournament.currentMatchup;
    if (!m) break;
    const ja = jaccard(h.PROFILES[m.a.id].colors, C), jb = jaccard(h.PROFILES[m.b.id].colors, C);
    let pick;
    if (ja === jb) pick = rnd() < 0.5 ? m.a.id : m.b.id;
    else {
      const better = ja > jb ? m.a.id : m.b.id, worse = ja > jb ? m.b.id : m.a.id;
      pick = rnd() < opts.p ? better : worse;
    }
    h.selectTournamentChoice(pick);
  }
  const r = h.state.result;
  return { trueId, idx, recovered: r ? r.identity : null, confidence: r ? r.confidence : 'NONE', earlyOffer, round1Pick };
}

// ---------- Main ----------
const TYPE_NAMES = { 1: 'mono', 2: 'guild', 3: 'three', 4: 'four', 5: 'five' };
const TYPES = ['mono', 'guild', 'three', 'four', 'five'];
const pct = (x) => (100 * x).toFixed(1).padStart(5) + '%';

// One jsdom page per worker thread (not per respondent). Every respondent has
// its own seeded streams, so results do not depend on how work is sharded.
function workerMain() {
  const t = Date.now();
  const { win, errors } = bootPage();
  const bootMs = Date.now() - t;
  const ids = Object.keys(win.__h.PROFILES);
  // Independence check: replaying a respondent after a different one on the
  // same page must reproduce its first result exactly.
  const probe = JSON.stringify(runRespondent(win, ids[0], 0));
  runRespondent(win, ids[ids.length - 1], 1);
  const independent = JSON.stringify(runRespondent(win, ids[0], 0)) === probe;
  const runs = independent ? workerData.tasks.map(([id, i]) => runRespondent(win, id, i)) : [];
  win.close();
  parentPort.postMessage({ runs, errors, bootMs, independent });
}

async function main() {
  const t0 = Date.now();
  const vm = require('vm');
  const sandbox = {}; vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf-8') + '\n;this.__P = PROFILES;', sandbox);
  const ids = Object.keys(sandbox.__P);
  const colorsOf = Object.fromEntries(ids.map(id => [id, [...sandbox.__P[id].colors]]));
  const tasks = [];
  for (const id of ids) for (let i = 0; i < opts.n; i++) tasks.push([id, i]);
  const W = Math.max(1, Math.min(opts.workers || os.availableParallelism(), tasks.length));
  const shards = Array.from({ length: W }, (_, w) => tasks.filter((_, k) => k % W === w));
  const parts = await Promise.all(shards.map(shard => new Promise((resolve, reject) => {
    const w = new Worker(__filename, { workerData: { tasks: shard }, argv: process.argv.slice(2) });
    w.once('message', resolve); w.once('error', reject);
  })));
  if (!parts.every(p => p.independent)) { console.error('State leaks between respondents on the same page; aborting.'); process.exit(1); }
  const byKey = new Map(parts.flatMap(p => p.runs).map(r => [r.trueId + '#' + r.idx, r]));
  const runs = tasks.map(([id, i]) => byKey.get(id + '#' + i));
  const errors = parts.flatMap(p => p.errors);
  const bootMs = Math.max(...parts.map(p => p.bootMs));
  const independent = true;
  const elapsedMs = Date.now() - t0;
  report({ ids, colorsOf, runs, errors, bootMs, independent, elapsedMs, workers: W });
}

function report({ ids, colorsOf, runs, errors, bootMs, independent, elapsedMs, workers }) {
  const perIdentity = {};
  for (const id of ids) {
    const mine = runs.filter(r => r.trueId === id);
    perIdentity[id] = {
      type: TYPE_NAMES[colorsOf[id].length], colors: colorsOf[id].join(''),
      exact: mine.filter(r => r.recovered === id).length / mine.length,
      round1Alone: mine.filter(r => r.round1Pick === id).length / mine.length,
    };
  }
  const byType = {};
  for (const t of TYPES) {
    const members = ids.filter(id => perIdentity[id].type === t);
    const avg = (k) => members.reduce((a, id) => a + perIdentity[id][k], 0) / (members.length || 1);
    byType[t] = { identities: members.length, exact: avg('exact'), round1Alone: avg('round1Alone') };
  }
  const overall = runs.filter(r => r.recovered === r.trueId).length / runs.length;
  const round1Overall = runs.filter(r => r.round1Pick === r.trueId).length / runs.length;
  const conf = {};
  for (const r of runs) conf[r.confidence] = (conf[r.confidence] || 0) + 1;
  const confusionCounts = {};
  for (const r of runs) if (r.recovered !== r.trueId) {
    const k = r.trueId + '\t' + r.recovered; confusionCounts[k] = (confusionCounts[k] || 0) + 1;
  }
  const topConfusions = Object.entries(confusionCounts)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 10)
    .map(([k, count]) => { const [from, to] = k.split('\t'); return { true: from, recovered: to, count, shareOfTrue: count / opts.n }; });
  const earlyOfferShare = runs.filter(r => r.earlyOffer).length / runs.length;

  const report = {
    params: { n: opts.n, p: opts.p, neither: opts.neither, seed: opts.seed },
    respondents: runs.length,
    elapsedSeconds: +(elapsedMs / 1000).toFixed(1),
    bootSeconds: +(bootMs / 1000).toFixed(1),
    workers,
    independentOnReusedPage: independent,
    overallExact: overall,
    round1AloneExact: round1Overall,
    earlyOfferShare,
    byType, perIdentity, topConfusions,
    confidence: Object.fromEntries(Object.entries(conf).map(([k, v]) => [k, { count: v, share: v / runs.length }])),
    pageErrorCount: errors.length,
    pageErrors: errors.slice(0, 20),
  };

  // ---------- Text report ----------
  const L = [];
  L.push(`Mana Curve respondent simulation  n=${opts.n}/identity  p=${opts.p}  neither=${opts.neither}  seed=${opts.seed}`);
  L.push(`${runs.length} respondents across ${ids.length} identities in ${report.elapsedSeconds}s (${workers} worker pages, boot ${report.bootSeconds}s)`);
  L.push('');
  L.push('Exact recovery                      final   R1 alone');
  for (const t of TYPES) {
    L.push(`  ${t.toUpperCase().padEnd(32)} ${pct(byType[t].exact)}    ${pct(byType[t].round1Alone)}   (type average)`);
    for (const id of ids.filter(i => perIdentity[i].type === t)) {
      L.push(`    ${id.padEnd(10)} ${perIdentity[id].colors.padEnd(19)} ${pct(perIdentity[id].exact)}    ${pct(perIdentity[id].round1Alone)}`);
    }
  }
  L.push('');
  L.push(`Overall exact recovery:        ${pct(overall)}`);
  L.push(`Round 1 alone (candidate #1):  ${pct(round1Overall)}`);
  L.push(`Early-result offer shown:      ${pct(earlyOfferShare)}`);
  L.push('');
  L.push('Confidence labels');
  for (const [k, v] of Object.entries(report.confidence).sort((a, b) => b[1].count - a[1].count)) {
    L.push(`  ${k.padEnd(9)} ${String(v.count).padStart(6)}  ${pct(v.share)}`);
  }
  L.push('');
  L.push('Top 10 confusions (true -> recovered)');
  for (const c of topConfusions) {
    L.push(`  ${(c.true + ' -> ' + c.recovered).padEnd(24)} ${String(c.count).padStart(5)}  (${pct(c.shareOfTrue).trim()} of ${c.true})`);
  }
  if (errors.length) { L.push(''); L.push(`Page reported ${errors.length} console/jsdom errors; first: ${errors[0]}`); }
  console.log(L.join('\n'));

  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'simulation.json'), JSON.stringify(report, null, 2) + '\n');
}

if (isMainThread) main().catch(e => { console.error(e); process.exit(1); });
else workerMain();
