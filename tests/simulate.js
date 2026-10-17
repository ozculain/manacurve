#!/usr/bin/env node
// Offline respondent simulation for The Mana Curve.
// Boots index.html once per worker thread (and scoring engine) in jsdom, then
// drives many synthetic respondents through Rounds 1-3 using the page's own
// handlers and scoring code (unchanged). The respondent models live in
// tests/_lib/respondent.js.
// Usage: node tests/simulate.js [--n 200] [--p 0.8[,0.9,...]] [--neither 0.05] [--seed 1]
//          [--model ideal|misspecified | --models both] [--engine 2 | --engine 1,2]
//          [--gaming] [--workers auto] [--out tests/out/simulation.json]
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const ROOT = path.resolve(__dirname, '..');
const { bootPage } = require('./_lib/load');
const { runRespondent, calibrateMisspecified, MODEL_NAMES } = require('./_lib/respondent');

// The page's default engine; ?engine=1 selects the win-rate engine for one release.
const ENGINES = [1, 2];
const DEFAULT_ENGINE = 2;
// The instrument version the page stamps on a finished result (INSTRUMENT_VERSION in
// index.html): 2 since the Phase 3 quiz copy changed the items and screens.
const INSTRUMENT_VERSION = 2;
const engineUrl =(engine) => (engine === 1 ? 'http://localhost/?engine=1' : 'http://localhost/');

