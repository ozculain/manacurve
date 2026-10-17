#!/usr/bin/env node
'use strict';
// Round 1 and 2 copy: the questions players answer in Rounds 1 and 2 (POOL_A and POOL_ALLY in
// index.html, with CONTEXT_HINTS and getContextHint), held on the live files to the rules in
// tools/check-round12-copy.js.
//  1. The structure is what it was before the copy rewrite (tests/fixtures/round12-keys.json): the
//     same items in the same order in each pool, each with its pair, weight and answer colours, so
//     the same counts per pool and per pair. Scoring and the seeded draws read these and never the
//     words, so a rewording leaves the golden fixture where it is.
//  2. Stems are 25 words or fewer, answers 20 or fewer, labels 4 or fewer.
//  3. No stem, answer, label or hint names a colour, a basic land, an identity or guild, a profile
//     tagline, mana or colour; and the house style holds (no em dash, exclamation mark, asterisk,
//     capitals or question mark in an answer; British spelling; none of the brief's banned words).
//  4. Every item was rewritten, or is on the fixture's keptAfterReview list, unchanged.
//  5. The hints: which item shows which (HINTS below), none on any other item (Magic items
//     included), and every hint in CONTEXT_HINTS shown under some Round 1, 2 or 3 stem.
//  6. In the page: Round 1's and Round 2's renderers on every item, and real Rounds 1 and 2 with
//     Magic items off and on, show the label, the stem, the hint and both answers as written.
//  7. The guards themselves, on made-up sources: each rule flags what it should and nothing else.
// The fixture is rewritten only when an item is added, removed or re-keyed on purpose, in a commit
// of its own (node tools/check-round12-copy.js --write-fixture).
// Usage: node tests/round12-copy.test.js [path/to/index.html]
const fs = require('fs');
const path = require('path');
const { run } = require('./_lib/report');
const { bootPage, pageArgs, whenReady, isVisible } = require('./_lib/load');
const tool = require('../tools/check-round12-copy');
const r3 = require('../tools/apply-round3-copy');

const args = pageArgs();
const ROOT = args.htmlPath ? path.dirname(args.htmlPath) : tool.ROOT;
const fixture = JSON.parse(fs.readFileSync(tool.FIXTURE, 'utf-8'));

// The Round 1 and 2 items that show a hint under the stem, and which one. Every other item shows none.
const HINTS = { 'A-WB-W01': 'TEAM', 'A-WB-W05': 'COLLEAGUE', 'A-WR-W11': 'TEAM', 'AL-BR-02': 'COLLEAGUE', 'AL-BR-06': 'MANAGER', 'AL-GW-04': 'TEAM' };
// Items per pool and pair, Magic items included: what Round 1's six-per-pair draw and Round 2's
// two-per-pair draw are made from, and what the golden fixture's seeded paths depend on.
const COUNTS = {
  'POOL_A W-B': 12, 'POOL_A U-R': 13, 'POOL_A G-U': 12, 'POOL_A W-R': 12, 'POOL_A B-G': 12,
  'POOL_ALLY W-U': 10, 'POOL_ALLY U-B': 10, 'POOL_ALLY B-R': 10, 'POOL_ALLY R-G': 10, 'POOL_ALLY G-W': 10,
};

const list = (arr, n = 4) => arr.slice(0, n).join('; ') + (arr.length > n ? `; ... (${arr.length} in all)` : '');
const countBy = (rows) => rows.reduce((m, r) => { const k = r.pool + ' ' + r.pair; m[k] = (m[k] || 0) + 1; return m; }, {});
const sameMap = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
const isMagic = (id) => id.startsWith(tool.MAGIC_PREFIX);

