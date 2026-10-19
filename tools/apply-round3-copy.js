#!/usr/bin/env node
'use strict';
// Round 3 copy: put the reviewed stems and options into the three constants that hold them,
// and hold the rules the copy was written to.
//
// Where the copy is. Section 1, "Round 3 stems and options", of the copy drafts file
// (research/COPY_DRAFTS_2026-10.md, revision 2). The file is private and gitignored, so its
// path is an argument. For all 48 Round 3 scenarios it gives the stem and every option as
// before/after pairs; an option marked "(keep)" stays as it is. The commentary around the
// pairs (*Separated*, *Note*, the inventory) is never read as copy.
//
// Where it goes.
//   ROUND2_SCENARIOS   data.js     8 generic scenarios, 31 options each. Stem: `context`.
//   POOL_B, POOL_C     index.html  38 + 85 authored scenarios. Stem: `sc`; options: r[] = {t, g}.
// Nothing else in either file is touched: the tool splices new string literals into the old
// lines, keeps each source's quoting, leaves every other byte alone and reorders nothing.
//
// Matching. By scenario id (CRISIS, POOL_B.AZORIUS[0], ...) and by option key (the identity
// key: MONO-W, DIMIR, ...), never by position. Scoring reads the keys and never the words, so
// the golden fixture does not move.
//
// It refuses, and writes nothing, when:
//   - a scenario or an identity key is in the draft and not in the source, or the other way round;
//   - any option runs over 15 words;
//   - an option outside MTG_STALL (or a stem outside it) names a colour (white, blue, black, red,
//     green), a basic land (Plains, Island, Swamp, Mountain, Forest) or an identity in PROFILES;
//   - a "was" or "keep" line in the draft is not what the source says today (the draft is stale,
//     or somebody else has edited the line), unless the source already says the new words;
//   - the draft disagrees with its own counts.
// Run it again after a successful run and it changes nothing.
//
// Apostrophes. Every "now" line in the draft uses straight apostrophes and the draft asks for
// the kept lines to be normalised to match, so curly quotes in a kept line are straightened
// (the words are the same; they are counted apart in the summary).
//
// Usage: node tools/apply-round3-copy.js --draft <file> [--root <dir>] [--dry-run]
//   --root     the checkout whose data.js and index.html are changed (default: this one)
//   --dry-run  check everything and print the counts, write nothing
// tests/round3-copy.test.js holds the same rules on the live files (readSources, sourceProblems)
// and tries the rest of this file on made-up sources, so it needs no copy of the private draft.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DRAFT_DEFAULT = path.join(ROOT, 'research', 'COPY_DRAFTS_2026-10.md');
const WORD_CAP = 15;
const MTG_STALL = 'MTG_STALL';          // the one scenario allowed to talk about Magic
const COLOUR_NAMES = ['white', 'blue', 'black', 'red', 'green'];
// The five basic lands. "Wastes" is a basic land too, and an everyday verb; it is left out.
const LAND_NAMES = ['plains', 'island', 'swamp', 'mountain', 'forest'];
const POOLS = ['POOL_B', 'POOL_C'];
const GENERIC = 'ROUND2_SCENARIOS';

// ---------- text helpers ----------
const straighten = (s) => s.replace(/[\u2018\u2019\u201B]/g, "'").replace(/[\u201C\u201D]/g, '"');
const same = (a, b) => straighten(a).replace(/\s+/g, ' ').trim() === straighten(b).replace(/\s+/g, ' ').trim();
// Words are the runs between spaces that hold a letter or a digit (a lone dash is not a word).
function wordCount(text) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

