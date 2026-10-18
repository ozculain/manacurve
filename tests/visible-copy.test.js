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
//   - a confidence block of more than the label and two sentences, more than
//     one quality line under it, or anything else between it and the bars.
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
// Jokes, tricolons and dramatic colons cannot be caught by a pattern; they
// are left to review. The checker itself is tested last, on the paragraph a
// player saw on a phone before this rule existed.
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
    // The confidence block: the label and its line (two sentences at most),
    // then at most one quality line, and nothing else before the bars.
    const label = R.labels[st.confidence];
    const block = visibleBlocks(win, d.querySelector('.mc-verdict-status'));
    const between = [];
    for (let n = d.querySelector('.mc-verdict-status').nextElementSibling; n && !n.contains(d.getElementById('res-bars-title')); n = n.nextElementSibling) {
      between.push(...visibleBlocks(win, n).map((b) => ({ id: n.id, b })));
    }
    const quality = between.filter((x) => x.id === 'quality-warning').map((x) => x.b);
    const others = between.filter((x) => x.id !== 'quality-warning');
    const wantQuality = st.quality ? [(R.quality || {})[st.quality]] : [];
    ok(`result: ${st.name}: the confidence block is "${label.word}" and its line, ${st.quality ? 'then the ' + st.quality + ' line' : 'with no quality line'}, and nothing else`,
      !threw && errors.length === 0 && JSON.stringify(block) === JSON.stringify([label.word, label.line])
        && sentences(block[1] || '').length <= 2 && JSON.stringify(quality) === JSON.stringify(wantQuality)
        && quality.every((q) => sentences(q).length <= 2) && others.length === 0 && !d.getElementById('conf-exp'),
      `${threw || errors[0] || ''} block=${JSON.stringify(block)} quality=${JSON.stringify(quality)} others=${JSON.stringify(others)}`);
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

  // ---------- 16. the checkers themselves ----------
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
    const clean = ['Fairly clear. Your nearest neighbour is next door.', "Four results are still in the running. You'll compare them two at a time.",
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
    win.close();
  }
});