// ---------- the page ----------
let nextSeed = 1201;
async function page() {
  const p = bootPage({ ...args, seed: nextSeed++ });
  await whenReady(p.win);
  return p;
}
function begin(h, { gaming = false } = {}) {
  const s = h.state;
  s.mode = 'draft'; s.audience = 'consumer'; s.gamingFamiliar = gaming; s.disclaimerAcknowledged = true;
  h.startAssessment();
}
// What the question on screen shows: the label above the stem, the stem, the hint under it, the
// answers and whether "Neither" is offered.
function onScreen(win) {
  const d = win.document;
  const scenario = d.getElementById('scenario');
  const first = scenario.firstChild;
  const hintBox = [...scenario.querySelectorAll('div')].find((el) => el.textContent.includes('\u{1F4A1}'));
  const ctx = d.getElementById('ctx');
  return {
    label: ctx.classList.contains('hidden') ? null : ctx.textContent,
    stem: first && first.nodeType === 3 ? first.textContent : null,
    hint: hintBox ? hintBox.textContent.replace(/^\s*\u{1F4A1}\s*/u, '').trim() : null,
    answers: [...d.querySelectorAll('#choices .mc-choice__text')].map((el) => el.textContent),
    neither: !!d.querySelector('#choices .mc-neither'),
    text: ['ctx', 'scenario', 'choices'].map((id) => d.getElementById(id).textContent).join(' '),
  };
}
// How the question on screen differs from the item as written ([] when it does not).
function differences(item, shown, hint, nameRules) {
  const p = [];
  if (shown.label !== item.ctx) p.push(`label "${shown.label}"`);
  if (shown.stem !== item.sc) p.push(`stem "${String(shown.stem).slice(0, 40)}"`);
  if ((shown.hint || null) !== (hint || null)) p.push(`hint "${shown.hint}" (want "${hint}")`);
  if ([...shown.answers].sort().join('|') !== item.r.map((o) => o.t).sort().join('|')) p.push('answers ' + shown.answers.join(' / '));
  if (!shown.neither) p.push('no "Neither"');
  const named = nameRules.filter(({ re }) => re.test(shown.text)).map(({ kind }) => kind);
  if (named.length) p.push('names a ' + named.join(', '));
  return p;
}

// ---------- made-up sources, for the guards ----------
const MINI_DATA = "const PROFILES = { 'MONO-W': { name: 'MONO-WHITE', tag: 'Peace Through Structure' }, "
  + "DIMIR: { name: 'DIMIR', tag: 'Intelligence Through Control' }, INK: { name: 'FOUR-COLOR (No Black)', tag: 'Altruism Without Pragmatism' } };\n";
const jsLit = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
// One item to vary (A-WB-W01), a Magic item and an ally item whose stems both match the one hint.
function miniHtml({ ctx = 'Credit', sc = 'A plain stem about nothing much.', a = 'One plain answer.', b = 'Another plain answer.', cb = 'B', hint = 'No team? Think: a club or a band.' } = {}) {
  return [
    '<script>',
    'const CONTEXT_HINTS = {',
    '  TEAM: {',
    '    hint: ' + JSON.stringify(hint) + ',',
    '    patterns: [/your team/i]',
    '  }',
    '};',
    'function getContextHint(scenarioText, questionId) {',
    "  if (questionId && questionId.startsWith('MTG-')) return null;",
    '  for (const data of Object.values(CONTEXT_HINTS)) {',
    '    for (const pattern of data.patterns) if (pattern.test(scenarioText)) return data.hint;',
    '  }',
    '  return null;',
    '}',
    'const POOL_A = [',
    `  {id:'A-WB-W01',pair:'W-B',ctx:${jsLit(ctx)},sc:${jsLit(sc)},r:[{t:${jsLit(a)},c:'W'},{t:${jsLit(b)},c:${jsLit(cb)}}]},`,
    "  {w:0.8,id:'MTG-WB-01',pair:'W-B',ctx:'Table Deal',sc:'Your team is at the table.',r:[{t:'Keep my word.',c:'W'},{t:'Attack.',c:'B'}]}",
    '];',
    'const POOL_ALLY = [',
    "  {id:'AL-WU-01',pair:'W-U',ctx:'Chores',sc:'Your team splits the chores.',r:[{t:'Keep it equal.',c:'W'},{t:'Give people the jobs they do best.',c:'U'}]}",
    '];',
    '</script>',
    '',
  ].join('\n');
}
function trial(opts) {
  const model = tool.readModel({ dataJs: MINI_DATA, indexHtml: miniHtml(opts) });
  return { model, problems: [...tool.itemProblems(model), ...tool.hintProblems(model)] };
}
// The rules a made-up A-WB-W01 trips, sorted and joined ('' for none).
const rulesOn = (opts) => [...new Set(trial(opts).problems.filter((p) => p.id === 'A-WB-W01').map((p) => p.rule))].sort().join(',');
const words = (n) => Array(n).fill('word').join(' ') + '.';

