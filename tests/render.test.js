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
const PAGE_EXPOSE = [...EXPOSE, 'RESULT_COPY', 'ROLES_HIDDEN_FOR_FUN'];

// typeline: what the banner typeline must say in player mode.
const CASES = [
  {
    id: 'MONO-R', type: 'mono', confidence: 'HIGH',
    activation: { R: 0.86, B: 0.52, G: 0.44, W: 0.21, U: 0.12 },
    typeline: 'Legendary Creature — Human Berserker (Mono-Red)',
    rolesForFun: 'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events',
    share: { consumer: "I'm Mono-Red. Rakdos lives next door. What are you?", workplace: "I'm Mono-Red. Rakdos lives next door. What are you?" },
    manaBase: '37 lands: 36 Mountain and a Hanweir Battlements, so nothing has to wait its turn.',
    nextDoor: {
      player: [['up', 'RAKDOS', 'Splash black: Rakdos.', 'Your black was well short. On nodding terms, no more.']],
      plain: [['up', 'RAKDOS', 'Add black: Rakdos.', 'Black was well short.']],
    },
    result: { allResults: [], round3Data: { matchHistory: [] } },
  },
  {
    id: 'DIMIR', type: 'guild', confidence: 'MODERATE',
    activation: { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 },
    typeline: 'Legendary Creature — Human Advisor (Dimir)',
    rolesForFun: 'Strategic Planning, Competitive Intelligence, Investigative Journalism',
    share: { consumer: "Turns out I'm Dimir. Sultai lives next door and keeps looking over the fence. You?", workplace: "I'm Dimir. Sultai lives next door. What are you?" },
    manaBase: '37 lands: Watery Grave, Polluted Delta, Drowned Catacomb, 19 Island, 15 Swamp.',
    nextDoor: {
      player: [['up', 'SULTAI', 'Splash green: Sultai.', 'Your green was well short. On nodding terms, no more.'],
        ['down', 'MONO-U', 'Cut the Swamps: Mono-Blue.', "Black made the cut easily. Without it, it's a different deck."]],
      plain: [['up', 'SULTAI', 'Add green: Sultai.', 'Green was well short.'], ['down', 'MONO-U', 'Drop black: Mono-Blue.', 'Black made it in comfortably.']],
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
    typeline: 'Legendary Creature — Human Mercenary (Jund)',
    rolesForFun: 'Aggressive Sales, Competitive Industries, Startups, Sports, Private Equity',
    share: { consumer: "I'm Jund. Four-colour (no blue) lives next door. What are you?", workplace: "I'm Jund. Four-colour (no blue) lives next door. What are you?" },
    manaBase: "37 lands: Ziatora's Proving Ground, Blood Crypt, Stomping Ground, Overgrown Tomb, 11 Mountain, 11 Forest, 11 Swamp.",
    nextDoor: {
      player: [['up', 'DUNE', 'Splash white: Four-colour (no blue).', 'Your white was well short. On nodding terms, no more.'],
        ['down', 'GRUUL', 'Cut the Swamps: Gruul.', "Black made the cut easily. Without it, it's a different deck."]],
      plain: [['up', 'DUNE', 'Add white: Four-colour (no blue).', 'White was well short.'], ['down', 'GRUUL', 'Drop black: Gruul.', 'Black made it in comfortably.']],
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
    typeline: 'Legendary Creature — Human Wizard (Four-colour, no white)',
    rolesForFun: 'Disruption, High-Risk Ventures, Competitive Industries, Activist Investing',
    share: { consumer: "I'm Four-colour (no white). Five-colour lives next door. What are you?", workplace: "I'm Four-colour (no white). Five-colour lives next door. What are you?" },
    manaBase: '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, 9 Island, 8 Swamp, 8 Mountain, 8 Forest.',
    nextDoor: {
      player: [['up', 'WUBRG', 'Splash white: Five-colour.', 'Your white was well short. On nodding terms, no more.'],
        ['down', 'GRIXIS', 'Cut the Forests: Grixis.', "Green made the cut easily. Without it, it's a different deck."]],
      plain: [['up', 'WUBRG', 'Add white: Five-colour.', 'White was well short.'], ['down', 'GRIXIS', 'Drop green: Grixis.', 'Green made it in comfortably.']],
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
    typeline: 'Legendary Creature — Human Cleric Wizard Rogue Warrior Druid (Five-colour)',
    rolesForFun: 'Consulting, General Tazri, Generalist Leadership, Facilitation',
    share: { consumer: "I'm Five-colour. Four-colour (no green) lives next door. What are you?", workplace: "I'm Five-colour. Four-colour (no green) lives next door. What are you?" },
    manaBase: '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, 7 Plains, 7 Island, 7 Swamp, 6 Mountain, 6 Forest.',
    nextDoor: {
      player: [['down', 'YORE', 'Cut the Forests: Four-colour (no green).', 'Green only just made the cut.']],
      plain: [['down', 'YORE', 'Drop green: Four-colour (no green).', 'Green only just made it in.']],
    },
    result: { allResults: [], round3Data: {} },
  },
];

// a precedes b in document order
const before = (win, a, b) => !!(a && b && (a.compareDocumentPosition(b) & win.Node.DOCUMENT_POSITION_FOLLOWING));

// Lands counted in a mana base line: "N Basic" counts N, every other listed
// land one, and a final "and a <land> <joke or tail>" one more.
function landCount(line) {
  const m = /^37 lands: (.*)\.$/.exec(line || '');
  if (!m) return -1;
  const [list, last] = m[1].split(/,? and an? /);
  return list.split(', ').reduce((sum, item) => {
    const basics = /^(\d+) (Plains|Island|Swamp|Mountain|Forest)$/.exec(item);
    return sum + (basics ? Number(basics[1]) : 1);
  }, last ? 1 : 0);
}

// Label words and base-rate sentences (scoring version 1, measured 17 October 2026).
const LABELS = {
  HIGH: {
    word: 'Locked in',
    player: 'About 54% of results like this held up when tested, so sleeve it up.',
    plain: 'About 54% of results like this held up when tested.',
  },
  MODERATE: {
    word: 'Leaning',
    player: 'About 53% of results like this held up when tested, so maybe proxy it first.',
    plain: 'About 53% of results like this held up when tested; most of the rest were a neighbour.',
  },
  LOW: {
    word: 'Still shuffling',
    player: 'Only about 31% of results like this held up when tested, so look next door before you sleeve anything.',
    plain: 'About 31% of results like this held up when tested, so read the neighbours too.',
  },
};
const SMALL_PRINT = '(Tested on simulated players, 17 October 2026.)';

function checkRender(win, h, c, audience, player, threw, errors) {
  const d = win.document, p = h.PROFILES[c.id], problems = [];
  const el = (id) => d.getElementById(id);
  const text = (id) => ((el(id) || {}).textContent || '').trim();
  const shown = (id) => !!el(id) && !el(id).classList.contains('hidden') && el(id).style.display !== 'none';
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
  need(text('res-typeline-name') === p.name.trim(), 'res-typeline-name');
  need(text('cmd-name-aside') === (p.cmd || '').trim() && text('cmd-name-aside') !== '', 'cmd-name-aside');
  need(text('cmd-desc-aside') === (p.cmdDesc || '').trim() && text('cmd-desc-aside') !== '', 'cmd-desc-aside');
  need(d.querySelectorAll('#strengths li').length === p.str.length && p.str.length > 0, 'strengths list');
  need(d.querySelectorAll('#weaknesses li').length === p.weak.length && p.weak.length > 0, 'shadows list');
  for (const id of ['roles', 'res-desc', 'identity-exp', 'conf-exp', 'share-preview']) real(id);
  need(!el('conf-exp').classList.contains('hidden'), 'conf-exp hidden');
  need(el('conf-badge').dataset.level === c.confidence.toLowerCase(), 'confidence badge level');
  need(d.querySelectorAll('#res-banner-pips .mc-pip').length === p.colors.length, 'banner pips');

  // 1. The reveal lands first: commander, name, tagline, typeline, then the
  //    philosophy; the confidence badge and its explanation come after it.
  need(text('res-banner-commander') === 'Commander · ' + p.cmd, 'banner commander ' + text('res-banner-commander'));
  need(before(win, el('res-id'), el('res-tag')) && before(win, el('res-tag'), el('identity-exp')), 'name and tagline should precede the philosophy');
  need(before(win, el('res-banner-commander'), el('res-banner-typeline')), 'typeline should sit under the commander');
  need(before(win, el('identity-exp'), el('conf-badge')), 'confidence badge should follow the philosophy');
  need(before(win, el('conf-badge'), el('conf-exp')), 'confidence explanation should follow the badge');
  need(before(win, el('identity-exp'), el('quality-warning')), 'quality warning should follow the philosophy');
  need(text('identity-exp') === p.philosophy.trim(), 'philosophy text');
  if (playerCopy) {
    need(shown('res-banner-typeline') && text('res-banner-typeline') === c.typeline, `typeline "${text('res-banner-typeline')}" != "${c.typeline}"`);
  } else {
    need(!shown('res-banner-typeline') && text('res-banner-typeline') === '', 'typeline shown outside player mode');
  }

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
  // 10. The share text dares a friend: the first line names the identity and
  //     its nearer next-door neighbour. Workplace mode always uses line one.
  need(share.split('\n')[0] === c.share[audience], `share line "${share.split('\n')[0]}" != "${c.share[audience]}"`);
  if (audience === 'workplace') {
    need(banter && banter.style.display === 'none', 'pub banter visible in workplace mode');
    need(disclaimer && disclaimer.style.display !== 'none', 'workplace disclaimer hidden');
    need(!p.pubBanter || !share.includes(p.pubBanter.replace(/^"|"$/g, '')), 'banter in workplace share preview');
  } else {
    need(banter && banter.style.display !== 'none', 'pub banter hidden in consumer mode');
    need(disclaimer && disclaimer.style.display === 'none', 'workplace disclaimer shown in consumer mode');
    real('res-counter');
  }
  // 2. Next door replaces the old LOW/MODERATE-only alternatives box and shows
  //    at every confidence level: up adds the strongest unlit colour, down
  //    drops the weakest lit one; mono has no down row, five-colour no up row.
  need(!el('alternative-results'), 'the old alternatives box is still in the page');
  need(shown('next-door') && before(win, el('conf-exp'), el('next-door')) && before(win, el('next-door'), el('res-profile-bars')),
    'next-door row missing or out of place (it sits between the confidence line and the bars)');
  const chips = [...d.querySelectorAll('#next-door-chips .mc-nextdoor__chip')].map((chip) => [
    chip.dataset.dir, chip.dataset.id,
    (chip.querySelector('.mc-nextdoor__head') || {}).textContent, (chip.querySelector('.mc-nextdoor__why') || {}).textContent,
  ]);
  const wantChips = c.nextDoor[playerCopy ? 'player' : 'plain'];
  need(JSON.stringify(chips) === JSON.stringify(wantChips), `next door ${JSON.stringify(chips)} != ${JSON.stringify(wantChips)}`);

  // 3. Label words in both modes, one base-rate sentence per label, no rarity mark.
  const label = LABELS[c.confidence];
  need(text('conf-badge') === label.word, `label "${text('conf-badge')}" != "${label.word}"`);
  need(text('conf-base-rate') === label[playerCopy ? 'player' : 'plain'], `base rate "${text('conf-base-rate')}"`);
  need(text('conf-small-print') === SMALL_PRINT, `small print "${text('conf-small-print')}"`);
  need(before(win, el('identity-exp'), el('conf-base-rate')), 'base rate should follow the philosophy');
  need(!/confidence|mythic|rare|uncommon/i.test(text('conf-badge') + ' ' + text('conf-base-rate')), 'old confidence wording or a rarity word in the label');

  // 4. The bars keep their title and gain a caption, in every mode.
  const barsTitle = el('res-bars-caption') && el('res-bars-caption').previousElementSibling;
  need(barsTitle && barsTitle.textContent.trim() === 'Your Mana Pool', 'bars title');
  need(text('res-bars-caption') === "The name's the summary. The bars are what you said.", `bars caption "${text('res-bars-caption')}"`);
  need(before(win, el('res-bars-caption'), el('res-profile-bars')), 'caption should sit above the bars');

  // 5. Rules-text strip above strengths and shadows, player mode only.
  if (playerCopy) {
    need(shown('res-rules') && text('res-rules') === h.RESULT_COPY.rules[c.id] && text('res-rules').length > 20, `rules strip "${text('res-rules')}"`);
    need(before(win, el('res-rules'), el('strengths')) && before(win, el('res-profile-bars'), el('res-rules')), 'rules strip should sit between the bars and strengths');
    need(!text('res-rules').includes('(') || (el('res-rules').querySelector('i') || {}).textContent === text('res-rules').match(/\([^)]*\)/)[0],
      'bracketed reminder text should be in italics');
  } else {
    need(!shown('res-rules') && text('res-rules') === '', 'rules strip shown outside player mode');
  }

  // 6. Mana base under the commander, player mode only: 37 lands.
  if (playerCopy) {
    need(shown('res-mana-base') && text('res-mana-base') === c.manaBase, `mana base "${text('res-mana-base')}" != "${c.manaBase}"`);
    need(landCount(text('res-mana-base')) === 37, `mana base counts ${landCount(text('res-mana-base'))} lands`);
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
    const visible = ['res-banner-typeline', 'next-door', 'conf-base-rate', 'res-rules', 'res-mana-base']
      .filter(shown).map((id) => text(id)).join(' ');
    need(!/splash|cut the|sleeve|proxy|on the stack|respond|legendary|37 lands/i.test(visible), 'Magic-flavoured copy in workplace mode');
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

  // Base rates are keyed by scoring version; version 2 is a placeholder that
  // falls back to version 1's numbers until it is measured.
  {
    const { win, errors, threw } = await renderCase(DIMIR, 'consumer', false, seed++, { scoringVersion: 2 });
    t.ok('scoring version 2 base rate falls back to version 1 until filled',
      !threw && errors.length === 0 && text(win, 'conf-base-rate') === LABELS.MODERATE.plain && text(win, 'conf-small-print') === SMALL_PRINT,
      `${threw || ''} ${text(win, 'conf-base-rate')}`);
    win.close();
  }

  // Mana base splash: one land for the up neighbour, only when its colour is
  // within a few answers (the bars of five recorded links, plus a close
  // four-colour result). The splash land replaces a basic; still 37 lands.
  const SPLASHES = [
    ['MONO-W', { W: 0.70, U: 0.22, B: 0.34, R: 0.40, G: 0.58 },
      '37 lands: 35 Plains, Castle Ardenvale, and a Temple Garden for the green you keep toying with.'],
    ['MONO-B', { W: 0.35, U: 0.33, B: 0.73, R: 0.46, G: 0.58 },
      '37 lands: 35 Swamp, Cabal Coffers, and an Overgrown Tomb for the green you keep toying with.'],
    ['RAKDOS', { W: 0.48, U: 0.28, B: 0.49, R: 0.83, G: 0.24 },
      '37 lands: Blood Crypt, Bloodstained Mire, Dragonskull Summit, 21 Mountain, 12 Swamp, and a Savai Triome you swear is for the splash.'],
    ['ESPER', { W: 0.68, U: 0.48, B: 0.59, R: 0.33, G: 0.15 },
      "37 lands: Raffine's Tower, Hallowed Fountain, Watery Grave, Godless Shrine, 13 Plains, 11 Swamp, 8 Island, and a Savai Triome for the red you keep toying with."],
    ['TEMUR', { W: 0.33, U: 0.62, B: 0.09, R: 0.42, G: 0.68 },
      "37 lands: Ketria Triome, Breeding Pool, Steam Vents, Stomping Ground, 13 Forest, 12 Island, 7 Mountain, and a Spara's Headquarters for the white you keep toying with."],
    ['GLINT', { U: 0.66, B: 0.63, R: 0.60, G: 0.58, W: 0.52 },
      '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, 8 Island, 8 Swamp, 8 Mountain, 8 Forest, and a Hallowed Fountain you swear is for the splash.'],
  ];
  for (const [id, activation, want] of SPLASHES) {
    const c = { id, confidence: 'HIGH', activation, result: { allResults: [], round3Data: {} } };
    const { win, errors, threw } = await renderCase(c, 'consumer', true, seed++);
    const got = text(win, 'res-mana-base');
    t.ok(`mana base splash ${id}`, !threw && errors.length === 0 && got === want && landCount(got) === 37, `${threw || ''} "${got}" (${landCount(got)} lands)`);
    win.close();
  }

  // 7. Appeal the verdict: the first tap on a neighbour peeks, a second,
  //    separate tap appeals. The verdict stays in state.result.identity.
  const tick = () => new Promise((r) => setTimeout(r, 0));
  for (const [audience, player] of [['consumer', true], ['consumer', false], ['workplace', true]]) {
    const { win, h, errors, threw } = await renderCase(DIMIR, audience, player, seed++);
    const d = win.document, el = (id) => d.getElementById(id);
    const shown = (id) => !!el(id) && !el(id).classList.contains('hidden');
    const P = h.PROFILES, playerCopy = player && audience === 'consumer';
    const problems = threw ? ['showResults threw: ' + threw] : [];
    const need = (cond, what) => { if (!cond) problems.push(what); };
    const chip = (id) => d.querySelector(`#next-door-chips .mc-nextdoor__chip[data-id="${id}"]`);
    const lis = (id) => [...d.querySelectorAll(`#${id} li`)].map((li) => li.textContent);

    // Peek: the neighbour's philosophy, rules text, strengths and shadows,
    // flagged as a peek, with nothing about the result changed.
    chip('SULTAI').click();
    need(text(win, 'identity-exp') === P.SULTAI.philosophy.trim(), 'peek did not show the neighbour\'s philosophy');
    need(JSON.stringify(lis('strengths')) === JSON.stringify(P.SULTAI.str) && JSON.stringify(lis('weaknesses')) === JSON.stringify(P.SULTAI.weak), 'peek did not show the neighbour\'s strengths and shadows');
    need(['identity-exp', 'res-traits'].every((id) => el(id).classList.contains('is-peeking') && el(id).dataset.peek === 'Next door: Sultai'), 'peeking state not visible');
    need(!playerCopy || text(win, 'res-rules') === h.RESULT_COPY.rules.SULTAI, 'peek did not show the neighbour\'s rules text');
    need(chip('SULTAI').getAttribute('aria-pressed') === 'true', 'peeked chip not pressed');
    need(shown('next-door-panel') && text(win, 'appeal-btn') === (playerCopy ? "Respond: I'm Sultai" : 'Switch to Sultai'), `appeal button "${text(win, 'appeal-btn')}"`);
    need(text(win, 'next-door-panel').includes(playerCopy ? 'Just looking. Nothing changes unless you respond.' : 'Just a look. Your result stays put unless you choose this one.'), 'peek note');
    need(text(win, 'peek-back-btn') === 'Back to Dimir', 'way back from the peek');
    need(text(win, 'next-door-panel').includes("Your appeal isn't included when you share.") === (audience === 'workplace'), 'workplace privacy note');
    need(text(win, 'res-id') === P.DIMIR.name && !h.state.result.appeal && !shown('res-appeal-mark'), 'a peek changed the result');
    el('peek-back-btn').click();
    need(text(win, 'identity-exp') === P.DIMIR.philosophy.trim() && !el('identity-exp').classList.contains('is-peeking') && !shown('next-door-panel'), 'way back did not restore the verdict');

    // Appeal: peek again, then the separate button.
    chip('SULTAI').click();
    el('appeal-btn').click();
    const a = h.state.result.appeal || {};
    need(h.state.result.identity === 'DIMIR', 'the verdict was overwritten');
    need(a.chosen === 'SULTAI' && JSON.stringify(a.shown) === '["SULTAI","MONO-U"]' && a.copyVersion === 1
      && a.labelShown === 'Leaning' && Number.isFinite(a.timeToAppealMs) && a.timeToAppealMs >= 0, 'appeal record ' + JSON.stringify(a));
    need(text(win, 'res-id') === P.SULTAI.name && text(win, 'res-tag') === P.SULTAI.tag && text(win, 'identity-exp') === P.SULTAI.philosophy.trim(), 'appealed identity not on screen');
    need(shown('res-appeal-mark') && text(win, 'res-appeal-mark') === '(on appeal)' && el('res-appeal-mark').title === 'Originally Dimir. You appealed.', 'appeal mark');
    el('res-appeal-mark').click();
    need(shown('res-appeal-note') && text(win, 'res-appeal-note') === 'Originally Dimir. You appealed.', 'tapping the mark should say where it started');
    need(chip('SULTAI').classList.contains('is-appealed') && d.querySelectorAll('#next-door-chips .mc-nextdoor__chip').length === 2, 'next door should still show the verdict\'s neighbours');
    need(text(win, 'next-door-panel').includes(playerCopy ? 'Appeal lodged. The original verdict stays on the record.' : 'Switched. Your original result is kept too.'), 'after-appeal note');
    need(text(win, 'appeal-undo-btn') === (playerCopy ? 'Let the original resolve' : 'Switch back to Dimir'), `undo "${text(win, 'appeal-undo-btn')}"`);
    const url = h.buildResultURL();
    if (audience === 'workplace') need(!/[?&]f=/.test(url) && !text(win, 'share-preview').includes('f=SULTAI'), 'workplace link carries the appeal: ' + url);
    else need(/&f=SULTAI(&|$)/.test(url), 'link lacks &f=SULTAI: ' + url);
    const saved = h.loadSession();
    need(saved && saved.result && saved.result.appeal && saved.result.appeal.chosen === 'SULTAI' && saved.result.identity === 'DIMIR', 'appeal not saved with the session');
    h.restoreSession(h.loadSession());
    need(text(win, 'res-id') === P.SULTAI.name && shown('res-appeal-mark'), 'appeal lost on resume');
    el('appeal-undo-btn').click();
    need(!h.state.result.appeal && text(win, 'res-id') === P.DIMIR.name && !shown('res-appeal-mark') && !shown('next-door-panel'), 'undo did not restore the verdict');
    need(errors.length === 0, 'errors: ' + errors.slice(0, 2).join(' | '));
    t.ok(`appeal: peek, way back, appeal, mark, link, resume, undo (${audience}, player mode ${player ? 'on' : 'off'})`, problems.length === 0, problems.join('; '));
    win.close();
  }

  // The other path: "Neither. Show me all 31." opens the explorer with a bar
  // that appeals to whichever identity is open.
  {
    const { win, h, errors } = await renderCase(DIMIR, 'consumer', true, seed++);
    const d = win.document, el = (id) => d.getElementById(id);
    const shown = (id) => !!el(id) && !el(id).classList.contains('hidden');
    const problems = [];
    const need = (cond, what) => { if (!cond) problems.push(what); };
    need(text(win, 'next-door-all') === 'Neither. Show me all 31.', 'all-31 link text');
    el('next-door-all').click();
    need(shown('screen-explorer') && !shown('screen-results') && shown('appeal-pick-bar') && text(win, 'appeal-pick-bar').includes('Pick the one that sounds like you.'), 'explorer with the pick bar');
    el('card-GOLGARI').click();
    need(text(win, 'detail-name') === h.PROFILES.GOLGARI.name && text(win, 'appeal-pick-btn') === "Respond: I'm Golgari", `pick bar "${text(win, 'appeal-pick-bar')}"`);
    need(shown('detail-content'), 'the explorer\'s profile detail stays hidden, so there is nothing to read before appealing');
    el('appeal-pick-btn').click();
    await tick();
    const a = h.state.result.appeal || {};
    need(shown('screen-results') && !shown('screen-explorer') && !shown('appeal-pick-bar'), 'back on the result after appealing');
    need(a.chosen === 'GOLGARI' && JSON.stringify(a.shown) === '["SULTAI","MONO-U"]' && text(win, 'res-id') === h.PROFILES.GOLGARI.name, 'all-31 appeal ' + JSON.stringify(a));
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
  //    confidence word anywhere on it. Share images show the verdict: an
  //    appeal never reaches them (in workplace mode, never at all).
  for (const theme of ['gilded', 'frames']) {
    for (const [audience, player, extra, want] of [
      ['consumer', true, {}, 'MC1 • EN • 009/031'],
      ['consumer', true, { scoringVersion: 2 }, 'MC2 • EN • 009/031'],
      ['consumer', false, {}, ''],
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

  // 10. shareResult() sends the dare through the Web Share API, or copies the
  //     dare and the link; the second line variant goes to identities whose
  //     place in PROFILES picks it (Orzhov is eighth).
  {
    const ORZHOV = {
      id: 'ORZHOV', confidence: 'HIGH', activation: { W: 0.74, B: 0.7, U: 0.35, G: 0.3, R: 0.28 },
      result: { allResults: [], round3Data: {} },
    };
    const want = "I'm Orzhov, with Esper next door. Guess yours before you look.";
    const { win, h, errors, threw } = await renderCase(ORZHOV, 'consumer', false, seed++);
    const problems = threw ? [threw] : [];
    let shared = null, copied = null;
    Object.defineProperty(win.navigator, 'share', { configurable: true, value: async (data) => { shared = data; } });
    await win.shareResult(null);
    if (!shared || shared.text !== want || shared.url !== h.buildResultURL()) problems.push('Web Share ' + JSON.stringify(shared));
    delete win.navigator.share;
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async (s) => { copied = s; } } });
    const btn = win.document.getElementById('share-result-btn');
    await win.shareResult(btn);
    if (copied !== `${want} ${h.buildResultURL()}`) problems.push('clipboard ' + JSON.stringify(copied));
    if (btn.textContent !== '✓ Link copied!') problems.push('button feedback ' + btn.textContent);
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
