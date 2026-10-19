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
// a check fails when it carries a number that is not a gap in points, is one
// of the old lines every result printed, names none of the result's colours
// (or, with no bars, the identity), or says what the bars do not ("well"
// clear by 25 points or fewer, "level" for bars printed apart, "nearly made
// it in" more than 8 points off, a close gap left uncounted); on all 31
// identities, seven bar shapes and the three labels, and as rendered in plain
// and player modes. Its gaps, and next door's, are in points, the gap between
// the two bars as printed, never in answers (CHANGELOG, "Result screens: third
// naive-reader round": "within two answers" sat above bars 14 points apart).
// Section 9 also renders, for all 31 in plain and player modes (CHANGELOG,
// "Result screens: second naive-reader round" and the third): next door,
// whose rows are sentences ("Splash white and you're Selesnya." for players,
// "With white as well, you'd be Selesnya." for everyone else), the up row
// giving how far short the added colour was, the down row naming its colour
// as the weaker or weakest of yours ("the weaker of your two"), never "your
// lowest colour" or "made the cut", and saying how far it was ahead of the
// nearest colour outside only when the line under the label did not count
// the gap, five colours' one row saying only which colour was weakest; the
// commander block (player mode only, the banner crediting the art otherwise);
// the
// colleague cards under Working With Others, on the result and in the
// explorer: one per missing colour, each line on one identity's page only,
// none of the traits and jargon readers caught ("You move on instinct",
// "Decisions defer", "second-order consequences"), no sentence opening on
// "You", no opening word on more than six cards or twice on one page; a
// legend naming only the lines the diagram draws; the theme switcher as its
// label and three names; and the whole page: none of the lines the second
// and third readers flagged, the scoring version only in the methodology,
// and one Share.
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
// identity names (MONO-WHITE, FOUR-COLOUR (No Red)), the commander's printed
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
// above rhythmProblems. It also holds the voice across the 31 (above
// voiceProblems): no "we", "us" or "our", no strength or shadow opening on
// "You" or "The", no year written out, no joke shape ("the room", "quietly",
// acting while others are still at it, a closing line turning on ", and")
// or office prop (meetings, quarters, favours, emails, the fridge and cake,
// votes, a crisis, weekdays, "nobody", an X about the X) on more profiles
// than its limit, and a closing line on 22 profiles at most, each in a box
// labelled "Your friends would put it like this." (once "Pub banter"). Jokes,
// dramatic colons and a neat closing line in
// other words cannot be caught by a pattern; they are left to review. The
// checkers themselves are tested last, on the paragraph a player saw on a
// phone before these rules existed, on the profiles' old passages and on the
// pages the second and third readers saw.
// Since "Result pages in the second person" (CHANGELOG) a consumer result
// page prints each profile's `you` lines where Strengths and Shadows stood.
// Section 16 reads them from the result page and holds them to youProblems
// (two to four a page, no line opening like the one above it, no colour, no
// word from the game, Mono-Blue opening on the author's two lines) and to the
// voice rules ("you" in every line); it reads strengths and shadows from the
// explorer, which still prints them, as do the dossier and workplace mode.
// The author's two lines (AUTHOR_LINES) are read past by the dash and list
// rules, as an identity name is. Section 9 also fails a consumer page that
// prints a work heading or label ("Natural Roles", "White colleague" ...), one
// of the labels three fresh readers heard as a slide deck ("Locked in",
// "Who you need around you", "Make a picture", "Explore All 31 Types" ...)
// or whose disclaimer box does not open on the author's line; section 7 fails
// a consumer peek whose heading or appeal button is a "Label: value".
// Section 6 fails a workplace page, with the workings open, that prints one
// of the status words, headings or buttons its reader heard as an app or an
// HR form ("Locked in", "Natural Roles", "View Full Breakdown" ...).
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

// The author's own lines (CHANGELOG, "Result pages in the second person"):
// Mono-Blue's first two `you` lines, kept word for word. The second carries
// the one em dash a page may print and the first has a list in it; the
// checkers read past both, as they read past an identity name. Anywhere else
// an em dash still fails.
const AUTHOR_LINES = [
  'You like to understand a thing before you act, which is sensible, and to understand it completely, which is where the trouble starts.',
  "You're nearly always right — nearly always a little too late to be any use.",
];
// A block as the checkers read it: in an author's line the dash reads as a comma.
const pastAuthorLines = (text) => AUTHOR_LINES.reduce((t, line) => t.split(line).join(line.replace(' — ', ', ')), String(text));

