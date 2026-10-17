#!/usr/bin/env node
'use strict';
// Round 1 and 2 copy: the questions players answer in Rounds 1 and 2, read from the live files,
// and the rules that copy is held to.
//
// What a player can read during Rounds 1 and 2, in any mode (Blind Draft or Constructed, Magic
// items on or off, For Fun or Workplace):
//   POOL_A     index.html  61 enemy-pair items. Round 1 asks 6 per pair; Round 2 re-tests up to 3
//                          of the unasked ones on the closest pairs.
//   POOL_ALLY  index.html  50 ally-pair items, for Round 2.
// An item is { w?, id, pair, ctx, sc, r: [{ t, c }, { t, c }] }: ctx is the label above the stem,
// sc the stem and r the two answers with their colours. Items whose id starts MTG- (10 in each
// pool) reach only players who said they play Magic. Under the stem, getContextHint() adds a line
// from CONTEXT_HINTS when the stem matches one of its patterns; Round 3 uses the same hints.
// Nothing else reaches Rounds 1 and 2: state.poolS2, the old Round 2 ranking path in showQ, is
// never filled, and Pool D is gone.
//
// The rules (itemProblems; hintProblems holds every hint in CONTEXT_HINTS to the same ones):
//   - a stem is 25 words or fewer, an answer 20 or fewer and a label 4 or fewer (words are counted
//     as tools/apply-round3-copy.js counts them)
//   - no stem, answer, label or hint names a colour, a basic land or an identity in PROFILES (its
//     key or name, guilds included; nameRules in tools/apply-round3-copy.js), a profile tagline,
//     or mana, colour or guild
//   - house style: no em or en dash, exclamation mark, asterisk or word in capitals; no question
//     mark in an answer; British spelling of the usual suspects; none of the words the copy brief
//     rules out, nor the office and therapy jargon listed below
// tests/round12-copy.test.js holds these on the live files, and holds the structure (ids, pairs,
// weights, answer colours) against tests/fixtures/round12-keys.json, written from the sources as
// they were before the rewrite.
//
// Usage: node tools/check-round12-copy.js [--list] [--root <dir>]
//          prints the problems, if any (exit 1 when there are); --list prints every item first,
//          with its word counts and its hint
//        node tools/check-round12-copy.js --write-fixture [--root <dir>]
//          writes tests/fixtures/round12-keys.json from the sources as they are now: every item's
//          keys, and the hash of its words as they were before the rewrite (writeFixture says how a
//          new item enters). Only in a commit of its own, when items are added, removed or re-keyed
//          on purpose.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const r3 = require('./apply-round3-copy');

const ROOT = path.resolve(__dirname, '..');
const FIXTURE = path.join(ROOT, 'tests', 'fixtures', 'round12-keys.json');
const POOLS = ['POOL_A', 'POOL_ALLY'];
const STEM_CAP = 25;
const ANSWER_CAP = 20;
const LABEL_CAP = 4;
const MAGIC_PREFIX = 'MTG-';

const { wordCount, nameRules } = r3;

// ---------- the rules ----------
// Whole words, any case, so "think" is not "ink" and "Inkblot" is not "ink".
const wholeWord = (alternation) => new RegExp('(?<![\\p{L}\\p{N}])(?:' + alternation + ')(?![\\p{L}\\p{N}])', 'iu');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The words the copy brief rules out, and the office and therapy jargon that reads the same way.
const BRIEF_WORDS = ['navigat\\p{L}*', 'journey\\p{L}*', 'leverag\\p{L}*', 'embrac\\p{L}*', 'resonat\\p{L}*',
  'nuanced?', 'authentic\\p{L}*', 'robust\\p{L}*', 'foster\\p{L}*'];
const JARGON = ['stakeholders?', 'deliverables?', 'synerg\\p{L}*', 'bandwidth', 'learnings', 'alignment',
  'initiatives?', 'workstreams?', 'actionable', 'impactful', 'holistic', 'paradigms?', 'empower\\p{L}*',
  'optimal', 'optimi[sz]\\p{L}*', 'proactive\\p{L}*', 'scalable', 'value-add', 'deep dive', 'circle back',
  'touch base', 'going forward', 'growth mindset', 'self-care', 'boundaries', 'validat\\p{L}*',
  'hold space', 'lean in(?:to)?', 'unpack\\p{L}*', 'triggered', 'toxic'];
