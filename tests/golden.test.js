#!/usr/bin/env node
'use strict';
// Golden-path regression test for the scoring pipeline.
// For each of the 31 identities, one respondent at p = 1 and five seeded
// respondents at p = 0.8 (the simulator's ideal model and seeding) go through
// the real Rounds 1-3. For each path it records the Round 1 candidates (id and
// s1), the Round 1 and final activation (3 dp), whether the early-result offer
// appeared, the final identity and confidence, the Round 3 matchups in order,
// and buildResultURL(). Any difference from tests/fixtures/golden.json fails.
//
// The fixture is rewritten only by a scoring change, in its own commit:
//   node tests/golden.test.js --update
// Usage: node tests/golden.test.js [--update] [path/to/index.html]
const fs = require('fs');
const path = require('path');
const { bootPage, pageArgs } = require('./_lib/load');
const { runRespondent } = require('./_lib/respondent');
const { run } = require('./_lib/report');

const FIXTURE = path.join(__dirname, 'fixtures', 'golden.json');
const UPDATE = process.argv.includes('--update');
const SEED = 1;
const PATHS = [
  { p: 1, neither: 0, idx: [0] },
  { p: 0.8, neither: 0.05, idx: [0, 1, 2, 3, 4] },
];
const TYPE = { 1: 'mono', 2: 'guild', 3: 'three', 4: 'four', 5: 'five' };
const FIELDS = ['r1', 'r1Activation', 'earlyOffer', 'activation', 'identity', 'confidence', 'matchups', 'url'];
const keyOf = (r) => `${r.id} p=${r.p} #${r.idx}`;

function record(win, id, spec, idx) {
  const r = runRespondent(win, id, idx, { model: 'ideal', p: spec.p, neither: spec.neither, seed: SEED }, { trace: true });
  return {
    id, p: spec.p, neither: spec.neither, idx,
    r1: r.r1, r1Activation: r.r1Activation, earlyOffer: r.earlyOffer, activation: r.activation,
    identity: r.recovered, confidence: r.confidence, matchups: r.matchups, url: r.url,
  };
}

// One path per line, so a fixture rewrite reads as a per-path diff.
function serialise(paths) {
  const note = 'Golden paths through the scoring pipeline; see tests/golden.test.js. Rewrite only with --update, in a scoring commit of its own.';
  return '{\n'
    + '  "note": ' + JSON.stringify(note) + ',\n'
    + '  "seed": ' + JSON.stringify(SEED) + ',\n'
    + '  "paths": ' + JSON.stringify(PATHS) + ',\n'
    + '  "results": [\n' + paths.map((r) => '    ' + JSON.stringify(r)).join(',\n') + '\n  ]\n}\n';
}

const show = (v) => { const s = JSON.stringify(v); return s === undefined ? 'missing' : (s.length > 90 ? s.slice(0, 87) + '...' : s); };
// For arrays, point at the first element that differs.
function describe(key, field, e, a) {
  if (Array.isArray(e) && Array.isArray(a)) {
    for (let i = 0; i < Math.max(e.length, a.length); i++) {
      if (JSON.stringify(e[i]) === JSON.stringify(a[i])) continue;
      const len = e.length !== a.length ? ` (length ${e.length} -> ${a.length})` : '';
      return `${key} ${field}[${i}]: ${show(e[i])} -> ${show(a[i])}${len}`;
    }
  }
  return `${key} ${field}: ${show(e)} -> ${show(a)}`;
}

run('golden', async ({ ok, note }) => {
  const t0 = Date.now();
  const { win, h, errors } = bootPage({ ...pageArgs(), seed: SEED, stubs: { calculating: 'skip' }, fastStyles: true });
  const ids = Object.keys(h.PROFILES);
  const actual = [];
  for (const id of ids) for (const spec of PATHS) for (const idx of spec.idx) actual.push(record(win, id, spec, idx));
  // Replaying the first path after all the others must reproduce it exactly.
  const replay = record(win, ids[0], PATHS[0], PATHS[0].idx[0]);
  ok('replaying a path on the same page reproduces it (no state leaks between respondents)', JSON.stringify(replay) === JSON.stringify(actual[0]), keyOf(actual[0]));
  ok('no console or jsdom errors while running the paths', errors.length === 0, errors.slice(0, 3).join(' | '));
  win.close();
  note(`${actual.length} paths in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  if (UPDATE) {
    fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
    fs.writeFileSync(FIXTURE, serialise(actual));
    ok(`fixture rewritten: ${path.relative(process.cwd(), FIXTURE)} (${actual.length} paths)`, true);
    return;
  }
  if (!ok('fixture present', fs.existsSync(FIXTURE), FIXTURE + ' missing; run with --update to create it')) return;
  const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf-8'));
  ok('fixture was recorded with the same seed and paths', fixture.seed === SEED && JSON.stringify(fixture.paths) === JSON.stringify(PATHS),
    'fixture seed/paths ' + JSON.stringify({ seed: fixture.seed, paths: fixture.paths }));

  const expected = new Map(fixture.results.map((r) => [keyOf(r), r]));
  const diffs = [];
  const diffsByType = {};
  const countByType = {};
  for (const a of actual) {
    const type = TYPE[h.PROFILES[a.id].colors.length];
    countByType[type] = (countByType[type] || 0) + 1;
    const e = expected.get(keyOf(a));
    expected.delete(keyOf(a));
    const mine = [];
    if (!e) mine.push(`${keyOf(a)}: not in the fixture`);
    else for (const f of FIELDS) {
      if (JSON.stringify(a[f]) !== JSON.stringify(e[f])) mine.push(describe(keyOf(a), f, e[f], a[f]));
    }
    diffs.push(...mine);
    if (mine.length) diffsByType[type] = (diffsByType[type] || 0) + 1;
  }
  for (const k of expected.keys()) diffs.push(`${k}: in the fixture but not produced`);
  for (const type of Object.values(TYPE)) {
    const n = diffsByType[type] || 0;
    ok(`golden ${type}: ${countByType[type] - n}/${countByType[type]} paths match`, n === 0, `${n} paths differ`);
  }
  ok('no fixture paths missing', expected.size === 0, `${expected.size} missing`);
  if (diffs.length) {
    note(`${diffs.length} differences; first ${Math.min(8, diffs.length)}:`);
    for (const d of diffs.slice(0, 8)) note('  ' + d);
    note('If the scoring change is intended, rewrite the fixture in its own commit: node tests/golden.test.js --update');
  }
});
