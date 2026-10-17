#!/usr/bin/env node
// Offline respondent simulation for The Mana Curve.
// Boots index.html once per worker thread in jsdom, then drives many synthetic
// respondents through Rounds 1-3 using the page's own handlers and scoring code
// (unchanged). The respondent models live in tests/_lib/respondent.js.
// Usage: node tests/simulate.js [--n 200] [--p 0.8[,0.9,...]] [--neither 0.05] [--seed 1]
//          [--model ideal|misspecified | --models both] [--workers auto]
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const ROOT = path.resolve(__dirname, '..');
const { bootPage } = require('./_lib/load');
const { runRespondent, calibrateMisspecified, MODEL_NAMES } = require('./_lib/respondent');

// ---------- CLI ----------
function fail(msg) { console.error(msg); process.exit(2); }
function parseArgs(argv) {
  const o = { n: 200, p: [0.8], neither: 0.05, seed: 1, workers: 0, models: ['ideal'] };
  const num = (k, v) => { const x = Number(v); if (v === undefined || v === '' || !Number.isFinite(x)) fail('Bad value for --' + k); return x; };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i].replace(/^--/, ''), v = argv[++i];
    if (['n', 'neither', 'seed', 'workers'].includes(k)) o[k] = num(k, v);
    else if (k === 'p') o.p = String(v).split(',').map((x) => num('p', x));
    else if (k === 'model') o.models = [String(v)];
    else if (k === 'models') o.models = v === 'both' ? ['ideal', 'misspecified'] : String(v).split(',');
    else fail('Unknown option ' + argv[i - 1]);
  }
  for (const m of o.models) if (!MODEL_NAMES.includes(m)) fail(`Unknown model "${m}"; expected ${MODEL_NAMES.join(' or ')}, or --models both`);
  for (const p of o.p) if (p < 0 || p > 1) fail('--p values must lie between 0 and 1');
  o.n = Math.max(1, Math.floor(o.n));
  o.p = [...new Set(o.p)];
  o.models = [...new Set(o.models)];
  return o;
}

// ---------- Worker ----------
// One jsdom page per worker thread (not per respondent). Every respondent has
// its own seeded streams, so results do not depend on how work is sharded.
function workerMain() {
  const { configs, tasks } = workerData;
  const t = Date.now();
  const { win, errors } = bootPage({ stubs: { calculating: 'skip' }, fastStyles: true });
  const bootMs = Date.now() - t;
  const ids = Object.keys(win.__h.PROFILES);
  const one = (ci, id, i) => ({ ci, ...runRespondent(win, id, i, configs[ci]) });
  // Independence check: replaying a respondent after a different one on the
  // same page must reproduce its first result exactly.
  const probe = JSON.stringify(one(0, ids[0], 0));
  one(configs.length - 1, ids[ids.length - 1], 1);
  const independent = JSON.stringify(one(0, ids[0], 0)) === probe;
  const runs = independent ? tasks.map(([ci, id, i]) => one(ci, id, i)) : [];
  win.close();
  parentPort.postMessage({ runs, errors, bootMs, independent });
}

// ---------- Main ----------
const TYPE_NAMES = { 1: 'mono', 2: 'guild', 3: 'three', 4: 'four', 5: 'five' };
const TYPES = ['mono', 'guild', 'three', 'four', 'five'];
const pct = (x) => (100 * x).toFixed(1).padStart(5) + '%';
const pp = (x) => ((x >= 0 ? '+' : '') + (100 * x).toFixed(1)).padStart(6);