// US spellings: -ize and -yze words (less the ones British spells that way too), and a short list.
const IZE = new RegExp('(?<![\\p{L}])(?!(?:size|sizes|sized|sizing|prize|prizes|prized|seize|seizes|seized|seizing|capsize|capsized)(?![\\p{L}]))'
  + '\\p{L}+(?:iz|yz)(?:e|es|ed|ing|ation|ations)(?![\\p{L}])', 'iu');
const US_WORDS = ['colors?', 'colored', 'favor(?:s|ed|ite|ites)?', 'behaviors?', 'honors?', 'labors?', 'neighbors?',
  'neighborhoods?', 'centers?', 'theaters?', 'gray', 'moms?', 'vacations?', 'apartments?', 'gotten', 'traveled',
  'traveling', 'canceled', 'canceling', 'math', 'soccer', 'jewelry', 'cozy', 'defense', 'fulfill', 'catalog',
  'dialog', 'pajamas'];

// Each rule: { kind, re, answersOnly? }. The names come first; the hints, labels, stems and answers
// are all held to them.
function textRules(PROFILES) {
  const taglines = Object.values(PROFILES).map((p) => p && p.tag).filter(Boolean)
    .map((tag) => escapeRe(tag).replace(/\s+/g, '\\s+'));
  return [
    ...nameRules(PROFILES),
    { kind: 'tagline', re: wholeWord(taglines.join('|')) },
    { kind: 'magic term', re: wholeWord('mana|colou?r\\p{L}*|guilds?') },
    { kind: 'dash', re: /—|–|--/ },
    { kind: 'exclamation', re: /!/ },
    { kind: 'asterisk', re: /\*/ },
    { kind: 'capitals', re: /(?<![\p{L}])\p{Lu}{3,}(?![\p{L}])/u },
    { kind: 'question', re: /\?/, answersOnly: true },
    { kind: 'US spelling', re: IZE },
    { kind: 'US spelling', re: wholeWord(US_WORDS.join('|')) },
    { kind: 'brief word', re: wholeWord(BRIEF_WORDS.join('|')) },
    { kind: 'jargon', re: wholeWord(JARGON.join('|')) },
  ];
}

// ---------- reading the sources ----------
// `const NAME = [` to the first later line that is exactly `];`, as inclusive line indexes.
function arrayRegion(lines, name) {
  const start = lines.findIndex((l) => l.startsWith('const ' + name + ' = ['));
  if (start < 0) throw new Error('const ' + name + ' not found');
  for (let i = start + 1; i < lines.length; i++) if (/^\];\s*$/.test(lines[i])) return { start, end: i };
  throw new Error('the end of const ' + name + ' (a line "];") not found');
}
// `function NAME(` to the first later line that is exactly `}`.
function functionRegion(lines, name) {
  const start = lines.findIndex((l) => l.startsWith('function ' + name + '('));
  if (start < 0) throw new Error('function ' + name + ' not found');
  for (let i = start + 1; i < lines.length; i++) if (/^\}\s*$/.test(lines[i])) return { start, end: i };
  throw new Error('the end of function ' + name + ' (a line "}") not found');
}
const slice = (lines, { start, end }) => lines.slice(start, end + 1).join('\n');

