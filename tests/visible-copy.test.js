#!/usr/bin/env node
'use strict';
// The words a player sees between the rounds and on the result screen, held to
// the plain-copy rules (CHANGELOG, "Plain screens"). The page is booted in
// jsdom and each screen is rendered for real: the three transitions, the
// Round 3 line-up, the early offer, the calculating and pre-result screens,
// the question screen's own lines, and the result screen in several states (a
// clean HIGH result; LOW with a Round 3 cycle; LOW with a context
// disagreement; the other old caveats; each quality flag and all three at
// once; workplace; Magic off; an early result; five colours; a shared link; a
// peek and an appeal). The visible text is collected, leaving out the
// identity's own content (name, tagline, philosophy, strengths, shadows,
// banter, roles, the player-mode card), the commander block (commander,
// description, mana base) and the colour cards under Working With Others,
// which sections 10 to 15 hold to their own rules. A check fails on:
//   - an em dash, or an en dash used as a dash
//   - a banned phrase ("caveat", "treat this as", "soft read", "softer than
//     they look", "secondary lean", "That's the game", "We know who they
//     are", "suspects", "genuinely", "actually", "simply", "truly")
//   - the scoring's workings ("loop", "final-round", "item answers",
//     "margins", "Round 1 and Round 2", "scenario answers" and the like)
//   - an identity code in capitals (MONO-U, WUBRG, IZZET, MONO-BLUE ...)
//   - an exclamation mark, a question mark (the screens ask the player
//     nothing), "not X, it's Y", a US spelling, an unfilled {placeholder}
//   - a sentence over 20 words
//   - a confidence block of more than the label and its one line, more than
//     one quality line under it, or anything else between it and the bars.
// The line under the label (sections 6 and 9; CHANGELOG, "Result screens
// rewritten from naive readers") is one sentence about the result's own bars:
// a check fails when it carries a number, is one of the old lines every result
// printed, names none of the result's colours (or, with no bars, the
// identity), or says what the bars do not ("well" clear by three answers or
// fewer, "level" for bars printed apart, a count of answers the gap does not
// fit); on all 31 identities, seven bar shapes and the three labels, and as
// rendered in plain and player modes. Section 9 also renders the commander
// block (the card text only in player mode) and the colleague cards under
// Working With Others for all 31, on the result and in the explorer: one card
// per missing colour saying what it brings and when to bring it in, none of
// the traits and jargon readers caught ("You move on instinct", "Decisions
// defer", "second-order consequences"), no sentence opening on "You", and a
// legend naming only the lines the diagram draws.
// Sections 10 to 15 (CHANGELOG, "Plain profiles and pages") read what a
// player reads about an identity and the pages around the result, rendered
// for real: the profile blocks on the result screen for all 31 identities
// (tagline, philosophy, strengths, shadows, banter, roles, the commander and
// its description, the player-mode card and mana base, the colour cards),
// the explorer with all 31 details in both audiences, the dossier's five
// tabs for all 31, the methodology and full breakdown (Round 2 and Round 3
// shown, under both engines), the colour-interactions screen and the share
// studio's three formats. There a check fails on the same dashes, banned
// phrases and scoring words (the methodology may name how the quiz works),
// "the real", an exclamation mark, a question mark outside a quotation (no
// rhetorical questions), "not X, it's Y", a US spelling ("color" and the
// rest), an unfilled {placeholder} (mana symbols like {1}{W} are not), a
// sentence over 25 words, or an identity code in capitals in the dossier's
// sentences. Left as they are, because they are data or quoted: the
// identity names (MONO-WHITE, FOUR-COLOR (No Red)), the commander's printed
// type line ("Legendary Creature — Human Ninja") and the card's rules text.
// Section 16 (CHANGELOG, "Profile rhythm") holds the 31 profiles' own
// passages, as the result screen and the explorer render them, to rhythm
// rules: no three sentences in a row on the same opening word, no run of
// three short sentences of the same shape, no antithesis ("rather than",
// "You'd rather X than Y", "not X but Y", "X, not Y", "the bigger the X, the
// calmer the Y"), no list of three outside an identity's own colours or a
// card's modes, no closing line in the formulas the profiles leaned on ("The
// card rewards ...", "... worth it", "The team finds you ..."), and the same
// em dash, rhetorical question and banned words; the rules are spelt out
// above rhythmProblems. Jokes, dramatic colons and a neat closing line in
// other words cannot be caught by a pattern; they are left to review. The
// checkers themselves are tested last, on the paragraph a player saw on a
// phone before these rules existed and on the profiles' old passages.
// Usage: node tests/visible-copy.test.js [--dump] [path/to/index.html]
const { bootPage, pageArgs, whenReady, isVisible, EXPOSE } = require('./_lib/load');
const { run } = require('./_lib/report');

const DUMP = process.argv.includes('--dump');
const PAGE_EXPOSE = [...EXPOSE, 'RESULT_COPY', 'manaBaseLine', 'FORMAT_HINTS'];
const MAX_WORDS = 20;
const MAX_CONTENT_WORDS = 25;

// ---------- the rules ----------
const PHRASES = [
  'caveat', 'treat this as', 'soft read', 'softer than they look', 'secondary lean', "that's the game",
  'we know who they are', 'suspect', 'genuinely', 'actually', 'simply', 'truly',
];
// how the scoring works
const SCORING_WORDS = [
  'loop', 'final-round', 'final round', 'item answers', 'scenario answers', 'quick answers', 'disagreed',
  'margin', "couldn't decide", 'round 1 and round 2', 'head-to-head comparison', 'enemy pair', 'ally pair',
  'posterior', 'broke the',
];
const BANNED = [...PHRASES, ...SCORING_WORDS];
const US_SPELLING = /\b(?:color|favor|flavor|behavior|honor\b|center\b|rigor\b|fervor|math\b|outmaneuver|(?:analy|organi|recogni|reali|priori|optimi|summari|emphasi|minimi|maximi|apologi|categori|characteri|personali|paraly)z)/i;
const NOT_X_ITS_Y = /\b(?:not|isn't|aren't|wasn't)\b[^.?!]*?[,;:]\s*(?:it's|it is|but)\b/i;

// Identity codes in capitals: the PROFILES keys (MONO-U ... WUBRG), and the
// capitalised profile names a sentence could pick up (MONO-BLUE, FOUR-COLOR ...).
function codeRules(PROFILES) {
  const keys = Object.keys(PROFILES).map((k) => k.replace(/[-]/g, '\\-'));
  return [
    new RegExp(`(?<![\\w-])(?:${keys.join('|')})(?![\\w-])`),
    /\bMONO-(?:WHITE|BLUE|BLACK|RED|GREEN)\b/,
    /\b(?:FOUR|FIVE)-COLOU?R\b/,
  ];
}