// ---------- CLI ----------
function fail(msg) { console.error(msg); process.exit(2); }
function parseArgs(argv) {
  const o = { n: 200, p: [0.8], neither: 0.05, seed: 1, workers: 0, models: ['ideal'], engines: [DEFAULT_ENGINE], gaming: false, out: null };
  const num = (k, v) => { const x = Number(v); if (v === undefined || v === '' || !Number.isFinite(x)) fail('Bad value for --' + k); return x; };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i].replace(/^--/, '');
    if (k === 'gaming') { o.gaming = true; continue; } // a flag: takes no value
    const v = argv[++i];
    if (['n', 'neither', 'seed', 'workers'].includes(k)) o[k] = num(k, v);
    else if (k === 'p') o.p = String(v).split(',').map((x) => num('p', x));
    else if (k === 'model') o.models = [String(v)];
    else if (k === 'models') o.models = v === 'both' ? ['ideal', 'misspecified'] : String(v).split(',');
    else if (k === 'engine' || k === 'engines') o.engines = v === 'both' ? [...ENGINES] : String(v).split(',').map((x) => num('engine', x));
    else if (k === 'out') { if (!v) fail('Bad value for --out'); o.out = path.resolve(v); }
    else fail('Unknown option ' + argv[i - 1]);
  }
  for (const m of o.models) if (!MODEL_NAMES.includes(m)) fail(`Unknown model "${m}"; expected ${MODEL_NAMES.join(' or ')}, or --models both`);
  for (const e of o.engines) if (!ENGINES.includes(e)) fail(`Unknown engine "${e}"; expected ${ENGINES.join(' or ')}, or --engine 1,2`);
  for (const p of o.p) if (p < 0 || p > 1) fail('--p values must lie between 0 and 1');
  o.n = Math.max(1, Math.floor(o.n));
  o.p = [...new Set(o.p)];
  o.models = [...new Set(o.models)];
  o.engines = [...new Set(o.engines)];
  return o;
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
  const { configs, tasks } = workerData;
  const t = Date.now();
  const pages = {};
  for (const engine of [...new Set(tasks.map(([ci]) => configs[ci].engine))]) {
    pages[engine] = bootPage({ url: engineUrl(engine), stubs: { calculating: 'skip' }, fastStyles: true });
  }
  const bootMs = Date.now() - t;
  const one = (ci, id, i) => ({ ci, ...runRespondent(pages[configs[ci].engine].win, id, i, configs[ci]) });
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
  const vm = require('vm');
  const sandbox = {}; vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf-8') + '\n;this.__P = PROFILES;', sandbox);
  const ids = Object.keys(sandbox.__P);
  const colorsOf = Object.fromEntries(ids.map(id => [id, [...sandbox.__P[id].colors]]));

  const configs = [];
  for (const p of opts.p) for (const model of opts.models) for (const engine of opts.engines) {
    const c = { model, p, neither: opts.neither, seed: opts.seed, engine, gaming: opts.gaming };
    if (model === 'misspecified') c.calibration = calibrateMisspecified(p);
    configs.push(c);
  }
  const tasks = [];
  for (let ci = 0; ci < configs.length; ci++) for (const id of ids) for (let i = 0; i < opts.n; i++) tasks.push([ci, id, i]);
  const W = Math.max(1, Math.min(opts.workers || os.availableParallelism(), tasks.length));
  const shards = Array.from({ length: W }, (_, w) => tasks.filter((_, k) => k % W === w));
  const parts = await Promise.all(shards.map(shard => new Promise((resolve, reject) => {
    const w = new Worker(__filename, { workerData: { configs, tasks: shard } });
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
  const reports = configs.map((config, ci) => {
    const runs = [];
    for (const id of ids) for (let i = 0; i < opts.n; i++) runs.push(byKey.get(ci + '#' + id + '#' + i));
    return summarise({ config, opts, ids, colorsOf, runs, meta });
  });

  const out = [];
  for (const p of opts.p) {
    const atP = reports.filter(r => r.params.p === p);
    out.push(atP.length === 1 ? textReport(atP[0], ids, meta) : textComparison(atP, ids, meta, opts));
  }
  if (opts.p.length > 1) out.push(textAcrossP(reports, opts));
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
  if (violations || errors.length) process.exit(1);
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

// state.result must carry the contract's fields (docs/SCORING_CONTRACT.md).
function contractProblems(r, engine) {
  const bad = [];
  if (!r.recovered) bad.push('no identity');
  if (!LABELS.includes(r.confidence)) bad.push('confidence ' + r.confidence);
  if (r.scoringVersion !== engine) bad.push(`scoringVersion ${r.scoringVersion} on engine ${engine}`);
  if (r.instrumentVersion !== INSTRUMENT_VERSION) bad.push('instrumentVersion ' + r.instrumentVersion);
  if (engine >= 2) {
    if (r.posteriorIds !== 31) bad.push('posterior over ' + r.posteriorIds + ' identities');
    else if (Math.abs(r.posteriorSum - 1) > 1e-9) bad.push('posterior sums to ' + r.posteriorSum);
  }
  return bad;
}

function summarise({ config, opts, ids, colorsOf, runs, meta }) {
  const idByKey = Object.fromEntries(ids.map(id => [WUBRG.filter(c => colorsOf[id].includes(c)).join(''), id]));
  const idOfColors = (cols) => idByKey[WUBRG.filter(c => cols.includes(c)).join('')] || null;
  const typeOf = (id) => TYPE_NAMES[colorsOf[id].length];
  const exactOf = (rs) => share(rs.filter(r => r.recovered === r.trueId).length, rs.length);
  const covered = (r) => neighbourhood(r.recovered, r.finalActivation, colorsOf, idOfColors).includes(r.trueId);

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
    .map(([k, count]) => { const [from, to] = k.split('\t'); return { true: from, recovered: to, count, shareOfTrue: count / opts.n }; });
  const contract = { violations: 0, examples: [] };
  for (const r of runs) {
    const bad = contractProblems(r, config.engine);
    if (bad.length) { contract.violations++; if (contract.examples.length < 5) contract.examples.push(`${r.trueId} #${r.idx}: ${bad.join(', ')}`); }
  }
  const params = { model: config.model, engine: config.engine, n: opts.n, p: config.p, neither: config.neither, seed: config.seed, gaming: config.gaming };
  if (config.calibration) params.calibration = config.calibration;
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
    byType, guilds, perIdentity, topConfusions, confidence, contract,
    pageErrorCount: meta.errors.length,
    pageErrors: meta.errors.slice(0, 20),
  };
}

function calibrationLine(r) {
  const c = r.params.calibration;
  if (!c) return null;
  return `Misspecified calibration: item sharpness k=${c.k.toFixed(2)}, Round 3 sharpness k3=${c.k3.toFixed(2)}` +
    (c.target !== r.params.p ? ` (p capped at ${c.target})` : '');
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
  L.push(`Early-result offer shown:      ${pct(report.earlyOffer.share)}   precision ${pct(report.earlyOffer.precision).trim()} (${report.earlyOffer.correct}/${report.earlyOffer.count} offered identities right)`);
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
  const short = { ideal: 'ideal', misspecified: 'misspec' };
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
  L.push('  ' + 'p'.padEnd(6) + 'model'.padEnd(14) + 'engine'.padEnd(8) + TYPES.map(t => t.toUpperCase().padStart(8)).join('') + 'OVERALL'.padStart(10) + 'HIGH'.padStart(8) + 'MOD'.padStart(8) + 'LOW'.padStart(8));
  const acc = (r, k) => (r.confidence[k] ? r.confidence[k].accuracy : null);
  for (const p of opts.p) for (const r of reports.filter(x => x.params.p === p)) {
    L.push('  ' + String(p).padEnd(6) + r.params.model.padEnd(14) + String(r.params.engine).padEnd(8) + TYPES.map(t => pct(r.byType[t].exact).padStart(8)).join('') + pct(r.overallExact).padStart(10)
      + LABELS.map(k => pct(acc(r, k)).padStart(8)).join(''));
  }
  L.push('  (HIGH / MOD / LOW: accuracy of each confidence label)');
  return L.join('\n');
}

if (isMainThread) main(parseArgs(process.argv.slice(2))).catch(e => { console.error(e); process.exit(1); });
else workerMain().catch(e => { console.error(e); process.exit(1); });
