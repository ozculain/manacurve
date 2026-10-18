#!/usr/bin/env node
'use strict';
// Results-screen smoke test (ported from scripts/_followup/_results_render_check.js).
// Drives showResults() with a fake finished result for a mono, a guild, a
// three-colour, a four-colour and the five-colour identity, in both audience
// modes and with player mode (state.gamingFamiliar) off and on, each on a fresh
// page, and checks that every key element is populated with that identity's
// data. Catches the "showResults throws midway and half the screen stays
// empty" class of bug, and pins the Phase 2 layout: the reveal order and the
// player-mode-only pieces.
// Usage: node tests/render.test.js [path/to/index.html]
const { bootPage, pageArgs, whenReady, isVisible, EXPOSE } = require('./_lib/load');
const { run } = require('./_lib/report');

const WUBRG = ['W', 'U', 'B', 'R', 'G'];
const sorted = (act) => Object.entries(act).sort((a, b) => b[1] - a[1]);
const cand = (id, wins, losses, score) => ({ id, wins, losses, combinedScore: score });
const match = (a, b, winner, i) => ({
  a: { id: a }, b: { id: b }, winner: { id: winner }, loser: { id: winner === a ? b : a },
  type: 'ROUND_ROBIN', scenarioId: 'CRISIS', questionNum: i,
});
const alt = (id, s1, s2, wins, losses) => [id, { s1, s2, combined: s1, wins, losses, isTournament: true }];

// Page constants the checks read back (they are top-level consts, not window properties).
const PAGE_EXPOSE = [...EXPOSE, 'RESULT_COPY', 'ROLES_HIDDEN_FOR_FUN', 'MANA_BASE_LANDS', 'manaBaseLine'];

// typeline: what the card's typeline must say in player mode (section 8: the
// commander's printed type line); rules: its rules text (section 2).
const CASES = [
  {
    id: 'MONO-R', type: 'mono', confidence: 'HIGH',
    activation: { R: 0.86, B: 0.52, G: 0.44, W: 0.21, U: 0.12 },
    line: 'Red was well ahead of every other colour.',
    typeline: 'Legendary Creature — Goblin Warrior',
    rules: 'Trample, haste. At the beginning of the end step, sacrifice this creature.',
    rolesForFun: 'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events',
    share: { consumer: "I'm Mono-Red. What are you?", workplace: "I'm Mono-Red. What are you?" },
    manaBase: '37 lands: 36 Mountain and a Hanweir Battlements.',
    nextDoor: {
      player: [['up', 'RAKDOS', 'Splash black: Rakdos.', 'Your black was 34 points short.']],
      plain: [['up', 'RAKDOS', "With black as well, you'd be Rakdos.", 'Black was 34 points short.']],
    },
    result: { allResults: [], round3Data: { matchHistory: [] } },
  },
  {
    id: 'DIMIR', type: 'guild', confidence: 'MODERATE',
    activation: { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 },
    line: 'Blue and black were well clear of the other three colours.',
    typeline: 'Legendary Creature — Human Ninja',
    rules: 'Whenever a player says something, surveil 1. You have shroud.',
    rolesForFun: 'Strategic Planning, Competitive Intelligence, Investigative Journalism',
    share: { consumer: "I'm Dimir. What are you?", workplace: "I'm Dimir. What are you?" },
    manaBase: '37 lands: Command Tower, Watery Grave, Polluted Delta, Drowned Catacomb, 19 Island, 14 Swamp.',
    nextDoor: {
      player: [['up', 'SULTAI', 'Splash green: Sultai.', 'Your green was 33 points short.'],
        ['down', 'MONO-U', 'Cut the Swamps: Mono-Blue.', 'Black was the lower of your two colours, 33 points ahead of green.']],
      plain: [['up', 'SULTAI', "With green as well, you'd be Sultai.", 'Green was 33 points short.'],
        ['down', 'MONO-U', "Without black, you'd be Mono-Blue.", 'Black was the lower of your two colours, 33 points ahead of green.']],
    },
    result: {
      allResults: [alt('DIMIR', 0.81, 0.75, 2, 1), alt('GRIXIS', 0.74, 0.75, 2, 1), alt('ESPER', 0.66, 0.25, 1, 2), alt('MONO-U', 0.61, 0.25, 1, 2)],
      round3Data: {
        allScores: [cand('DIMIR', 2, 1, 0.81), cand('GRIXIS', 2, 1, 0.74), cand('ESPER', 1, 2, 0.66), cand('MONO-U', 1, 2, 0.61)],
        gap: 1, runnerUp: { id: 'GRIXIS', wins: 2, losses: 1 },
        matchHistory: [
          match('DIMIR', 'GRIXIS', 'DIMIR', 0), match('ESPER', 'MONO-U', 'ESPER', 1), match('DIMIR', 'ESPER', 'DIMIR', 2),
          match('GRIXIS', 'MONO-U', 'GRIXIS', 3), match('DIMIR', 'MONO-U', 'MONO-U', 4), match('GRIXIS', 'ESPER', 'GRIXIS', 5),
        ],
        terminated: true, termReason: { terminate: true, reason: 'EXHAUSTED', message: 'All matches played' },
        cycle: null, scenarioContradiction: null, contextDisagreement: null, isTournament: true,
      },
    },
  },
  {
    id: 'JUND', type: 'three', confidence: 'LOW',
    activation: { R: 0.71, G: 0.69, B: 0.66, W: 0.24, U: 0.18 },
    line: 'White and blue were well behind your three colours, but your answers fitted more than one result.',
    typeline: 'Legendary Creature — Dragon',
    rules: 'Trample. At the beginning of each quarter, sacrifice your weakest creature.',
    rolesForFun: 'Sales, Startups, Professional Sport, Commodity Trading',
    share: { consumer: "I'm Jund. What are you?", workplace: "I'm Jund. What are you?" },
    manaBase: "37 lands: Command Tower, Ziatora's Proving Ground, Blood Crypt, Stomping Ground, Overgrown Tomb, 11 Mountain, 11 Forest, 10 Swamp.",
    nextDoor: {
      player: [['up', 'DUNE', 'Splash white: Four-colour (no blue).', 'Your white was 42 points short.'],
        ['down', 'GRUUL', 'Cut the Swamps: Gruul.', 'Black was the lowest of your three colours, 42 points ahead of white.']],
      plain: [['up', 'DUNE', "With white as well, you'd be Four-colour (no blue).", 'White was 42 points short.'],
        ['down', 'GRUUL', "Without black, you'd be Gruul.", 'Black was the lowest of your three colours, 42 points ahead of white.']],
    },
    result: {
      allResults: [alt('JUND', 0.7, 0.5, 2, 2), alt('GRUUL', 0.68, 0.5, 2, 2), alt('RAKDOS', 0.65, 0.5, 2, 2)],
      round3Data: {
        allScores: [cand('JUND', 2, 2, 0.7), cand('GRUUL', 2, 2, 0.68), cand('RAKDOS', 2, 2, 0.65)],
        gap: 0, runnerUp: { id: 'GRUUL', wins: 2, losses: 2 },
        matchHistory: [match('JUND', 'GRUUL', 'JUND', 0), match('GRUUL', 'RAKDOS', 'GRUUL', 1), match('RAKDOS', 'JUND', 'RAKDOS', 2)],
        cycle: ['JUND', 'GRUUL', 'RAKDOS'], isTournament: true,
      },
    },
  },
  {
    id: 'GLINT', type: 'four', confidence: 'MODERATE',
    activation: { U: 0.66, B: 0.63, R: 0.6, G: 0.58, W: 0.2 },
    line: 'White was well behind your four colours.',
    typeline: 'Legendary Creature — Ogre Wizard',
    rules: "Trample, cascade. Phasing (When the bill arrives, treat this creature as though it doesn't exist.)",
    rolesForFun: 'Venture Capital, Trading, Startups, Activist Investing',
    share: { consumer: "I'm Four-colour (no white). What are you?", workplace: "I'm Four-colour (no white). What are you?" },
    manaBase: '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, six shocks, four Triomes and 23 basics.',
    nextDoor: {
      player: [['up', 'WUBRG', 'Splash white: Five-colour.', 'Your white was 38 points short.'],
        ['down', 'GRIXIS', 'Cut the Forests: Grixis.', 'Green was the lowest of your four colours, 38 points ahead of white.']],
      plain: [['up', 'WUBRG', "With white as well, you'd be Five-colour.", 'White was 38 points short.'],
        ['down', 'GRIXIS', "Without green, you'd be Grixis.", 'Green was the lowest of your four colours, 38 points ahead of white.']],
    },
    result: {
      allResults: [alt('GLINT', 0.64, 0.75, 3, 0), alt('GRIXIS', 0.6, 0.5, 2, 1)],
      round3Data: {
        matchHistory: [match('GLINT', 'GRIXIS', 'GLINT', 0)], gap: 2, runnerUp: { id: 'GRIXIS', wins: 2, losses: 1 },
        scenarioContradiction: { color: 'W' }, contextDisagreement: { color: 'U', agreement: 0.5 },
      },
    },
  },
  {
    id: 'WUBRG', type: 'five', confidence: 'LOW',
    activation: { W: 0.55, U: 0.53, B: 0.52, R: 0.5, G: 0.49 },
    line: 'All five colours finished within 6 points of each other.',
    typeline: 'Legendary Creature — Human Noble',
    rules: 'Changeling. You have every ability. Each works at a fifth of its strength.',
    rolesForFun: 'Consulting, Chief of Staff, Facilitation, Interpreting, General Practice',
    share: { consumer: "I'm Five-colour. What are you?", workplace: "I'm Five-colour. What are you?" },
    manaBase: '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, all ten shocks, all ten Triomes and 13 basics.',
    nextDoor: {
      player: [['down', 'YORE', 'Cut the Forests: Four-colour (no green).', 'Green was the lowest of your five colours.']],
      plain: [['down', 'YORE', "Without green, you'd be Four-colour (no green).", 'Green was the lowest of your five colours.']],
    },
    result: { allResults: [], round3Data: {} },
  },
];