// Every Round 1 and 2 item, in source order, with the hint the page shows under it, and what the
// page needs to work that out. dataJs and indexHtml are the files' text.
function readModel({ dataJs, indexHtml }) {
  const data = vm.runInNewContext(dataJs.replace(/^﻿/, '') + '\n;({ PROFILES });', {}, { filename: 'data.js', timeout: 10000 });
  const lines = indexHtml.split('\n');
  const source = [
    ...POOLS.map((name) => slice(lines, arrayRegion(lines, name))),
    slice(lines, r3.constRegion(lines, 'CONTEXT_HINTS')),
    slice(lines, functionRegion(lines, 'getContextHint')),
    ';({ POOL_A, POOL_ALLY, CONTEXT_HINTS, getContextHint });',
  ].join('\n');
  const page = vm.runInNewContext(source, {}, { filename: 'index.html', timeout: 10000 });
  const hintKeyOf = (hint) => (hint ? Object.keys(page.CONTEXT_HINTS).find((k) => page.CONTEXT_HINTS[k].hint === hint) || '?' : null);
  const items = [];
  for (const pool of POOLS) {
    page[pool].forEach((q, index) => {
      const hint = page.getContextHint(q.sc, q.id);
      items.push({
        pool, index, id: q.id, pair: q.pair, w: q.w === undefined ? null : q.w,
        ctx: q.ctx, sc: q.sc, answers: (q.r || []).map((o) => ({ c: o.c, t: o.t })),
        magic: String(q.id).startsWith(MAGIC_PREFIX), hint, hintKey: hintKeyOf(hint),
      });
    });
  }
  return { PROFILES: data.PROFILES, CONTEXT_HINTS: page.CONTEXT_HINTS, getContextHint: page.getContextHint, items };
}