// Identity codes in capitals: the PROFILES keys (MONO-U ... WUBRG), and the
// capitalised profile names a sentence could pick up (MONO-BLUE, FOUR-COLOUR ...).
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
// The identity names are data and are read past: FOUR-COLOUR (No Red) is a
// name, not an identity code in a sentence.
const WHEEL_WORDS = ['enemy pair', 'ally pair'];
const TYPE_LINE = /^Legendary (?:Artifact )?Creature — [A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
function contentProblems(text, { PROFILES, scoring = true, codes = false } = {}) {
  let t = pastAuthorLines(text);
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

// ---------- units (sections 6 and 9) ----------
// CHANGELOG, "Result screens: third naive-reader round". The bars print
// percentages, so a gap is said in points, the difference between two
// printed numbers ("5 points behind" above bars of 74% and 69%). The line
// under the label and next door once counted it in answers ("within two
// answers of each other" above bars 14 points apart), and readers called that
// a contradiction. A text fails when it counts in answers, gives a
// percentage, writes "1 points" or "5 point", or gives a number of points
// that is not the gap between the two bars it compares, as printed.
const ANSWER_COUNT = /\b(?:less than an|about one|an|one|two|three|four|\d+) answers?\b/i;
// The gaps a text gives in points: "5 points" is { n: 5, word: 'points' }.
const pointsIn = (text) => [...text.matchAll(/\b(\d+) (points?)\b/g)].map((m) => ({ n: Number(m[1]), word: m[2] }));
const badPointWords = (text) => pointsIn(text).filter(({ n, word }) => (n === 1) !== (word === 'point')).map(({ n, word }) => `"${n} ${word}"`);
// The two bars a line or a next-door row compares, as the page orders them:
// your lowest colour and the highest one outside it, or for five colours your
// highest and lowest; `gap` is the first printed number less the second.
function comparedBars(id, act, PROFILES) {
  const colours = PROFILES[id].colors;
  const bar = (c) => act[c] || 0;
  const shown = (c) => Math.round(bar(c) * 100);
  const byBar = (list) => [...list].sort((a, b) => (bar(b) - bar(a)) || ('WUBRG'.indexOf(a) - 'WUBRG'.indexOf(b)));
  const inside = byBar(colours);
  const outside = byBar(['W', 'U', 'B', 'R', 'G'].filter((c) => !colours.includes(c)));
  const [hi, lo] = outside.length ? [inside[inside.length - 1], outside[0]] : [inside[0], inside[inside.length - 1]];
  return { inside, outside, hi, lo, gap: shown(hi) - shown(lo) };
}
function unitProblems(texts, gap) {
  const out = [];
  for (const t of texts) {
    if (ANSWER_COUNT.test(t)) out.push(`counts in answers: "${t}"`);
    if (/%/.test(t)) out.push(`a percentage: "${t}"`);
    out.push(...badPointWords(t).map((w) => `${w} in "${t}"`));
    const bad = pointsIn(t).filter(({ n }) => n !== Math.abs(gap));
    if (bad.length) out.push(`"${t}" gives ${bad.map((b) => b.n).join(' and ')} points for bars ${Math.abs(gap)} points apart`);
  }
  return out;
}

// ---------- the line under the label (sections 6 and 9) ----------
// One sentence about this result's own bars (CHANGELOG, "Result screens
// rewritten from naive readers"), any gap in it in points (the unit rules
// above). It fails when it is empty, more than one sentence, carries a number
// that is not a gap in points or a gap the bars do not print, counts in
// answers, is one of the old lines every result printed ("Fairly clear. Your
// nearest neighbour is next door."), names no colour of the result (its own
// colours, the nearest one outside them, or for five colours "all five
// colours") and not the identity either, or says something the bars do not:
// "well" for a gap of three answers (25 points) or less, "level" or "tied" for
// bars that print apart, "nearly made it in" for more than one answer (8
// points), or a gap of 25 points or less left uncounted. One answer is a
// twelfth of a bar, as next door counts it.
const OLD_LABEL_LINES = ['A clear result.', 'Fairly clear. Your nearest neighbour is next door.',
  'Your answers were split between a few results. Have a look next door.'];
const COLOUR_WORD = { W: 'white', U: 'blue', B: 'black', R: 'red', G: 'green' };
function lineProblems(line, id, act, PROFILES, name) {
  const out = [];
  if (!line) return ['no line'];
  if (sentences(line).length !== 1) out.push(`${sentences(line).length} sentences`);
  if (/\d|%/.test(line.replace(/\b\d+ points?\b/g, ''))) out.push('a number that is not a gap in points');
  if (OLD_LABEL_LINES.includes(line)) out.push('an old line every result printed');
  const colours = PROFILES[id].colors;
  const { outside, gap } = comparedBars(id, act, PROFILES);
  const lower = line.toLowerCase();
  const named = [...colours, ...outside.slice(0, 1)].filter((c) => new RegExp(`\\b${COLOUR_WORD[c]}\\b`).test(lower));
  const allFive = colours.length === 5 && /\ball five colours\b/.test(lower);
  if (!named.length && !allFive && !(name && line.includes(name))) out.push('names no colour of this result');
  out.push(...unitProblems([line], gap));
  if (gap > 0 && gap <= 25 && !pointsIn(line).length) out.push(`a gap of ${gap} points left uncounted`);
  if (/\bwell\b/.test(lower) && !(gap > 25)) out.push(`"well" for a gap of ${gap} points`);
  if (/\b(?:level|tied)\b/.test(lower) && gap !== 0) out.push(`"level" for bars ${Math.abs(gap)} points apart`);
  if (/\bnearly made it in\b/.test(lower) && !(gap > 0 && gap <= 8)) out.push(`"nearly made it in" for a gap of ${gap} points`);
  return out;
}

// ---------- next door against the line under the label (section 9) ----------
// Plain mode says each row as a sentence, since "Add white: Selesnya." means
// nothing to someone who doesn't know the names; player mode says its
// headline as a sentence too ("Splash white and you're Selesnya.", where the
// colon headline "Splash white: Selesnya." stood). Each reason gives the gap
// the line under the label compares, in points (the unit rules above, held
// by unitProblems): a page once said "less than an answer behind" in the line
// and "one answer short" next door. The up row says how far short the added
// colour was. The down row names the colour it drops as the weaker or
// weakest of yours ("the weaker of your two", "the weakest of your three"):
// the third readers read "Blue was your lowest colour" beside a blue bar of
// 80% as the lowest of all five, and a fresh reader since heard "the lower of
// your two colours" as computed output. Beside a line that counted the gap,
// the down row does not count it again (the count once came three times on
// one page); beside a line that said only "well", it says how far its colour
// was ahead of the nearest one outside ("Blue was the weakest of your three,
// though still 40 points ahead of white."), where "Blue made the cut easily"
// stood and read, in the slot for the colour you would drop, as the
// opposite. Five colours have one row, which says only which colour was
// weakest ("Green only just made the cut" beside "Locked in" read as a
// contradiction), and their line says how closely all five finished. These
// are a consumer page's words (CHANGELOG, "Result pages: the labels below the
// profile"); workplace mode keeps the old ones, which tests/render.test.js
// holds.
const RANK = { 2: 'the weaker of your two', 3: 'the weakest of your three', 4: 'the weakest of your four', 5: 'the weakest of your five' };
const OLD_DOWN = /\byour lowest colour\b|\bmade the cut\b|\bmade it in\b|\beasily\b|\bonly just\b/i;
function doorProblems(rows, line, id, PROFILES, names, player) {
  const out = [];
  const n = PROFILES[id].colors.length;
  const want = n === 1 ? 'up' : n === 5 ? 'down' : 'up,down';
  if (rows.map((r) => r.dir).join() !== want) out.push(`rows ${rows.map((r) => r.dir).join()} for ${n} colours`);
  const lower = line.toLowerCase();
  const lineCounts = pointsIn(line).length > 0;
  for (const r of rows) {
    const head = player
      ? (r.dir === 'up' ? /^Splash (?:white|blue|black|red|green) and you're (.+)\.$/ : /^Cut the (?:Plains|Islands|Swamps|Mountains|Forests) and you're (.+)\.$/).exec(r.head)
      : (r.dir === 'up' ? /^With (?:white|blue|black|red|green) as well, you'd be (.+)\.$/ : /^Without (?:white|blue|black|red|green), you'd be (.+)\.$/).exec(r.head);
    if (!head || head[1] !== names[r.id]) out.push(`head "${r.head}"`);
    const why = r.why.toLowerCase();
    if (sentences(r.why).length !== 1) out.push(`reason "${r.why}" is not one sentence`);
    if (r.dir === 'down' && OLD_DOWN.test(r.why)) out.push(`the down row says "${r.why}"`);
    if (n === 5) {
      if (r.why.replace(/^\w+ /, '') !== `was ${RANK[5]}.` || !/^all five colours\b/.test(lower)) out.push(`five colours: "${line}" / "${r.why}"`);
      continue;
    }
    const tie = /\b(?:level|tied)\b/.test(lower), above = /\bedged ahead\b/.test(lower);
    if (tie !== /\btied\b/.test(why)) out.push(`"${line}" and "${r.why}" disagree about a tie`);
    if (above !== (r.dir === 'up' ? /\babove\b/ : /\bbelow\b/).test(why)) out.push(`"${line}" and "${r.why}" disagree about which was higher`);
    if (tie || above) continue;
    if (r.dir === 'up' && !/^(?:Your \w+|\w+) was \d+ points? short\.$/.test(r.why)) out.push(`the up row does not say how far short: "${r.why}"`);
    if (r.dir === 'down') {
      if (!r.why.includes(` was ${RANK[n]}`)) out.push(`the down row does not name its colour as ${RANK[n]}: "${r.why}"`);
      if (lineCounts && pointsIn(r.why).length) out.push(`the down row counts again: "${r.why}"`);
      if (!lineCounts && !/, though still \d+ points? ahead of (?:white|blue|black|red|green)\.$/.test(r.why)) out.push(`"${line}" gives no gap, and the down row does not say how far ahead: "${r.why}"`);
    }
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
// The cards are built differently from one another (CHANGELOG, "Result
// screens: third naive-reader round"): each colour's cards once opened the
// same way on every page ("Talk to them when ...", "Check with them before
// ..."), and readers comparing pages saw the template. No opening word is
// used on more than CARD_OPENINGS cards, nor twice on one page.
const CARD_OPENINGS = 6;
function cardOpeningProblems(cardsByPage) {
  const out = [];
  const first = (line) => (line.split(/\s+/)[0] || '').replace(/[^A-Za-z'’]/g, '').toLowerCase();
  const pages = {};
  for (const [id, lines] of Object.entries(cardsByPage)) {
    const seen = new Set();
    for (const line of lines) {
      const w = first(line);
      (pages[w] = pages[w] || []).push(id);
      if (seen.has(w)) out.push(`${id}: two cards open on "${w}"`);
      seen.add(w);
    }
  }
  for (const [w, ids] of Object.entries(pages)) if (ids.length > CARD_OPENINGS) out.push(`"${w}" opens ${ids.length} cards (at most ${CARD_OPENINGS})`);
  return out;
}

// ---------- the whole result screen (section 9) ----------
// CHANGELOG, "Result screens: second naive-reader round". Three readers on
// three models read all 31 screens, as a player and as a non-player sees
// them, and flagged lines as machine-written, insulting, jargon, a forced
// joke, vague, too long, contradictory or repeated. These are the ones that
// were cut or rewritten; none may come back. The frame lines flagged on every
// page are here too: the footer's scoring version, the plain commander line,
// the diagram's legend, the theme note and the second Share button.
const ROUND2_FLAGGED = [
  // frame
  'Scoring version', 'The Magic: The Gathering card matched to', 'A dashed line joins one of your colours',
  'A solid line joins two of your colours', 'keeps the page plain during the quiz', 'Share my result',
  'bring in a colleague with one strong colour', 'Notices who a plan is unfair to', 'Hexproof from feedback',
  'Every other creature has lesser power',
  // taglines and philosophies
  'Power Through Ruthless Action', 'Innovation Without Nature', 'though that makes decisions slower',
  'rules are mostly for people too afraid to live', 'You believe some things are worth fighting for.', 'nice-to-haves',
  'fair systems, deep analysis, and the willingness', "Being disliked along the way doesn't bother you",
  'patient analysis and strategic positioning', 'take value out slowly and quietly',
  'sustainable success comes from patience, analysis, and quiet positioning',
  'most "ethics" are someone protecting their position', 'Rules exist to protect the people',
  // strengths
  'without putting their feelings on a pedestal', 'When asked to hurry, moves only as fast',
  'Will sit with a struggling colleague until', 'Holds a group together through the kind of week',
  'Knows just how to set up bureaucracy', 'Generates more usable ideas', 'either blows it up or helps it find a new',
  'Reliable in a crisis precisely because', 'Will rework the inherited process slightly better every quarter',
  'Will run at the problem while everyone else', 'Gets a team behind a cause and keeps it there',
  'Keeps the org chart and the budget in mind', 'Made the move that mattered four quarters ago',
  'before everyone else has finished diagramming', 'Gets more out of a small team than most managers',
  'Makes an offer before the other side has finished', 'standing in 2034', 'Has carried the organisation through its worst years',
  'Demonstrates the standard by doing it', 'without showing the gear-change', 'Knows what every person at the table has to give',
  'Gets calmer as the stakes go up', 'Delivers the result, even on a deadline others have given up on',
  'without the emotional component clouding the analysis', "Will deliver the thing that didn't exist yesterday",
  'thirteen-part architecture', 'quietly builds the automation', 'the cynicism quietly excuses itself',
  'Lands on decisions that hold up because the process was visibly fair',
  // shadows
  'Trust is offered on a thirty-day rolling basis', 'Quietly grades the room', 'When asked to pick without enough data',
  'Capable of describing 1998', 'Wants anything new written up and approved', 'workshopping', 'Keeps the underperformer',
  'Rewards loyalty slowly', 'Did a colleague a small favour in 2022', 'Hears what a meeting left out',
  'about laws or processes that matter', "Can be promoted into roles where 'just do it'", 'Will happily let a project die',
  "Suspicious of 'good enough' as a moral position", 'Struggles not to reach for the hammer',
  "Can't quite tell the difference between a difficult conversation and a battle", 'Believes a well-run process can prevent conflict',
  'Struggles in a crisis, when things are needed fast', 'when some of them needed a decision',
  "Refers to colleagues by what they do and what they're worth", 'Optimises hard and leaves the ongoing problems',
  'is sincerely puzzled when colleagues leave', "weren't built for this", 'Believes nuance is what people do',
  'The big speech was on Wednesday', 'which is almost always untrue', "can't get a word in to say where it should point",
  'Leaves the detail to whoever is still in the room', 'regrettable but tolerable feature of the workplace',
  "haven't yet noticed what they're being helped towards", 'Changes the plan between Monday and Wednesday', 'personal velocity',
  'thirty percent better and forty percent on fire', 'moved to a different role at a different company',
  'before the analysis has finished its first sentence', "cover story for someone else's plan", 'none of them has a clear scope',
  'Gives the win to the room', 'second-best person in the room', 'what kind of room they\'re in', 'CVs glued together',
  'Approaches grey areas looking for the absolutely fair answer', 'Keeps choosing the fair, slow option',
  // closing lines
  'leaving collection', 'Getting a straight answer out of you', 'cycles of life with you', 'smoke machine', 'D-Day',
  "five-a-side 'a friendly'", 'marching band', 'Christmas cards arrive in early November', 'We threw you a surprise party',
  'expenses policy as an opening offer', "We're still reading the email", 'already read the reorganisation plan',
  // roles
  'Mission Nonprofits', 'Strategic Operations, Management Consulting', 'Startups, Innovation, R&D',
  'Operations, Agriculture, Sustainability, Mentorship', 'Sustainability, Turnaround/Restructuring',
  'Construction, Military, Crisis Response, Frontline Trades', 'Frontline Leadership, Field Operations',
];
// CHANGELOG, "Result screens: third naive-reader round". The lines the third
// readers flagged (vague, repeated, contradictory, a forced joke,
// machine-written, insulting, too long, jargon, no sense), each cut or
// rewritten, and the recurring props they named (the meeting about the
// meeting, a vote about a vote, the fridge and cake rules, reply-all,
// quarters). None may come back.
const ROUND3_FLAGGED = [
  // units and next door
  'within two answers of each other', 'led white by about one answer', 'was your lowest colour', 'made the cut easily', 'made it in easily',
  'Dashed line: one of your colours against one you lack.', 'None of the five colours is missing from your result.',
  // names and taglines
  'FOUR-COLOR', 'FIVE-COLOR', 'Intelligence Through Control', 'Power Through Agency', 'Structure Through Power',
  'Community Through Nature', 'Growth Through Positioning', 'Chaos or Mastery',
  // philosophies
  'the most reliable form of leverage', 'accepting your place in the larger system', 'structure is the foundation of ambition',
  'belong to something larger than themselves', 'serving something larger than yourself', 'you take it and live with the consequences',
  'Tradition is useful to you as information.',
  // strengths
  'Knows what a piece of information is worth', 'Picks up on how a team feels without being told.',
  'Gets things shipped without waiting for every question', 'Will try a move that\'s technically against the rules',
  'Closes the deal that everyone said couldn\'t be done.', 'Routes around new constraints', 'Knows which rules can be broken and what it will cost.',
  'Can drop the script halfway through', 'Names who is in charge and what they want.', 'Goes after the outcome they want without waiting',
  'Gets unlikely projects off the ground.', 'Comes alive in a crisis.', 'Is never the first to blink',
  'Keeps a clear head when a discussion turns heated.', 'Speaks five different professional dialects',
  'Is usually three steps ahead', 'Looks out for the people nobody else notices.',
  // shadows
  'Has prepared a framework for selecting the framework.', 'Turns difficult conversations into battles.',
  'Relies on quiet influence when a bit of loud energy', 'By the third quarter', 'rotting from the inside',
  'Keeps losing good people to calmer jobs.', 'Will burn down the agenda', 'in it for themselves', 'three good causes this month',
  'Leaves the long-term cost of how they got here', 'Pulls the lever and is surprised', 'anyone would do the same if they were honest',
  'The transition was discussed in March', 'low hum of property damage', 'the third hour of the Tuesday call',
  'Gets bored during a stable, successful stretch', "'one paragraph short on the docs'", 'made a process so robust',
  'Watches a struggling project until it\'s cheap enough', 'Drops a method that works because a newer one',
  'Can seem so detached that colleagues wonder', 'Holds five priorities and gives each one twenty percent',
  'Has a CV that reads like five people\'s.', 'Rebuilds things that were correct the first time.',
  // closing lines
  'fax number in your email signature', 'which desk you\'re having when your manager leaves', 'parked in the director\'s space',
  'office plants are thriving', 'took over the Thursday meeting', 'interval training for the charity fun run',
  'team away day is a second deadline', 'every Monday meeting with a round of applause', 'office fridge policy',
  'sign-off process for the office birthday cake', 'a vote on whether to hold a vote', 'reply-all thread',
  'chair the one that decides the committees',
  // who to bring in
  'the meeting about the meeting', 'Bring them in to read the manual you skipped.', 'skip the numbers',
  'Talk to them when a reorganisation is coming', 'Talk to them before a big move', 'Talk to them when you\'re right',
  'Bring them in when a deal looks good', 'so many exceptions that nobody can explain it',
  'being kind to one person is costing everyone else', 'commitments you made last quarter',
  // commander and rules text
  'Creatures you control are artifacts in addition to their other types.', 'You may pay life rather than mana.',
  'You don\'t lose unspent green mana as steps and phases end.', 'Other creatures you control get +2/+2.',
  'Other creatures you control have haste.', 'Samut and your other creatures have haste.', 'Pay {W} and tap Samut',
  'Pay {1}{G}{W} and tap Trostani', '{W/B}{W/B}', 'within your experience', 'Pay {2} and sacrifice two artifacts to choose one',
  'Your White and Blue spells cost {1} less', 'cost {1} more to cast and need a countersignature',
  ', 5 Mountain, 5 Forest', ', 5 Swamp, 5 Forest', ', 5 Swamp, 5 Mountain',
  // roles
  'Professional Services', 'Competitive Industries', 'Competitive Markets', 'Disruptive Startups', 'Aggressive Sales',
  'Private Equity, VC, Real Estate', 'Generalist Leadership', 'Recycling',
];
// Problems in a whole result screen, given its visible blocks: a flagged
// line; the scoring version anywhere but the methodology, which is closed
// until "View Full Breakdown"; more than one Share; the colleague card's old
// arrow or a plus written as text.
function screenProblems(blocks, d, win) {
  const all = blocks.join('\n');
  const out = [...ROUND2_FLAGGED, ...ROUND3_FLAGGED].filter((x) => all.includes(x)).map((x) => `flagged "${x}"`);
  const version = d.getElementById('res-version');
  if (!version || !d.getElementById('unified-breakdown').contains(version)) out.push('the scoring version is not in the methodology');
  const onScreen = (el) => { for (let n = el; n; n = n.parentElement) if (hidden(win, n)) return false; return true; };
  const shares = [...d.querySelectorAll('#screen-results button')].filter((b) => /\bshare\b/i.test(b.textContent) && onScreen(b));
  if (shares.length !== 1) out.push(`${shares.length} Share buttons`);
  if (blocks.some((b) => b === '+' || b.startsWith('→'))) out.push('a "+" or "→" written as text');
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
// The lists that stay. A colour list would stand for the identity's own
// colours, one item each; a card's modes are the modes it prints.
// No colour list stays. The four that only listed colours ("Holds analysis,
// fairness, and timing in one mental model") went in the first naive-reader
// round, and the four philosophies that opened on one (Bant's "civilisation,
// knowledge, and patience", Esper's, Abzan's and Four-colour without red's)
// in the second: readers took them for machine-written.
// No card's modes stay either: the third readers called Breya's three ("3
// damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life")
// too long, and its description now names two. A passage may still carry its
// own `kept` list, which the checker's own tests use.
const COLOUR_LISTS = {};
const CARD_MODES = {};
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
function rhythmProblems({ id, part, items, list = false, prose = true, kept: own = [] }) {
  const out = [];
  const add = (rule, detail) => out.push({ rule, at: `${id} ${part}`, detail });
  const all = pastAuthorLines(items.join(' '));
  for (const [re, name] of RHYTHM_BANNED) { const m = re.exec(all); if (m) add('banned', `${name} in "${all.slice(Math.max(0, m.index - 30), m.index + 30)}"`); }
  if (!prose) return out;
  const seq = items.flatMap(sentences);
  for (const r of runsOf(seq, (s) => opener(s) || null)) add('openings', `${r.length} open on "${opener(r[0])}": ${r.join(' / ')}`);
  for (const r of runsOf(seq, (s) => (words(s).length <= SHORT_SENTENCE ? shapeOf(s) : null))) add('short', `${r.length} short, ${shapeOf(r[0])}: ${r.join(' / ')}`);
  const kept = [...(COLOUR_LISTS[id] || []), ...(CARD_MODES[id] || []), ...own, ...AUTHOR_LINES];
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

// ---------- voice across the 31 profiles (section 16) ----------
// CHANGELOG, "Result screens: second naive-reader round". Readers comparing
// pages saw the same joke shapes on page after page (the room, quietly,
// acting while everyone else is still at something, exact years, a closing
// line that turns on ", and") and the person drifting within a page, from
// "you" to "they" to a sudden "we". The philosophy and the closing line say
// "you", the strengths and shadows describe a person with no subject, and
// nothing says "we". A rule fails on:
//   - person: "we", "us" or "our" anywhere; a strength or shadow that opens
//     on "You" or "Your", or on "The" (a note about something else: "The
//     transition was discussed in March", "The team has, collectively,
//     stopped scheduling"), which the third readers saw switch the list's
//     voice
//   - years: a year written out (1998, 2034)
//   - shapes: more profiles than SHAPE_LIMITS allows using one shape, across
//     the philosophy, strengths, shadows, closing line and description
//   - props: more profiles than PROP_LIMITS allows using one office prop,
//     across what the result page says about an identity (tagline,
//     philosophy, strengths, shadows, banter, rules text, colleague cards)
//   - banter: a closing line on more than BANTER_PROFILES profiles. It sits in
//     its own box, labelled "Your friends would put it like this." (once "Pub
//     banter"); the third readers, who had the page as text, read it as the
//     last of the shadows, and saw every page end on a joke.
const SHAPE_LIMITS = [
  ['"the room"', /\bthe room\b/i, 2],
  ['"quietly"', /\bquietly\b/i, 1],
  ['"everyone else"', /\beveryone else\b/i, 5],
  ['acting before everyone else has finished', /\bbefore (?:anyone|everyone)(?: else)? (?:has )?(?:finished|had time)\b/i, 0],
  ['acting while everyone else is still at it', /\bwhile (?:everyone(?: else)?|the others|others) (?:is|are) still\b/i, 0],
];
// CHANGELOG, "Result screens: third naive-reader round": the props the third
// readers saw come round page after page (meetings, quarters, reply-all
// emails, favours, the fridge and cake rules, a vote about a vote, the
// meeting about the meeting).
const PROP_LIMITS = [
  ['meetings', /\bmeetings?\b/i, 6],
  ['quarters', /\bquarters?\b/i, 1],
  ['favours', /\bfavours?\b/i, 2],
  ['emails and reply-all', /\b(?:e-?mails?|reply-all|replied)\b/i, 3],
  ['the fridge, the cake and the biscuits', /\b(?:fridge|cakes?|biscuits?)\b/i, 0],
  ['votes', /\bvot(?:e|es|ed|ing)\b/i, 1],
  ['a crisis', /\bcris(?:is|es)\b/i, 3],
  ['a day of the week', /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday)\b/, 4],
  ['"nobody"', /\bnobody\b/i, 10],
  ['an X about the X', /\b(\w{4,}) (?:about|for selecting|on whether to hold) (?:the|a|an) \1s?\b/i, 0],
];
const PROP_PARTS = ['tagline', 'philosophy', 'you', 'strengths', 'shadows', 'banter', 'rules', 'colleague cards'];
const BANTER_TWISTS = 5; // closing lines that turn on ", and"
const BANTER_PROFILES = 22; // profiles with a closing line at all
// A `you` line speaks to the reader: it has "you" or "your" in it.
const SPEAKS_TO_YOU = /\byou(?:r|rs|rself|['’](?:re|ve|d|ll))?\b/i;
function voiceProblems(passages) {
  const out = [];
  const add = (rule, detail) => out.push({ rule, detail });
  for (const x of passages) {
    const all = x.items.join(' ');
    const we = /\b(?:we|us|our)\b/i.exec(all);
    if (we) add('person', `${x.id} ${x.part}: "${we[0]}" in "${all.slice(0, 70)}"`);
    if (x.list && ['strengths', 'shadows'].includes(x.part)) x.items.filter((i) => /^(?:you|your|the)\b/i.test(i)).forEach((i) => add('person', `${x.id} ${x.part} opens on "${i.split(' ')[0]}": "${i}"`));
    if (x.part === 'you') x.items.filter((i) => !SPEAKS_TO_YOU.test(i)).forEach((i) => add('person', `${x.id} you: no "you" in "${i}"`));
    const year = /\b(?:1[89]|20)\d\d\b/.exec(all);
    if (year) add('years', `${x.id} ${x.part}: ${year[0]} in "${all.slice(0, 70)}"`);
  }
  const prose = passages.filter((x) => ['philosophy', 'you', 'strengths', 'shadows', 'banter', 'description'].includes(x.part));
  for (const [name, re, limit] of SHAPE_LIMITS) {
    const ids = [...new Set(prose.filter((x) => x.items.some((i) => re.test(i))).map((x) => x.id))];
    if (ids.length > limit) add('shapes', `${name} on ${ids.length} profiles (at most ${limit}): ${ids.join(', ')}`);
  }
  const twists = passages.filter((x) => x.part === 'banter' && x.items.some((i) => /, and /.test(i))).map((x) => x.id);
  if (twists.length > BANTER_TWISTS) add('shapes', `${twists.length} closing lines turn on ", and" (at most ${BANTER_TWISTS}): ${twists.join(', ')}`);
  const page = passages.filter((x) => PROP_PARTS.includes(x.part));
  for (const [name, re, limit] of PROP_LIMITS) {
    const ids = [...new Set(page.filter((x) => x.items.some((i) => re.test(i))).map((x) => x.id))];
    if (ids.length > limit) add('props', `${name} on ${ids.length} profiles (at most ${limit}): ${ids.join(', ')}`);
  }
  const banter = [...new Set(passages.filter((x) => x.part === 'banter' && x.items.some(Boolean)).map((x) => x.id))];
  if (banter.length > BANTER_PROFILES) add('banter', `a closing line on ${banter.length} profiles (at most ${BANTER_PROFILES})`);
  return out;
}

// ---------- the `you` lines (section 16) ----------
// CHANGELOG, "Result pages in the second person". Each profile's `you` lines,
// as the consumer result page renders them, in place of Strengths and
// Shadows: two to four lines, said to the reader's face (voiceProblems holds
// that), and a check fails on:
//   - count: fewer than two lines or more than four
//   - opening: a line that opens on the same word as the line above it (a
//     contraction counts as its word: You and You're are one), unless both
//     are the author's
//   - colour: a colour's name (the card and the commander already do that job)
//   - magic: a word from the game (mana, spell, creature, card ...)
//   - author: Mono-Blue not opening on the author's two lines, word for word
// The em dash, banned words, sentence length, antithesis and lists are held by
// the content and rhythm checkers, which read past the author's lines.
const YOU_COLOUR = /\b(?:white|blue|black|red|green)\b/i;
const YOU_MAGIC = /\b(?:mana|spells?|creatures?|graveyards?|commanders?|planeswalkers?|battlefield|decks?|mulligans?|sideboard|cards?)\b/i;
function youProblems(byId) {
  const out = [];
  const add = (rule, detail) => out.push({ rule, detail });
  for (const [id, lines] of Object.entries(byId)) {
    if (lines.length < 2 || lines.length > 4) add('count', `${id}: ${lines.length} lines`);
    lines.forEach((line, i) => {
      if (i > 0 && opener(line) === opener(lines[i - 1]) && !(AUTHOR_LINES.includes(line) && AUTHOR_LINES.includes(lines[i - 1]))) add('opening', `${id}: "${lines[i - 1]}" / "${line}"`);
      if (YOU_COLOUR.test(line)) add('colour', `${id}: "${line}"`);
      if (YOU_MAGIC.test(line)) add('magic', `${id}: "${line}"`);
    });
  }
  if ('MONO-U' in byId && JSON.stringify((byId['MONO-U'] || []).slice(0, 2)) !== JSON.stringify(AUTHOR_LINES)) add('author', `MONO-U opens on ${JSON.stringify((byId['MONO-U'] || []).slice(0, 2))}`);
  return out;
}
// The "Not For Official Use" box, in both modes: the author's line first,
// word for word, then the one about hiring and firing.
const AUTHOR_DISCLAIMER = "It is not validated and it is not science. We're telling you for legal reasons, and also because it's true and it's started to bother us.";
const HIRING_LINE = 'Do not use this for hiring, firing or any other decision about a person.';
// The label on the closing line's box, which keeps the line from reading as
// the last of the `you` lines (once "Pub banter", which readers heard as a
// lazy stereotype and a forced joke).
const BANTER_LABEL = 'Your friends would put it like this.';
// Work wording a consumer result page no longer prints (CHANGELOG, "Result
// pages in the second person"): the old headings, the colour cards' old label
// and the old buttons. Then the labels three fresh readers heard as a slide
// deck under the rewritten profiles (CHANGELOG, "Result pages: the labels
// below the profile"): the status words, the self-help heading, the Title
// Case buttons, the colon key and headlines, the footnote caption. Workplace
// mode keeps its legend, picture button, Retake, switcher label and
// disclaimer heading.
const CONSUMER_GONE = [/^Strengths$/, /^Shadows$/, /^Natural Roles$/, /^Working With Others$/, /^Who to bring in$/, /^View Full Breakdown$/, /^Make an image$/,
  /^(?:White|Blue|Black|Red|Green) colleague$/, /^Colleagues strong in\b/,
  /^Locked in$/, /^Leaning$/, /^Still shuffling$/, /^Who you need around you$/, /^Make a picture$/,
  /^Retake$/, /^Explore All 31 Types$/, /^How Colours Interact$/, /^Page style$/, /^Pub banter$/,
  /^Commander · /, /^Solid line: /, /^Dashed line: /, /^Splash \w+: /, /^Cut the \w+: /, /^⚠ Not For Official Use$/,
  /^How often you picked each colour when it was offered\.$/, /^The results one colour away from yours\.$/, /^People strong in the colours\b/];
// The status words, headings and buttons a reader of the workplace page heard
// as an app's or an HR form's (CHANGELOG, "Result pages: the last flagged
// lines, the workplace labels and eight taglines"). No page prints them now:
// section 6 holds the workplace page to it with the workings open, and
// tests/render.test.js holds the words that replaced them.
const WORKPLACE_GONE = [/^Locked in$/, /^Leaning$/, /^Still shuffling$/, /^Natural Roles$/, /^Natural roles$/,
  /^Working With Others$/, /^View Full Breakdown$/, /^Hide Full Breakdown$/, /^Explore All 31 Types$/, /^How Colours Interact$/];

// ---------- collecting what is on screen ----------
// Not prose for these rules: the identity's own content, the commander block
// and the colour cards (a separate decision), and nothing hidden.
const CONTENT = [
  '#res-id', '#res-tag', '#res-banner-commander', '#res-idcard', '#identity-exp', '#res-you', '#strengths', '#weaknesses',
  '#res-counter-section', '#res-desc', '#roles', '#cmd-name-aside', '#cmd-desc-aside', '#res-mana-base',
  '#relations-detail', '.mc-nextdoor__peek-philosophy', '.mc-nextdoor__peek-you', '.mc-nextdoor__peek-traits', '#share-preview',
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
    // The confidence block: the label (a sentence about how clear the result
    // was on a consumer page, the label word in workplace mode) and its line
    // (one sentence about this result's own bars, naming one of its
    // colours), then at most one quality line, and nothing else before the bars.
    const label = { word: st.mode === 'workplace' ? R.labels[st.confidence].word : R.labels[st.confidence].said };
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
    // Workplace mode: none of the status words, headings or buttons its
    // reader heard as an app or an HR form, with the workings open as well.
    if (st.mode === 'workplace') {
      win.toggleBreakdown();
      const page = visibleBlocks(win, screen, { exclude: [] });
      const old = page.filter((b) => WORKPLACE_GONE.some((re) => re.test(b)));
      ok(`result: ${st.name}: none of the old status words, headings or buttons, with the workings open ("Locked in", "Natural Roles", "Hide Full Breakdown" ...)`,
        page.includes('Hide the workings') && old.length === 0, old.join(' | ') || page.filter((b) => /workings/i.test(b)).join(' | '));
    }
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
    // A consumer peek has no "Label: value" heading or button (workplace
    // mode keeps "Next door: Sultai" and "Appeal: I'm Sultai").
    if (mode !== 'workplace') {
      const head = ((d.querySelector('.mc-nextdoor__panel-head') || {}).textContent || '').trim();
      const button = (d.getElementById('appeal-btn').textContent || '').trim();
      ok(`result: a peek next door (${mode}): the heading and the appeal button are a sentence and a plain action`,
        head === "Here's Sultai." && button === 'Make it Sultai' && !/:/.test(head + button), `"${head}" / "${button}"`);
    }
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
  // colour outside the result printed above one in it, level, within one
  // answer (2 and 6 points), a few answers (12 and 20 points), well clear)
  // under each label; then every identity rendered for real in plain and
  // player modes: the line on the page and next door, each gap in points as
  // the bars print it, the commander block (no card text in plain mode), the
  // colleague cards and the legend; then the explorer's cards for all 31.
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
  const cardLines = {}; // each colleague card's line: the identities whose page printed it
  const cardsByPage = {}; // each identity's colleague cards, in page order
  for (const [modeName, gaming] of [['plain', false], ['player', true]]) {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES, R = h.RESULT_COPY;
    h.selectAudience('consumer');
    const s = h.state;
    s.gamingFamiliar = gaming;
    const text = (sel) => ((d.querySelector(sel) || {}).textContent || '').replace(/\s+/g, ' ').trim();
    const shown = (sel) => !!d.querySelector(sel) && !hidden(win, d.querySelector(sel));
    const lineIssues = [], doorIssues = [], unitIssues = [], cmdIssues = [], gapIssues = [], legendIssues = [], pageIssues = [];
    let gapsGiven = 0, wellRows = 0;
    for (const id of Object.keys(P)) {
      // Bars of every shape the line has words for: a colour outside printed
      // above one inside, level, within one answer, a few answers, well clear.
      for (const gap of [-0.05, 0, 0.02, 0.06, 0.12, 0.2, 0.4]) {
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
        // Next door says each row as the mode says it, gives the gap the line
        // compares, and names a dropped colour as the lowest of yours.
        const rows = [...d.querySelectorAll('#next-door-chips .mc-nextdoor__chip')].map((chip) => ({
          dir: chip.dataset.dir, id: chip.dataset.id,
          head: chip.querySelector('.mc-nextdoor__head').textContent, why: chip.querySelector('.mc-nextdoor__why').textContent,
        }));
        doorIssues.push(...doorProblems(rows, line, id, P, R.names, gaming).map((p) => `${id} gap ${gap}: ${p}`));
        // The units: the line and every reason give the gap in points, the gap
        // between the two bars as the page prints them.
        const printed = [...d.querySelectorAll('#res-profile-bars .mc-profile__pct')].map((el) => Number(el.textContent.replace('%', '')));
        const shownAct = Object.fromEntries(['W', 'U', 'B', 'R', 'G'].map((c, i) => [c, printed[i] / 100]));
        const texts = [line, ...rows.map((r) => r.why)];
        unitIssues.push(...unitProblems(texts, comparedBars(id, shownAct, P).gap).map((p) => `${id} gap ${gap}: ${p}`));
        gapsGiven += texts.filter((t) => pointsIn(t).length).length;
        wellRows += rows.filter((r) => r.dir === 'down' && /, though still \d+ points? ahead of \w+\.$/.test(r.why)).length;
      }
      cardsByPage[id] = [...d.querySelectorAll('#relations-detail .mc-gap-card .mc-gap-card__gap')].map((el) => el.textContent.trim());
      // The commander block, player mode only, with "Your commander is
      // <card>." in the banner; otherwise no block, and the banner credits
      // the art ("Card art: <card>").
      const desc = text('#cmd-desc-aside'), banner = text('#res-banner-commander');
      const cmdRight = gaming
        ? shown('#res-cmd-aside') && desc === P[id].cmdDesc && text('#cmd-title-aside') === 'Commander' && text('#cmd-name-aside') === P[id].cmd && banner === `Your commander is ${P[id].cmd}.`
        : !shown('#res-cmd-aside') && desc === '' && banner === `Card art: ${P[id].cmd}`;
      if (!cmdRight) cmdIssues.push(`${id}: "${banner}" / "${desc}"`);
      if (!gaming && /\b(?:mana|graveyard|battlefield|creature|library|token|counter|upkeep|combat)\b/i.test(desc + ' ' + text('#res-idcard'))) cmdIssues.push(`${id}: card words in plain mode`);
      // The colleague cards: one per missing colour, each with its own line.
      const missing = ['W', 'U', 'B', 'R', 'G'].filter((c) => !P[id].colors.includes(c));
      const cards = [...d.querySelectorAll('#relations-detail .mc-gap-card')];
      const lines = cards.map((card) => ((card.querySelector('.mc-gap-card__gap') || {}).textContent || '').trim());
      if (cards.length !== missing.length || lines.some((x) => !x)) gapIssues.push(`${id}: ${cards.length} cards for ${missing.length} colours, ${lines.filter(Boolean).length} with a line`);
      lines.forEach((x) => (cardLines[x] = cardLines[x] || new Set()).add(id));
      for (const b of visibleBlocks(win, d.getElementById('relations-detail'), { exclude: [] })) {
        gapIssues.push(...gapProblems(b).map((p) => `${id}: ${p}`), ...contentProblems(b, { PROFILES: P }).map((p) => `${id}: ${p}`));
      }
      // The legend names only the kinds of line the diagram draws.
      const ally = !!d.querySelector('#screen-results .rel-edge-ally.is-lit-ally'), enemy = !!d.querySelector('#screen-results .rel-edge-enemy.is-lit-enemy');
      if (shown('#rel-legend-ally') !== ally || shown('#rel-legend-enemy') !== enemy) legendIssues.push(`${id}: legend ally ${shown('#rel-legend-ally')}/${ally}, enemy ${shown('#rel-legend-enemy')}/${enemy}`);
      legendIssues.push(...gapProblems(text('.mc-relations-legend')).map((p) => `${id} legend: ${p}`));
      // The whole page as a reader gets it: none of the lines the second
      // readers flagged, no scoring version outside the methodology, one Share.
      const page = visibleBlocks(win, d.getElementById('screen-results'), { exclude: [] });
      pageIssues.push(...screenProblems(page, d, win).map((p) => `${id}: ${p}`));
      // A consumer page: none of the work headings, labels or buttons, and the
      // author's disclaimer line above the one about hiring and firing.
      pageIssues.push(...page.filter((b) => CONSUMER_GONE.some((re) => re.test(b))).map((b) => `${id}: "${b}" on a consumer page`));
      const warn = page.findIndex((b) => b === AUTHOR_DISCLAIMER);
      if (warn < 0 || page[warn + 1] !== HIRING_LINE) pageIssues.push(`${id}: the disclaimer reads ${JSON.stringify(page.slice(Math.max(0, warn), warn + 2))}`);
    }
    // The theme switcher is its label and three names: the notes about Card
    // Frames ("keeps the colours hidden until your result", "keeps the page
    // plain during the quiz") read to first-time readers as settings text.
    // On a consumer page the label is a sentence ("Page style" in workplace mode).
    const sw = visibleBlocks(win, d.getElementById('theme-switch'), { exclude: [] }).join(' / ');
    if (sw !== 'Change how the page looks. / Gilded Hall / Card Frames / Borderless') legendIssues.push(`theme switcher "${sw}"`);
    ok(`result (${modeName}): the line under the label is confidenceLine's, true to the bars, for all 31 on seven bar shapes`, lineIssues.length === 0 && errors.length === 0,
      lineIssues.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | '));
    ok(`result (${modeName}): next door says each row as a sentence (${gaming ? '"Splash white and you\'re Selesnya."' : '"With white as well, you\'d be Selesnya."'}), says how far short the added colour was, and names the dropped one as the weaker or weakest of yours ("the weaker of your two"), never "your lowest colour" or "made the cut", for all 31 on seven bar shapes`,
      doorIssues.length === 0, doorIssues.slice(0, 4).join(' | '));
    ok(`result (${modeName}): next door's down row says how far its colour was ahead of the nearest one outside when the line under the label did not count the gap, and does not count it again when it did (${wellRows} rows with the gap)`,
      doorIssues.filter((p) => /how far ahead|counts again/.test(p)).length === 0 && wellRows > 0, doorIssues.filter((p) => /how far ahead|counts again/.test(p)).slice(0, 4).join(' | ') || `${wellRows} rows`);
    ok(`result (${modeName}): units: the line under the label and next door give every gap in points, the gap between the two bars as printed, and never in answers (all 31, seven bar shapes: ${gapsGiven} gaps given)`,
      unitIssues.length === 0 && gapsGiven > 0, unitIssues.slice(0, 4).join(' | '));
    ok(`result (${modeName}): the commander block is ${gaming ? 'the card text, under "Your commander is <card>." in the banner' : 'gone, and the banner credits the art to the card'}, for all 31`, cmdIssues.length === 0, cmdIssues.slice(0, 4).join(' | '));
    ok(`result (${modeName}): one colleague card per missing colour, each with a line, none of the traits readers caught and no sentence on "You", for all 31`,
      gapIssues.length === 0, gapIssues.slice(0, 4).join(' | '));
    ok(`result (${modeName}): the legend names only the lines drawn, and the theme switcher is its label and three names`, legendIssues.length === 0, legendIssues.slice(0, 4).join(' | '));
    ok(`result (${modeName}): none of the lines the second and third readers flagged, no scoring version outside the methodology, one Share, none of the work headings ("Strengths", "Natural Roles", "White colleague" ...) or slide-deck labels ("Locked in", "Make a picture", "Explore All 31 Types" ...) and the author's disclaimer line above the hiring line, for all 31`,
      pageIssues.length === 0, pageIssues.slice(0, 4).join(' | '));
    win.close();
  }
  // No two pages print the same colleague card: readers comparing pages saw
  // one blurb on half of them and took the section for a template.
  {
    const shared = Object.entries(cardLines).filter(([, ids]) => ids.size > 1).map(([x, ids]) => `"${x}" on ${[...ids].join(', ')}`);
    ok(`colleague cards: each of the ${Object.keys(cardLines).length} lines is on one identity's page only (all 31, plain and player)`,
      Object.keys(cardLines).length === 75 && shared.length === 0, shared.slice(0, 3).join(' | ') || `${Object.keys(cardLines).length} lines`);
    const openings = cardOpeningProblems(cardsByPage);
    ok(`colleague cards: no opening word on more than ${CARD_OPENINGS} of the 75 cards, and none twice on one page (all 31)`,
      Object.keys(cardsByPage).length === 31 && openings.length === 0, openings.slice(0, 4).join(' | '));
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
    // A consumer page: the `you` lines, where strengths and shadows stood
    // (the explorer and the dossier, sections 11 and 12, still print those).
    const PARTS = ['#res-tag', '#res-banner-commander', '#res-rules', '#res-collector', '#identity-exp', '#res-you',
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
    // Every part shows, but the banter on a profile that has none.
    const wantParts = 31 * PARTS.length - Object.values(P).filter((p) => !p.pubBanter).length;
    ok('result: every identity\'s profile blocks, card, commander, mana base and colour cards are plain (all 31, player mode)',
      parts === wantParts && problems.length === 0 && errors.length === 0,
      `${parts} of ${wantParts} parts shown; ` + (problems.slice(0, 4).join(' | ') || errors.slice(0, 2).join(' | ')));
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
  // description, which the explorer shows. Eight passages for each of 31, the
  // banter empty on a profile that has none, whose page shows no banter box.
  // The rules text and the colleague cards are read too, for the props.
  {
    const { win, h, errors } = await page();
    const d = win.document, P = h.PROFILES;
    h.selectAudience('consumer');
    const s = h.state;
    s.gamingFamiliar = true;
    const text = (sel) => ((d.querySelector(sel) || {}).textContent || '').replace(/\s+/g, ' ').trim();
    const lines = (sel) => [...d.querySelectorAll(sel)].map((el) => el.textContent.replace(/\s+/g, ' ').trim());
    const passages = [], extras = [], banterBoxes = [];
    for (const id of Object.keys(P)) {
      s.result = { identity: id, confidence: 'MODERATE', allResults: [], scoringVersion: 2, instrumentVersion: 4, round3Data: {} };
      s.activationSorted = sorted(actFor(P[id].colors));
      s.responses = new Array(30).fill({ c: P[id].colors[0] });
      s.neitherCount = 1;
      s.qualityFlags = CLEAN_FLAGS;
      s.disclaimerAcknowledged = true;
      h.showResults();
      const box = d.getElementById('res-counter-section');
      const boxShown = !!box && !hidden(win, box);
      if (boxShown !== !!P[id].pubBanter || (boxShown && text('#res-counter-label') !== BANTER_LABEL)) banterBoxes.push(`${id}: box ${boxShown ? 'shown' : 'hidden'}, label "${text('#res-counter-label')}"`);
      passages.push(
        { id, part: 'tagline', items: [text('#res-tag')], prose: false },
        { id, part: 'philosophy', items: [text('#identity-exp')] },
        { id, part: 'you', items: hidden(win, d.getElementById('res-you')) ? [] : lines('#res-you li'), list: true },
        { id, part: 'banter', items: [boxShown ? text('#res-counter') : ''] },
        { id, part: 'roles', items: [text('#roles')], prose: false },
        { id, part: 'commander description', items: [text('#cmd-desc-aside')] },
      );
      extras.push(
        { id, part: 'rules', items: [text('#res-rules')], prose: false },
        { id, part: 'colleague cards', items: lines('#relations-detail .mc-gap-card__gap'), prose: false },
      );
    }
    // The explorer: the description, and the strengths and shadows that the
    // consumer result page no longer prints but the explorer, the dossier and
    // workplace mode still do.
    win.showExplorer();
    for (const id of Object.keys(P)) {
      win.showDetail(id);
      passages.push(
        { id, part: 'description', items: [text('#detail-desc')] },
        { id, part: 'strengths', items: lines('#detail-strengths li'), list: true },
        { id, part: 'shadows', items: lines('#detail-shadows li'), list: true },
      );
    }
    dump('rhythm: the 31 profiles', passages.map((x) => `${x.id} ${x.part}: ${x.items.join(' || ')}`));
    const unread = passages.filter((x) => !x.items.length || x.items.some((i) => !i))
      .filter((x) => !(x.part === 'banter' && !P[x.id].pubBanter)).map((x) => `${x.id} ${x.part}`);
    ok(`rhythm: all nine passages of all 31 profiles are read as rendered (the \`you\` lines from the result page, strengths and shadows from the explorer), and the banter box, labelled "${BANTER_LABEL}", shows exactly when the profile has a closing line`,
      passages.length === 31 * 9 && unread.length === 0 && banterBoxes.length === 0 && errors.length === 0,
      `${passages.length} passages; empty: ${unread.join(', ')} ${banterBoxes.slice(0, 3).join(' | ')} ${errors.slice(0, 2).join(' | ')}`);
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
    // The voice across the 31 profiles: each section keeps its person, no
    // year is written out, no joke shape or office prop runs from page to
    // page, and not every page ends on a joke.
    // The `you` lines as the result page printed them, held to their own rules.
    const youByPage = Object.fromEntries(passages.filter((x) => x.part === 'you').map((x) => [x.id, x.items]));
    const youFound = youProblems(youByPage);
    for (const [rule, label] of [['count', 'two to four lines on each page'], ['opening', 'no line opens on the same word as the line above it, but the author\'s two'],
      ['colour', 'no colour named'], ['magic', 'no word from the game (mana, spell, card ...)'], ['author', 'Mono-Blue opens on the author\'s two lines, word for word']]) {
      const hits = youFound.filter((v) => v.rule === rule);
      ok(`you: ${label} (all 31 profiles, ${Object.values(youByPage).flat().length} lines)`, Object.keys(youByPage).length === 31 && hits.length === 0, hits.slice(0, 4).map((v) => v.detail).join(' | '));
    }
    const voice = voiceProblems([...passages, ...extras]);
    for (const [rule, label] of [['person', 'each section keeps its person: no "we", "us" or "our", no strength or shadow opening on "You" or "The", and "you" in every `you` line'],
      ['years', 'no year written out'], ['shapes', 'no joke shape on more profiles than its limit ("the room", "quietly", "everyone else", acting while others are still at it, a closing line turning on ", and")'],
      ['props', 'no office prop on more profiles than its limit (meetings, quarters, favours, emails, the fridge and cake, votes, a crisis, weekdays, "nobody", an X about the X), colleague cards and rules text included'],
      ['banter', `a closing line on at most ${BANTER_PROFILES} profiles`]]) {
      const hits = voice.filter((v) => v.rule === rule);
      ok(`voice: ${label} (all 31 profiles)`, hits.length === 0, hits.slice(0, 4).map((v) => v.detail).join(' | '));
    }
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
      ['FOUR-COLOUR (No Red)', {}],
      ['Round 1 tested only enemy pairs, colours that oppose each other.', { scoring: false }],
      ['One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four twenty-five.', {}],
      // the author's two lines, em dash and all
      [AUTHOR_LINES.join(' '), {}],
    ];
    const contentFlagged = contentClean.map(([x, opts]) => [x, contentProblems(x, { PROFILES: P, ...opts })])
      .filter(([, found]) => found.length).map(([x, found]) => `${x}: ${found}`);
    const strayDash = contentProblems("You're nearly always right — and you know it.", { PROFILES: P }).join(' | ');
    ok('the content checker flags an em dash outside the author\'s lines', strayDash.includes('em dash'), strayDash);
    ok('the content checker passes a quoted question, mana symbols, an identity name, the methodology\'s own words, a 25-word sentence and the author\'s lines',
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
      // an identity's own colours, kept until the second naive-reader round
      [{ id: 'BANT', part: 'philosophy', items: ['You believe civilisation, knowledge, and patience all matter.'] }, ['lists']],
      [{ id: 'ESPER', part: 'philosophy', items: ['You believe good decisions need fair systems, deep analysis, and the willingness to make the call.'] }, ['lists']],
    ];
    const rhythmMissed = rhythmSamples.filter(([x, want]) => !want.every((r) => rulesOf(x).includes(r))).map(([x, want]) => `${x.id} ${x.part}: wanted ${want}, got ${rulesOf(x)}`);
    ok('the rhythm checker flags each rule on a profile\'s old passage or a made-up one', rhythmMissed.length === 0, rhythmMissed.join(' | '));
    const rhythmClean = [
      // two sentences in a row on the same word, and two short ones
      { id: 'X', part: 'philosophy', items: ['You believe every approach has its place. You read the situation first and pick the approach that fits it.'] },
      { id: 'X', part: 'commander description', items: ['Your creatures have haste. Tap: untap another creature.'] },
      // a lead-in breaks a run of short sentences
      { id: 'X', part: 'banter', items: ['You treat quarterly planning like D-Day. Months on, the intensity is exhausting. Relax for one minute and stop talking.'] },
      // a card's modes
      { id: 'YORE', part: 'commander description', kept: ['3 damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life'], items: ['When Breya enters, create two 1/1 thopter tokens. Then pay {2} and sacrifice two artifacts for various effects: 3 damage to a player or planeswalker, -4/-4 to a creature, or gain 5 life.'] },
      // "but" far from a negative is no antithesis; a list of jobs is no rhythm
      { id: 'X', part: 'shadows', list: true, items: ["Treats people who haven't put in their hours as a regrettable but tolerable feature of the workplace.", 'Adapts slowly, and is surprised when the world has changed.', 'Will apply the letter of a rule in an emergency it was never written for.'] },
      { id: 'X', part: 'roles', prose: false, items: ['Strategy, Research, Analytics, Architecture, Policy Analysis, Forecasting'] },
      // the author's two lines, with their list and their dash
      { id: 'MONO-U', part: 'you', list: true, items: [...AUTHOR_LINES, 'People come to you upset and go away informed.'] },
    ];
    const rhythmFlagged = rhythmClean.filter((x) => rulesOf(x).length).map((x) => `${x.id} ${x.part}: ${rhythmProblems(x).map((f) => f.detail).join('; ')}`);
    const strayList = rulesOf({ id: 'X', part: 'you', list: true, items: ['You like a thing before you act, which is fine, and to like it completely.'] });
    ok('the rhythm checker flags the author\'s list shape in anyone else\'s line', strayList.includes('lists'), strayList.join());
    ok('the rhythm checker passes two openings or two short sentences in a row, a lead-in, a card\'s modes, a list of jobs and the author\'s lines',
      rhythmFlagged.length === 0, rhythmFlagged.join(' | '));

    // The line checker (sections 6 and 9), on Dimir's bars (blue 78, black 64,
    // green 31: black 33 points clear of green), on a close pair (black 60,
    // green 50: 10 points) and on five colours 66 to 52 (14 points), with
    // the lines the pages carried before the gaps were in points.
    const dimir = { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 }, close = { U: 0.7, B: 0.6, G: 0.5, W: 0.2, R: 0.1 };
    const five = { W: 0.66, U: 0.62, B: 0.58, R: 0.55, G: 0.52 };
    const nameOf = (id) => h.RESULT_COPY.names[id];
    const lineSamples = [
      ['DIMIR', 'Fairly clear. Your nearest neighbour is next door.', dimir, ['2 sentences', 'an old line', 'names no colour']],
      ['DIMIR', 'Green came next, 14 points behind black.', dimir, ['gives 14 points for bars 33 points apart']],
      ['DIMIR', 'Green came next, 40% behind black.', dimir, ['a number that is not a gap in points', 'a percentage']],
      ['DIMIR', 'Red and white were well behind your colours.', dimir, ['names no colour']],
      ['DIMIR', 'The nearest colour outside yours was green, well behind black.', close, ['"well" for a gap of 10 points']],
      ['DIMIR', 'Green tied with black, the lower of your two colours.', close, ['"level" for bars 10 points apart']],
      ['DIMIR', 'Green nearly made it in, 10 points behind black.', close, ['"nearly made it in" for a gap of 10 points']],
      ['DIMIR', 'Green came next, behind black.', close, ['a gap of 10 points left uncounted']],
      ['DIMIR', 'Green came next, 10 point behind black.', close, ['"10 point"']],
      ['DIMIR', 'The nearest colour outside yours was green, about one answer behind black.', dimir, ['counts in answers']],
      ['WUBRG', 'All five colours finished within two answers of each other.', five, ['counts in answers', 'a gap of 14 points left uncounted']],
      ['MONO-B', 'Black led white by about one answer.', { B: 0.86, W: 0.81, U: 0.2, R: 0.1, G: 0.1 }, ['counts in answers']],
    ];
    const lineMissed = lineSamples.filter(([id, line, act, want]) => !want.every((w) => lineProblems(line, id, act, P, nameOf(id)).join(' | ').includes(w)))
      .map(([id, line, act]) => `${line}: ${lineProblems(line, id, act, P, nameOf(id))}`);
    ok('the line checker flags an old line, a gap in answers or one the bars do not print, a percentage, "10 point", no colour of the result, and a gap left uncounted', lineMissed.length === 0, lineMissed.join(' | '));
    const lineClean = [
      ['DIMIR', 'Blue and black were well clear of the other three colours.', dimir],
      ['DIMIR', 'Green came next, 10 points behind black.', close],
      ['DIMIR', 'Green nearly made it in, 1 point behind black.', { U: 0.7, B: 0.6, G: 0.59, W: 0.2, R: 0.1 }],
      ['WUBRG', 'All five colours finished within 14 points of each other.', five],
      ['DIMIR', 'This link shows Dimir without the answers behind it.', { W: 0, U: 0, B: 0, R: 0, G: 0 }],
    ].filter(([id, line, act]) => lineProblems(line, id, act, P, nameOf(id)).length)
      .map(([id, line, act]) => `${line}: ${lineProblems(line, id, act, P, nameOf(id))}`);
    ok('the line checker passes lines true to their bars in points, and a bare link\'s line naming the identity', lineClean.length === 0, lineClean.join(' | '));
    // The unit checker, on next door's old reasons and on this round's.
    const unitSamples = [
      [['Your white was about one answer short.'], 5, 'counts in answers'],
      [['Green was less than an answer short.'], 4, 'counts in answers'],
      [['Your white was 4 points short.'], 5, 'gives 4 points for bars 5 points apart'],
      [['Your white was 1 points short.'], 1, '"1 points"'],
      [['White was 52% short.'], 52, 'a percentage'],
    ].filter(([texts, gap, flag]) => !unitProblems(texts, gap).join(' | ').includes(flag)).map(([texts, gap]) => `${texts}: ${unitProblems(texts, gap)}`);
    ok('the unit checker flags a gap in answers, a count the bars do not print, "1 points" and a percentage', unitSamples.length === 0, unitSamples.join(' | '));
    const unitClean = [
      ...unitProblems(['White nearly made it in, 5 points behind red.', 'Your white was 5 points short.', 'Red was the weakest of your three.',
        'This link shows Dimir without the answers behind it.', 'White and blue were well behind your three colours, but your answers fitted more than one result.'], 5),
      ...unitProblems(['Black was the weaker of your two, though still 1 point ahead of green.'], 1),
    ];
    ok('the unit checker passes gaps in points that match the bars, "1 point", and "answers" that count nothing', unitClean.length === 0, unitClean.join(' | '));

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

    // The next-door checker (section 9), on the pages the second and third
    // readers saw and on the pages that replaced them.
    const N = h.RESULT_COPY.names;
    const row = (dir, id, head, why) => ({ dir, id, head, why });
    const doorSamples = [
      // the second readers' Abzan: the gap counted two ways, and "only just made the cut"
      ['ABZAN', 'The nearest colour outside yours was blue, less than an answer behind green.', [row('up', 'WITCH', 'Splash blue: Four-colour (no red).', 'Your blue was one answer short.'),
        row('down', 'ORZHOV', 'Cut the Forests: Orzhov.', 'Green only just made the cut.')], true, 'the down row says "Green only just made the cut."'],
      ['MONO-G', 'Green was well ahead of every other colour.', [row('up', 'SELESNYA', 'Add white: Selesnya.', 'White was 52 points short.')], false, 'head "Add white'],
      ['WUBRG', 'All five colours finished within two answers of each other.', [row('down', 'YORE', 'Cut the Forests: Four-colour (no green).', 'Green was your lowest colour.')], true, 'five colours'],
      ['DIMIR', 'Green tied with black, the lower of your two colours.', [row('up', 'SULTAI', 'Splash green: Sultai.', 'Your green was 4 points short.'),
        row('down', 'MONO-U', 'Cut the Swamps: Mono-Blue.', 'Black tied with green.')], true, 'disagree about a tie'],
      ['TEMUR', 'White nearly made it in, 5 points behind red.', [row('up', 'INK', 'Splash white: Four-colour (no black).', 'Your white was 5 points short.'),
        row('down', 'SIMIC', 'Cut the Mountains: Simic.', 'Red was the lowest of your three colours, 5 points ahead of white.')], true, 'the down row counts again'],
      // the third readers: Simic's blue at 80% called "your lowest colour"; Bant's "made the cut easily"
      ['SIMIC', 'White nearly made it in, 5 points behind blue.', [row('up', 'BANT', 'Splash white: Bant.', 'Your white was 5 points short.'),
        row('down', 'MONO-G', 'Cut the Islands: Mono-Green.', 'Blue was your lowest colour.')], true, 'the down row says "Blue was your lowest colour."'],
      ['BANT', 'Black and red were well behind your three colours.', [row('up', 'WITCH', 'Splash black: Four-colour (no red).', 'Your black was well short.'),
        row('down', 'AZORIUS', 'Cut the Forests: Azorius.', 'Green made the cut easily.')], true, 'the down row says "Green made the cut easily."'],
      ['BANT', 'Black and red were well behind your three colours.', [row('up', 'WITCH', 'Splash black: Four-colour (no red).', 'Your black was well short.'),
        row('down', 'AZORIUS', 'Cut the Forests: Azorius.', 'Green was the lowest of your three colours, 40 points ahead of black.')], true, 'the up row does not say how far short'],
      ['SULTAI', 'White and red were well behind your three colours.', [row('up', 'WITCH', 'Splash white: Four-colour (no red).', 'Your white was 40 points short.'),
        row('down', 'GOLGARI', 'Cut the Islands: Golgari.', 'Blue was the lowest of your three colours.')], true, 'the down row does not say how far ahead'],
      ['DIMIR', 'Green nearly made it in, 4 points behind black.', [row('up', 'SULTAI', "Splash green and you're Sultai.", 'Your green was 4 points short.'),
        row('down', 'MONO-U', "Cut the Swamps and you're Mono-Blue.", 'Black was the weakest of your three.')], true, 'does not name its colour as the weaker of your two'],
      // the fourth readers' pages: a player's colon headline, and "the lower of
      // your two colours", which a fresh reader heard as computed output
      ['DIMIR', 'Green came next, 14 points behind black.', [row('up', 'SULTAI', 'Splash green: Sultai.', 'Your green was 14 points short.'),
        row('down', 'MONO-U', "Cut the Swamps and you're Mono-Blue.", 'Black was the weaker of your two.')], true, 'head "Splash green: Sultai."'],
      ['SELESNYA', 'Blue came next, 20 points behind green.', [row('up', 'BANT', "With blue as well, you'd be Bant.", 'Blue was 20 points short.'),
        row('down', 'MONO-W', "Without green, you'd be Mono-White.", 'Green was the lower of your two colours.')], false, 'does not name its colour as the weaker of your two'],
    ];
    const doorMissed = doorSamples.filter(([id, line, rows, player, flag]) => !doorProblems(rows, line, id, P, N, player).join(' | ').includes(flag))
      .map(([id, line, rows, player]) => `${id}: ${doorProblems(rows, line, id, P, N, player).join('; ') || 'nothing'}`);
    ok('the next-door checker flags "made the cut", "your lowest colour", "the lower of your two colours", a colon headline in either mode, a down row counting again or not saying how far ahead, an up row with no gap, the wrong count of colours and a tie said once', doorMissed.length === 0, doorMissed.join(' | '));
    const doorClean = [
      ['ABZAN', 'Blue nearly made it in, 3 points behind green.', [row('up', 'WITCH', "Splash blue and you're Four-colour (no red).", 'Your blue was 3 points short.'),
        row('down', 'ORZHOV', "Cut the Forests and you're Orzhov.", 'Green was the weakest of your three.')], true],
      ['MONO-G', 'Green was well ahead of every other colour.', [row('up', 'SELESNYA', "With white as well, you'd be Selesnya.", 'White was 52 points short.')], false],
      ['SULTAI', 'White and red were well behind your three colours.', [row('up', 'WITCH', "Splash white and you're Four-colour (no red).", 'Your white was 40 points short.'),
        row('down', 'GOLGARI', "Cut the Islands and you're Golgari.", 'Blue was the weakest of your three, though still 40 points ahead of white.')], true],
      ['DIMIR', 'Green came next, 14 points behind black.', [row('up', 'SULTAI', "With green as well, you'd be Sultai.", 'Green was 14 points short.'),
        row('down', 'MONO-U', "Without black, you'd be Mono-Blue.", 'Black was the weaker of your two.')], false],
      ['WUBRG', 'All five colours finished within 14 points of each other.', [row('down', 'YORE', "Without green, you'd be Four-colour (no green).", 'Green was the weakest of your five.')], false],
    ].filter(([id, line, rows, player]) => doorProblems(rows, line, id, P, N, player).length)
      .map(([id, line, rows, player]) => `${id}: ${doorProblems(rows, line, id, P, N, player).join('; ')}`);
    ok('the next-door checker passes rows that give the gap in points and name the dropped colour as the weaker or weakest of yours', doorClean.length === 0, doorClean.join(' | '));

    // The card-opening checker (section 9), on the old cards' shape and on
    // cards built differently.
    const openingSamples = cardOpeningProblems({
      A: ['Talk to them when one thing happens.', 'Talk to them before another.'],
      B: ['Talk to them when x.'], C: ['Talk to them when y.'], D: ['Talk to them when z.'], E: ['Talk to them when w.'], F: ['Talk to them when v.'],
    });
    ok('the card-opening checker flags two cards on one page opening alike, and one opening on more than six cards',
      openingSamples.some((p) => p.includes('A: two cards open on "talk"')) && openingSamples.some((p) => p.includes('"talk" opens 7 cards')), openingSamples.join(' | '));
    const openingClean = cardOpeningProblems({ A: ['Show them the draft.', 'Ask them why.'], B: ['Ask them how.', "They'll know."] });
    ok('the card-opening checker passes cards that open differently', openingClean.length === 0, openingClean.join(' | '));

    // The voice checker (section 16), on lines the second readers saw.
    const rulesFound = (passages) => [...new Set(voiceProblems(passages).map((v) => v.rule))].sort().join();
    const voiceSamples = [
      [[{ id: 'WITCH', part: 'banter', items: ['We threw you a surprise party once, mostly as an experiment. You thanked us.'] }], 'person'],
      [[{ id: 'DIMIR', part: 'shadows', list: true, items: ['You know things and never say how.'] }], 'person'],
      [[{ id: 'ORZHOV', part: 'shadows', list: true, items: ['Did a colleague a small favour in 2022, and has been collecting on it since.'] }], 'years'],
      [['MONO-U', 'NAYA', 'INK'].map((id) => ({ id, part: 'shadows', list: true, items: ['Quietly grades the room.'] })), 'shapes'],
      [['GRUUL', 'BOROS', 'GLINT'].map((id) => ({ id, part: 'strengths', list: true, items: ['Closes the deal while the others are still arranging the call.'] })), 'shapes'],
      // the third readers' notes that switched voice, and their office props
      [[{ id: 'MONO-G', part: 'shadows', list: true, items: ['The transition was discussed in March, and is still being discussed in October.'] }], 'person'],
      [['MONO-B', 'IZZET'].map((id) => ({ id, part: 'shadows', list: true, items: ['Wins quarters in a way that makes the next quarter harder.'] })), 'props'],
      [[{ id: 'AZORIUS', part: 'colleague cards', items: ['Call on them when the meeting about the meeting has been booked.'] }], 'props'],
      [['MONO-W', 'AZORIUS'].map((id) => ({ id, part: 'banter', items: ["You've been asked to stop quoting the office fridge policy by paragraph number."] })), 'props'],
      [Array.from({ length: 23 }, (x, i) => ({ id: 'P' + i, part: 'banter', items: ['You did a thing.'] })), 'banter'],
      // the office anecdote about some colleague, where a `you` line should be
      [[{ id: 'DIMIR', part: 'you', list: true, items: ['Has spotted three of the last five problems first.'] }], 'person'],
    ].filter(([passages, rule]) => !rulesFound(passages).includes(rule)).map(([passages, rule]) => `${passages[0].items[0]}: wanted ${rule}, got ${rulesFound(passages)}`);
    ok('the voice checker flags "we", a shadow on "You" or "The", a `you` line with no "you", a year, a joke shape or an office prop on several pages, and a closing line on too many', voiceSamples.length === 0, voiceSamples.join(' | '));
    const voiceClean = voiceProblems([
      { id: 'BOROS', part: 'shadows', list: true, items: ["Treats 'let's just send an email' as a form of moral cowardice."] },
      { id: 'IZZET', part: 'strengths', list: true, items: ['Will rebuild a system at 11pm because they thought of a better way at 10:47pm.'] },
      { id: 'BANT', part: 'strengths', list: true, items: ["Asks the quietest person in the room first, and changes the plan when they're right."] },
      { id: 'MONO-U', part: 'you', list: true, items: [...AUTHOR_LINES, 'People come to you upset and go away informed.'] },
    ]);
    ok('the voice checker passes a quoted "let\'s", a time of night, one page with "the room" and `you` lines that open on "You"', voiceClean.length === 0, voiceClean.map((v) => v.detail).join(' | '));

    // The `you` checker (section 16), on made-up pages and on the author's.
    const youRules = (byId) => [...new Set(youProblems(byId).map((v) => v.rule))].sort().join();
    const youSamples = [
      [{ X: ['You keep the receipts.'] }, 'count'],
      [{ X: ['You keep the receipts.', "You're never wrong about money.", 'People ask you first.'] }, 'opening'],
      [{ X: ['You see red at the first queue-jumper.', 'People step back.'] }, 'colour'],
      [{ X: ['You count the cards in your hand twice.', 'People let you deal.'] }, 'magic'],
      [{ 'MONO-U': ['You read the manual.', 'People ask you things.'] }, 'author'],
    ].filter(([byId, rule]) => !youRules(byId).includes(rule)).map(([byId, rule]) => `${JSON.stringify(byId)}: wanted ${rule}, got ${youRules(byId)}`);
    ok('the you checker flags one line, two lines opening alike, a colour, a word from the game, and Mono-Blue without the author\'s lines', youSamples.length === 0, youSamples.join(' | '));
    const youClean = youProblems({ 'MONO-U': [...AUTHOR_LINES, 'People come to you upset and go away informed.'], X: ['You keep the receipts.', 'People ask you first.', "You're never wrong about money."] });
    ok('the you checker passes the author\'s two lines opening alike, and lines that open differently', youClean.length === 0, youClean.map((v) => v.detail).join(' | '));
    win.close();
  }
});
