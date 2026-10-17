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
const PAGE_EXPOSE = [...EXPOSE, 'RESULT_COPY'];

// typeline: what the banner typeline must say in player mode.
const CASES = [
  {
    id: 'MONO-R', type: 'mono', confidence: 'HIGH',
    activation: { R: 0.86, B: 0.52, G: 0.44, W: 0.21, U: 0.12 },
    typeline: 'Legendary Creature — Human Berserker (Mono-Red)',
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
    nextDoor: {
      player: [['down', 'YORE', 'Cut the Forests: Four-colour (no green).', 'Green only just made the cut.']],
      plain: [['down', 'YORE', 'Drop green: Four-colour (no green).', 'Green only just made it in.']],
    },
    result: { allResults: [], round3Data: {} },
  },
];

// a precedes b in document order
const before = (win, a, b) => !!(a && b && (a.compareDocumentPosition(b) & win.Node.DOCUMENT_POSITION_FOLLOWING));

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
  need(share.includes(p.name.trim()), 'share preview lacks the identity name');
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

  // The Scorecard share image shows the label word, not the old confidence word.
  {
    const { win, errors } = await renderCase(DIMIR, 'consumer', false, seed++);
    win.showShareScreen();
    t.ok('scorecard shows the label word', text(win, 'sc-conf') === 'Leaning' && errors.length === 0, `"${text(win, 'sc-conf')}"`);
    win.close();
  }
});