// Sentences of a block of text: split after . ! or ? (and a closing bracket
// or quote) where the next word starts with a capital or a digit.
function sentences(text) {
  return text.split(/(?<=[.!?]["')’]?)\s+(?=["'(‘“]?[A-Z0-9])/).map((x) => x.trim()).filter(Boolean);
}
const words = (sentence) => sentence.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));

// Problems in one block of visible text. `questions`: whether a question mark
// is allowed (the undo's confirm asks one; the share text asks a friend).
function problemsIn(text, { PROFILES, questions = false } = {}) {
  const out = [];
  const lower = text.toLowerCase();
  if (text.includes('—')) out.push('em dash');
  if (/\s–\s|(?<!\d)–|–(?!\d)/.test(text)) out.push('en dash used as a dash');
  for (const b of BANNED) if (lower.includes(b)) out.push(`"${b}"`);
  if (text.includes('!')) out.push('exclamation mark');
  if (!questions && text.includes('?')) out.push('question mark');
  if (NOT_X_ITS_Y.test(text)) out.push('"not X, it\'s Y"');
  const us = US_SPELLING.exec(text);
  if (us) out.push(`US spelling "${us[0]}"`);
  if (/\{\w+\}/.test(text)) out.push('unfilled placeholder');
  if (PROFILES) for (const re of codeRules(PROFILES)) { const m = re.exec(text); if (m) out.push(`identity code "${m[0]}"`); }
  for (const s of sentences(text)) if (words(s).length > MAX_WORDS) out.push(`${words(s).length} words: "${s.slice(0, 60)}..."`);
  return out;
}

// Problems in one block of an identity's content or the pages around the
// result (sections 10 to 15). `scoring`: whether the scoring's workings count
// against it (not on the methodology, whose subject they are). `codes`:
// whether an identity code in capitals counts (the dossier's sentences).
// "Enemy pair" and "ally pair" name the colour wheel's relationships there
// (the explorer's "Allied and enemy pairs."), not the scoring, and pass.
// The identity names are data and are read past: FOUR-COLOR is a name, not
// the copy's spelling.
const WHEEL_WORDS = ['enemy pair', 'ally pair'];
const TYPE_LINE = /^Legendary (?:Artifact )?Creature — [A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
function contentProblems(text, { PROFILES, scoring = true, codes = false } = {}) {
  let t = text;
  if (PROFILES) for (const p of Object.values(PROFILES)) t = t.split(p.name).join(' ');
  const out = [];
  const lower = t.toLowerCase();
  if (t.includes('—')) out.push('em dash');
  if (/\s–\s|(?<!\d)–|–(?!\d)/.test(t)) out.push('en dash used as a dash');
  if (/\s--\s|\w--\w/.test(t)) out.push('double hyphen used as a dash');
  for (const b of (scoring ? BANNED.filter((w) => !WHEEL_WORDS.includes(w)) : PHRASES)) if (lower.includes(b)) out.push(`"${b}"`);
  if (/\bthe real\b/i.test(t)) out.push('"the real"');
  if (t.includes('!')) out.push('exclamation mark');
  if (/\?(?!['"’”])/.test(t)) out.push('question mark outside a quotation');
  if (NOT_X_ITS_Y.test(t)) out.push('"not X, it\'s Y"');
  const us = US_SPELLING.exec(t);
  if (us) out.push(`US spelling "${us[0]}"`);
  if (/\{[a-z]\w*\}/.test(t)) out.push('unfilled placeholder');
  if (codes && PROFILES) for (const re of codeRules(PROFILES)) { const m = re.exec(text); if (m) out.push(`identity code "${m[0]}"`); }
  for (const s of sentences(t)) if (words(s).length > MAX_CONTENT_WORDS) out.push(`${words(s).length} words: "${s.slice(0, 60)}..."`);
  return out;
}

// ---------- the line under the label (sections 6 and 9) ----------
// One sentence about this result's own bars (CHANGELOG, "Result screens
// rewritten from naive readers"). It fails when it is empty, more than one
// sentence, carries a number, is one of the old lines every result printed
// ("Fairly clear. Your nearest neighbour is next door."), names no colour of
// the result (its own colours, the nearest one outside them, or for five
// colours "all five colours") and not the identity either, or says something
// the bars do not: "well" for a gap of
// three answers or less, "level" or "tied" for bars that print apart, or a
// count of answers the gap does not fit. One answer is a twelfth of a bar, as
// next door counts it.
const OLD_LABEL_LINES = ['A clear result.', 'Fairly clear. Your nearest neighbour is next door.',
  'Your answers were split between a few results. Have a look next door.'];
const COLOUR_WORD = { W: 'white', U: 'blue', B: 'black', R: 'red', G: 'green' };
const ANSWER_RANGES = [
  ['less than an answer', 0, 0.5], ['about one answer', 0.5, 1], ['one or two answers', 1, 2],
  ['two or three answers', 2, 3], ['more than three answers', 3, Infinity],
];
function lineProblems(line, id, act, PROFILES, name) {
  const out = [];
  if (!line) return ['no line'];
  if (sentences(line).length !== 1) out.push(`${sentences(line).length} sentences`);
  if (/\d|%/.test(line)) out.push('a number');
  if (OLD_LABEL_LINES.includes(line)) out.push('an old line every result printed');
  const colours = PROFILES[id].colors;
  const bar = (c) => act[c] || 0;
  const shown = (c) => Math.round(bar(c) * 100);
  const outside = ['W', 'U', 'B', 'R', 'G'].filter((c) => !colours.includes(c)).sort((a, b) => bar(b) - bar(a));
  const inside = [...colours].sort((a, b) => bar(b) - bar(a));
  const lower = line.toLowerCase();
  const named = [...colours, ...outside.slice(0, 1)].filter((c) => new RegExp(`\\b${COLOUR_WORD[c]}\\b`).test(lower));
  const allFive = colours.length === 5 && /\ball five colours\b/.test(lower);
  if (!named.length && !allFive && !(name && line.includes(name))) out.push('names no colour of this result');
  // The two bars the line compares: your lowest colour and the highest one
  // outside it, or for five colours the highest and the lowest.
  const [hi, lo] = outside.length ? [inside[inside.length - 1], outside[0]] : [inside[0], inside[inside.length - 1]];
  const answers = (bar(hi) - bar(lo)) * 12;
  if (/\bwell\b/.test(lower) && !(answers > 3)) out.push(`"well" for ${answers.toFixed(2)} answers`);
  if (/\b(?:level|tied)\b/.test(lower) && shown(hi) !== shown(lo)) out.push(`"level" for bars of ${shown(hi)} and ${shown(lo)}`);
  for (const [words, min, max] of ANSWER_RANGES) {
    if (lower.includes(words) && !(answers >= min - 1e-9 && answers <= max + 1e-9)) out.push(`"${words}" for ${answers.toFixed(2)} answers`);
  }
  return out;
}

// ---------- the colleague cards (section 9) ----------
// What a colleague strong in each missing colour brings, and when to bring
// them in. The cards once claimed traits of the reader that their own result
// contradicted ("You move on instinct" to Mono-White, "Decisions defer" to
// Mono-Black); readers also caught the jargon in them. None of these may come
// back, no sentence on them may open on "You" or "Your", and the stray legend
// labels and the old heading stay gone.
const GAP_TRAITS = [
  'move on instinct', 'do the thing, then learn', "don't pause long enough", "don't experience the team",
  'something you owe care to', 'decisions get made for you', 'stated motives as their real ones', 'give away leverage',
  'holding the bill', "weren't watching the table", "don't generate the heat", 'decisions defer', 'one more data point',
  'flat or strategically aloof', 'distrust existing systems', 'rebuilding more satisfying', "discarded as 'legacy'",
  'relearned the expensive way', 'temperature of the room', 'live data', 'second-order consequences', 'cheapest insurance',
  'psychologically safe', 'name trade-offs', 'stakeholder', 'no single colour completes you', 'all five tensions',
  'which voice leads when', "what's missing", 'ally edge', 'tension to what you lack',
];
function gapProblems(text) {
  const lower = text.toLowerCase();
  const out = GAP_TRAITS.filter((p) => lower.includes(p)).map((p) => `"${p}"`);
  for (const s of sentences(text)) if (/^(?:you|your)\b/i.test(s)) out.push(`opens on "You": "${s.slice(0, 50)}"`);
  return out;
}

// ---------- rhythm (section 16) ----------
// One passage is { id, part, items, list, prose }: a paragraph is one item,
// a list (strengths, shadows) one item per line, read top to bottom as one
// run of sentences. A check fails on:
//   - openings: three or more sentences in a row that open on the same word
//     ("You read ... You ask ... You'd rather ..."; "Can ... Can ... Can" down
//     a list). A contraction counts as its word: You'd and You're are "you".
//   - short: three or more short sentences in a row (SHORT_SENTENCE words or
//     fewer) with the same shape: each opens straight on its subject (in a
//     list, on its verb), or each opens on a lead-in ("When ...", "If ...",
//     "Months on, ...": a lead-in word, or a comma in the first four words).
//   - antithesis: "rather than", "would rather" (the "You'd rather X than Y"
//     ending), "not X but Y" (up to six words between), "X, not Y", and "the
//     bigger the X, the calmer the Y".
//   - lists: a list of three or more items of one to four words, with a comma
//     before the "and" or "or" ("X, Y, and Z"), or of four items or more,
//     unless it is kept: COLOUR_LISTS (an identity's own colours, three to as
//     many items as it has colours) or CARD_MODES (a commander's modes as the
//     card prints them). "X, Y and Z" without that comma is left to review.
//   - closers: the last sentence of a paragraph of two or more in a formula
//     the profiles leaned on: "The card rewards ...", "The whole point ...",
//     "The trick is ...", "Most people ...", "... worth it", "The team finds
//     you ..." or "The team that follows you is ...", "You've decided ...".
//   - banned: an em dash, a question mark outside a quotation (a rhetorical
//     question), "actually", "genuinely", "simply", "truly", "the real".
// The tagline and the roles are a name and a list of jobs (`prose: false`):
// only the last rule applies to them.
const SHORT_SENTENCE = 10;
const LEAD_INS = new Set(['when', 'whenever', 'if', 'once', 'as', 'after', 'before', 'because', 'since', 'until', 'while',
  'though', 'although', 'unless', 'by', 'in', 'on', 'at', 'for', 'with', 'without', 'during', 'from', 'over', 'under',
  'sometimes', 'often', 'then', 'so', 'and', 'but', 'or', 'yet', 'still', 'now', 'later', 'also', 'even', 'only',
  'whatever', 'where', 'yeah', 'look', 'please']);
const RHYTHM_RULES = [
  ['openings', 'no three sentences in a row open on the same word'],
  ['short', `no run of three short sentences (${SHORT_SENTENCE} words or fewer) with the same shape`],
  ['antithesis', 'no "rather than", "would rather", "not X but Y", "X, not Y" or "the bigger the X, the calmer the Y"'],
  ['lists', 'no list of three outside the identity\'s own colours or a card\'s modes'],
  ['closers', 'no closing line in the old formulas ("The card rewards ...", "... worth it", "The team finds you ...")'],
  ['banned', 'no em dash, rhetorical question, "actually", "genuinely", "simply", "truly" or "the real"'],
];
// The lists that stay. Each item of a colour list stands for one of the
// identity's own colours (Bant: civilisation, knowledge, patience), three of
// them or more; a card's modes are the modes it prints.
// The four that only listed colours ("Holds analysis, fairness, and timing in
// one mental model", "Sees the same situation from analysis, ambition,
// structure, instinct, and patience") are gone: readers took them for
// machine-written.
const COLOUR_LISTS = {
  BANT: ['civilisation, knowledge, and patience'],
  ESPER: ['fair systems, deep analysis, and the willingness to make the call'],
  ABZAN: ['patience, pragmatism, and community'],
  WITCH: ['patience, analysis, and quiet positioning'],
};
const CARD_MODES = {
  YORE: ['3 damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life'],
};
const RHYTHM_ANTITHESIS = [
  [/\brather than\b/i, '"rather than"'],
  [/\b(?:would|'d|’d) rather\b/i, '"would rather"'],
  [/\b(?:not|isn['’]t|aren['’]t|wasn['’]t|weren['’]t|don['’]t|doesn['’]t|didn['’]t)(?:\s+[\w'’-]+){1,6},?\s+but\b/i, '"not X but Y"'],
  [/,\s+not\b/i, '"X, not Y"'],
  [/\bthe (?:more|less|fewer|\w+er) (?:the|you|they|it|we|he|she|i)\b[^.!?;]*,\s*the (?:more|less|fewer|\w+er)\b/i, '"the bigger the X, the calmer the Y"'],
  [/,\s*the (?:more|less|fewer) \w+ (?:you|they|it|we|he|she|i)\b/i, '"the more X you have"'],
];
const LIST_ITEM = String.raw`[\w'’/{}+-]+(?: [\w'’/{}+-]+){0,3}`;
const LIST_OF_THREE = new RegExp(String.raw`(?<![\w'’/{}+-])${LIST_ITEM}(?:(?:, ${LIST_ITEM})+, (?:and|or) ${LIST_ITEM}|(?:, ${LIST_ITEM}){2,} (?:and|or) ${LIST_ITEM})`, 'gi');
const RHYTHM_CLOSERS = [
  /^the (?:card|whole|point|trick|mechanic|result|lesson)\b/i,
  /^most people\b/i,
  /\bworth it\b/i,
  /^the (?:team|room)\b(?: that \w+(?: around)? you)? (?:finds|is)\b/i,
  /^you['’]ve (?:decided|learned)\b/i,
];
const RHYTHM_BANNED = [
  [/—/, 'em dash'], [/\?(?!['"’”])/, 'rhetorical question'], [/\b(?:actually|genuinely|simply|truly)\b/i, 'banned word'], [/\bthe real\b/i, '"the real"'],
];
// The word a sentence opens on, in lower case, a contraction read as its word.
function opener(sentence) {
  const m = /^[^A-Za-z0-9]*([A-Za-z0-9][\w'’-]*)/.exec(sentence);
  if (!m) return '';
  return m[1].toLowerCase().replace(/’/g, "'").replace(/^(?:can't|cannot)$/, 'can').replace(/^won't$/, 'will')
    .replace(/n't$/, '').replace(/'(?:s|d|re|ve|ll|m)$/, '');
}
const shapeOf = (sentence) => (LEAD_INS.has(opener(sentence)) || sentence.split(/\s+/).slice(0, 4).join(' ').includes(',') ? 'lead-in' : 'direct');
// Runs of three or more sentences in a row with the same key (null breaks a run).
function runsOf(list, key) {
  const out = [];
  for (let i = 0; i < list.length;) {
    const k = key(list[i]);
    let j = i + 1;
    if (k !== null) while (j < list.length && key(list[j]) === k) j++;
    if (k !== null && j - i >= 3) out.push(list.slice(i, j));
    i = j;
  }
  return out;
}
function rhythmProblems({ id, part, items, list = false, prose = true }) {
  const out = [];
  const add = (rule, detail) => out.push({ rule, at: `${id} ${part}`, detail });
  const all = items.join(' ');
  for (const [re, name] of RHYTHM_BANNED) { const m = re.exec(all); if (m) add('banned', `${name} in "${all.slice(Math.max(0, m.index - 30), m.index + 30)}"`); }
  if (!prose) return out;
  const seq = items.flatMap(sentences);
  for (const r of runsOf(seq, (s) => opener(s) || null)) add('openings', `${r.length} open on "${opener(r[0])}": ${r.join(' / ')}`);
  for (const r of runsOf(seq, (s) => (words(s).length <= SHORT_SENTENCE ? shapeOf(s) : null))) add('short', `${r.length} short, ${shapeOf(r[0])}: ${r.join(' / ')}`);
  const kept = [...(COLOUR_LISTS[id] || []), ...(CARD_MODES[id] || [])];
  for (const s of seq) {
    for (const [re, name] of RHYTHM_ANTITHESIS) if (re.test(s)) add('antithesis', `${name}: "${s}"`);
    const keep = kept.map((k) => [s.indexOf(k), k.length]).filter(([i]) => i >= 0);
    for (const m of s.matchAll(LIST_OF_THREE)) {
      if (!keep.some(([i, n]) => m.index < i + n && i < m.index + m[0].length)) add('lists', `"${m[0]}" in "${s}"`);
    }
  }
  if (!list) {
    const ss = sentences(all);
    const last = ss[ss.length - 1];
    if (ss.length > 1 && RHYTHM_CLOSERS.some((re) => re.test(last))) add('closers', `"${last}"`);
  }
  return out;
}
// The items of a kept list: "a, b, and c" is three.
const listItems = (text) => text.split(/,\s*(?:(?:and|or)\s+)?|\s+(?:and|or)\s+/).filter(Boolean);

// ---------- collecting what is on screen ----------
// Not prose for these rules: the identity's own content, the commander block
// and the colour cards (a separate decision), and nothing hidden.
const CONTENT = [
  '#res-id', '#res-tag', '#res-banner-commander', '#res-idcard', '#identity-exp', '#strengths', '#weaknesses',
  '#res-counter-section', '#res-desc', '#roles', '#cmd-name-aside', '#cmd-desc-aside', '#res-mana-base',
  '#relations-detail', '.mc-nextdoor__peek-philosophy', '.mc-nextdoor__peek-traits', '#share-preview',
];
const BLOCK = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'UL', 'OL', 'BUTTON', 'SECTION', 'LABEL', 'TD', 'TH', 'BR']);
const SKIP = new Set(['SCRIPT', 'STYLE', 'SVG', 'svg', 'TEMPLATE']);

function hidden(win, el) {
  if (el.classList && el.classList.contains('hidden')) return true;
  if (el.hasAttribute && el.hasAttribute('hidden')) return true;
  if (el.style && el.style.display === 'none') return true;
  return win.getComputedStyle(el).display === 'none';
}

// The visible text under root, as blocks (one per block-level element), with
// the content selectors left out.
function visibleBlocks(win, root, { exclude = CONTENT } = {}) {
  const blocks = [];
  let buf = '';
  const flush = () => { const t = buf.replace(/\s+/g, ' ').trim(); if (t) blocks.push(t); buf = ''; };
  const walk = (node) => {
    if (node.nodeType === 3) { buf += node.textContent; return; }
    if (node.nodeType !== 1 || SKIP.has(node.tagName) || hidden(win, node)) return;
    if (exclude.some((sel) => node.matches(sel))) { flush(); return; }
    const block = BLOCK.has(node.tagName);
    // Adjacent inline elements are separate words even with no space between
    // them in the markup ("Sultai." then "Your green ...").
    if (block) flush(); else buf += ' ';
    node.childNodes.forEach(walk);
    if (block) flush(); else buf += ' ';
  };
  walk(root);
  flush();
  return blocks;
}

// ---------- booting and rendering ----------
let nextSeed = 901;
async function page(opts = {}) {
  const p = bootPage({ ...pageArgs(), seed: nextSeed++, expose: PAGE_EXPOSE, ...opts });
  await whenReady(p.win);
  return p;
}
function begin(h, { gaming = false, audience = 'consumer' } = {}) {
  const s = h.state;
  s.mode = 'draft'; s.audience = audience; s.gamingFamiliar = gaming; s.disclaimerAcknowledged = true;
  if (h.selectAudience) h.selectAudience(audience);
  h.startAssessment();
}
const MODES = [
  ['plain', { gaming: false, audience: 'consumer' }],
  ['player', { gaming: true, audience: 'consumer' }],
  ['workplace', { gaming: true, audience: 'workplace' }],
];
const sorted = (act) => Object.entries(act).sort((a, b) => b[1] - a[1]);
const matchOf = (a, b, winner) => ({ a: { id: a }, b: { id: b }, winner: { id: winner }, loser: { id: winner === a ? b : a }, type: 'ROUND_ROBIN', scenarioId: 'CRISIS' });
const CLEAN_FLAGS = { totalAnswered: 30, alwaysLeftCount: 12, allNeitherCount: 1, fastResponseCount: 2 };

// Result states: the identity, its bars and the result; flags and modes.
const DIMIR_ACT = { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 };
const DIMIR_R3 = {
  allScores: [{ id: 'DIMIR', wins: 2, losses: 1 }, { id: 'GRIXIS', wins: 2, losses: 1 }, { id: 'ESPER', wins: 1, losses: 2 }, { id: 'MONO-U', wins: 1, losses: 2 }],
  gap: 0, runnerUp: { id: 'GRIXIS', wins: 2, losses: 1 },
  matchHistory: [matchOf('DIMIR', 'GRIXIS', 'DIMIR'), matchOf('ESPER', 'MONO-U', 'ESPER'), matchOf('DIMIR', 'ESPER', 'DIMIR'),
    matchOf('GRIXIS', 'MONO-U', 'GRIXIS'), matchOf('DIMIR', 'MONO-U', 'MONO-U'), matchOf('GRIXIS', 'ESPER', 'GRIXIS')],
  cycle: null, scenarioContradiction: null, contextDisagreement: null, isTournament: true,
};
const STATES = [
  { name: 'a clean HIGH result (player mode)', id: 'DIMIR', confidence: 'HIGH', act: DIMIR_ACT, r3: { ...DIMIR_R3, gap: 2 }, mode: 'player' },
  // The phone: a Round 3 cycle through three identities, the runner-up, and Round 1 and 2 disagreeing about blue
  { name: 'LOW with a Round 3 cycle, a runner-up and a context disagreement (the phone)', id: 'MONO-U', confidence: 'LOW',
    act: { U: 0.66, R: 0.55, W: 0.5, B: 0.48, G: 0.45 }, mode: 'player',
    r3: { allScores: [{ id: 'MONO-U', wins: 1, losses: 1 }, { id: 'IZZET', wins: 1, losses: 1 }, { id: 'WUBRG', wins: 1, losses: 1 }], gap: 0,
      runnerUp: { id: 'IZZET', wins: 1, losses: 1 }, cycle: ['IZZET', 'WUBRG', 'MONO-U'],
      matchHistory: [matchOf('IZZET', 'WUBRG', 'IZZET'), matchOf('WUBRG', 'MONO-U', 'WUBRG'), matchOf('MONO-U', 'IZZET', 'MONO-U')],
      contextDisagreement: { color: 'U', agreement: 0.5 }, isTournament: true } },
  { name: 'LOW with the context-disagreement flag', id: 'JUND', confidence: 'LOW', act: { R: 0.71, G: 0.69, B: 0.66, W: 0.24, U: 0.18 }, mode: 'plain',
    r3: { ...DIMIR_R3, allScores: [{ id: 'JUND', wins: 2, losses: 1 }], runnerUp: { id: 'GRUUL', wins: 2, losses: 1 }, contextDisagreement: { color: 'B', agreement: 0.4 } } },
  { name: 'MODERATE with a scenario contradiction, a near tie and a width shift', id: 'ESPER', confidence: 'MODERATE',
    act: { U: 0.7, B: 0.66, W: 0.62, G: 0.2, R: 0.1 }, mode: 'player',
    r3: { ...DIMIR_R3, gap: 1, runnerUp: { id: 'DIMIR', wins: 2, losses: 1 }, scenarioContradiction: { color: 'G' },
      widthShift: true, expectedWinner: 'DIMIR', shiftDirection: 'wider' } },
  { name: 'the fast-answers flag', id: 'DIMIR', confidence: 'MODERATE', act: DIMIR_ACT, r3: DIMIR_R3, mode: 'plain',
    flags: { totalAnswered: 30, alwaysLeftCount: 12, allNeitherCount: 1, fastResponseCount: 20 }, quality: 'fast' },
  { name: 'the many-neithers flag', id: 'DIMIR', confidence: 'MODERATE', act: DIMIR_ACT, r3: DIMIR_R3, mode: 'player',
    flags: { totalAnswered: 30, alwaysLeftCount: 10, allNeitherCount: 12, fastResponseCount: 1 }, quality: 'neither' },
  { name: 'the first-answer flag', id: 'DIMIR', confidence: 'MODERATE', act: DIMIR_ACT, r3: DIMIR_R3, mode: 'plain',
    flags: { totalAnswered: 30, alwaysLeftCount: 25, allNeitherCount: 0, fastResponseCount: 0 }, quality: 'firstAnswer' },
  { name: 'every quality flag at once (one line, the quick answers)', id: 'DIMIR', confidence: 'LOW', act: DIMIR_ACT, r3: DIMIR_R3, mode: 'player',
    flags: { totalAnswered: 30, alwaysLeftCount: 25, allNeitherCount: 12, fastResponseCount: 20 }, quality: 'fast' },
  { name: 'workplace audience', id: 'GLINT', confidence: 'MODERATE', act: { U: 0.66, B: 0.63, R: 0.6, G: 0.58, W: 0.2 },
    r3: { ...DIMIR_R3, scenarioContradiction: { color: 'W' }, contextDisagreement: { color: 'U', agreement: 0.5 } }, mode: 'workplace' },
  { name: 'gaming off', id: 'MONO-R', confidence: 'HIGH', act: { R: 0.86, B: 0.52, G: 0.44, W: 0.21, U: 0.12 }, r3: { matchHistory: [] }, mode: 'plain' },
  { name: 'an early result', id: 'BOROS', confidence: 'HIGH', act: { W: 0.8, R: 0.75, U: 0.3, B: 0.25, G: 0.2 }, early: true, mode: 'player' },
  { name: 'five colours', id: 'WUBRG', confidence: 'LOW', act: { W: 0.55, U: 0.53, B: 0.52, R: 0.5, G: 0.49 }, r3: {}, mode: 'plain' },
];

async function renderResult(st, { engine = 2 } = {}) {
  const p = await page();
  const { win, h } = p;
  const mode = Object.fromEntries(MODES)[st.mode];
  h.selectAudience(mode.audience);
  const s = h.state;
  s.gamingFamiliar = mode.gaming;
  s.result = st.early
    ? { identity: st.id, confidence: st.confidence, earlyTermination: true, allResults: [], scoringVersion: engine, instrumentVersion: 4 }
    : { identity: st.id, confidence: st.confidence, allResults: [], scoringVersion: engine, instrumentVersion: 4, round3Data: JSON.parse(JSON.stringify(st.r3 || {})) };
  s.activationSorted = sorted(st.act);
  s.responses = new Array(30).fill({ c: h.PROFILES[st.id].colors[0] });
  s.neitherCount = st.flags ? st.flags.allNeitherCount : 1;
  s.qualityFlags = st.flags || CLEAN_FLAGS;
  s.disclaimerAcknowledged = true;
  let threw = null;
  try { h.showResults(); } catch (e) { threw = e.message; }
  return { ...p, threw };
}

// ---------- the checks ----------
run('visible-copy', async (t) => {
  const { ok } = t;
  const dump = (label, blocks) => { if (DUMP) { console.log('\n== ' + label); blocks.forEach((b) => console.log('   | ' + b)); } };
  // One check per screen: every block passes the rules.
  const checkScreen = (label, win, root, PROFILES, opts = {}) => {
    const blocks = visibleBlocks(win, root, opts);
    dump(label, blocks);
    const problems = blocks.flatMap((b) => problemsIn(b, { PROFILES, questions: opts.questions }).map((p) => `${p} in "${b.slice(0, 70)}"`));
    ok(`${label}: plain`, blocks.length > 0 && problems.length === 0, problems.slice(0, 4).join(' | ') || 'no visible text');
    return blocks;
  };
  // The content rules on blocks already collected; returns the problems, each
  // with the block it was found in.
  const contentIssues = (label, blocks, PROFILES, opts = {}) => {
    dump(label, blocks);
    return blocks.flatMap((b) => contentProblems(b, { PROFILES, ...opts }).map((p) => `${label}: ${p} in "${b.slice(0, 70)}"`));
  };

  // ---------- 1. the transitions, in every mode ----------
  for (const [modeName, mode] of MODES) {
    const { win, h, errors } = await page({ stubs: { transitions: false } });
    begin(h, mode);
    h.state.activationSorted = sorted(DIMIR_ACT);
    const screen = win.document.getElementById('screen-round-transition');
    const seen = [];
    for (const [from, to] of [[1, 2], [2, 3], [3, 4]]) {
      win.showRoundTransition(from, to, () => {});
      seen.push(checkScreen(`transition ${from} to ${to} (${modeName})`, win, screen, h.PROFILES).join(' / '));
    }
    ok(`transitions say which round is done and "Continue", nothing else (${modeName})`,
      seen.join(' | ') === 'Round 1 done. / Continue | Round 2 done. / Continue | Round 3 done. / Continue' && errors.length === 0, seen.join(' | '));
    win.close();
  }

  // ---------- 2. the Round 3 line-up, by how many results are in play ----------
  for (const [modeName, mode] of MODES) {
    const { win, h, errors } = await page();
    begin(h, mode);
    h.state.activationSorted = sorted(DIMIR_ACT);
    const cands = ['DIMIR', 'GRIXIS', 'ESPER', 'MONO-U'].map((id) => ({ id, s1: 0.25 }));
    const screen = win.document.getElementById('screen-interstitial');
    for (const n of [4, 3, 2, 1]) {
      win.showInterstitial(cands.slice(0, n));
      const blocks = checkScreen(`Round 3 line-up, ${n} in play (${modeName})`, win, screen, h.PROFILES);
      const lines = blocks.filter((b) => !/^✦+$/.test(b));
      ok(`Round 3 line-up, ${n} in play (${modeName}): the title, one line and the button`,
        lines.length === 3 && lines[0] === 'Round 3' && lines[2] === 'Start Round 3' && sentences(lines[1]).length <= 2, lines.join(' / '));
    }
    ok(`Round 3 line-up (${modeName}): no errors`, errors.length === 0, errors.slice(0, 2).join(' | '));
    win.close();
  }

  // ---------- 3. the early offer ----------
  for (const [modeName, mode] of MODES) {
    const { win, h } = await page();
    begin(h, mode);
    h.state.qNum = 30;
    win.showEarlyTerminationOffer({ identity: 'DIMIR', confidence: 0.95, message: 'Your Round 1 answers already point clearly to DIMIR.' });
    const blocks = checkScreen(`early offer (${modeName})`, win, win.document.getElementById('screen-early-offer'), h.PROFILES);
    ok(`early offer (${modeName}): names no identity or colour`, !/\b(?:dimir|white|blue|black|red|green)\b/i.test(blocks.join(' ')), blocks.join(' / '));
    win.close();
  }

  // ---------- 4. the calculating and pre-result screens ----------
  {
    const { win, h } = await page();
    win.showCalculating();
    checkScreen('calculating', win, win.document.getElementById('screen-calculating'), h.PROFILES);
    win.close();
  }
  {
    const { win, h } = await page();
    const s = h.state;
    s.result = { identity: 'DIMIR', confidence: 'MODERATE', allResults: [], round3Data: {} };
    s.activationSorted = sorted(DIMIR_ACT);
    s.responses = new Array(30).fill({ c: 'U' });
    s.refinementAnswers = new Array(9).fill({ choice: 'U' });
    s.disclaimerAcknowledged = false;
    h.showResults();
    const blocks = checkScreen('pre-result screen', win, win.document.getElementById('screen-pre-result-disclaimer'), h.PROFILES);
    ok('pre-result screen: counts the answers, no "caveat"', isVisible(win, 'screen-pre-result-disclaimer') && blocks.includes('This result comes from 39 answers.'), blocks.join(' / '));
    win.close();
  }

  // ---------- 5. the question screen's own lines (the item text is checked by the copy tests) ----------
  for (const [modeName, mode] of MODES) {
    const { win, h } = await page();
    begin(h, mode);
    for (let i = 0; i < 10; i++) {
      const q = h.state.poolA[h.state.qNum];
      h.answerQ(q.r[0], 0);
    }
    win.document.getElementById('mulligan-btn').click();
    const d = win.document;
    const chrome = ['#stage-label', '.mc-q__count', '#q-beat', '#mulligan-btn', '#mulligan-confirm', '#instr', '.mc-neither']
      .map((sel) => d.querySelector(sel)).filter((el) => el && !hidden(win, el));
    const blocks = chrome.flatMap((el) => visibleBlocks(win, el));
    dump(`question screen (${modeName})`, blocks);
    const problems = blocks.flatMap((b) => problemsIn(b, { PROFILES: h.PROFILES, questions: true }).map((p) => `${p} in "${b}"`));
    ok(`question screen's own lines, with the progress line and the undo's confirm (${modeName}): plain`,
      problems.length === 0 && blocks.includes('10 answered, 35 to go.') && blocks.includes('Undo your last answer? You get one per round.'), problems.join(' | ') || blocks.join(' / '));
    win.close();
  }

  // ---------- 6. the result screen ----------
  for (const st of STATES) {
    const { win, h, errors, threw } = await renderResult(st);
    const d = win.document;
    const R = h.RESULT_COPY;
    const screen = d.getElementById('screen-results');
    checkScreen(`result: ${st.name}`, win, screen, h.PROFILES);
    // The confidence block: the label and its line (one sentence about this
    // result's own bars, naming one of its colours), then at most one quality
    // line, and nothing else before the bars.
    const label = R.labels[st.confidence];
    const line = win.confidenceLine(st.id, st.act, st.confidence);
    const block = visibleBlocks(win, d.querySelector('.mc-verdict-status'));
    const between = [];
    for (let n = d.querySelector('.mc-verdict-status').nextElementSibling; n && !n.contains(d.getElementById('res-bars-title')); n = n.nextElementSibling) {
      between.push(...visibleBlocks(win, n).map((b) => ({ id: n.id, b })));
    }
    const quality = between.filter((x) => x.id === 'quality-warning').map((x) => x.b);
    const others = between.filter((x) => x.id !== 'quality-warning');
    const wantQuality = st.quality ? [(R.quality || {})[st.quality]] : [];
    const specific = lineProblems(line, st.id, st.act, h.PROFILES);
    ok(`result: ${st.name}: the confidence block is "${label.word}" and one sentence about these bars, ${st.quality ? 'then the ' + st.quality + ' line' : 'with no quality line'}, and nothing else`,
      !threw && errors.length === 0 && JSON.stringify(block) === JSON.stringify([label.word, line]) && specific.length === 0
        && JSON.stringify(quality) === JSON.stringify(wantQuality)
        && quality.every((q) => sentences(q).length <= 2) && others.length === 0 && !d.getElementById('conf-exp'),
      `${threw || errors[0] || ''} block=${JSON.stringify(block)} ${specific.join(', ')} quality=${JSON.stringify(quality)} others=${JSON.stringify(others)}`);
    win.close();
  }

  // ---------- 7. a shared link, a peek next door and an appeal ----------
  {
    const { win, h } = await page({ url: 'http://localhost/?r=DIMIR&p=22,78,64,11,31&c=moderate&a=consumer&s=2&i=4' });
    ok('result: a shared link shows the seed banner', isVisible(win, 'seed-banner') && isVisible(win, 'screen-results'), '');
    checkScreen('result: a shared link', win, win.document.getElementById('screen-results'), h.PROFILES);
    win.close();
  }
  for (const mode of ['player', 'plain', 'workplace']) {
    const { win, h } = await renderResult({ id: 'DIMIR', confidence: 'MODERATE', act: DIMIR_ACT, r3: DIMIR_R3, mode });
    const d = win.document;
    d.querySelector('#next-door-chips .mc-nextdoor__chip[data-id="SULTAI"]').click();
    checkScreen(`result: a peek next door (${mode})`, win, d.getElementById('screen-results'), h.PROFILES);
    d.getElementById('appeal-btn').click();
    checkScreen(`result: after an appeal (${mode})`, win, d.getElementById('screen-results'), h.PROFILES);
    win.close();
  }

  // ---------- 8. the share text and the colour cards' framing line ----------
  {
    const lines = [];
    for (const [mode, appeal] of [['plain', null], ['player', 'SULTAI'], ['workplace', 'SULTAI']]) {
      const { win, h } = await renderResult({ id: 'DIMIR', confidence: 'HIGH', act: DIMIR_ACT, r3: DIMIR_R3, mode });
      if (appeal) { win.document.querySelector(`#next-door-chips .mc-nextdoor__chip[data-id="${appeal}"]`).click(); win.document.getElementById('appeal-btn').click(); }
      lines.push(win.shareDareText());
      win.close();
    }
    const { win, h } = await page();
    const problems = lines.flatMap((x) => problemsIn(x, { PROFILES: h.PROFILES, questions: true }).map((p) => `${p} in "${x}"`));
    ok('share text: plain in every mode, after an appeal too',
      problems.length === 0 && lines.join(' | ') === "I'm Dimir. What are you? | I'm Sultai (on appeal). What are you? | I'm Dimir. What are you?",
      problems.join(' | ') || lines.join(' | '));
    win.close();
  }
  {
    const { win, h } = await renderResult({ id: 'DIMIR', confidence: 'HIGH', act: DIMIR_ACT, r3: DIMIR_R3, mode: 'plain' });
    const sub = (win.document.querySelector('#relations-detail .mc-relations-detail__sub') || {}).textContent || '';
    ok('Working With Others: the line over the colour cards is plain', !!sub && problemsIn(sub, { PROFILES: h.PROFILES }).length === 0, sub);
    win.close();
  }

  // ---------- 9. the line under the label, the commander and the colleague cards, all 31 ----------
  // The line from confidenceLine on bars of every shape it has words for (a
  // colour outside the result printed above one in it, level, under an
  // answer, about one, one or two, two or three, well clear) under each
  // label; then every identity rendered for real in plain and player modes:
  // the line on the page, the commander block (no card text in plain mode),
  // the colleague cards and the legend; then the explorer's cards for all 31.
  // Bars: the result's colours from 75 down by two, the nearest colour
  // outside them `gap` below the lowest, the rest near 10; five colours from
  // 60, spread over `gap`.
  const barsFor = (colours, gap) => {
    const act = {};
    const out = ['W', 'U', 'B', 'R', 'G'].filter((c) => !colours.includes(c));
    if (!out.length) { colours.forEach((c, i) => { act[c] = 0.6 - (gap / 4) * i; }); return act; }
    colours.forEach((c, i) => { act[c] = 0.75 - 0.02 * i; });
    out.forEach((c, i) => { act[c] = i === 0 ? 0.75 - 0.02 * (colours.length - 1) - gap : 0.12 - 0.01 * i; });
    return act;
  };
  {
    const { win, h, errors } = await page();
    const P = h.PROFILES, R = h.RESULT_COPY;
    const issues = [], lines = new Set();
    for (const id of Object.keys(P)) {
      for (const gap of [-0.05, 0, 0.02, 0.06, 0.12, 0.2, 0.4]) {
        const act = barsFor(P[id].colors, gap);
        for (const level of ['HIGH', 'MODERATE', 'LOW']) {
          const line = win.confidenceLine(id, act, level);
          lines.add(line);
          const where = `${id} ${level} gap ${gap}`;
          issues.push(...lineProblems(line, id, act, P, R.names[id]).map((p) => `${where}: ${p} in "${line}"`));
          issues.push(...problemsIn(line, { PROFILES: P }).map((p) => `${where}: ${p} in "${line}"`));
        }
      }
    }
    // A shared link with no bars names the identity instead.
    const bare = win.confidenceLine('DIMIR', { W: 0, U: 0, B: 0, R: 0, G: 0 }, 'MODERATE');
    issues.push(...lineProblems(bare, 'DIMIR', { W: 0, U: 0, B: 0, R: 0, G: 0 }, P, R.names.DIMIR).map((p) => `no bars: ${p} in "${bare}"`));
    ok(`the line under the label: one plain sentence that names this result's colours and is true to its bars (all 31, seven bar shapes, three labels: ${lines.size} lines)`,
      issues.length === 0 && errors.length === 0 && lines.size > 31, issues.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | '));
    win.close();
  }
  for (const [modeName, gaming] of [['plain', false], ['player', true]]) {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES, R = h.RESULT_COPY;
    h.selectAudience('consumer');
    const s = h.state;
    s.gamingFamiliar = gaming;
    const text = (sel) => ((d.querySelector(sel) || {}).textContent || '').replace(/\s+/g, ' ').trim();
    const shown = (sel) => !!d.querySelector(sel) && !hidden(win, d.querySelector(sel));
    const lineIssues = [], cmdIssues = [], gapIssues = [], legendIssues = [];
    for (const id of Object.keys(P)) {
      for (const gap of [0.06, 0.4]) {
        const act = barsFor(P[id].colors, gap);
        s.result = { identity: id, confidence: 'MODERATE', allResults: [], scoringVersion: 2, instrumentVersion: 4, round3Data: {} };
        s.activationSorted = sorted(act);
        s.responses = new Array(30).fill({ c: P[id].colors[0] });
        s.neitherCount = 1;
        s.qualityFlags = CLEAN_FLAGS;
        s.disclaimerAcknowledged = true;
        h.showResults();
        const line = text('#conf-base-rate');
        if (line !== win.confidenceLine(id, act, 'MODERATE')) lineIssues.push(`${id}: the page shows "${line}"`);
        lineIssues.push(...lineProblems(line, id, act, P, R.names[id]).map((p) => `${id} gap ${gap}: ${p} in "${line}"`));
      }
      // The commander block: the card text in player mode, one plain line in its place otherwise.
      const desc = text('#cmd-desc-aside'), title = text('#cmd-title-aside');
      const want = gaming ? P[id].cmdDesc : R.commander.plain.replace('{identity}', R.names[id]);
      if (desc !== want || title !== (gaming ? 'Commander' : 'Your card') || text('#cmd-name-aside') !== P[id].cmd) cmdIssues.push(`${id}: "${title}" / "${desc}"`);
      if (!gaming && /\b(?:mana|graveyard|battlefield|creature|library|token|counter|upkeep|combat)\b/i.test(desc + ' ' + text('#res-idcard'))) cmdIssues.push(`${id}: card words in plain mode`);
      // The colleague cards: one per missing colour, each saying what they bring and when to bring them in.
      const missing = ['W', 'U', 'B', 'R', 'G'].filter((c) => !P[id].colors.includes(c));
      const cards = [...d.querySelectorAll('#relations-detail .mc-gap-card')];
      const filled = cards.every((card) => (card.querySelector('.mc-gap-card__gap') || {}).textContent.trim()
        && (card.querySelector('.mc-gap-card__complement') || {}).textContent.replace('→', '').trim());
      if (cards.length !== missing.length || !filled) gapIssues.push(`${id}: ${cards.length} cards for ${missing.length} colours`);
      for (const b of visibleBlocks(win, d.getElementById('relations-detail'), { exclude: [] })) {
        gapIssues.push(...gapProblems(b).map((p) => `${id}: ${p}`), ...contentProblems(b, { PROFILES: P }).map((p) => `${id}: ${p}`));
      }
      // The legend names only the kinds of line the diagram draws.
      const ally = !!d.querySelector('#screen-results .rel-edge-ally.is-lit-ally'), enemy = !!d.querySelector('#screen-results .rel-edge-enemy.is-lit-enemy');
      if (shown('#rel-legend-ally') !== ally || shown('#rel-legend-enemy') !== enemy) legendIssues.push(`${id}: legend ally ${shown('#rel-legend-ally')}/${ally}, enemy ${shown('#rel-legend-enemy')}/${enemy}`);
      legendIssues.push(...gapProblems(text('.mc-relations-legend')).map((p) => `${id} legend: ${p}`));
    }
    const sw = [text('#theme-switch-label'), text('.mc-theme-switch__note')];
    if (sw[0] === 'Table' || /keeps the colours hidden until your result/.test(sw[1])) legendIssues.push(`theme switcher "${sw.join(' / ')}"`);
    ok(`result (${modeName}): the line under the label is confidenceLine's, true to the bars, for all 31`, lineIssues.length === 0 && errors.length === 0,
      lineIssues.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | '));
    ok(`result (${modeName}): the commander block is ${gaming ? 'the card text' : 'the card\'s name and one plain line, no card text'}, for all 31`, cmdIssues.length === 0, cmdIssues.slice(0, 4).join(' | '));
    ok(`result (${modeName}): the colleague cards say what each missing colour brings and when to bring it in, with none of the traits readers caught and no sentence on "You", for all 31`,
      gapIssues.length === 0, gapIssues.slice(0, 4).join(' | '));
    ok(`result (${modeName}): the legend names only the lines drawn, and the theme switcher reads on its own`, legendIssues.length === 0, legendIssues.slice(0, 4).join(' | '));
    win.close();
  }
  for (const audience of ['consumer', 'workplace']) {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES;
    h.selectAudience(audience);
    win.showExplorer();
    const issues = [];
    for (const id of Object.keys(P)) {
      win.showDetail(id);
      const detail = d.getElementById('explorer-relations-detail');
      const cards = detail.querySelectorAll('.mc-gap-card').length;
      if (cards !== 5 - P[id].colors.length) issues.push(`${id}: ${cards} cards`);
      for (const b of visibleBlocks(win, detail, { exclude: [] })) issues.push(...gapProblems(b).map((p) => `${id}: ${p}`));
    }
    ok(`explorer (${audience}): the colleague cards for all 31 carry none of the traits readers caught`, issues.length === 0 && errors.length === 0,
      issues.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | '));
    win.close();
  }

  // ---------- 10. the identity's own content on the result screen, all 31 ----------
  // Player mode, so the card (typeline, rules text, collector number) and the
  // mana base show too. One page, re-rendered for each identity, its own
  // colours lit and the rest well short.
  const actFor = (colours, gap = 0.4) => {
    const act = {};
    const out = ['W', 'U', 'B', 'R', 'G'].filter((c) => !colours.includes(c));
    colours.forEach((c, i) => { act[c] = 0.75 - 0.02 * i; });
    out.forEach((c, i) => { act[c] = i === 0 ? 0.75 - 0.02 * (colours.length - 1) - gap : 0.12 - 0.01 * i; });
    return act;
  };
  // The colours of the identities sections 14 and 15 render.
  const COLOURS = { 'MONO-W': ['W'], 'MONO-U': ['U'], DIMIR: ['U', 'B'], ESPER: ['W', 'U', 'B'], WITCH: ['W', 'U', 'B', 'G'],
    GLINT: ['U', 'B', 'R', 'G'], WUBRG: ['W', 'U', 'B', 'R', 'G'] };
  {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES;
    h.selectAudience('consumer');
    const s = h.state;
    s.gamingFamiliar = true;
    const PARTS = ['#res-tag', '#res-banner-commander', '#res-rules', '#res-collector', '#identity-exp', '#strengths', '#weaknesses',
      '#res-counter-section', '#roles', '#cmd-name-aside', '#cmd-desc-aside', '#res-mana-base', '#relations-detail'];
    const problems = [], typelines = [];
    let parts = 0;
    for (const id of Object.keys(P)) {
      s.result = { identity: id, confidence: 'MODERATE', allResults: [], scoringVersion: 2, instrumentVersion: 4, round3Data: {} };
      s.activationSorted = sorted(actFor(P[id].colors));
      s.responses = new Array(30).fill({ c: P[id].colors[0] });
      s.neitherCount = 1;
      s.qualityFlags = CLEAN_FLAGS;
      s.disclaimerAcknowledged = true;
      h.showResults();
      const shown = PARTS.map((sel) => d.querySelector(sel)).filter((el) => el && !hidden(win, el));
      parts += shown.length;
      problems.push(...contentIssues(`result: ${id}`, shown.flatMap((el) => visibleBlocks(win, el, { exclude: [] })), P));
      typelines.push([id, d.getElementById('res-typeline').textContent]);
    }
    ok('result: every identity\'s profile blocks, card, commander, mana base and colour cards are plain (all 31, player mode)',
      parts === 31 * PARTS.length && problems.length === 0 && errors.length === 0,
      `${parts} of ${31 * PARTS.length} parts shown; ` + (problems.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | ')));
    const badType = typelines.filter(([, line]) => !TYPE_LINE.test(line));
    ok('result: the card\'s typeline is the commander\'s printed type line, its dash the only one on the card (all 31)',
      typelines.length === 31 && badType.length === 0, badType.map(([id, line]) => `${id} "${line}"`).join(' | '));
    // Every mana base line, with the up neighbour one answer, a few answers and well short.
    const lines = Object.keys(P).flatMap((id) => [0.05, 0.15, 0.4].map((gap) => h.manaBaseLine(id, actFor(P[id].colors, gap))));
    const manaProblems = contentIssues('mana base', [...new Set(lines)], P);
    ok('result: every mana base line is plain (all 31, a maybeboard line or not)', lines.length === 93 && lines.every(Boolean) && manaProblems.length === 0,
      manaProblems.slice(0, 4).join(' | '));
    win.close();
  }

  // ---------- 11. the explorer: the grid and all 31 details, in both audiences ----------
  for (const audience of ['consumer', 'workplace']) {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES;
    h.selectAudience(audience);
    win.showExplorer();
    const problems = contentIssues(`explorer (${audience})`, visibleBlocks(win, d.getElementById('screen-explorer'), { exclude: ['#detail-panel'] }), P);
    let details = 0;
    for (const id of Object.keys(P)) {
      win.showDetail(id);
      const blocks = visibleBlocks(win, d.getElementById('detail-panel'), { exclude: [] });
      if (blocks.includes(P[id].tag)) details++;
      problems.push(...contentIssues(`explorer: ${id} (${audience})`, blocks, P));
    }
    ok(`explorer: the grid and all 31 details are plain (${audience})`, details === 31 && problems.length === 0 && errors.length === 0,
      `${details} details; ` + (problems.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | ')));
    win.close();
  }

  // ---------- 12. the dossier: all five tabs, all 31 identities ----------
  {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES;
    const problems = [];
    let tabs = 0;
    for (const id of Object.keys(P)) {
      win.openModal(id);
      d.querySelectorAll('#modal-body .tab-content').forEach((tab) => { tab.classList.remove('hidden'); tabs++; });
      problems.push(...contentIssues(`dossier: ${id}`, visibleBlocks(win, d.getElementById('modal-header'), { exclude: [] }), P));
      problems.push(...contentIssues(`dossier: ${id}`, visibleBlocks(win, d.getElementById('modal-body'), { exclude: [] }), P, { codes: true }));
      win.closeModal();
    }
    ok('dossier: all five tabs for all 31 identities are plain, with no identity code in capitals in its sentences',
      tabs === 31 * 5 && problems.length === 0 && errors.length === 0, problems.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | '));
    win.close();
  }

  // ---------- 13. the methodology and full breakdown ----------
  // Opened as "View Full Breakdown" opens it, the breakdown expanded, the
  // commander card turned over and the Round 2 and Round 3 sections shown; one
  // to five colours, a primary colour, both spreads, four and eight Neithers,
  // and the Round 3 line under both engines. The card's rules text is quoted
  // from the card and left out.
  const BREAKDOWN = [
    { id: 'MONO-R', act: { R: 0.86, B: 0.52, G: 0.44, W: 0.21, U: 0.12 }, neither: 1, engine: 2, what: 'one colour, a wide spread' },
    { id: 'BOROS', act: { W: 0.85, R: 0.6, U: 0.3, B: 0.25, G: 0.2 }, neither: 5, engine: 2, what: 'two colours, a primary colour, four Neithers' },
    { id: 'DIMIR', act: DIMIR_ACT, neither: 1, engine: 1, what: 'two colours, engine 1' },
    { id: 'ESPER', act: { U: 0.7, B: 0.66, W: 0.62, G: 0.2, R: 0.1 }, neither: 1, engine: 2, what: 'three colours' },
    { id: 'GLINT', act: { U: 0.66, B: 0.63, R: 0.6, G: 0.58, W: 0.2 }, neither: 9, engine: 2, what: 'four colours, eight Neithers' },
    { id: 'WUBRG', act: { W: 0.55, U: 0.53, B: 0.52, R: 0.5, G: 0.49 }, neither: 1, engine: 1, what: 'five colours, a narrow spread, engine 1' },
  ];
  {
    const problems = [], seen = [];
    for (const b of BREAKDOWN) {
      const { win, h, errors } = await renderResult({ id: b.id, confidence: 'MODERATE', act: b.act, r3: DIMIR_R3, mode: 'player' }, { engine: b.engine });
      const d = win.document, s = h.state;
      s.neitherCount = b.neither;
      s.refinementAnswers = new Array(9).fill({ choice: h.PROFILES[b.id].colors[0] });
      s.refinementPairwise = { 'W-U': { W: 2, U: 1 }, 'B-R': { B: 1, R: 2 }, 'G-W': { G: 2, W: 1 } };
      h.showResults();
      d.getElementById('legacy-detail').classList.remove('hidden');
      d.getElementById('unified-breakdown').style.display = 'block';
      ['round2-unified-section', 'round3-unified-section'].forEach((id) => d.getElementById(id).classList.remove('hidden'));
      d.getElementById('cmd-card-frame').style.display = 'block';
      const blocks = visibleBlocks(win, d.getElementById('legacy-detail'), { exclude: ['#cmd-oracle-text', '#cmd-pt', '#cmd-cost'] });
      seen.push(...blocks);
      problems.push(...contentIssues(`breakdown: ${b.what}`, blocks, h.PROFILES, { scoring: false }), ...errors);
      win.close();
    }
    const has = (pattern) => seen.some((x) => pattern.test(x));
    ok('methodology and full breakdown: plain under every state, Round 2 and Round 3 included',
      problems.length === 0 && has(/^White is your primary colour within this combination, 25 points above the next\.$/)
        && has(/^Round 1 tested only enemy pairs/) && has(/finished with the best record/) && has(/won on the weight of all your answers/)
        && has(/Neither" on 9 of 30 questions/) && has(/Four- and five-colour results are the hardest to pin down/),
      problems.slice(0, 4).join(' | ') || 'a state did not show');
  }

  // ---------- 14. the colour-interactions screen, with and without a result ----------
  {
    const problems = [];
    for (const id of [null, 'MONO-W', 'DIMIR', 'ESPER', 'GLINT', 'WUBRG']) {
      const p = id ? await renderResult({ id, confidence: 'HIGH', act: actFor(COLOURS[id]), r3: {}, mode: 'plain' }) : await page();
      p.win.showInteractions();
      problems.push(...contentIssues(`colour interactions (${id || 'no result'})`, visibleBlocks(p.win, p.win.document.getElementById('screen-interactions'), { exclude: [] }), p.h.PROFILES), ...p.errors);
      p.win.close();
    }
    ok('colour interactions: plain, on its own and personalised for one to five colours', problems.length === 0, problems.slice(0, 4).join(' | '));
  }

  // ---------- 15. the share studio: Card, Scorecard and Story ----------
  // The Card's keyword over each rules line ("Vigilance") is a heading on its
  // own line and is read separately from the line under it.
  const SHARE_EXCLUDE = ['#tcg-rules strong'];
  {
    const problems = [], typelines = [];
    for (const [mode, id] of [['player', 'DIMIR'], ['plain', 'WITCH'], ['workplace', 'MONO-U']]) {
      const { win, h, errors } = await renderResult({ id, confidence: 'HIGH', act: actFor(COLOURS[id]), r3: DIMIR_R3, mode });
      win.showShareScreen();
      for (const fmt of ['card', 'scorecard', 'story']) {
        win.selectShareFormat(fmt);
        problems.push(...contentIssues(`share studio: ${fmt} (${mode})`, visibleBlocks(win, win.document.getElementById('screen-share'), { exclude: SHARE_EXCLUDE }), h.PROFILES));
      }
      problems.push(...Object.values(h.FORMAT_HINTS).flatMap((x) => contentProblems(x.replace(/<[^>]+>/g, ''), { PROFILES: h.PROFILES }).map((q) => `hint: ${q}`)), ...errors);
      typelines.push(win.document.querySelector('#share-tcg .mc-tcg__typeline span').textContent.replace(/\s+/g, ' ').trim());
      win.close();
    }
    ok('share studio: the three formats and their hints are plain in every mode', problems.length === 0, problems.slice(0, 4).join(' | '));
    ok('share studio: the Card\'s typeline reads "Personality · Name", as the result page does',
      typelines.join(' | ') === 'Personality · Dimir | Personality · Four-colour (no red) | Personality · Mono-Blue', typelines.join(' | '));
  }
  {
    // Every identity in all three formats, its runner-up a four-colour identity.
    const { win, h, errors } = await renderResult({ id: 'DIMIR', confidence: 'HIGH', act: DIMIR_ACT, r3: { ...DIMIR_R3, runnerUp: { id: 'WITCH', wins: 2, losses: 1 } }, mode: 'player' });
    const problems = [];
    for (const id of Object.keys(h.PROFILES)) {
      h.state.result.identity = id;
      win.showShareScreen();
      for (const fmt of ['card', 'scorecard', 'story']) {
        win.selectShareFormat(fmt);
        problems.push(...contentIssues(`share studio: ${id} ${fmt}`, visibleBlocks(win, win.document.getElementById('screen-share'), { exclude: SHARE_EXCLUDE }), h.PROFILES));
      }
    }
    const closest = win.document.getElementById('sc-closest').textContent;
    ok('share studio: all 31 identities are plain in all three formats, and "Closest" names the runner-up as the result page does',
      problems.length === 0 && errors.length === 0 && closest === 'Four-colour (no red)', `Closest "${closest}"; ` + (problems.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | ')));
    win.close();
  }

  // ---------- 16. rhythm: the 31 profiles as rendered ----------
  // Each identity's result screen in player mode for a consumer (so the card
  // and the banter show): the tagline, philosophy, strengths, shadows, banter,
  // roles and commander description as the page writes them; then its
  // description, which the explorer shows. Eight passages for each of 31.
  {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES;
    h.selectAudience('consumer');
    const s = h.state;
    s.gamingFamiliar = true;
    const text = (sel) => ((d.querySelector(sel) || {}).textContent || '').replace(/\s+/g, ' ').trim();
    const lines = (sel) => [...d.querySelectorAll(sel)].map((el) => el.textContent.replace(/\s+/g, ' ').trim());
    const passages = [];
    for (const id of Object.keys(P)) {
      s.result = { identity: id, confidence: 'MODERATE', allResults: [], scoringVersion: 2, instrumentVersion: 4, round3Data: {} };
      s.activationSorted = sorted(actFor(P[id].colors));
      s.responses = new Array(30).fill({ c: P[id].colors[0] });
      s.neitherCount = 1;
      s.qualityFlags = CLEAN_FLAGS;
      s.disclaimerAcknowledged = true;
      h.showResults();
      passages.push(
        { id, part: 'tagline', items: [text('#res-tag')], prose: false },
        { id, part: 'philosophy', items: [text('#identity-exp')] },
        { id, part: 'strengths', items: lines('#strengths li'), list: true },
        { id, part: 'shadows', items: lines('#weaknesses li'), list: true },
        { id, part: 'banter', items: [text('#res-counter')] },
        { id, part: 'roles', items: [text('#roles')], prose: false },
        { id, part: 'commander description', items: [text('#cmd-desc-aside')] },
      );
    }
    win.showExplorer();
    for (const id of Object.keys(P)) {
      win.showDetail(id);
      passages.push({ id, part: 'description', items: [text('#detail-desc')] });
    }
    dump('rhythm: the 31 profiles', passages.map((x) => `${x.id} ${x.part}: ${x.items.join(' || ')}`));
    const unread = passages.filter((x) => !x.items.length || x.items.some((i) => !i)).map((x) => `${x.id} ${x.part}`);
    ok('rhythm: all eight passages of all 31 profiles are read as rendered',
      passages.length === 31 * 8 && unread.length === 0 && errors.length === 0, `${passages.length} passages; empty: ${unread.join(', ')} ${errors.slice(0, 2).join(' | ')}`);
    const found = passages.flatMap(rhythmProblems);
    t.note('rhythm, problems per rule: ' + RHYTHM_RULES.map(([rule]) => `${rule} ${found.filter((f) => f.rule === rule).length}`).join(', '));
    for (const [rule, label] of RHYTHM_RULES) {
      const hits = found.filter((f) => f.rule === rule);
      ok(`rhythm: ${label} (all 31 profiles)`, hits.length === 0, `${hits.length} found: ` + hits.slice(0, 4).map((f) => `${f.at}: ${f.detail}`).join(' | '));
    }
    // A kept list is still in the text it was kept for, and a colour list has
    // three items or more, and no more than the identity has colours.
    const textOf = (id) => passages.filter((x) => x.id === id).flatMap((x) => x.items).join(' ');
    const stale = [...Object.entries(COLOUR_LISTS), ...Object.entries(CARD_MODES)]
      .flatMap(([id, ls]) => ls.filter((l) => !P[id] || !textOf(id).includes(l)).map((l) => `${id}: "${l}"`));
    const miscounted = Object.entries(COLOUR_LISTS)
      .flatMap(([id, ls]) => ls.filter((l) => P[id] && (listItems(l).length < 3 || listItems(l).length > P[id].colors.length)).map((l) => `${id}: "${l}"`));
    ok('rhythm: every list kept is in its profile, and each colour list has three items to as many as the identity has colours',
      stale.length === 0 && miscounted.length === 0, [...stale.map((x) => 'not found ' + x), ...miscounted.map((x) => 'miscounted ' + x)].join(' | '));
    win.close();
  }

  // ---------- 17. the checkers themselves ----------
  {
    const { win, h } = await page();
    const P = h.PROFILES;
    const phone = "Your final-round preferences formed a loop (IZZET beat WUBRG beat MONO-U, who beat IZZET), so the scenarios couldn't decide this. Your item answers — the mana pool below — broke the loop instead. Treat this as a soft read. Your secondary lean: IZZET. Another caveat: Round 1 and Round 2 disagreed about Blue — you chose it against its enemies but not against its allies, or the other way round. Treat the margins as softer than they look.";
    const found = problemsIn(phone, { PROFILES: P }).join(' | ');
    const flags = ['em dash', '"loop"', '"final-round"', '"item answers"', '"treat this as"', '"soft read"', '"secondary lean"', '"caveat"',
      '"disagreed"', '"margin"', '"softer than they look"', '"round 1 and round 2"', 'identity code "IZZET"', 'words: "Another caveat'];
    ok('the checker flags the paragraph a player saw on a phone, on every count', flags.every((f) => found.includes(f)), found);
    const samples = [
      ['We know who they are. You don\'t. That\'s the game.', '"we know who they are"'],
      ['Four suspects remain.', '"suspect"'],
      ['Not quite you? Look next door.', 'question mark'],
      ['Link copied!', 'exclamation mark'],
      ['The result isn\'t a verdict, it\'s a snapshot.', '"not X, it\'s Y"'],
      ['Your favorite color, analyzed.', 'US spelling'],
      ['You are near the border with MONO-BLUE.', 'identity code "MONO-BLUE"'],
      ['Ages 6–12 and a range – used as a dash.', 'en dash used as a dash'],
      ['About {n} questions.', 'unfilled placeholder'],
      ['This genuinely, actually, simply, truly helps.', '"genuinely"'],
    ];
    const missed = samples.filter(([text, flag]) => !problemsIn(text, { PROFILES: P }).join(' | ').includes(flag)).map(([text]) => text);
    ok('the checker flags each rule on a made-up line', missed.length === 0, missed.join(' | '));
    const clean = ['The nearest colour outside yours was green, one or two answers behind black.', "Four results are still in the running. You'll compare them two at a time.",
      'Ages 6–12.', 'Colour, colours, coloured.', 'Do not use this for hiring, firing or any other decision about a person.'];
    const flagged = clean.filter((x) => problemsIn(x, { PROFILES: P }).length).map((x) => `${x}: ${problemsIn(x, { PROFILES: P })}`);
    ok('the checker passes plain lines (an en dash in a range, British spellings, a long list in one short sentence)', flagged.length === 0, flagged.join(' | '));

    // The content checker (sections 10 to 15), on lines the profiles and pages
    // carried before this rule, and on made-up ones.
    const contentSamples = [
      ['Will hold a team together past the point most people would have given up — and sometimes past the point they should have.', 'em dash'],
      ['Treats being wrong as new information, not a personal injury. Genuinely. Not performatively.', '"genuinely"'],
      ["Always 'well, actually' before any decision. Can we just decide already?", 'question mark outside a quotation'],
      ['Your strongest colors are: White and Blue.', 'US spelling "color"'],
      ['Rules are for suckers. Has done the math.', 'US spelling "math"'],
      ['The rules are the rules -- can tend to adapt slowly.', 'double hyphen used as a dash'],
      ["Power isn't evil, it's the ability to shape the world.", '"not X, it\'s Y"'],
      ['They were the real reason it worked.', '"the real"'],
      ['Your item answers broke the loop.', '"loop"'],
      ['When MONO-WHITE is stressed, watch for:', 'identity code "MONO-WHITE"'],
      ["In three weeks you'll come back with a thoroughly argued treatise explaining how you were right all along and we'll all know it but the world will have moved on.", '30 words'],
      ['{Colour} made the cut by {n} answers.', 'unfilled placeholder'],
    ];
    const contentMissed = contentSamples.filter(([text, flag]) => !contentProblems(text, { PROFILES: P, codes: true }).join(' | ').includes(flag)).map(([text]) => text);
    ok('the content checker flags each rule on a line the pages carried before, or a made-up one', contentMissed.length === 0, contentMissed.join(' | '));
    const contentClean = [
      ['Treats "is this okay?" as a question for someone else\'s department.', {}],
      ['Your White and Blue spells cost {1} less; opponents\' spells cost {1} more.', {}],
      ['Whenever Alesha attacks, pay {W/B}{W/B}: return a creature card with power 2 or less from graveyard, tapped and attacking.', {}],
      ['FOUR-COLOR (No Red)', {}],
      ['Round 1 tested only enemy pairs, colours that oppose each other.', { scoring: false }],
      ['One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five.', {}],
    ];
    const contentFlagged = contentClean.map(([x, opts]) => [x, contentProblems(x, { PROFILES: P, ...opts })])
      .filter(([, found]) => found.length).map(([x, found]) => `${x}: ${found}`);
    ok('the content checker passes a quoted question, mana symbols, an identity name, the methodology\'s own words and a 25-word sentence',
      contentFlagged.length === 0 && TYPE_LINE.test('Legendary Creature — Human Ninja') && !TYPE_LINE.test('Personality — Dimir'), contentFlagged.join(' | '));

    // The rhythm checker (section 16), on passages the profiles carried before
    // it, and on made-up ones.
    const rulesOf = (passage) => rhythmProblems(passage).map((f) => f.rule);
    const rhythmSamples = [
      [{ id: 'MONO-U', part: 'philosophy', items: ["You believe most decisions get better with more information. You read the whole document, sometimes twice. You ask the third question that nobody else thought to ask. You'd rather be the last person to commit than the first one to be wrong."] }, ['openings', 'antithesis']],
      [{ id: 'GOLGARI', part: 'philosophy', items: ["You believe nothing is wasted. What dies feeds what comes next. Failure teaches; success teaches differently. The cycle continues whether you act or don't."] }, ['short']],
      [{ id: 'BANT', part: 'shadows', list: true, items: ['Can prioritise team cohesion and accuracy over results.', 'Believes a well-run process can prevent conflict.', 'Can struggle in a crisis, or when things are needed fast and no good option exists.', 'Can mistake "the data supports it and we agreed" for "this is going to work".', 'Can struggle to have difficult conversations.'] }, ['openings']],
      [{ id: 'GLINT', part: 'strengths', list: true, items: ['Treats new constraints as features of the terrain rather than moral statements, and routes around them.', 'Knows which rules can be broken, by whom, and at what cost.'] }, ['antithesis', 'lists']],
      [{ id: 'MARDU', part: 'strengths', list: true, items: ['The bigger the stakes, the calmer the voice.'] }, ['antithesis']],
      [{ id: 'ABZAN', part: 'commander description', items: ['Costs {1} less for each creature card in your graveyard. May cast a creature from graveyard each turn. Karador gets cheaper, and more capable, the more history you have.'] }, ['antithesis']],
      [{ id: 'TEMUR', part: 'commander description', items: ["Can't be countered. Your creatures can't be countered. Your other creatures have trample. Once you've committed to the play, nothing stops it landing."] }, ['short']],
      [{ id: 'MONO-G', part: 'commander description', items: ["Omnath doesn't lose green mana as steps and phases end, and grows +1/+1 for each unspent green mana you have. The card rewards patience and accumulation."] }, ['closers']],
      [{ id: 'BANT', part: 'philosophy', items: ["You believe civilisation, knowledge, and patience all matter, and that most people pick one and pretend the other two are nice-to-haves. The trade-off is time. You've decided the time is worth it."] }, ['closers']],
      [{ id: 'GLINT', part: 'description', items: ['You combine intelligence, ambition, urgency and adaptability, without the group-level loyalty that would keep you inside the lines. The team finds you brilliant and untrustworthy in roughly equal measure.'] }, ['lists', 'closers']],
      [{ id: 'X', part: 'banter', items: ['Treats being wrong as new information, not a personal injury. Is that fair? It was the real reason — genuinely.'] }, ['antithesis', 'banned']],
    ];
    const rhythmMissed = rhythmSamples.filter(([x, want]) => !want.every((r) => rulesOf(x).includes(r))).map(([x, want]) => `${x.id} ${x.part}: wanted ${want}, got ${rulesOf(x)}`);
    ok('the rhythm checker flags each rule on a profile\'s old passage or a made-up one', rhythmMissed.length === 0, rhythmMissed.join(' | '));
    const rhythmClean = [
      // two sentences in a row on the same word, and two short ones
      { id: 'X', part: 'philosophy', items: ['You believe every approach has its place. You read the situation first and pick the approach that fits it.'] },
      { id: 'X', part: 'commander description', items: ['Your creatures have haste. Tap: untap another creature.'] },
      // a lead-in breaks a run of short sentences
      { id: 'X', part: 'banter', items: ['You treat quarterly planning like D-Day. Months on, the intensity is exhausting. Relax for one minute and stop talking.'] },
      // an identity's own colours, and a card's modes
      { id: 'BANT', part: 'philosophy', items: ['You believe civilisation, knowledge, and patience all matter.'] },
      { id: 'YORE', part: 'commander description', items: ['When Breya enters, create two 1/1 thopter tokens. Then pay {2} and sacrifice two artifacts for various effects: 3 damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life.'] },
      // "but" far from a negative is no antithesis; a list of jobs is no rhythm
      { id: 'X', part: 'shadows', list: true, items: ["Treats people who haven't put in their hours as a regrettable but tolerable feature of the workplace.", 'Adapts slowly, and is surprised when the world has changed.', 'Will apply the letter of a rule in an emergency it was never written for.'] },
      { id: 'X', part: 'roles', prose: false, items: ['Strategy, Research, Analytics, Architecture, Policy Analysis, Forecasting'] },
    ];
    const rhythmFlagged = rhythmClean.filter((x) => rulesOf(x).length).map((x) => `${x.id} ${x.part}: ${rhythmProblems(x).map((f) => f.detail).join('; ')}`);
    ok('the rhythm checker passes two openings or two short sentences in a row, a lead-in, an identity\'s colours, a card\'s modes and a list of jobs',
      rhythmFlagged.length === 0, rhythmFlagged.join(' | '));

    // The line checker (sections 6 and 9), on Dimir's bars (blue 78, black 64,
    // green 31: black well clear of green), and on a close pair.
    const dimir = { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 }, close = { U: 0.7, B: 0.6, G: 0.5, W: 0.2, R: 0.1 };
    const lineSamples = [
      ['Fairly clear. Your nearest neighbour is next door.', dimir, ['2 sentences', 'an old line', 'names no colour']],
      ['Blue was 14 points ahead of black.', dimir, ['a number']],
      ['Red and white were well behind your colours.', dimir, ['names no colour']],
      ['The nearest colour outside yours was green, well behind black.', close, ['"well" for']],
      ['Green tied with black, the lower of your two colours.', close, ['"level" for']],
      ['The nearest colour outside yours was green, about one answer behind black.', dimir, ['"about one answer" for']],
    ];
    const lineMissed = lineSamples.filter(([line, act, want]) => !want.every((w) => lineProblems(line, 'DIMIR', act, P, 'Dimir').join(' | ').includes(w)))
      .map(([line, act]) => `${line}: ${lineProblems(line, 'DIMIR', act, P, 'Dimir')}`);
    ok('the line checker flags an old line, a number, no colour of the result, and a gap the bars do not show', lineMissed.length === 0, lineMissed.join(' | '));
    const lineClean = [
      ['Blue and black were well clear of the other three colours.', dimir],
      ['The nearest colour outside yours was green, one or two answers behind black.', close],
      ['This link shows Dimir without the answers behind it.', { W: 0, U: 0, B: 0, R: 0, G: 0 }],
    ].filter(([line, act]) => lineProblems(line, 'DIMIR', act, P, 'Dimir').length).map(([line, act]) => `${line}: ${lineProblems(line, 'DIMIR', act, P, 'Dimir')}`);
    ok('the line checker passes a line true to its bars, and a bare link\'s line naming the identity', lineClean.length === 0, lineClean.join(' | '));

    // The colleague-card checker (section 9), on the paragraphs and labels
    // readers caught, and on the cards that replaced them.
    const gapSamples = [
      "You don't experience the team as something you owe care to. Decisions get made for you and the task.",
      'You move on instinct. You\'ll do the thing, then learn what the thing meant.',
      "Your team's institutional knowledge gets discarded as 'legacy' and has to be relearned the expensive way.",
      'A White colleague feels the temperature of the room as live data.',
      'Can create a psychologically safe space where people feel supported.',
      'Ally edge (within you) Tension to what you lack',
    ].filter((x) => !gapProblems(x).length);
    ok('the colleague-card checker flags the traits, jargon and labels readers caught', gapSamples.length === 0, gapSamples.join(' | '));
    const gapClean = ['Notices who a plan is unfair to, and who will quietly stop helping because of it. → Ask them before a plan reaches the people it affects.',
      'All five colours are in your result, so none is missing.'].filter((x) => gapProblems(x).length);
    ok('the colleague-card checker passes the cards that replaced them', gapClean.length === 0, gapClean.join(' | '));
    win.close();
  }
});