// ---------- the rules ----------
// Whole-word, case-insensitive matches, so "think" is not "ink" and "brown" is not "red".
const wholeWord = (alternation) => new RegExp('(?<![\\p{L}\\p{N}])(?:' + alternation + ')(?![\\p{L}\\p{N}])', 'iu');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// What an option outside MTG_STALL must not name. The identity names are every PROFILES key
// (MONO-W, DIMIR, WITCH, INK, WUBRG, ...) and every PROFILES name (MONO-WHITE, FIVE-COLOR, ...).
function nameRules(PROFILES) {
  const identities = new Set();
  for (const [key, profile] of Object.entries(PROFILES)) {
    identities.add(key);
    if (profile && profile.name) identities.add(profile.name);
  }
  const identityAlternation = [...identities].map(escapeRe).join('|')
    + '|(?:four|five)-colou?r|mono-?(?:white|blue|black|red|green)';
  return [
    { kind: 'colour', re: wholeWord(COLOUR_NAMES.join('|')) },
    { kind: 'basic land', re: wholeWord(LAND_NAMES.map((n) => n + (n === 'plains' ? '' : 's?')).join('|')) },
    { kind: 'identity', re: wholeWord(identityAlternation) },
  ];
}

// Problems with the words themselves, for a model { PROFILES, scenarios: [{ id, stem, options }] }.
// The 15-word cap is for options; the names rule is for stems and options; MTG_STALL is exempt
// from the names rule only.
function sourceProblems(model) {
  const rules = nameRules(model.PROFILES);
  const problems = [];
  for (const sc of model.scenarios) {
    const texts = [{ where: 'stem', text: sc.stem }, ...sc.options.map((o) => ({ where: o.key, text: o.text, option: true }))];
    const seen = new Set();
    for (const o of sc.options) {
      if (seen.has(o.key)) problems.push({ id: sc.id, where: o.key, rule: 'keys', detail: 'key appears twice' });
      seen.add(o.key);
    }
    for (const { where, text, option } of texts) {
      if (typeof text !== 'string' || !text.trim()) { problems.push({ id: sc.id, where, rule: 'text', detail: 'empty or not a string' }); continue; }
      if (option) {
        const n = wordCount(text);
        if (n > WORD_CAP) problems.push({ id: sc.id, where, rule: 'words', detail: n + ' words (cap ' + WORD_CAP + '): ' + text });
      }
      if (sc.id === MTG_STALL) continue;
      for (const { kind, re } of rules) {
        const m = re.exec(text);
        if (m) problems.push({ id: sc.id, where, rule: kind, detail: 'names a ' + kind + ' ("' + m[0] + '"): ' + text });
      }
    }
  }
  return problems;
}

// ---------- reading the sources ----------
// `const NAME = {` to the first later line that is exactly `};`, as inclusive line indexes.
function constRegion(lines, name) {
  const start = lines.findIndex((l) => l.startsWith('const ' + name + ' = {'));
  if (start < 0) throw new Error('const ' + name + ' not found');
  for (let i = start + 1; i < lines.length; i++) if (/^\};\s*$/.test(lines[i])) return { start, end: i };
  throw new Error('the end of const ' + name + ' (a line "};") not found');
}

function evalConst(lines, name) {
  const { start, end } = constRegion(lines, name);
  const body = lines.slice(start, end + 1).join('\n').replace(/^const [A-Za-z0-9_]+ = /, '').replace(/;\s*$/, '');
  return vm.runInNewContext('(' + body + ')', {}, { filename: name, timeout: 5000 });
}

// Every Round 3 scenario as { id, group, stem, options: [{ key, text }] }, in source order,
// and PROFILES. dataJs and indexHtml are the files' text.
function readModel({ dataJs, indexHtml }) {
  const data = vm.runInNewContext(dataJs.replace(/^\uFEFF/, '') + '\n;({ PROFILES, ROUND2_SCENARIOS });', {}, { filename: 'data.js', timeout: 10000 });
  const scenarios = [];
  for (const [name, sc] of Object.entries(data.ROUND2_SCENARIOS)) {
    scenarios.push({
      id: name, group: GENERIC, stem: sc.context,
      options: Object.entries(sc.responses).map(([key, text]) => ({ key, text })),
    });
  }
  const lines = indexHtml.split('\n');
  for (const group of POOLS) {
    for (const [owner, entries] of Object.entries(evalConst(lines, group))) {
      entries.forEach((e, i) => scenarios.push({
        id: `${group}.${owner}[${i}]`, group, stem: e.sc,
        options: e.r.map((o) => ({ key: o.g, text: o.t })),
      }));
    }
  }
  return { PROFILES: data.PROFILES, scenarios };
}