run('round12-copy', async (t) => {
  const { ok, note } = t;
  const live = tool.readSources(ROOT);
  const want = fixture.items;
  const wantIds = Object.keys(want);
  const fixtureRows = wantIds.map((id) => ({ id, ...want[id] }));

  // ---------- 1. the structure ----------
  ok('C1a the fixture holds 61 POOL_A and 50 POOL_ALLY items (10 Magic items in each), in the counts per pair the draws expect',
    sameMap(countBy(fixtureRows), COUNTS) && fixtureRows.filter((r) => isMagic(r.id)).length === 20
      && ['POOL_A', 'POOL_ALLY'].every((p) => fixtureRows.filter((r) => r.pool === p && isMagic(r.id)).length === 10),
    JSON.stringify(countBy(fixtureRows)));
  {
    const order = (rows, pool) => rows.filter((r) => r.pool === pool).map((r) => r.id).join();
    const same = ['POOL_A', 'POOL_ALLY'].every((p) => order(live.items, p) === order(fixtureRows, p));
    const liveIds = live.items.map((i) => i.id);
    const gone = wantIds.filter((id) => !liveIds.includes(id)), added = liveIds.filter((id) => !(id in want));
    const dupes = liveIds.filter((id, i) => liveIds.indexOf(id) !== i);
    ok('C1b the live pools hold the same items as before the rewrite, in the same order, each id once',
      same && !gone.length && !added.length && !dupes.length, `missing ${list(gone)}; new ${list(added)}; repeated ${list(dupes)}`);
    ok('C1c the same number of items per pool and per pair as before the rewrite', sameMap(countBy(live.items), countBy(fixtureRows)),
      JSON.stringify(countBy(live.items)));
    const moved = live.items.filter((i) => want[i.id]).map((i) => ({ i, k: tool.keyOf(i), w: want[i.id] }))
      .filter(({ k, w }) => k.pool !== w.pool || k.pair !== w.pair || k.w !== w.w || k.answers.join() !== w.answers.join())
      .map(({ i, k, w }) => `${i.id}: ${JSON.stringify([k.pool, k.pair, k.w, k.answers])} was ${JSON.stringify([w.pool, w.pair, w.w, w.answers])}`);
    ok('C1d every item keeps its pool, pair, weight and answer colours, in order', moved.length === 0, list(moved));
  }

  // ---------- 2 and 3. the words ----------
  {
    const problems = tool.itemProblems(live);
    const of = (...rules) => problems.filter((p) => rules.includes(p.rule)).map((p) => `${p.id} ${p.where} [${p.rule}] ${p.detail}`);
    ok(`C2a every stem is ${tool.STEM_CAP} words or fewer, every answer ${tool.ANSWER_CAP} or fewer, every label ${tool.LABEL_CAP} or fewer`, of('words').length === 0, list(of('words')));
    ok('C2b every item has a label, a stem and two answers of two colours, and no label is its own stem',
      of('text', 'answers', 'label').length === 0, list(of('text', 'answers', 'label')));
    ok('C3a no stem, answer, label or hint names a colour, a basic land, an identity or guild, or a profile tagline',
      of('colour', 'basic land', 'identity', 'tagline').length === 0, list(of('colour', 'basic land', 'identity', 'tagline')));
    ok('C3b nor says mana, colour or guild', of('magic term').length === 0, list(of('magic term')));
    ok('C3c house style: no em or en dash, exclamation mark, asterisk or word in capitals, and no question mark in an answer',
      of('dash', 'exclamation', 'asterisk', 'capitals', 'question').length === 0, list(of('dash', 'exclamation', 'asterisk', 'capitals', 'question')));
    ok('C3d British spelling, and none of the words the brief rules out (navigate, journey, leverage...) or office and therapy jargon',
      of('US spelling', 'brief word', 'jargon').length === 0, list(of('US spelling', 'brief word', 'jargon')));
    const hints = tool.hintProblems(live).map((p) => `${p.id} [${p.rule}] ${p.detail}`);
    ok('C3e every hint in CONTEXT_HINTS, whichever round shows it, is held to the same rules', hints.length === 0, list(hints));
    const n = (pool) => live.items.filter((i) => i.pool === pool);
    const longest = (pick) => Math.max(...live.items.map((i) => pick(i)));
    note(`${n('POOL_A').length} POOL_A and ${n('POOL_ALLY').length} POOL_ALLY items; the longest stem is ${longest((i) => r3.wordCount(i.sc))} words, the longest answer ${longest((i) => Math.max(...i.answers.map((a) => r3.wordCount(a.t))))}`);
  }

  // ---------- 4. rewritten, or kept after review ----------
  {
    const kept = fixture.keptAfterReview || [];
    const unchanged = live.items.filter((i) => want[i.id] && tool.wordsHash(i) === want[i.id].words).map((i) => i.id);
    const unlisted = unchanged.filter((id) => !kept.includes(id));
    const stale = kept.filter((id) => !unchanged.includes(id));
    ok('C4a every item was rewritten, or is listed in the fixture as kept after review', unlisted.length === 0,
      'unchanged but not listed: ' + list(unlisted));
    ok('C4b every item listed as kept after review is in the pools, with its words unchanged', stale.length === 0, list(stale));
    note(`${live.items.length - unchanged.length} items rewritten, ${unchanged.length} kept after review (${list(unchanged)})`);
  }

  // ---------- 5. the hints ----------
  {
    const wrong = live.items.filter((i) => (i.hintKey || null) !== (HINTS[i.id] || null))
      .map((i) => `${i.id} shows ${i.hintKey || 'none'}, expected ${HINTS[i.id] || 'none'}`);
    ok('C5a the hints under the stems: TEAM on three items, COLLEAGUE on two, MANAGER on one, none on any other item (Magic items included)',
      wrong.length === 0, list(wrong));
    const keyOfHint = (hint) => Object.keys(live.CONTEXT_HINTS).find((k) => live.CONTEXT_HINTS[k].hint === hint);
    const shown = new Set(live.items.map((i) => i.hintKey).filter(Boolean));
    const round3 = r3.readSources(ROOT);
    for (const sc of round3.scenarios) { const hint = live.getContextHint(sc.stem, sc.id); if (hint) shown.add(keyOfHint(hint)); }
    const unused = Object.keys(live.CONTEXT_HINTS).filter((k) => !shown.has(k));
    ok('C5b every hint in CONTEXT_HINTS is shown under some Round 1, 2 or 3 stem', unused.length === 0, 'never shown: ' + list(unused));
  }

  // ---------- 6. in the page ----------
  const nameRules = r3.nameRules(live.PROFILES);
  {
    // Each renderer on every item it can be handed: Round 1's showQ on POOL_A; Round 2's
    // showRefinementQuestion on POOL_ALLY and on POOL_A (Round 2's enemy retests).
    const { win, h, errors } = await page();
    begin(h);
    const s = h.state;
    const hintOf = win.eval('getContextHint');
    const showQ = win.eval('showQ');
    const showRound2 = win.eval('showRefinementQuestion');
    const poolA = h.POOL_A, poolAlly = h.POOL_ALLY;
    const bad1 = [], bad2 = [];
    s.stage = 1; s.poolA = poolA.slice();
    poolA.forEach((q, i) => {
      s.qNum = i; showQ();
      const p = differences(q, onScreen(win), hintOf(q.sc, q.id), nameRules);
      if (p.length) bad1.push(q.id + ': ' + p.join(', '));
    });
    ok(`C6a Round 1's renderer shows all ${poolA.length} POOL_A items as written: label, stem, hint and both answers, with "Neither"`,
      poolA.length === 61 && bad1.length === 0 && errors.length === 0, list(bad1.concat(errors)));
    const round2 = [...poolAlly, ...poolA];
    s.stage = 'refinement'; s.refinementQuestions = round2; s.refinementAnswers = []; s.refinementPairwise = {};
    round2.forEach((q, i) => {
      s.qNum = i; showRound2();
      const p = differences(q, onScreen(win), hintOf(q.sc, q.id), nameRules);
      if (p.length) bad2.push(q.id + ': ' + p.join(', '));
    });
    ok(`C6b Round 2's renderer shows all ${poolAlly.length} POOL_ALLY items, and all ${poolA.length} POOL_A items as enemy retests, as written`,
      poolAlly.length === 50 && bad2.length === 0 && errors.length === 0, list(bad2.concat(errors)));
    const hinted = poolA.concat(poolAlly).filter((q) => hintOf(q.sc, q.id)).map((q) => q.id).sort().join();
    ok('C6c in the page, the same six items show a hint, and no Magic item does', hinted === Object.keys(HINTS).sort().join(), hinted);
    win.close();
  }
  for (const gaming of [false, true]) {
    // A real Round 1 and Round 2, answered by a fixed preference, checking each question on screen.
    const { win, h, errors } = await page();
    begin(h, { gaming });
    const hintOf = win.eval('getContextHint');
    const pref = { W: 5, U: 4, B: 3, R: 2, G: 1 };
    const pick = (q, n) => (n % 3 === 2 ? q.r[1] : q.r.reduce((best, o) => (pref[o.c] > pref[best.c] ? o : best), q.r[0]));
    const seen = { 1: [], 2: [] }, bad = [];
    const look = (q, round) => {
      seen[round].push(q.id);
      if (!isVisible(win, 'screen-assessment')) { bad.push(q.id + ': the question screen is hidden'); return; }
      const p = differences(q, onScreen(win), hintOf(q.sc, q.id), nameRules);
      if (p.length) bad.push(`R${round} ${q.id}: ${p.join(', ')}`);
    };
    let guard = 0;
    while (guard++ < 120) {
      const st = h.state;
      if (st.stage === 1 && st.qNum < st.poolA.length) {
        const q = st.poolA[st.qNum]; look(q, 1);
        const o = pick(q, guard); h.answerQ(o, q.r.indexOf(o));
      } else if (st.stage === 'refinement' && st.qNum < st.refinementQuestions.length) {
        const q = st.refinementQuestions[st.qNum]; look(q, 2);
        h.selectRefinementChoice(pick(q, guard).c, q.pair);
      } else if (isVisible(win, 'screen-early-offer')) h.continueToRound2();
      else break; // the line-up after Round 2
    }
    const magic = [...seen[1], ...seen[2]].filter(isMagic);
    const mode = gaming ? 'on' : 'off';
    ok(`C6${gaming ? 'e' : 'd'} Magic items ${mode}: a real Round 1 (${seen[1].length} questions) and Round 2 (${seen[2].length}) show every question's label, stem, hint and answers as written`,
      seen[1].length === 30 && seen[2].length >= 6 && bad.length === 0 && errors.length === 0, list(bad.concat(errors)));
    if (gaming) ok(`C6f with Magic items on, Magic items are asked (${magic.length}: ${list(magic, 3)}) and show no hint`, magic.length > 0 && bad.length === 0, list(magic));
    else ok('C6g with Magic items off, no Magic item is asked', magic.length === 0, list(magic));
    win.close();
  }

  // ---------- 7. the guards, on made-up sources ----------
  {
    const base = trial();
    ok('C7a a made-up source that follows the rules raises no problem', base.problems.length === 0, list(base.problems.map((p) => `${p.id} ${p.rule} ${p.detail}`)));
    const magicItem = base.model.items.find((i) => i.id === 'MTG-WB-01'), allyItem = base.model.items.find((i) => i.id === 'AL-WU-01');
    ok('C7b its Magic item gets no hint although its stem matches one, and its ally item does', magicItem.hint === null && allyItem.hintKey === 'TEAM',
      JSON.stringify([magicItem.hint, allyItem.hintKey]));
    const flags = (label, opts, rule) => {
      const got = rulesOn(opts);
      ok('C7 flags ' + label, got.split(',').includes(rule), `wanted ${rule}, got ${got || 'nothing'}`);
    };
    const passes = (label, opts) => {
      const got = rulesOn(opts);
      ok('C7 passes ' + label, got === '', got);
    };
    flags('a stem of 26 words', { sc: words(26) }, 'words');
    passes('a stem of exactly 25 words', { sc: words(25) });
    flags('an answer of 21 words', { a: words(21) }, 'words');
    passes('an answer of exactly 20 words', { a: words(20) });
    flags('a label of 5 words', { ctx: 'One Two Three Four Five' }, 'words');
    flags('a colour in a stem', { sc: 'Out of the blue, a parcel arrives.' }, 'colour');
    flags('a colour in a label', { ctx: 'Red Tape' }, 'colour');
    flags('a basic land in an answer', { a: 'Move mountains for them.' }, 'basic land');
    flags('an identity in an answer', { a: 'Ask Dimir what to do.' }, 'identity');
    flags('an identity key that is also a word (INK)', { b: 'Sign it in ink.' }, 'identity');
    flags('a profile tagline', { a: 'Peace through structure, every time.' }, 'tagline');
    flags('mana', { a: 'Tap for mana first.' }, 'magic term');
    flags('colour, in any form', { b: 'Something more colourful.' }, 'magic term');
    flags('guild', { b: 'Ask the guild.' }, 'magic term');
    flags('an em dash', { a: 'Wait — then go.' }, 'dash');
    flags('an exclamation mark', { a: 'Go now!' }, 'exclamation');
    flags('an asterisk', { a: 'It is *mine*.' }, 'asterisk');
    flags('a word in capitals', { a: 'Do it NOW.' }, 'capitals');
    flags('a question mark in an answer', { b: 'Why not?' }, 'question');
    passes('a question mark in a stem', { sc: 'Which of these is closer to your view?' });
    flags('an -ize spelling', { a: 'Organize it first.' }, 'US spelling');
    flags('a US spelling from the list', { a: 'My favorite one.' }, 'US spelling');
    flags('a word the brief rules out', { a: 'Enjoy the journey.' }, 'brief word');
    flags('office jargon', { a: 'Ask the stakeholders.' }, 'jargon');
    flags('a label that is the stem', { ctx: 'Same words.', sc: 'Same words.' }, 'label');
    flags('two answers of one colour', { cb: 'W' }, 'answers');
    passes('whole words only: "think", "tired", "brown", "Inkblot", "sized", "realise", "OK"', { a: "I think the brown one's tired, OK.", b: 'An Inkblot test, sized up. I realise.' });
    const dashHint = trial({ hint: 'No team? Think — a club.' }).problems;
    ok('C7 flags a hint with an em dash, on the item that shows it and in CONTEXT_HINTS',
      dashHint.some((p) => p.id === 'AL-WU-01' && p.where === 'hint' && p.rule === 'dash') && dashHint.some((p) => p.id === 'CONTEXT_HINTS.TEAM' && p.rule === 'dash'),
      list(dashHint.map((p) => `${p.id} ${p.where} ${p.rule}`)));
  }
});