// a precedes b in document order
const before = (win, a, b) => !!(a && b && (a.compareDocumentPosition(b) & win.Node.DOCUMENT_POSITION_FOLLOWING));

// [10] A mana base line is the deck ("37 lands: ...") and, sometimes, a
// maybeboard line after it, outside the 37.
const deckPart = (line) => (line || '').split(' Maybeboard: ')[0];
const maybeboardPart = (line) => ((line || '').split(' Maybeboard: ')[1] || '');

// Lands counted in the deck part: "N Basic" counts N; "six shocks", "four
// Triomes", "all ten shocks" and "all ten Triomes" what they say, and "four
// Triomes and N basics" N more; a mono line's "N Basic and a <land>" N + 1;
// any other land one.
function landCount(line) {
  const m = /^37 lands: (.*)\.$/.exec(deckPart(line));
  if (!m) return -1;
  const mono = /^(\d+) (Plains|Island|Swamp|Mountain|Forest) and an? /.exec(m[1]);
  if (mono) return Number(mono[1]) + 1;
  const WORDS = { four: 4, six: 6, ten: 10 };
  return m[1].split(', ').reduce((sum, item) => {
    let x;
    if ((x = /^(\d+) (Plains|Island|Swamp|Mountain|Forest)$/.exec(item))) return sum + Number(x[1]);
    if ((x = /^(?:all )?(four|six|ten) (?:shocks|Triomes)(?: and (\d+) basics)?$/.exec(item))) return sum + WORDS[x[1]] + Number(x[2] || 0);
    return sum + 1;
  }, 0);
}

// The colours of every land MANA_BASE_LANDS names: a pair land its two, a
// Triome its three, a utility land or a basic its one, the rest none.
function landColours(L) {
  const map = new Map();
  Object.entries(L.basics).forEach(([c, name]) => map.set(name, c));
  Object.entries(L.pairs).forEach(([k, p]) => [p.shock, p.fetch, p.check].forEach((name) => map.set(name, k)));
  Object.entries(L.triples).forEach(([k, t]) => map.set(t.triome, k));
  Object.entries(L.mono).forEach(([c, name]) => map.set(name, c));
  [L.commandTower, ...L.wide].forEach((name) => map.set(name, ''));
  return map;
}

// Named lands in the deck part that carry a colour outside the identity.
function offIdentityLands(line, colours, map) {
  const deck = deckPart(line);
  return [...map].filter(([name, cols]) => deck.includes(name) && ![...cols].every((c) => colours.includes(c))).map(([name]) => name);
}

// [4] Label words, the same in both modes. The line under each is one sentence
// about the result's own bars (each case's `line`), with no number until
// Phase 5 measures real results. Nothing else is stacked under them
// (tests/visible-copy.test.js holds the block to that, and the line to its bars).
const LABELS = {
  HIGH: { word: 'Locked in' },
  MODERATE: { word: 'Leaning' },
  LOW: { word: 'Still shuffling' },
};
// The banner names the card: the commander in player mode, the art's source
// otherwise. Only player mode has the commander block beside Natural Roles.
const BANNER_CARD = { player: (card) => `Commander · ${card}`, plain: (card) => `Card art: ${card}` };
// [4] The bars' title by mode; the caption is the same in both.
const BARS_TITLE = { player: 'Your Mana Pool', plain: 'Your colours' };