function readSources(root = ROOT) {
  const dataFile = path.join(root, 'data.js');
  const htmlFile = path.join(root, 'index.html');
  const dataJs = fs.readFileSync(dataFile, 'utf-8');
  const indexHtml = fs.readFileSync(htmlFile, 'utf-8');
  return { dataFile, htmlFile, dataJs, indexHtml, ...readModel({ dataJs, indexHtml }) };
}

// ---------- reading the draft ----------
const ID_GENERIC = /^[A-Z][A-Z0-9_]*$/;
const ID_POOL = /^POOL_[BC]\.[A-Z]+\[\d+\]$/;
const KEY = '[A-Z0-9]+(?:-[A-Z0-9]+)*';

// Section 1 of the draft as { scenarios: [{ id, line, meta, stem: { was, now }, options }], claims }.
// An option is { key, kept: true, text } or { key, kept: false, was, now }. Strict: any line in a
// Stem or Options block that is not one of the known shapes stops the parse with its line number.
function parseDraft(markdown) {
  const lines = markdown.split(/\r?\n/);
  const first = lines.findIndex((l) => /^## 1\. /.test(l));
  if (first < 0) throw new Error('draft: "## 1." not found');
  let last = lines.findIndex((l, i) => i > first && /^## \d+\. /.test(l));
  if (last < 0) last = lines.length;
  const fail = (i, why) => { throw new Error(`draft line ${i + 1}: ${why}: ${JSON.stringify(lines[i])}`); };

  const scenarios = [];
  let sc = null, state = 'between', option = null;
  for (let i = first + 1; i < last; i++) {
    const line = lines[i].replace(/\s+$/, '');
    let m;
    if ((m = /^#### (.+)$/.exec(line))) {
      const id = m[1].trim();
      if (!ID_GENERIC.test(id) && !ID_POOL.test(id)) fail(i, 'not a scenario id');
      sc = { id, line: i + 1, meta: null, stem: { was: null, now: null }, options: [] };
      scenarios.push(sc); state = 'head'; option = null;
      continue;
    }
    if (/^#{1,3} /.test(line)) { state = 'between'; sc = null; continue; }
    if (!sc || state === 'between' || state === 'commentary') continue;
    if (line === '') continue;
    if (/^\*(?:Separated|Note)/.test(line)) { state = 'commentary'; continue; }

    if (state === 'head') {
      if ((m = /^`ROUND2_SCENARIOS\.([A-Z0-9_]+)` · (\d+) options · (\d+) changed/.exec(line))) {
        if (m[1] !== sc.id) fail(i, 'header names another scenario');
        sc.meta = { options: +m[2], changed: +m[3], keys: null };
      } else if ((m = new RegExp(`^keys (${KEY}(?:, ${KEY})*) · (\\d+) options · (\\d+) changed`).exec(line))) {
        sc.meta = { options: +m[2], changed: +m[3], keys: m[1].split(', ') };
      } else if (line === '**Stem**') state = 'stem';
      else fail(i, 'unexpected line before **Stem**');
    } else if (state === 'stem') {
      if ((m = /^- (was|now): (.+)$/.exec(line))) {
        if (sc.stem[m[1]] !== null) fail(i, 'stem ' + m[1] + ' given twice');
        sc.stem[m[1]] = m[2];
      } else if (line === '**Options**') state = 'options';
      else fail(i, 'unexpected line in **Stem**');
    } else if (state === 'options') {
      if ((m = new RegExp(`^- \\*\\*(${KEY})\\*\\* \\(keep\\) (.+)$`).exec(line))) {
        option = { key: m[1], kept: true, text: m[2] };
        sc.options.push(option); option = null;
      } else if ((m = new RegExp(`^- \\*\\*(${KEY})\\*\\*$`).exec(line))) {
        option = { key: m[1], kept: false, was: null, now: null };
        sc.options.push(option);
      } else if (option && (m = /^ {2}- (was|now): (.+)$/.exec(line))) {
        if (option[m[1]] !== null) fail(i, 'option ' + m[1] + ' given twice');
        option[m[1]] = m[2];
      } else fail(i, 'unexpected line in **Options**');
    }
  }

  // The draft's own counts, read from the inventory paragraph when it has them.
  const intro = lines.slice(first, last).join('\n');
  const claims = {};
  let c;
  if ((c = /Total: (\d+) stems and (\d+) options/.exec(intro))) { claims.stems = +c[1]; claims.options = +c[2]; }
  if ((c = /(\d+) stems and (\d+) options change; (\d+) options are kept/.exec(intro))) {
    claims.stemsChanged = +c[1]; claims.optionsChanged = +c[2]; claims.optionsKept = +c[3];
  }
  return { scenarios, claims };
}

// The draft against itself: every block complete, its header's counts and keys right, its totals right.
function draftProblems(draft) {
  const problems = [];
  const add = (id, where, detail) => problems.push({ id, where, rule: 'draft', detail });
  const ids = new Set();
  let options = 0, changed = 0, kept = 0;
  for (const sc of draft.scenarios) {
    if (ids.has(sc.id)) add(sc.id, '', 'scenario appears twice');
    ids.add(sc.id);
    if (sc.stem.was === null || sc.stem.now === null) add(sc.id, 'stem', 'needs both a was and a now line');
    const keys = new Set();
    for (const o of sc.options) {
      if (keys.has(o.key)) add(sc.id, o.key, 'option appears twice');
      keys.add(o.key);
      if (!o.kept && (o.was === null || o.now === null)) add(sc.id, o.key, 'needs both a was and a now line');
    }
    const nKept = sc.options.filter((o) => o.kept).length;
    options += sc.options.length; kept += nKept; changed += sc.options.length - nKept;
    if (!sc.meta) add(sc.id, '', 'no header line giving its option count');
    else {
      if (sc.meta.options !== sc.options.length) add(sc.id, '', `header says ${sc.meta.options} options, the block has ${sc.options.length}`);
      if (sc.meta.changed !== sc.options.length - nKept) add(sc.id, '', `header says ${sc.meta.changed} changed, the block has ${sc.options.length - nKept}`);
      if (sc.meta.keys && sc.meta.keys.join(',') !== sc.options.map((o) => o.key).join(',')) add(sc.id, '', 'header keys differ from the block');
    }
  }
  const { claims } = draft;
  const claim = (name, want, got) => { if (want !== undefined && want !== got) add('draft', name, `says ${want}, the blocks hold ${got}`); };
  claim('stems', claims.stems, draft.scenarios.length);
  claim('options', claims.options, options);
  claim('stems changed', claims.stemsChanged, draft.scenarios.length);
  claim('options changed', claims.optionsChanged, changed);
  claim('options kept', claims.optionsKept, kept);
  return problems;
}

// ---------- the plan: the draft against the live sources ----------
// Returns { final: Map id -> { stem, options: Map key -> text } , stats, problems }.
function buildPlan(draft, live) {
  const problems = draftProblems(draft);
  const add = (id, where, rule, detail) => problems.push({ id, where, rule, detail });
  const liveById = new Map(live.scenarios.map((s) => [s.id, s]));
  const draftById = new Map(draft.scenarios.map((s) => [s.id, s]));
  for (const id of liveById.keys()) if (!draftById.has(id)) add(id, '', 'keys', 'scenario is in the source and not in the draft');
  for (const id of draftById.keys()) if (!liveById.has(id)) add(id, '', 'keys', 'scenario is in the draft and not in the source');

  const final = new Map();
  const group = () => ({ scenarios: 0, stemsChanged: 0, stemsUnchanged: 0, optionsChanged: 0, optionsUnchanged: 0, straightened: 0 });
  const stats = { [GENERIC]: group(), POOL_B: group(), POOL_C: group(), total: group() };
  for (const d of draft.scenarios) {
    const l = liveById.get(d.id);
    if (!l) continue;
    const dKeys = d.options.map((o) => o.key), lKeys = l.options.map((o) => o.key);
    for (const k of lKeys) if (!dKeys.includes(k)) add(d.id, k, 'keys', 'key is in the source and not in the draft');
    for (const k of dKeys) if (!lKeys.includes(k)) add(d.id, k, 'keys', 'key is in the draft and not in the source');
    const liveText = new Map(l.options.map((o) => [o.key, o.text]));

    // A line may hold what the draft calls "was" (to be replaced) or already what it calls "now".
    if (!same(l.stem, d.stem.was) && !same(l.stem, d.stem.now)) {
      add(d.id, 'stem', 'stale', `the source says ${JSON.stringify(l.stem)}, the draft's was line says ${JSON.stringify(d.stem.was)}`);
    }
    const options = new Map();
    const g = stats[l.group], t = stats.total;
    const bump = (field) => { g[field]++; t[field]++; };
    bump('scenarios');
    bump(l.stem === d.stem.now ? 'stemsUnchanged' : 'stemsChanged');
    for (const o of d.options) {
      if (!liveText.has(o.key)) continue;
      const before = liveText.get(o.key);
      const after = o.kept ? straighten(o.text) : o.now;
      const expected = o.kept ? [o.text] : [o.was, o.now];
      if (!expected.some((e) => same(before, e))) {
        add(d.id, o.key, 'stale', `the source says ${JSON.stringify(before)}, the draft's ${o.kept ? 'keep' : 'was'} line says ${JSON.stringify(expected[0])}`);
      }
      options.set(o.key, after);
      if (o.kept) {
        bump('optionsUnchanged');
        if (before !== after) bump('straightened');
      } else bump(before === after ? 'optionsUnchanged' : 'optionsChanged');
    }
    final.set(d.id, { stem: d.stem.now, options });
  }

  // The rules, on the words as they will stand.
  const finalModel = {
    PROFILES: live.PROFILES,
    scenarios: live.scenarios.filter((s) => final.has(s.id)).map((s) => ({
      id: s.id, group: s.group, stem: final.get(s.id).stem,
      options: s.options.filter((o) => final.get(s.id).options.has(o.key)).map((o) => ({ key: o.key, text: final.get(s.id).options.get(o.key) })),
    })),
  };
  problems.push(...sourceProblems(finalModel));
  return { final, stats, problems, finalModel };
}

// ---------- writing into the sources ----------
const SQ = String.raw`'(?:[^'\\\r\n]|\\.)*'`;
const DQ = String.raw`"(?:[^"\\\r\n]|\\.)*"`;
const LIT = `(?:${SQ}|${DQ})`;
const decodeLiteral = (lit) => vm.runInNewContext('(' + lit + ')', {}, { timeout: 1000 });

function escapeBody(text) {
  return text.replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}
// data.js: single quotes, double quotes when the words hold an apostrophe. A line that wrote
// its non-ASCII characters as \uXXXX escapes keeps doing so.
function dataLiteral(text, oldLiteral) {
  let body = escapeBody(text);
  if (/\\u[0-9a-fA-F]{4}/.test(oldLiteral)) body = body.replace(/[^\x00-\x7f]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  if (!text.includes("'")) return "'" + body + "'";
  if (!text.includes('"')) return '"' + body + '"';
  return "'" + body.replace(/'/g, "\\'") + "'";
}
// index.html pools: always single quotes, apostrophes escaped.
const poolLiteral = (text) => "'" + escapeBody(text).replace(/'/g, "\\'") + "'";

const CONTEXT_LINE = new RegExp(`^( {4}context: )(${LIT})(,?\\s*)$`);
const OPTION_LINE = new RegExp(`^( {6}['"])(${KEY})(['"]: )(${LIT})(,?\\s*)$`);

// Returns { text, literals } where literals is the number of string literals replaced.
function applyToDataJs(dataJs, plan) {
  const lines = dataJs.split('\n');
  const { start, end } = constRegion(lines, GENERIC);
  const seen = new Set();
  let current = null, inResponses = false, literals = 0;
  const swap = (i, m, literalIndex, id, where, text) => {
    const old = m[literalIndex];
    const key = id + '|' + where;
    if (seen.has(key)) throw new Error(`data.js line ${i + 1}: ${id} ${where} appears twice`);
    seen.add(key);
    if (typeof text !== 'string') throw new Error(`data.js line ${i + 1}: the draft has no text for ${id} ${where}`);
    if (decodeLiteral(old) === text) return;
    const parts = m.slice(1);
    parts[literalIndex - 1] = dataLiteral(text, old);
    lines[i] = parts.join('');
    literals++;
  };
  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    let m;
    if ((m = /^ {2}([A-Z0-9_]+): \{\s*$/.exec(line))) { current = m[1]; inResponses = false; continue; }
    if (!current) continue;
    if ((m = CONTEXT_LINE.exec(line))) {
      const target = plan.final.get(current);
      if (!target) throw new Error(`data.js line ${i + 1}: scenario ${current} is not in the plan`);
      swap(i, m, 2, current, 'stem', target.stem);
    } else if (/^ {4}responses: \{\s*$/.test(line)) inResponses = true;
    else if (inResponses && /^ {4}\},?\s*$/.test(line)) inResponses = false;
    else if (inResponses) {
      if (!(m = OPTION_LINE.exec(line))) throw new Error(`data.js line ${i + 1}: not an option line: ${line}`);
      const target = plan.final.get(current);
      if (!target) throw new Error(`data.js line ${i + 1}: scenario ${current} is not in the plan`);
      swap(i, m, 4, current, m[2], target.options.get(m[2]));
    }
  }
  const expected = [];
  for (const [id, t] of plan.final) if (!id.startsWith('POOL_')) expected.push(id + '|stem', ...[...t.options.keys()].map((k) => id + '|' + k));
  const missed = expected.filter((k) => !seen.has(k));
  if (missed.length) throw new Error('data.js: no line found for ' + missed.slice(0, 5).join(', ') + (missed.length > 5 ? ` (+${missed.length - 5} more)` : ''));
  return { text: lines.join('\n'), literals };
}

// One pool line is `  OWNER:[{sc:'...',r:[{t:'...',g:'KEY'},...]},{sc:...}],`. Tokens: the stem
// opener {sc:'...',r:[ and the option {t:'...',g:'KEY'}. Everything between them is kept as it is.
const POOL_TOKEN = new RegExp(`\\{sc:(${SQ}),r:\\[|\\{t:(${SQ}),g:'(${KEY})'\\}`, 'g');
const POOL_SKELETON = /^ {2}[A-Z]+:\[S(?:,?O)+\]\}(?:,S(?:,?O)+\]\})*\],?\s*$/;

function applyToIndexHtml(indexHtml, plan) {
  const lines = indexHtml.split('\n');
  const seen = new Set();
  let literals = 0;
  for (const group of POOLS) {
    const { start, end } = constRegion(lines, group);
    for (let i = start + 1; i < end; i++) {
      const owner = /^ {2}([A-Z]+):\[/.exec(lines[i]);
      if (!owner) throw new Error(`index.html line ${i + 1}: not a ${group} entry: ${lines[i].slice(0, 80)}`);
      let index = -1, id = null;
      const skeleton = lines[i].replace(POOL_TOKEN, (all, stem, text, key) => (stem !== undefined ? 'S' : 'O'));
      if (!POOL_SKELETON.test(skeleton)) throw new Error(`index.html line ${i + 1}: ${group}.${owner[1]} has a shape the tool does not know`);
      lines[i] = lines[i].replace(POOL_TOKEN, (all, stem, text, key) => {
        if (stem !== undefined) {
          index++; id = `${group}.${owner[1]}[${index}]`;
          const target = plan.final.get(id);
          if (!target) throw new Error(`index.html line ${i + 1}: scenario ${id} is not in the plan`);
          seen.add(id + '|stem');
          if (decodeLiteral(stem) === target.stem) return all;
          literals++;
          return `{sc:${poolLiteral(target.stem)},r:[`;
        }
        const target = plan.final.get(id);
        const next = target && target.options.get(key);
        if (typeof next !== 'string') throw new Error(`index.html line ${i + 1}: the draft has no text for ${id} ${key}`);
        seen.add(id + '|' + key);
        if (decodeLiteral(text) === next) return all;
        literals++;
        return `{t:${poolLiteral(next)},g:'${key}'}`;
      });
    }
  }
  const expected = [];
  for (const [id, t] of plan.final) if (id.startsWith('POOL_')) expected.push(id + '|stem', ...[...t.options.keys()].map((k) => id + '|' + k));
  const missed = expected.filter((k) => !seen.has(k));
  if (missed.length) throw new Error('index.html: no entry found for ' + missed.slice(0, 5).join(', ') + (missed.length > 5 ? ` (+${missed.length - 5} more)` : ''));
  return { text: lines.join('\n'), literals };
}

// The new files, read back: same scenarios, same keys in the same order, the planned words, the
// rules held, and every line outside the three constants byte for byte as it was.
function verifyApplied(live, dataJs, indexHtml, plan) {
  const problems = [];
  const add = (detail) => problems.push({ id: 'verify', where: '', rule: 'verify', detail });
  const next = readModel({ dataJs, indexHtml });
  if (next.scenarios.map((s) => s.id).join() !== live.scenarios.map((s) => s.id).join()) add('the scenarios differ in id or order');
  for (const s of next.scenarios) {
    const before = live.scenarios.find((x) => x.id === s.id);
    const want = plan.final.get(s.id);
    if (!before || !want) continue;
    if (s.options.map((o) => o.key).join() !== before.options.map((o) => o.key).join()) add(s.id + ': the option keys differ in set or order');
    if (s.stem !== want.stem) add(s.id + ': the stem is not the planned one');
    for (const o of s.options) if (o.text !== want.options.get(o.key)) add(`${s.id} ${o.key}: the words are not the planned ones`);
  }
  problems.push(...sourceProblems(next));
  const outside = (text, file, regions) => {
    const a = (file === 'data.js' ? live.dataJs : live.indexHtml).split('\n'), b = text.split('\n');
    if (a.length !== b.length) { add(file + ': the line count changed'); return; }
    const inside = (i) => regions.some((r) => i >= r.start && i <= r.end);
    for (let i = 0; i < a.length; i++) if (!inside(i) && a[i] !== b[i]) { add(`${file} line ${i + 1} changed outside the Round 3 constants`); return; }
  };
  outside(dataJs, 'data.js', [constRegion(live.dataJs.split('\n'), GENERIC)]);
  outside(indexHtml, 'index.html', POOLS.map((g) => constRegion(live.indexHtml.split('\n'), g)));
  return problems;
}

// ---------- reporting ----------
function summaryLines(plan, draft) {
  const out = [];
  const n = draft.scenarios.length;
  const options = draft.scenarios.reduce((a, s) => a + s.options.length, 0);
  const kept = draft.scenarios.reduce((a, s) => a + s.options.filter((o) => o.kept).length, 0);
  out.push(`draft: ${n} scenarios, ${options} options (${options - kept} rewritten, ${kept} kept)`);
  const row = (label, g) => `  ${label.padEnd(17)}${String(g.scenarios).padStart(9)}${String(g.stemsChanged).padStart(15)}${String(g.optionsChanged).padStart(18)}${String(g.optionsUnchanged).padStart(19)}`;
  out.push('  ' + ''.padEnd(17) + 'scenarios  stems changed  options changed  options unchanged');
  for (const k of [GENERIC, 'POOL_B', 'POOL_C']) out.push(row(k, plan.stats[k]));
  out.push(row('total', plan.stats.total));
  out.push(`  stems unchanged ${plan.stats.total.stemsUnchanged}; unchanged options include ${plan.stats.total.straightened} kept lines whose curly apostrophes were straightened`);
  let longest = { n: 0 };
  for (const s of plan.finalModel.scenarios) for (const o of s.options) { const w = wordCount(o.text); if (w > longest.n) longest = { n: w, id: s.id, key: o.key }; }
  out.push(`  longest option: ${longest.n} words (${longest.id} ${longest.key}); cap ${WORD_CAP}`);
  return out;
}

function parseArgs(argv) {
  const opts = { draft: DRAFT_DEFAULT, root: ROOT, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--draft' && i + 1 < argv.length) opts.draft = path.resolve(argv[++i]);
    else if (argv[i] === '--root' && i + 1 < argv.length) opts.root = path.resolve(argv[++i]);
    else if (argv[i] === '--dry-run') opts.dryRun = true;
    else return null;
  }
  return opts;
}

function main(argv) {
  const opts = parseArgs(argv);
  if (!opts) {
    console.error('usage: node tools/apply-round3-copy.js --draft <copy drafts file> [--root <dir>] [--dry-run]');
    return 2;
  }
  if (!fs.existsSync(opts.draft)) {
    console.error('apply-round3-copy: the copy drafts file is not at ' + opts.draft + ' (it is private and not in the repository; pass --draft)');
    return 2;
  }
  const draft = parseDraft(fs.readFileSync(opts.draft, 'utf-8'));
  const live = readSources(opts.root);
  const plan = buildPlan(draft, live);
  summaryLines(plan, draft).forEach((l) => console.log(l));
  const refuse = (problems) => {
    console.error('\napply-round3-copy: refusing to run, ' + problems.length + ' problem' + (problems.length === 1 ? '' : 's') + '; nothing was written');
    for (const p of problems.slice(0, 60)) console.error(`  [${p.rule}] ${p.id}${p.where ? ' ' + p.where : ''}: ${p.detail}`);
    if (problems.length > 60) console.error(`  ... and ${problems.length - 60} more`);
    return 1;
  };
  if (plan.problems.length) return refuse(plan.problems);

  const data = applyToDataJs(live.dataJs, plan);
  const html = applyToIndexHtml(live.indexHtml, plan);
  const verify = verifyApplied(live, data.text, html.text, plan);
  if (verify.length) return refuse(verify);
  console.log(`  ${data.literals} string literals rewritten in data.js, ${html.literals} in index.html`);
  if (opts.dryRun) { console.log('dry run: nothing written'); return 0; }
  if (data.text !== live.dataJs) fs.writeFileSync(live.dataFile, data.text);
  if (html.text !== live.indexHtml) fs.writeFileSync(live.htmlFile, html.text);
  console.log(data.literals + html.literals === 0 ? 'already applied: nothing to change' : 'written');
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error('apply-round3-copy: ' + e.message);
    process.exitCode = 1;
  }
}

module.exports = {
  ROOT, WORD_CAP, MTG_STALL, COLOUR_NAMES, LAND_NAMES, POOLS, GENERIC,
  straighten, same, wordCount, nameRules, sourceProblems,
  constRegion, readModel, readSources, parseDraft, draftProblems, buildPlan,
  dataLiteral, poolLiteral, applyToDataJs, applyToIndexHtml, verifyApplied, summaryLines, main,
};