async function main(opts) {
  const t0 = Date.now();
  const vm = require('vm');
  const sandbox = {}; vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf-8') + '\n;this.__P = PROFILES;', sandbox);
  const ids = Object.keys(sandbox.__P);
  const colorsOf = Object.fromEntries(ids.map(id => [id, [...sandbox.__P[id].colors]]));

  const configs = [];
  for (const p of opts.p) for (const model of opts.models) {
    const c = { model, p, neither: opts.neither, seed: opts.seed };
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
    out.push(atP.length === 1 ? textReport(atP[0], ids, meta) : textComparison(atP, ids, meta));
  }
  if (opts.p.length > 1) out.push(textAcrossP(reports, opts));
  console.log(out.join('\n\n' + '='.repeat(78) + '\n\n'));

  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const json = reports.length === 1 ? reports[0] : { runs: reports };
  fs.writeFileSync(path.join(outDir, 'simulation.json'), JSON.stringify(json, null, 2) + '\n');
  // A page error makes the run suspect: fail, so the smoke run in npm test catches it.
  if (errors.length) {
    console.error(`\nThe page reported ${errors.length} console/jsdom errors; exiting with status 1.`);
    process.exit(1);
  }
}

function summarise({ config, opts, ids, colorsOf, runs, meta }) {
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
  const conf = {};
  for (const r of runs) conf[r.confidence] = (conf[r.confidence] || 0) + 1;
  const confusionCounts = {};
  for (const r of runs) if (r.recovered !== r.trueId) {
    const k = r.trueId + '\t' + r.recovered; confusionCounts[k] = (confusionCounts[k] || 0) + 1;
  }
  const topConfusions = Object.entries(confusionCounts)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 10)
    .map(([k, count]) => { const [from, to] = k.split('\t'); return { true: from, recovered: to, count, shareOfTrue: count / opts.n }; });
  const params = { model: config.model, n: opts.n, p: config.p, neither: config.neither, seed: config.seed };
  if (config.calibration) params.calibration = config.calibration;
  return {
    params,
    respondents: runs.length,
    elapsedSeconds: meta.elapsedSeconds,
    bootSeconds: meta.bootSeconds,
    workers: meta.workers,
    independentOnReusedPage: true,
    overallExact: runs.filter(r => r.recovered === r.trueId).length / runs.length,
    round1AloneExact: runs.filter(r => r.round1Pick === r.trueId).length / runs.length,
    earlyOfferShare: runs.filter(r => r.earlyOffer).length / runs.length,
    byType, perIdentity, topConfusions,
    confidence: Object.fromEntries(Object.entries(conf).map(([k, v]) => [k, { count: v, share: v / runs.length }])),
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

// ---------- Text: one model at one p ----------
function textReport(report, ids, meta) {
  const { byType, perIdentity, topConfusions, params } = report;
  const L = [];
  L.push(`Mana Curve respondent simulation  model=${params.model}  n=${params.n}/identity  p=${params.p}  neither=${params.neither}  seed=${params.seed}`);
  L.push(`${report.respondents} respondents across ${ids.length} identities in ${meta.elapsedSeconds}s (${meta.workers} worker pages, boot ${meta.bootSeconds}s)`);
  const cal = calibrationLine(report); if (cal) L.push(cal);
  L.push('');
  L.push('Exact recovery                      final   R1 alone');
  for (const t of TYPES) {
    L.push(`  ${t.toUpperCase().padEnd(32)} ${pct(byType[t].exact)}    ${pct(byType[t].round1Alone)}   (type average)`);
    for (const id of ids.filter(i => perIdentity[i].type === t)) {
      L.push(`    ${id.padEnd(10)} ${perIdentity[id].colors.padEnd(19)} ${pct(perIdentity[id].exact)}    ${pct(perIdentity[id].round1Alone)}`);
    }
  }
  L.push('');
  L.push(`Overall exact recovery:        ${pct(report.overallExact)}`);
  L.push(`Round 1 alone (candidate #1):  ${pct(report.round1AloneExact)}`);
  L.push(`Early-result offer shown:      ${pct(report.earlyOfferShare)}`);
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
  if (meta.errors.length) { L.push(''); L.push(`Page reported ${meta.errors.length} console/jsdom errors; first: ${meta.errors[0]}`); }
  return L.join('\n');
}

// ---------- Text: several models side by side at one p ----------
// gap = first model minus each other model, in percentage points.
function textComparison(reports, ids, meta) {
  const [base, ...rest] = reports;
  const names = reports.map(r => r.params.model);
  const col = (s) => String(s).padStart(13);
  const gapName = (r) => (rest.length === 1 ? 'gap (pp)' : 'gap ' + r.params.model.slice(0, 8));
  const head = (label) => label.padEnd(34) + names.map(col).join('') + rest.map(r => col(gapName(r))).join('');
  const row = (label, get) => label.padEnd(34) + reports.map(r => col(pct(get(r)))).join('') + rest.map(r => col(pp(get(base) - get(r)))).join('');
  const { params } = base;
  const L = [];
  L.push(`Mana Curve respondent simulation  models=${names.join(',')}  n=${params.n}/identity  p=${params.p}  neither=${params.neither}  seed=${params.seed}`);
  L.push(`${reports.reduce((a, r) => a + r.respondents, 0)} respondents across ${ids.length} identities in ${meta.elapsedSeconds}s (${meta.workers} worker pages, boot ${meta.bootSeconds}s)`);
  for (const r of reports) { const cal = calibrationLine(r); if (cal) L.push(cal); }
  L.push(`gap = ${base.params.model} minus ${rest.map(r => r.params.model).join(' / ')}, in percentage points`);
  L.push('');
  L.push(head('Exact recovery, final'));
  for (const t of TYPES) {
    L.push(row(`  ${t.toUpperCase()} (type average)`, r => r.byType[t].exact));
    for (const id of ids.filter(i => base.perIdentity[i].type === t)) {
      L.push(row(`    ${id.padEnd(10)} ${base.perIdentity[id].colors}`, r => r.perIdentity[id].exact));
    }
  }
  L.push(row('  OVERALL', r => r.overallExact));
  L.push('');
  L.push(head('Round 1 alone (candidate #1)'));
  for (const t of TYPES) L.push(row(`  ${t.toUpperCase()} (type average)`, r => r.byType[t].round1Alone));
  L.push(row('  OVERALL', r => r.round1AloneExact));
  L.push('');
  L.push(head('Other'));
  L.push(row('  Early-result offer shown', r => r.earlyOfferShare));
  for (const k of ['HIGH', 'MODERATE', 'LOW']) L.push(row(`  Confidence ${k}`, r => (r.confidence[k] || { share: 0 }).share));
  for (const r of reports) {
    L.push('');
    L.push(`Top 5 confusions, ${r.params.model} (true -> recovered)`);
    for (const c of r.topConfusions.slice(0, 5)) {
      L.push(`  ${(c.true + ' -> ' + c.recovered).padEnd(24)} ${String(c.count).padStart(5)}  (${pct(c.shareOfTrue).trim()} of ${c.true})`);
    }
  }
  if (meta.errors.length) { L.push(''); L.push(`Page reported ${meta.errors.length} console/jsdom errors; first: ${meta.errors[0]}`); }
  return L.join('\n');
}

// ---------- Text: summary across p ----------
function textAcrossP(reports, opts) {
  const L = ['Exact recovery by p (type averages)'];
  L.push('  ' + 'p'.padEnd(6) + 'model'.padEnd(14) + TYPES.map(t => t.toUpperCase().padStart(8)).join('') + 'OVERALL'.padStart(10));
  for (const p of opts.p) for (const r of reports.filter(x => x.params.p === p)) {
    L.push('  ' + String(p).padEnd(6) + r.params.model.padEnd(14) + TYPES.map(t => pct(r.byType[t].exact).padStart(8)).join('') + pct(r.overallExact).padStart(10));
  }
  return L.join('\n');
}

if (isMainThread) main(parseArgs(process.argv.slice(2))).catch(e => { console.error(e); process.exit(1); });
else workerMain();