function checkRender(win, h, c, audience, player, threw, errors) {
  const d = win.document, p = h.PROFILES[c.id], problems = [];
  const el = (id) => d.getElementById(id);
  const text = (id) => ((el(id) || {}).textContent || '').trim();
  const shown = (id) => !!el(id) && !el(id).classList.contains('hidden') && el(id).style.display !== 'none';
  // shown, and so is every element around it
  const visible = (id) => {
    for (let n = el(id); n; n = n.parentElement) if (n.classList.contains('hidden') || n.style.display === 'none') return false;
    return !!el(id);
  };
  const need = (cond, what) => { if (!cond) problems.push(what); };
  const PLACEHOLDERS = ['', '…', '—', 'Description', 'Roles', 'Banter', 'Explanation', 'Tagline'];
  const real = (id) => need(!PLACEHOLDERS.includes(text(id)) && !text(id).includes('IDENTITY'), `${id} placeholder "${text(id).slice(0, 40)}"`);
  // Player-mode copy shows only with gamingFamiliar on, and never in workplace mode.
  const playerCopy = player && audience === 'consumer';

  need(!threw, 'showResults threw: ' + threw);
  need(errors.length === 0, 'console/jsdom errors: ' + errors.slice(0, 2).join(' | '));
  need(isVisible(win, 'screen-results'), 'results screen hidden');
  need(text('res-id') === p.name.trim(), `res-id "${text('res-id')}"`);
  need(text('res-tag') === p.tag.trim(), 'res-tag');
  need(text('res-typeline-name') === h.RESULT_COPY.names[c.id], 'res-typeline-name');
  // The commander block: the card's name and text in player mode; none
  // otherwise, and Natural Roles takes the full width.
  if (playerCopy) {
    need(visible('res-cmd-aside') && text('cmd-title-aside') === 'Commander' && text('cmd-name-aside') === (p.cmd || '').trim() && text('cmd-name-aside') !== '', 'commander block');
    need(text('cmd-desc-aside') === (p.cmdDesc || '').trim() && text('cmd-desc-aside') !== '', `cmd-desc-aside "${text('cmd-desc-aside')}"`);
  } else {
    need(!visible('res-cmd-aside') && text('cmd-desc-aside') === '' && el('res-roles-grid').style.gridTemplateColumns === '1fr', 'commander block shown outside player mode, or the roles not at full width');
  }
  need(d.querySelectorAll('#strengths li').length === p.str.length && p.str.length > 0, 'strengths list');
  need(d.querySelectorAll('#weaknesses li').length === p.weak.length && p.weak.length > 0, 'shadows list');
  for (const id of ['roles', 'res-desc', 'identity-exp', 'share-preview']) real(id);
  need(!el('conf-exp'), 'the old confidence explanation (#conf-exp) is back');
  need(el('conf-badge').dataset.level === c.confidence.toLowerCase(), 'confidence badge level');
  need(d.querySelectorAll('#res-banner-pips .mc-pip').length === p.colors.length, 'banner pips');

  // 1. The reveal lands first: commander, name, tagline, then (player mode)
  //    the identity as a card: the typeline, the rules text directly under
  //    it, the collector number at its foot. Then the philosophy, with the
  //    confidence badge and its one line after it, then the quality line's
  //    place (hidden here: these answers raise no quality flag).
  need(text('res-banner-commander') === BANNER_CARD[playerCopy ? 'player' : 'plain'](p.cmd), 'banner commander ' + text('res-banner-commander'));
  need(before(win, el('res-id'), el('res-tag')) && before(win, el('res-tag'), el('identity-exp')), 'name and tagline should precede the philosophy');
  need(before(win, el('identity-exp'), el('conf-badge')), 'confidence badge should follow the philosophy');
  need(before(win, el('conf-base-rate'), el('quality-warning')) && before(win, el('quality-warning'), el('res-bars-title')),
    'the quality line should sit between the confidence line and the bars');
  need(!shown('quality-warning') && text('quality-warning') === '', `a quality line with no flag raised: "${text('quality-warning')}"`);
  need(text('identity-exp') === p.philosophy.trim(), 'philosophy text');
  // 8. One typeline on the page: the card's in player mode, the "Personality"
  //    divider's in plain mode. The scoring version closes the methodology,
  //    under "View Full Breakdown", in every mode, and is not in the footer.
  const collector = `MC1 • EN • ${String(Object.keys(h.PROFILES).indexOf(c.id) + 1).padStart(3, '0')}/031`;
  if (playerCopy) {
    need(visible('res-idcard') && text('res-typeline') === c.typeline, `typeline "${text('res-typeline')}" != "${c.typeline}"`);
    need(before(win, el('res-tag'), el('res-typeline')) && before(win, el('res-typeline'), el('res-rules'))
      && before(win, el('res-rules'), el('res-collector')) && before(win, el('res-collector'), el('identity-exp')),
      'the card should read name, tagline, typeline, rules text, collector number, then the philosophy');
    need(!el('res-banner-commander').parentElement.contains(el('res-typeline')), 'typeline under the commander');
    need(text('res-collector') === collector, `collector number "${text('res-collector')}" != "${collector}"`);
    need(!visible('res-personality'), 'a second typeline (the Personality divider) in player mode');
  } else {
    need(!visible('res-idcard') && !visible('res-typeline') && text('res-typeline') === '' && text('res-collector') === '', 'card shown outside player mode');
    need(visible('res-personality') && text('res-personality').replace(/\s+/g, ' ') === 'Personality · ' + h.RESULT_COPY.names[c.id], `divider "${text('res-personality')}"`);
  }
  need(text('res-version') === 'Scoring version 1.' && el('unified-breakdown').contains(el('res-version')) && !visible('res-version'),
    `scoring version "${text('res-version')}" should close the methodology, out of sight until the breakdown opens`);

  const rows = [...d.querySelectorAll('#res-profile-bars .mc-profile__row')];
  need(rows.length === 5, `expected 5 profile rows, got ${rows.length}`);
  if (rows.length === 5) {
    const pcts = rows.map((r) => (r.querySelector('.mc-profile__pct') || {}).textContent || '');
    const want = WUBRG.map((col) => Math.round(c.activation[col] * 100) + '%');
    need(pcts.join(',') === want.join(','), `bars ${pcts.join(',')} != ${want.join(',')}`);
    const lit = rows.map((r) => !!r.querySelector('.mc-pip.is-lit'));
    need(lit.join() === WUBRG.map((col) => p.colors.includes(col)).join(), 'lit pips do not match the identity colours');
  }

  const banter = el('res-counter-section'), disclaimer = el('workplace-disclaimer');
  const share = text('share-preview');
  need(share.includes(h.buildResultURL()), 'share preview lacks the result link');
  // 10. The share text asks a friend: the first line names the identity and
  //     asks theirs. Workplace mode always uses line one.
  need(share.split('\n')[0] === c.share[audience], `share line "${share.split('\n')[0]}" != "${c.share[audience]}"`);
  if (audience === 'workplace') {
    need(banter && banter.style.display === 'none', 'pub banter visible in workplace mode');
    need(disclaimer && disclaimer.style.display !== 'none', 'workplace disclaimer hidden');
    need(!p.pubBanter || !share.includes(p.pubBanter.replace(/^"|"$/g, '')), 'banter in workplace share preview');
  } else {
    // Consumer mode shows the banter when the profile has one, under its
    // label, which is text so a copied page or a screen reader keeps it; a
    // profile with none shows no box.
    need(banter && (banter.style.display !== 'none') === !!p.pubBanter, `pub banter ${banter && banter.style.display !== 'none' ? 'shown' : 'hidden'} for a profile ${p.pubBanter ? 'with' : 'without'} one`);
    need(text('res-counter-label') === 'Pub banter' && banter.contains(el('res-counter-label')), `banter label "${text('res-counter-label')}"`);
    need(disclaimer && disclaimer.style.display === 'none', 'workplace disclaimer shown in consumer mode');
    if (p.pubBanter) real('res-counter');
  }
  // 2. Next door replaces the old LOW/MODERATE-only alternatives box and shows
  //    at every confidence level: up adds the strongest unlit colour, down
  //    drops the weakest lit one; mono has no down row, five-colour no up row.
  //    It sits directly below the commander block and its mana base (the
  //    editor's decision), and each row is a chip followed by its own panel.
  need(!el('alternative-results'), 'the old alternatives box is still in the page');
  need(shown('next-door') && before(win, el('res-profile-bars'), el('next-door')) && before(win, el('cmd-desc-aside'), el('next-door'))
    && before(win, el('res-mana-base'), el('next-door')) && before(win, el('next-door'), el('relations-detail')),
  'next-door row missing or out of place (it sits directly below the commander block and its mana base)');
  const chips = [...d.querySelectorAll('#next-door-chips .mc-nextdoor__chip')].map((chip) => [
    chip.dataset.dir, chip.dataset.id,
    (chip.querySelector('.mc-nextdoor__head') || {}).textContent, (chip.querySelector('.mc-nextdoor__why') || {}).textContent,
  ]);
  const wantChips = c.nextDoor[playerCopy ? 'player' : 'plain'];
  need(JSON.stringify(chips) === JSON.stringify(wantChips), `next door ${JSON.stringify(chips)} != ${JSON.stringify(wantChips)}`);
  const ownPanels = [...d.querySelectorAll('#next-door-chips .mc-nextdoor__chip')].every((chip) => {
    const panel = chip.nextElementSibling;
    return panel && panel.classList.contains('mc-nextdoor__panel') && panel.id === chip.getAttribute('aria-controls')
      && panel.classList.contains('hidden') && chip.getAttribute('aria-expanded') === 'false';
  });
  need(ownPanels, 'each next-door row should have its own closed panel');
  need(text('next-door-prompt') === (playerCopy ? 'Appeal this ruling' : 'The results one colour away from yours.'), `next-door prompt "${text('next-door-prompt')}"`);
  need(text('next-door-all') === 'None of these. Show me all 31.', `all-31 link "${text('next-door-all')}"`);

  // 3. Label words in both modes, and under each one sentence about this
  //    result's bars (the same in both modes; no number but a gap in the
  //    bars' own points, and no small print before Phase 5), no rarity mark.
  const label = LABELS[c.confidence];
  need(text('conf-badge') === label.word, `label "${text('conf-badge')}" != "${label.word}"`);
  need(text('conf-base-rate') === c.line, `line under the label "${text('conf-base-rate')}" != "${c.line}"`);
  need(!/\d|%/.test(text('conf-base-rate').replace(/\b\d+ points?\b/g, '')) && !el('conf-small-print'), 'a number other than a gap in points, or small print, in the base rate before Phase 5');
  need(before(win, el('identity-exp'), el('conf-base-rate')), 'base rate should follow the philosophy');
  need(!/confidence|mythic|rare|uncommon|sleeve|proxy/i.test(text('conf-badge') + ' ' + text('conf-base-rate')), 'old confidence wording, a rarity word or a cut tail in the label');

  // 4. The bars: "Your Mana Pool" in player mode, "Your colours" otherwise,
  //    and the same caption in every mode.
  need(text('res-bars-title') === BARS_TITLE[playerCopy ? 'player' : 'plain'] && el('res-bars-title') === el('res-bars-caption').previousElementSibling,
    `bars title "${text('res-bars-title')}"`);
  need(text('res-bars-caption') === 'How often you picked each colour when it was offered.', `bars caption "${text('res-bars-caption')}"`);
  need(before(win, el('res-bars-caption'), el('res-profile-bars')), 'caption should sit above the bars');

  // 5. Rules-text strip, player mode only, on the card (its place is checked
  //    with the typeline above), with bracketed reminder text in italics.
  if (playerCopy) {
    need(visible('res-rules') && text('res-rules') === c.rules, `rules strip "${text('res-rules')}" != "${c.rules}"`);
    need(!text('res-rules').includes('(') || (el('res-rules').querySelector('i') || {}).textContent === text('res-rules').match(/\([^)]*\)/)[0],
      'bracketed reminder text should be in italics');
  } else {
    need(!visible('res-rules') && text('res-rules') === '', 'rules strip shown outside player mode');
  }

  // 6. Mana base at the foot of the commander block, player mode only: 37
  //    lands, none of them outside the identity's colours.
  if (playerCopy) {
    need(shown('res-mana-base') && text('res-mana-base') === c.manaBase, `mana base "${text('res-mana-base')}" != "${c.manaBase}"`);
    need(landCount(text('res-mana-base')) === 37, `mana base counts ${landCount(text('res-mana-base'))} lands`);
    const off = offIdentityLands(text('res-mana-base'), p.colors, landColours(h.MANA_BASE_LANDS));
    need(off.length === 0, 'off-identity lands in the deck: ' + off.join(', '));
    need(before(win, el('cmd-desc-aside'), el('res-mana-base')), 'mana base should sit under the commander');
  } else {
    need(!shown('res-mana-base') && text('res-mana-base') === '', 'mana base shown outside player mode');
  }

  // 11. Consumer mode leaves the corporate-sounding roles out; workplace keeps them all.
  const wantRoles = audience === 'workplace' ? p.roles : c.rolesForFun;
  need(text('roles') === wantRoles, `roles "${text('roles')}" != "${wantRoles}"`);
  if (audience === 'consumer') {
    const hidden = text('roles').split(', ').filter((r) => h.ROLES_HIDDEN_FOR_FUN.includes(r));
    need(hidden.length === 0, 'consumer roles still list ' + hidden.join(', '));
  }

  // Workplace mode gets the plain copy throughout: no Magic nods, no banter.
  if (audience === 'workplace') {
    const plainText = ['res-idcard', 'res-bars-title', 'next-door', 'conf-base-rate', 'res-mana-base']
      .filter(visible).map((id) => text(id)).join(' ');
    need(!/splash|cut the|sleeve|proxy|on the stack|respond|legendary|37 lands|mana pool|maybeboard|ruling/i.test(plainText), 'Magic-flavoured copy in workplace mode');
  }
  return problems;
}