function readSources(root = ROOT) {
  const dataJs = fs.readFileSync(path.join(root, 'data.js'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
  return { root, dataJs, indexHtml, ...readModel({ dataJs, indexHtml }) };
}

// ---------- the checks ----------
// Problems with the words, as [{ id, where, rule, detail }]. where: 'stem', 'label', 'hint', or the
// answer's colour.
function itemProblems(model) {
  const rules = textRules(model.PROFILES);
  const problems = [];
  const add = (item, where, rule, detail) => problems.push({ id: item.id, where, rule, detail });
  for (const item of model.items) {
    const texts = [
      { where: 'stem', text: item.sc, cap: STEM_CAP },
      ...item.answers.map((a) => ({ where: a.c, text: a.t, cap: ANSWER_CAP, answer: true })),
      { where: 'label', text: item.ctx, cap: LABEL_CAP },
      ...(item.hint ? [{ where: 'hint', text: item.hint }] : []),
    ];
    if (item.answers.length !== 2 || new Set(item.answers.map((a) => a.c)).size !== 2) add(item, 'answers', 'answers', 'not two answers of two colours');
    for (const { where, text, cap, answer } of texts) {
      if (typeof text !== 'string' || !text.trim()) { add(item, where, 'text', 'empty or not a string'); continue; }
      const n = wordCount(text);
      if (cap && n > cap) add(item, where, 'words', `${n} words (cap ${cap}): ${text}`);
      for (const { kind, re, answersOnly } of rules) {
        if (answersOnly && !answer) continue;
        const m = re.exec(text);
        if (m) add(item, where, kind, `"${m[0]}" in: ${text}`);
      }
    }
    const norm = (s) => String(s).replace(/\s+/g, ' ').trim().toLowerCase();
    if (typeof item.ctx === 'string' && norm(item.ctx) === norm(item.sc)) add(item, 'label', 'label', 'the label is the stem');
  }
  return problems;
}

// The same rules on every hint in CONTEXT_HINTS, whichever round shows it.
function hintProblems(model) {
  const rules = textRules(model.PROFILES).filter((r) => !r.answersOnly);
  const problems = [];
  for (const [key, entry] of Object.entries(model.CONTEXT_HINTS)) {
    const id = 'CONTEXT_HINTS.' + key;
    const text = entry && entry.hint;
    if (typeof text !== 'string' || !text.trim()) { problems.push({ id, where: 'hint', rule: 'text', detail: 'empty or not a string' }); continue; }
    for (const { kind, re } of rules) {
      const m = re.exec(text);
      if (m) problems.push({ id, where: 'hint', rule: kind, detail: `"${m[0]}" in: ${text}` });
    }
  }
  return problems;
}

// The words of an item (label, stem, answers in source order), straightened and with the spacing
// evened out, so a curly apostrophe made straight is not a rewrite.
function wordsOf(item) {
  return [item.ctx, item.sc, ...item.answers.map((a) => a.t)].map((s) => r3.straighten(String(s)).replace(/\s+/g, ' ').trim()).join('\n');
}
const wordsHash = (item) => crypto.createHash('sha1').update(wordsOf(item), 'utf8').digest('hex').slice(0, 16);

// What the fixture holds for an item: everything scoring and the seeded draws read, and a hash of the words.
const keyOf = (item) => ({ pool: item.pool, pair: item.pair, w: item.w, answers: item.answers.map((a) => a.c), words: wordsHash(item) });

// Writes the fixture from the sources as they are. An item already in it keeps the hash of the words
// it had when it entered (for the first 111, the words before the copy rewrite), so the rewrite
// stays measurable; a new item enters with its words as they are and counts as kept after review;
// an item no longer in the sources leaves.
function writeFixture(root = ROOT, file = FIXTURE) {
  const model = readSources(root);
  let old = { items: {}, keptAfterReview: [] };
  if (fs.existsSync(file)) old = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const ids = new Set(model.items.map((i) => i.id));
  const kept = (old.keptAfterReview || []).filter((id) => ids.has(id));
  const added = [];
  const rows = model.items.map((item) => {
    const key = keyOf(item);
    if (old.items && old.items[item.id]) key.words = old.items[item.id].words;
    else if (fs.existsSync(file)) { added.push(item.id); if (!kept.includes(item.id)) kept.push(item.id); }
    return '    ' + JSON.stringify(item.id) + ': ' + JSON.stringify(key);
  });
  const note = 'Rounds 1 and 2 (POOL_A and POOL_ALLY in index.html): each item\'s pool, pair, weight (null when it has none) and answer colours, in source order, and a hash of its words (tools/check-round12-copy.js, wordsHash) as they were before the copy rewrite. keptAfterReview lists the items whose words were reviewed and kept. See tests/round12-copy.test.js; rewrite only with node tools/check-round12-copy.js --write-fixture, in a commit of its own.';
  const text = '{\n  "note": ' + JSON.stringify(note) + ',\n  "items": {\n' + rows.join(',\n') + '\n  },\n  "keptAfterReview": '
    + JSON.stringify(kept) + '\n}\n';
  fs.writeFileSync(file, text);
  const removed = Object.keys(old.items || {}).filter((id) => !ids.has(id));
  return { file, items: rows.length, added: added.length, removed: removed.length, kept: kept.length };
}

// ---------- CLI ----------
function main(argv = process.argv.slice(2)) {
  const at = argv.indexOf('--root');
  const root = at >= 0 ? path.resolve(argv[at + 1]) : ROOT;
  if (argv.includes('--write-fixture')) {
    const { file, items, added, removed, kept } = writeFixture(root, path.join(root, 'tests', 'fixtures', 'round12-keys.json'));
    console.log(`wrote ${path.relative(root, file)} (${items} items, ${added} new, ${removed} gone, ${kept} kept after review)`);
    return 0;
  }
  const model = readSources(root);
  if (argv.includes('--list')) {
    for (const item of model.items) {
      console.log(`${item.id} [${item.pair}]${item.w === null ? '' : ' w=' + item.w} "${item.ctx}"${item.hint ? ' hint=' + item.hintKey : ''}`);
      console.log(`  stem (${wordCount(item.sc)}): ${item.sc}`);
      for (const a of item.answers) console.log(`  ${a.c} (${wordCount(a.t)}): ${a.t}`);
    }
  }
  const problems = [...itemProblems(model), ...hintProblems(model)];
  const count = (pool) => model.items.filter((i) => i.pool === pool).length;
  console.log(`${POOLS.map((p) => `${p} ${count(p)}`).join(', ')} items; ${problems.length} problem${problems.length === 1 ? '' : 's'}`);
  for (const p of problems) console.log(`  ${p.id} ${p.where} [${p.rule}] ${p.detail}`);
  return problems.length ? 1 : 0;
}

if (require.main === module) process.exit(main());

module.exports = {
  ROOT, FIXTURE, POOLS, STEM_CAP, ANSWER_CAP, LABEL_CAP, MAGIC_PREFIX,
  textRules, arrayRegion, functionRegion, readModel, readSources, itemProblems, hintProblems, wordsOf, wordsHash, keyOf, writeFixture, main,
};