// A fresh page with a fake finished result rendered by showResults().
async function renderCase(c, audience, player, seed, extra = {}) {
  const { win, h, errors } = bootPage({ ...pageArgs(), seed, expose: PAGE_EXPOSE });
  await whenReady(win);
  h.selectAudience(audience);
  const s = h.state;
  s.gamingFamiliar = player;
  s.result = { identity: c.id, confidence: c.confidence, ...JSON.parse(JSON.stringify(c.result)), ...extra };
  s.activationSorted = sorted(c.activation);
  s.responses = new Array(30).fill({ c: h.PROFILES[c.id].colors[0] });
  s.qualityFlags = { totalAnswered: 30, alwaysLeftCount: 5, allNeitherCount: 2, fastResponseCount: 1 };
  s.disclaimerAcknowledged = true;
  let threw = null;
  try { h.showResults(); } catch (e) { threw = e.message; }
  return { win, h, errors, threw };
}

run('render', async (t) => {
  let seed = 100;
  for (const c of CASES) {
    for (const audience of ['consumer', 'workplace']) {
      for (const player of [false, true]) {
        const { win, h, errors, threw } = await renderCase(c, audience, player, seed++);
        const problems = checkRender(win, h, c, audience, player, threw, errors);
        t.ok(`results render ${c.id} (${c.type}, ${c.confidence}) ${audience}, player mode ${player ? 'on' : 'off'}`, problems.length === 0, problems.join('; '));
        win.close();
      }
    }
  }

  const DIMIR = CASES.find((c) => c.id === 'DIMIR');
  const text = (win, id) => (win.document.getElementById(id).textContent || '').trim();

  // [4] Every scoring version prints the same sentence and no number; the
  // Phase 5 lines ({pct}, {date}) wait in RESULT_COPY and print nowhere.
  {
    const { win, h, errors, threw } = await renderCase(DIMIR, 'consumer', true, seed++, { scoringVersion: 2 });
    const L = h.RESULT_COPY.labels;
    const waiting = ['HIGH', 'MODERATE', 'LOW'].every((k) => /\{pct\}%/.test(L[k].phase5)) && /\{date\}/.test(h.RESULT_COPY.phase5SmallPrint);
    const page = win.document.getElementById('screen-results').textContent;
    t.ok('base rate: scoring version 2 in player mode prints the sentence with no number; the Phase 5 lines wait unused',
      !threw && errors.length === 0 && text(win, 'conf-base-rate') === DIMIR.line && waiting && !/held up when tested|\{pct\}/.test(page),
      `${threw || ''} ${text(win, 'conf-base-rate')}`);
    win.close();
  }

  // The line under the label reads the bars: the closest call, in points as
  // the bars print them, on Dimir with green within one answer (8 points), a
  // few answers and well short, tied, and above black (an old link's bars);
  // Mono-Red close to black; five colours level and 14 points apart; and a
  // link with no bars. Plain mode, so nothing else differs.
  {
    const LINES = [
      ['DIMIR', 'MODERATE', { U: 0.78, B: 0.64, G: 0.6, W: 0.22, R: 0.11 }, 'Green nearly made it in, 4 points behind black.'],
      ['DIMIR', 'MODERATE', { U: 0.78, B: 0.64, G: 0.57, W: 0.22, R: 0.11 }, 'Green nearly made it in, 7 points behind black.'],
      ['DIMIR', 'HIGH', { U: 0.78, B: 0.64, G: 0.5, W: 0.22, R: 0.11 }, 'Green came next, 14 points behind black.'],
      ['DIMIR', 'LOW', { U: 0.78, B: 0.64, G: 0.42, W: 0.22, R: 0.11 }, 'Green came next, 22 points behind black.'],
      ['DIMIR', 'LOW', { U: 0.78, B: 0.64, G: 0.641, W: 0.22, R: 0.11 }, 'Green tied with black, the lower of your two colours.'],
      ['DIMIR', 'LOW', { U: 0.78, B: 0.6, G: 0.64, W: 0.22, R: 0.11 }, 'Green edged ahead of black, though black is the one in your result.'],
      ['MONO-R', 'MODERATE', { R: 0.7, B: 0.6, G: 0.44, W: 0.21, U: 0.12 }, 'Red led black by 10 points.'],
      ['WUBRG', 'MODERATE', { W: 0.5, U: 0.5, B: 0.5, R: 0.5, G: 0.5 }, 'All five colours finished level.'],
      ['WUBRG', 'HIGH', { W: 0.66, U: 0.62, B: 0.58, R: 0.55, G: 0.52 }, 'All five colours finished within 14 points of each other.'],
      ['DIMIR', 'MODERATE', { U: 0, B: 0, G: 0, W: 0, R: 0 }, 'This link shows Dimir without the answers behind it.'],
    ];
    const problems = [];
    for (const [id, confidence, activation, want] of LINES) {
      const c = { id, confidence, activation, result: { allResults: [], round3Data: {} } };
      const { win, errors, threw } = await renderCase(c, 'consumer', false, seed++);
      const got = text(win, 'conf-base-rate');
      if (threw || errors.length || got !== want) problems.push(`${id} ${JSON.stringify(activation)}: "${got}" ${threw || errors[0] || ''}`);
      win.close();
    }
    t.ok('the line under the label: the closest call in the bars, in points, tied, above, five level and no bars', problems.length === 0, problems.join('; '));
  }

  // [8] The typeline is the commander's own printed type line: the drafts'
  // five examples as rendered in player mode (the collector number carrying
  // scoring version 2), and a well-formed line for every identity.
  {
    const FIVE = [
      ['MONO-U', 'Legendary Creature — Human Artificer'],
      ['DIMIR', 'Legendary Creature — Human Ninja'],
      ['ESPER', 'Legendary Artifact Creature — Sphinx'],
      ['MARDU', 'Legendary Creature — Human Warrior'],
      ['WUBRG', 'Legendary Creature — Human Noble'],
    ];
    const problems = [];
    let typelines = {}, ids = [];
    for (const [id, want] of FIVE) {
      const c = { id, confidence: 'HIGH', activation: { W: 0.55, U: 0.54, B: 0.53, R: 0.52, G: 0.51 }, result: { allResults: [], round3Data: {} } };
      const { win, h, errors, threw } = await renderCase(c, 'consumer', true, seed++, { scoringVersion: 2 });
      if (threw || errors.length) problems.push(`${id}: ${threw || errors[0]}`);
      if (text(win, 'res-typeline') !== want) problems.push(`${id} "${text(win, 'res-typeline')}" != "${want}"`);
      if (!/^MC2 • EN • \d{3}\/031$/.test(text(win, 'res-collector'))) problems.push(`${id} collector "${text(win, 'res-collector')}"`);
      typelines = h.RESULT_COPY.typeline;
      ids = Object.keys(h.PROFILES);
      win.close();
    }
    const malformed = ids.filter((id) => !/^Legendary (Artifact )?Creature — [A-Z][a-z]+( [A-Z][a-z]+)*$/.test(typelines[id] || ''));
    if (malformed.length || ids.length !== 31) problems.push('malformed or missing typelines: ' + malformed.join(', '));
    t.ok('typeline: the five examples render as printed (section 8), and all 31 are type lines', problems.length === 0, problems.join('; '));
  }

  // [3] Next door reasons, from the drafts' worked examples, in player and
  // plain modes: the colon headline in player mode and a sentence otherwise,
  // whatever the gap; one plain reason, the up row giving the gap in points
  // and the down row naming the colour as the lowest of yours, with how far it
  // was ahead of the colour outside only when the line under the label had not
  // counted it (a gap well clear); a four-colour neighbour by its sentence
  // name; a tie and an old link's inverted bars said as they are; and the one
  // row of five colours, which says only which colour was lowest.
  {
    const EXAMPLES = [
      ['MONO-U', { U: 0.70, B: 0.64, W: 0.30, R: 0.20, G: 0.10 }, {
        player: [['up', 'DIMIR', 'Splash black: Dimir.', 'Your black was 6 points short.']],
        plain: [['up', 'DIMIR', "With black as well, you'd be Dimir.", 'Black was 6 points short.']],
      }],
      ['MONO-R', { R: 0.85, G: 0.45, W: 0.30, U: 0.20, B: 0.10 }, {
        player: [['up', 'GRUUL', 'Splash green: Gruul.', 'Your green was 40 points short.']],
        plain: [['up', 'GRUUL', "With green as well, you'd be Gruul.", 'Green was 40 points short.']],
      }],
      ['BOROS', { W: 0.70, R: 0.62, U: 0.45, B: 0.20, G: 0.10 }, {
        player: [['up', 'JESKAI', 'Splash blue: Jeskai.', 'Your blue was 17 points short.'],
          ['down', 'MONO-W', 'Cut the Mountains: Mono-White.', 'Red was the lower of your two colours.']],
        plain: [['up', 'JESKAI', "With blue as well, you'd be Jeskai.", 'Blue was 17 points short.'], ['down', 'MONO-W', "Without red, you'd be Mono-White.", 'Red was the lower of your two colours.']],
      }],
      ['ESPER', { W: 0.62, U: 0.70, B: 0.66, G: 0.20, R: 0.10 }, {
        player: [['up', 'WITCH', 'Splash green: Four-colour (no red).', 'Your green was 42 points short.'],
          ['down', 'DIMIR', 'Cut the Plains: Dimir.', 'White was the lowest of your three colours, 42 points ahead of green.']],
        plain: [['up', 'WITCH', "With green as well, you'd be Four-colour (no red).", 'Green was 42 points short.'],
          ['down', 'DIMIR', "Without white, you'd be Dimir.", 'White was the lowest of your three colours, 42 points ahead of green.']],
      }],
      ['DIMIR', { U: 0.78, B: 0.64, G: 0.60, W: 0.22, R: 0.11 }, {
        player: [['up', 'SULTAI', 'Splash green: Sultai.', 'Your green was 4 points short.'],
          ['down', 'MONO-U', 'Cut the Swamps: Mono-Blue.', 'Black was the lower of your two colours.']],
        plain: [['up', 'SULTAI', "With green as well, you'd be Sultai.", 'Green was 4 points short.'], ['down', 'MONO-U', "Without black, you'd be Mono-Blue.", 'Black was the lower of your two colours.']],
      }],
      ['DIMIR', { U: 0.78, B: 0.641, G: 0.64, W: 0.22, R: 0.11 }, {
        player: [['up', 'SULTAI', 'Splash green: Sultai.', 'Your green tied with black.'], ['down', 'MONO-U', 'Cut the Swamps: Mono-Blue.', 'Black tied with green.']],
        plain: [['up', 'SULTAI', "With green as well, you'd be Sultai.", 'Green tied with black.'], ['down', 'MONO-U', "Without black, you'd be Mono-Blue.", 'Black tied with green.']],
      }],
      ['DIMIR', { U: 0.78, B: 0.60, G: 0.64, W: 0.22, R: 0.11 }, {
        player: [['up', 'SULTAI', 'Splash green: Sultai.', 'Your green finished above black.'], ['down', 'MONO-U', 'Cut the Swamps: Mono-Blue.', 'Black finished below green.']],
        plain: [['up', 'SULTAI', "With green as well, you'd be Sultai.", 'Green finished above black.'], ['down', 'MONO-U', "Without black, you'd be Mono-Blue.", 'Black finished below green.']],
      }],
      ['WUBRG', { W: 0.66, U: 0.62, B: 0.58, R: 0.55, G: 0.52 }, {
        player: [['down', 'YORE', 'Cut the Forests: Four-colour (no green).', 'Green was the lowest of your five colours.']],
        plain: [['down', 'YORE', "Without green, you'd be Four-colour (no green).", 'Green was the lowest of your five colours.']],
      }],
    ];
    const problems = [];
    for (const [id, activation, want] of EXAMPLES) {
      for (const [audience, player] of [['consumer', true], ['consumer', false], ['workplace', true]]) {
        const c = { id, confidence: 'MODERATE', activation, result: { allResults: [], round3Data: {} } };
        const { win, errors, threw } = await renderCase(c, audience, player, seed++);
        const got = [...win.document.querySelectorAll('#next-door-chips .mc-nextdoor__chip')].map((chip) => [
          chip.dataset.dir, chip.dataset.id, chip.querySelector('.mc-nextdoor__head').textContent, chip.querySelector('.mc-nextdoor__why').textContent,
        ]);
        const mode = player && audience === 'consumer' ? 'player' : 'plain';
        if (threw || errors.length) problems.push(`${id} ${audience}: ${threw || errors[0]}`);
        if (JSON.stringify(got) !== JSON.stringify(want[mode])) problems.push(`${id} ${audience} ${mode}: ${JSON.stringify(got)}`);
        win.close();
      }
    }
    t.ok('next door: the worked examples read as drafted, in player and plain modes', problems.length === 0, problems.join('; '));
  }

  // [10] The drafts' sample lines, rendered: Dimir with green one answer short
  // (the plan's sample, made legal: the Triome is a maybeboard line), mono,
  // three colours within an answer, four colours and five.
  const MANA_SAMPLES = [
    ['DIMIR', { U: 0.70, B: 0.66, G: 0.60, W: 0.20, R: 0.10 },
      '37 lands: Command Tower, Watery Grave, Polluted Delta, Drowned Catacomb, 17 Island, 16 Swamp. Maybeboard: Zagoth Triome.'],
    ['MONO-G', { G: 0.90, W: 0.40, R: 0.30, U: 0.20, B: 0.10 },
      "37 lands: 36 Forest and a Gaea's Cradle."],
    ['NAYA', { R: 0.70, G: 0.68, W: 0.64, U: 0.30, B: 0.20 },
      "37 lands: Command Tower, Jetmir's Garden, Stomping Ground, Temple Garden, Sacred Foundry, 11 Mountain, 11 Forest, 10 Plains."],
    ['WITCH', { W: 0.66, U: 0.65, B: 0.64, G: 0.60, R: 0.20 },
      '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, six shocks, four Triomes and 23 basics.'],
    ['WUBRG', { W: 0.55, U: 0.53, B: 0.52, R: 0.50, G: 0.49 },
      '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, all ten shocks, all ten Triomes and 13 basics.'],
  ];
  // The maybeboard on five recorded links' bars and a close four-colour
  // result: one answer short and a few short both get "Maybeboard: <land>.",
  // and a mono line names its utility land with no joke after it.
  const MAYBEBOARDS = [
    ['MONO-W', { W: 0.70, U: 0.22, B: 0.34, R: 0.40, G: 0.58 },
      '37 lands: 36 Plains and a Castle Ardenvale. Maybeboard: Temple Garden.'],
    ['MONO-B', { W: 0.35, U: 0.33, B: 0.73, R: 0.46, G: 0.58 },
      '37 lands: 36 Swamp and a Cabal Coffers. Maybeboard: Overgrown Tomb.'],
    ['RAKDOS', { W: 0.48, U: 0.28, B: 0.49, R: 0.83, G: 0.24 },
      '37 lands: Command Tower, Blood Crypt, Bloodstained Mire, Dragonskull Summit, 21 Mountain, 12 Swamp. Maybeboard: Savai Triome.'],
    ['ESPER', { W: 0.68, U: 0.48, B: 0.59, R: 0.33, G: 0.15 },
      "37 lands: Command Tower, Raffine's Tower, Hallowed Fountain, Watery Grave, Godless Shrine, 13 Plains, 11 Swamp, 8 Island. Maybeboard: Savai Triome."],
    ['TEMUR', { W: 0.33, U: 0.62, B: 0.09, R: 0.42, G: 0.68 },
      "37 lands: Command Tower, Ketria Triome, Breeding Pool, Steam Vents, Stomping Ground, 13 Forest, 12 Island, 7 Mountain. Maybeboard: Spara's Headquarters."],
    ['GLINT', { U: 0.66, B: 0.63, R: 0.60, G: 0.58, W: 0.52 },
      '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, six shocks, four Triomes and 23 basics. Maybeboard: Hallowed Fountain.'],
  ];
  for (const [label, list] of [['sample', MANA_SAMPLES], ['maybeboard', MAYBEBOARDS]]) {
    for (const [id, activation, want] of list) {
      const c = { id, confidence: 'HIGH', activation, result: { allResults: [], round3Data: {} } };
      const { win, errors, threw } = await renderCase(c, 'consumer', true, seed++);
      const got = text(win, 'res-mana-base');
      t.ok(`mana base ${label} ${id}`, !threw && errors.length === 0 && got === want && landCount(got) === 37, `${threw || ''} "${got}" (${landCount(got)} lands)`);
      win.close();
    }
  }

  // [10] Every identity, with its up neighbour one answer, a few answers and
  // well short: 37 lands; Command Tower first in every two- and three-colour
  // base, the four colourless lands first in four and five; no land in the
  // deck outside the identity's colours; and a maybeboard line exactly when
  // the up neighbour qualifies (one or a few short), holding a land that
  // brings in that colour and no other outside one.
  {
    const { win, h, errors } = bootPage({ ...pageArgs(), seed: seed++, expose: PAGE_EXPOSE });
    await whenReady(win);
    const L = h.MANA_BASE_LANDS, colourOf = landColours(L), problems = [];
    const tail = { one: '.', few: '.' };
    for (const [id, prof] of Object.entries(h.PROFILES)) {
      const lit = prof.colors;
      for (const [margin, gap] of [['one', 0.05], ['few', 0.15], ['well', 0.4]]) {
        // Lit bars within an answer of each other; the strongest unlit colour
        // `gap` below the weakest lit one; the rest well below.
        const act = {}, out = WUBRG.filter((c) => !lit.includes(c));
        lit.forEach((c, i) => { act[c] = 0.7 - 0.01 * i; });
        out.forEach((c, i) => { act[c] = i === 0 ? 0.7 - 0.01 * (lit.length - 1) - gap : 0.1 - 0.01 * i; });
        const line = h.manaBaseLine(id, act);
        const where = `${id} ${margin}: "${line}"`;
        if (landCount(line) !== 37) problems.push(`${where} counts ${landCount(line)}`);
        const off = offIdentityLands(line, lit, colourOf);
        if (off.length) problems.push(`${where} has ${off.join(', ')} in the deck`);
        const opens = lit.length >= 4 ? '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, '
          : lit.length >= 2 ? '37 lands: Command Tower, ' : '37 lands: 36 ';
        if (!line.startsWith(opens)) problems.push(`${where} should open "${opens}"`);
        const mb = maybeboardPart(line);
        const qualifies = out.length > 0 && margin !== 'well';
        if (!!mb !== qualifies) problems.push(`${where} maybeboard ${mb ? 'shown' : 'missing'}`);
        if (mb) {
          const land = mb.replace(/\.$/, '');
          const cols = colourOf.get(land) || '';
          const outside = [...cols].filter((c) => !lit.includes(c));
          if (!mb.endsWith(tail[margin]) || outside.length !== 1 || outside[0] !== out[0]) problems.push(`${where} maybeboard land ${land} (${cols})`);
          if (lit.length === 1 && !deckPart(line).endsWith(`and a ${L.mono[lit[0]]}.`)) problems.push(`${where} carries a joke after its utility land`);
        }
      }
    }
    if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
    t.ok('mana base: all 31 identities, 37 lands, Command Tower, no off-identity land in the deck, maybeboard only when a neighbour qualifies',
      problems.length === 0, problems.slice(0, 6).join('; '));
    win.close();
  }

  // What decided the result. Engine 2 (the default) weighs all the answers,
  // so the reported identity can lack the best Round 3 record: the Round 3
  // line in "How we read you" says what decided it, and says so plainly when
  // the record was not the best. Engine 1 (?engine=1) keeps "finished with
  // the best record". The confidence block says none of it: under either
  // engine it is the label and its one line.
  {
    const notBest = JSON.parse(JSON.stringify(DIMIR.result));
    notBest.round3Data.allScores = [cand('DIMIR', 1, 2, 0.81), cand('GRIXIS', 3, 0, 0.74), cand('ESPER', 1, 2, 0.66), cand('MONO-U', 1, 2, 0.61)];
    notBest.round3Data.runnerUp = { id: 'GRIXIS', wins: 3, losses: 0 };
    const R3 = [
      ['engine 2, the winner lacks the best record', notBest, 2,
        'Dimir won on the weight of all your answers, though not with the best record in this round (1W-2L). Grixis came next (3W-0L).'],
      ['engine 2, the winner shares the best record', DIMIR.result, 2,
        'Dimir won on the weight of all your answers (2W-1L in this round). Grixis came next (2W-1L).'],
      ['engine 1 keeps its line', DIMIR.result, 1,
        'DIMIR finished with the best record (2W-1L), ahead of GRIXIS (2W-1L).'],
    ];
    for (const [what, result, version, want] of R3) {
      const { win, errors, threw } = await renderCase({ ...DIMIR, result }, 'consumer', false, seed++, { scoringVersion: version });
      const got = text(win, 'round3-testing-explanation');
      const block = win.document.querySelector('.mc-verdict-status').textContent.replace(/\s+/g, ' ').trim();
      t.ok(`what decided it: ${what}`, !threw && errors.length === 0 && got === want && block === `${LABELS.MODERATE.word} ${DIMIR.line}`,
        `${threw || ''} "${got}" | "${block}"`);
      win.close();
    }
  }

  // 7. [9] Appeal the ruling: each next-door row has its own peek and appeal.
  //    The first tap on a row opens its own panel with that neighbour's
  //    philosophy, strengths and shadows; the panel's button is the second,
  //    separate tap. The page itself does not change until then, and the
  //    verdict stays in state.result.identity.
  const tick = () => new Promise((r) => setTimeout(r, 0));
  const APPEAL = {
    player: { peekNote: 'The ruling stands unless you appeal.', after: 'Overturned on appeal. The original ruling stays on the record.' },
    plain: { peekNote: 'Your result stays the same unless you appeal.', after: 'Appeal noted. Your original result is kept too.' },
  };
  for (const [audience, player] of [['consumer', true], ['consumer', false], ['workplace', true]]) {
    const { win, h, errors, threw } = await renderCase(DIMIR, audience, player, seed++);
    const d = win.document, el = (id) => d.getElementById(id);
    const shown = (id) => !!el(id) && !el(id).classList.contains('hidden');
    const P = h.PROFILES, playerCopy = player && audience === 'consumer', copy = APPEAL[playerCopy ? 'player' : 'plain'];
    const problems = threw ? ['showResults threw: ' + threw] : [];
    const need = (cond, what) => { if (!cond) problems.push(what); };
    const chip = (id) => d.querySelector(`#next-door-chips .mc-nextdoor__chip[data-id="${id}"]`);
    const panelOf = (id) => chip(id).nextElementSibling;
    const open = (node) => !!node && !node.classList.contains('hidden');
    const lis = (node) => (node ? [...node.querySelectorAll('li')].map((li) => li.textContent) : []);
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const pageIsDimir = () => text(win, 'res-id') === P.DIMIR.name && text(win, 'identity-exp') === P.DIMIR.philosophy.trim()
      && same(lis(el('strengths')), P.DIMIR.str) && same(lis(el('weaknesses')), P.DIMIR.weak);

    // Peek under the Sultai row: its philosophy, strengths and shadows and its
    // own appeal button, with nothing on the page changed.
    chip('SULTAI').click();
    const sp = panelOf('SULTAI');
    need(open(sp) && !open(panelOf('MONO-U')) && !shown('next-door-panel'), 'the peek should open under its own row only');
    need((sp.querySelector('.mc-nextdoor__panel-head') || {}).textContent === 'Next door: Sultai' && sp.textContent.includes(copy.peekNote), 'peek heading and note');
    need(((sp.querySelector('.mc-nextdoor__peek-philosophy') || {}).textContent || '').trim() === P.SULTAI.philosophy.trim(), 'peek did not show the neighbour\'s philosophy');
    const columns = sp.querySelectorAll('.mc-nextdoor__peek-traits > div');
    need(columns.length === 2 && same(lis(columns[0]), P.SULTAI.str) && same(lis(columns[1]), P.SULTAI.weak), 'peek did not show the neighbour\'s strengths and shadows');
    need(sp.contains(el('appeal-btn')) && text(win, 'appeal-btn') === "Appeal: I'm Sultai", `appeal button "${text(win, 'appeal-btn')}"`);
    need(sp.contains(el('peek-back-btn')) && text(win, 'peek-back-btn') === 'Back to Dimir', 'way back from the peek');
    need(sp.textContent.includes("Your appeal isn't included when you share.") === (audience === 'workplace'), 'workplace privacy note under the appeal button');
    need(!sp.textContent.includes(h.RESULT_COPY.rules.SULTAI), 'the peek should not carry the rules text (one joke next door)');
    need(chip('SULTAI').getAttribute('aria-expanded') === 'true' && chip('SULTAI').classList.contains('is-peeking'), 'peeked row state');
    need(pageIsDimir() && !h.state.result.appeal && !shown('res-appeal-mark'), 'a peek changed the result');

    // The other row has its own peek and appeal; opening it closes the first,
    // and tapping a row again closes its peek.
    chip('MONO-U').click();
    need(open(panelOf('MONO-U')) && !open(sp) && panelOf('MONO-U').contains(el('appeal-btn')) && text(win, 'appeal-btn') === "Appeal: I'm Mono-Blue",
      'the second row should have its own peek and appeal button');
    need(d.querySelectorAll('[id="appeal-btn"]').length === 1, 'one appeal button open at a time');
    chip('MONO-U').click();
    need(!open(panelOf('MONO-U')) && chip('MONO-U').getAttribute('aria-expanded') === 'false', 'tapping the row again should close its peek');
    chip('SULTAI').click();
    el('peek-back-btn').focus(); // as a real click would; jsdom's click() leaves focus where it was
    el('peek-back-btn').click();
    need(!open(panelOf('SULTAI')) && pageIsDimir() && d.activeElement === chip('SULTAI'), 'the way back should close the peek and hand focus to its row');

    // Appeal: peek again, then the separate button.
    chip('SULTAI').click();
    el('appeal-btn').click();
    const a = h.state.result.appeal || {};
    need(h.state.result.identity === 'DIMIR', 'the verdict was overwritten');
    need(a.chosen === 'SULTAI' && JSON.stringify(a.shown) === '["SULTAI","MONO-U"]' && a.copyVersion === 6
      && a.labelShown === 'Leaning' && Number.isFinite(a.timeToAppealMs) && a.timeToAppealMs >= 0, 'appeal record ' + JSON.stringify(a));
    need(text(win, 'res-id') === P.SULTAI.name && text(win, 'res-tag') === P.SULTAI.tag && text(win, 'identity-exp') === P.SULTAI.philosophy.trim(), 'appealed identity not on screen');
    need(!playerCopy || (text(win, 'res-typeline') === 'Legendary Creature — Snake Shaman' && text(win, 'res-rules') === h.RESULT_COPY.rules.SULTAI),
      'the card should follow the appealed identity');
    need(shown('res-appeal-mark') && text(win, 'res-appeal-mark') === '(on appeal)' && el('res-appeal-mark').title === 'Originally Dimir. You appealed.', 'appeal mark');
    el('res-appeal-mark').click();
    need(shown('res-appeal-note') && text(win, 'res-appeal-note') === 'Originally Dimir. You appealed.', 'tapping the mark should say where it started');
    need(chip('SULTAI').classList.contains('is-appealed') && d.querySelectorAll('#next-door-chips .mc-nextdoor__chip').length === 2, 'next door should still show the verdict\'s neighbours');
    need(open(panelOf('SULTAI')) && panelOf('SULTAI').textContent.includes(copy.after) && panelOf('SULTAI').contains(el('appeal-undo-btn')) && !shown('next-door-panel'),
      'the receipt should sit in the appealed row');
    need(text(win, 'appeal-undo-btn') === 'Withdraw the appeal', `undo "${text(win, 'appeal-undo-btn')}"`);
    const url = h.buildResultURL();
    if (audience === 'workplace') need(!/[?&]f=/.test(url) && !text(win, 'share-preview').includes('f=SULTAI'), 'workplace link carries the appeal: ' + url);
    else need(/&f=SULTAI(&|$)/.test(url), 'link lacks &f=SULTAI: ' + url);
    // [11] Shares after an appeal: consumer mode names the identity on the
    // page, marked, with that identity's own neighbour; workplace mode keeps
    // the appeal private and names the verdict.
    const wantShare = audience === 'workplace'
      ? "I'm Dimir. What are you?"
      : "I'm Sultai (on appeal). What are you?";
    let sharedText = null;
    Object.defineProperty(win.navigator, 'share', { configurable: true, value: async (data) => { sharedText = data.text; } });
    await win.shareResult(null);
    delete win.navigator.share;
    need(text(win, 'share-preview').split('\n')[0] === wantShare && sharedText === wantShare, `share after an appeal "${text(win, 'share-preview').split('\n')[0]}" / "${sharedText}"`);
    need(audience === 'workplace' || text(win, 'share-preview').includes(P.SULTAI.str[0]), 'the consumer share preview should follow the identity on the page');
    const saved = h.loadSession();
    need(saved && saved.result && saved.result.appeal && saved.result.appeal.chosen === 'SULTAI' && saved.result.identity === 'DIMIR', 'appeal not saved with the session');
    h.restoreSession(h.loadSession());
    need(text(win, 'res-id') === P.SULTAI.name && shown('res-appeal-mark'), 'appeal lost on resume');
    el('appeal-undo-btn').click();
    need(!h.state.result.appeal && pageIsDimir() && !shown('res-appeal-mark') && !open(panelOf('SULTAI')) && !shown('next-door-panel'), 'undo did not restore the verdict');
    need(errors.length === 0, 'errors: ' + errors.slice(0, 2).join(' | '));
    t.ok(`appeal: each row peeks and appeals, way back, mark, link, resume, undo (${audience}, player mode ${player ? 'on' : 'off'})`, problems.length === 0, problems.join('; '));
    win.close();
  }

  // The other path: "None of these. Show me all 31." opens the explorer with
  // a bar that appeals to whichever identity is open. That appeal has no row,
  // so its receipt sits under the rows.
  {
    const { win, h, errors } = await renderCase(DIMIR, 'consumer', true, seed++);
    const d = win.document, el = (id) => d.getElementById(id);
    const shown = (id) => !!el(id) && !el(id).classList.contains('hidden');
    const problems = [];
    const need = (cond, what) => { if (!cond) problems.push(what); };
    need(text(win, 'next-door-all') === 'None of these. Show me all 31.', 'all-31 link text');
    el('next-door-all').click();
    need(shown('screen-explorer') && !shown('screen-results') && shown('appeal-pick-bar') && text(win, 'appeal-pick-bar').includes('Pick the one that sounds like you.'), 'explorer with the pick bar');
    el('card-GOLGARI').click();
    need(text(win, 'detail-name') === h.PROFILES.GOLGARI.name && text(win, 'appeal-pick-btn') === "Appeal: I'm Golgari", `pick bar "${text(win, 'appeal-pick-bar')}"`);
    need(shown('detail-content'), 'the explorer\'s profile detail stays hidden, so there is nothing to read before appealing');
    el('appeal-pick-btn').click();
    await tick();
    const a = h.state.result.appeal || {};
    need(shown('screen-results') && !shown('screen-explorer') && !shown('appeal-pick-bar'), 'back on the result after appealing');
    need(a.chosen === 'GOLGARI' && JSON.stringify(a.shown) === '["SULTAI","MONO-U"]' && text(win, 'res-id') === h.PROFILES.GOLGARI.name, 'all-31 appeal ' + JSON.stringify(a));
    need(shown('next-door-panel') && text(win, 'next-door-panel').includes('Overturned on appeal. The original ruling stays on the record.')
      && el('next-door-panel').contains(el('appeal-undo-btn')), 'the receipt of an all-31 appeal should sit under the rows');
    // Leaving the picker another way ends it; the plain explorer has no bar.
    el('next-door-all').click();
    win.closeExplorer();
    await tick();
    win.showExplorer();
    need(!shown('appeal-pick-bar'), 'the pick bar stayed on the plain explorer');
    need(errors.length === 0, 'errors: ' + errors.slice(0, 2).join(' | '));
    t.ok('appeal: the all-31 path through the explorer', problems.length === 0, problems.join('; '));
    win.close();
  }

  // 9. The share Card exports in both themes. jsdom cannot rasterise, so
  //    html-to-image is stubbed and the test checks the node it is handed:
  //    the Card, whose set-symbol slot holds the collector number in player
  //    mode (scoring version as the set code) and nothing otherwise, and no
  //    confidence word anywhere on it. Share images show the verdict, with no
  //    "(on appeal)" mark: release-1 images keep the original until the
  //    release-2 mark lands (and in workplace mode an appeal is private).
  for (const theme of ['gilded', 'frames']) {
    for (const [audience, player, extra, want] of [
      ['consumer', true, {}, 'MC1 • EN • 009/031'],
      ['consumer', true, { scoringVersion: 2 }, 'MC2 • EN • 009/031'],
      ['consumer', false, {}, ''],
      ['consumer', true, { appeal: { chosen: 'SULTAI' } }, 'MC1 • EN • 009/031'],
      ['workplace', true, {}, ''],
      ['workplace', false, { appeal: { chosen: 'SULTAI' } }, ''],
    ]) {
      const { win, errors, threw } = await renderCase(DIMIR, audience, player, seed++, extra);
      const d = win.document;
      let exported = null;
      win.htmlToImage = { toBlob: async (node) => { exported = node; return new win.Blob(['png'], { type: 'image/png' }); } };
      win.selectTheme(theme);
      win.showShareScreen();
      win.selectShareFormat('card');
      let blob = null, exportError = null;
      try { blob = await win._renderActiveShareFrame(); } catch (e) { exportError = e.message; }
      const card = d.getElementById('share-tcg');
      const problems = [];
      if (threw || exportError) problems.push(threw || exportError);
      if (d.body.dataset.theme !== theme) problems.push('theme ' + d.body.dataset.theme);
      if (!blob || exported !== card) problems.push('export did not render the Card');
      if (text(win, 'tcg-conf') !== want) problems.push(`set slot "${text(win, 'tcg-conf')}" != "${want}"`);
      if (/leaning|moderate|confidence|locked in|shuffling/i.test(card.textContent)) problems.push('a confidence word is on the Card');
      if (text(win, 'tcg-name') !== 'DIMIR' || text(win, 'sc-name') !== 'DIMIR') problems.push('share images should show the verdict: ' + text(win, 'tcg-name'));
      if (/on appeal|sultai/i.test(card.textContent + d.getElementById('share-scorecard').textContent + d.getElementById('share-mani').textContent)) problems.push('the appeal reached a share image');
      if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
      const label = [extra.scoringVersion && 'scoring v' + extra.scoringVersion, extra.appeal && 'appealed'].filter(Boolean).map((s) => ', ' + s).join('');
      t.ok(`share Card exports (${theme}, ${audience}, player mode ${player ? 'on' : 'off'}${label})`, problems.length === 0, problems.join('; '));
      win.close();
    }
  }

  // 10. [11] shareResult() sends the dare through the Web Share API, or copies
  //     the dare and the link. One line ships in every mode (the drafts'
  //     other variants are dropped).
  {
    const ORZHOV = {
      id: 'ORZHOV', confidence: 'HIGH', activation: { W: 0.74, B: 0.7, U: 0.35, G: 0.3, R: 0.28 },
      result: { allResults: [], round3Data: {} },
    };
    const want = "I'm Orzhov. What are you?";
    const { win, h, errors, threw } = await renderCase(ORZHOV, 'consumer', false, seed++);
    const problems = threw ? [threw] : [];
    let shared = null, copied = null;
    Object.defineProperty(win.navigator, 'share', { configurable: true, value: async (data) => { shared = data; } });
    await win.shareResult(null);
    if (!shared || shared.text !== want || shared.url !== h.buildResultURL()) problems.push('Web Share ' + JSON.stringify(shared));
    delete win.navigator.share;
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async (s) => { copied = s; } } });
    const btn = win.document.getElementById('res-banner-share');
    await win.shareResult(btn);
    if (copied !== `${want} ${h.buildResultURL()}`) problems.push('clipboard ' + JSON.stringify(copied));
    if (btn.textContent !== '✓ Link copied') problems.push('button feedback ' + btn.textContent);
    if (text(win, 'share-preview').split('\n')[0] !== want) problems.push('preview ' + text(win, 'share-preview').split('\n')[0]);
    if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
    t.ok('share: the dare goes out through Web Share and the clipboard', problems.length === 0, problems.join('; '));
    win.close();
  }

  // The Scorecard share image shows the label word, not the old confidence word.
  {
    const { win, errors } = await renderCase(DIMIR, 'consumer', false, seed++);
    win.showShareScreen();
    t.ok('scorecard shows the label word', text(win, 'sc-conf') === 'Leaning' && errors.length === 0, `"${text(win, 'sc-conf')}"`);
    win.close();
  }
});
