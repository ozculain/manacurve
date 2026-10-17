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

// typeline: what the card's typeline must say in player mode (section 8: the
// commander's printed type line); rules: its rules text (section 2).
const CASES = [
  {
    id: 'MONO-R', type: 'mono', confidence: 'HIGH',
    activation: { R: 0.86, B: 0.52, G: 0.44, W: 0.21, U: 0.12 },
    typeline: 'Legendary Creature — Goblin Warrior',
    rules: 'Trample, haste. At the beginning of the end step, sacrifice this creature. Back Thursday.',
    rolesForFun: 'Startups, Sales, Crisis Response, Creative Industries, Frontline Operations, Live Events',
    share: { consumer: "I'm Mono-Red. Rakdos lives next door. What are you?", workplace: "I'm Mono-Red. Rakdos lives next door. What are you?" },
    manaBase: '37 lands: 36 Mountain and a Hanweir Battlements, so nothing has to wait its turn.',
    nextDoor: {
      player: [['up', 'RAKDOS', 'Splash black? Rakdos.', 'Your black was well short. On nodding terms, no more.']],
      plain: [['up', 'RAKDOS', 'Add black? Rakdos.', 'Black was well short.']],
    },
    result: { allResults: [], round3Data: { matchHistory: [] } },
  },
  {
    id: 'DIMIR', type: 'guild', confidence: 'MODERATE',
    activation: { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 },
    typeline: 'Legendary Creature — Human Ninja',
    rules: "Whenever a player says something, surveil 1. You have shroud. (You can't be the target of spells, abilities or friends.)",
    rolesForFun: 'Strategic Planning, Competitive Intelligence, Investigative Journalism',
    share: { consumer: "Turns out I'm Dimir. Sultai lives next door and keeps looking over the fence. You?", workplace: "I'm Dimir. Sultai lives next door. What are you?" },
    manaBase: '37 lands: Watery Grave, Polluted Delta, Drowned Catacomb, 19 Island, 15 Swamp.',
    nextDoor: {
      player: [['up', 'SULTAI', 'Splash green? Sultai.', 'Your green was well short. On nodding terms, no more.'],
        ['down', 'MONO-U', 'Cut the Swamps: Mono-Blue.', "Black made the cut easily. Without it, it's a different deck."]],
      plain: [['up', 'SULTAI', 'Add green? Sultai.', 'Green was well short.'], ['down', 'MONO-U', 'Drop black: Mono-Blue.', 'Black made it in comfortably.']],
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
    typeline: 'Legendary Creature — Dragon',
    rules: 'Trample. Sacrifice another creature: This creature gets +1/+0 until end of turn. It knew what the job was.',
    rolesForFun: 'Aggressive Sales, Competitive Industries, Startups, Sports, Private Equity',
    share: { consumer: "I'm Jund. Four-colour (no blue) lives next door. What are you?", workplace: "I'm Jund. Four-colour (no blue) lives next door. What are you?" },
    manaBase: "37 lands: Ziatora's Proving Ground, Blood Crypt, Stomping Ground, Overgrown Tomb, 11 Mountain, 11 Forest, 11 Swamp.",
    nextDoor: {
      player: [['up', 'DUNE', 'Splash white? Four-colour (no blue).', 'Your white was well short. On nodding terms, no more.'],
        ['down', 'GRUUL', 'Cut the Swamps: Gruul.', "Black made the cut easily. Without it, it's a different deck."]],
      plain: [['up', 'DUNE', 'Add white? Four-colour (no blue).', 'White was well short.'], ['down', 'GRUUL', 'Drop black: Gruul.', 'Black made it in comfortably.']],
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
    typeline: 'Legendary Creature — Ogre Wizard',
    rules: "Trample, cascade. Phasing (When the bill arrives, treat this creature as though it doesn't exist.)",
    rolesForFun: 'Disruption, High-Risk Ventures, Competitive Industries, Activist Investing',
    share: { consumer: "I'm Four-colour (no white). Five-colour lives next door. What are you?", workplace: "I'm Four-colour (no white). Five-colour lives next door. What are you?" },
    manaBase: '37 lands: Command Tower, Mana Confluence, City of Brass, Exotic Orchard, 9 Island, 8 Swamp, 8 Mountain, 8 Forest.',
    nextDoor: {
      player: [['up', 'WUBRG', 'Splash white? Five-colour.', 'Your white was well short. On nodding terms, no more.'],
        ['down', 'GRIXIS', 'Cut the Forests: Grixis.', "Green made the cut easily. Without it, it's a different deck."]],
      plain: [['up', 'WUBRG', 'Add white? Five-colour.', 'White was well short.'], ['down', 'GRIXIS', 'Drop green: Grixis.', 'Green made it in comfortably.']],
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
    typeline: 'Legendary Creature — Human Noble',
    rules: 'Changeling. You have every ability. Each works at a fifth of its strength.',
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

// [4] Label words and base-rate sentences: the same in both modes, joke-free,
// and with no number until Phase 5 measures real results.
const LABELS = {
  HIGH: { word: 'Locked in', line: 'The colours are usually right. One more or one fewer is where it wobbles.' },
  MODERATE: { word: 'Leaning', line: "Mostly one way, with a pull next door. If it's off, it's usually by one colour." },
  LOW: { word: 'Still shuffling', line: 'Your answers pulled several ways. Read next door before you settle on this one.' },
};
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
  need(text('res-typeline-name') === p.name.trim(), 'res-typeline-name');
  need(text('cmd-name-aside') === (p.cmd || '').trim() && text('cmd-name-aside') !== '', 'cmd-name-aside');
  need(text('cmd-desc-aside') === (p.cmdDesc || '').trim() && text('cmd-desc-aside') !== '', 'cmd-desc-aside');
  need(d.querySelectorAll('#strengths li').length === p.str.length && p.str.length > 0, 'strengths list');
  need(d.querySelectorAll('#weaknesses li').length === p.weak.length && p.weak.length > 0, 'shadows list');
  for (const id of ['roles', 'res-desc', 'identity-exp', 'conf-exp', 'share-preview']) real(id);
  need(!el('conf-exp').classList.contains('hidden'), 'conf-exp hidden');
  need(el('conf-badge').dataset.level === c.confidence.toLowerCase(), 'confidence badge level');
  need(d.querySelectorAll('#res-banner-pips .mc-pip').length === p.colors.length, 'banner pips');

  // 1. The reveal lands first: commander, name, tagline, then (player mode)
  //    the identity as a card: the typeline, the rules text directly under
  //    it, the collector number at its foot. Then the philosophy, with the
  //    confidence badge and its explanation after it.
  need(text('res-banner-commander') === 'Commander · ' + p.cmd, 'banner commander ' + text('res-banner-commander'));
  need(before(win, el('res-id'), el('res-tag')) && before(win, el('res-tag'), el('identity-exp')), 'name and tagline should precede the philosophy');
  need(before(win, el('identity-exp'), el('conf-badge')), 'confidence badge should follow the philosophy');
  need(before(win, el('conf-badge'), el('conf-exp')), 'confidence explanation should follow the badge');
  need(before(win, el('identity-exp'), el('quality-warning')), 'quality warning should follow the philosophy');
  need(text('identity-exp') === p.philosophy.trim(), 'philosophy text');
  // 8. One typeline on the page: the card's in player mode, the "Personality"
  //    divider's in plain mode, which prints the scoring version in the footer.
  const collector = `MC1 • EN • ${String(Object.keys(h.PROFILES).indexOf(c.id) + 1).padStart(3, '0')}/031`;
  if (playerCopy) {
    need(visible('res-idcard') && text('res-typeline') === c.typeline, `typeline "${text('res-typeline')}" != "${c.typeline}"`);
    need(before(win, el('res-tag'), el('res-typeline')) && before(win, el('res-typeline'), el('res-rules'))
      && before(win, el('res-rules'), el('res-collector')) && before(win, el('res-collector'), el('identity-exp')),
      'the card should read name, tagline, typeline, rules text, collector number, then the philosophy');
    need(!el('res-banner-commander').parentElement.contains(el('res-typeline')), 'typeline under the commander');
    need(text('res-collector') === collector, `collector number "${text('res-collector')}" != "${collector}"`);
    need(!visible('res-personality') && !visible('res-version'), 'a second typeline (the Personality divider) or the footer version in player mode');
  } else {
    need(!visible('res-idcard') && !visible('res-typeline') && text('res-typeline') === '' && text('res-collector') === '', 'card shown outside player mode');
    need(visible('res-personality') && text('res-personality').replace(/\s+/g, ' ') === 'Personality — ' + p.name.trim(), `divider "${text('res-personality')}"`);
    need(visible('res-version') && text('res-version') === 'Scoring version 1', `footer "${text('res-version')}"`);
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
  need(text('next-door-prompt') === (playerCopy ? 'Appeal this ruling' : 'Not quite you? Look next door.'), `next-door prompt "${text('next-door-prompt')}"`);
  need(text('next-door-all') === 'None of these. Show me all 31.', `all-31 link "${text('next-door-all')}"`);

  // 3. Label words in both modes, one base-rate sentence per label (the same
  //    in both modes, no number, no small print before Phase 5), no rarity mark.
  const label = LABELS[c.confidence];
  need(text('conf-badge') === label.word, `label "${text('conf-badge')}" != "${label.word}"`);
  need(text('conf-base-rate') === label.line, `base rate "${text('conf-base-rate')}" != "${label.line}"`);
  need(!/\d|%/.test(text('conf-base-rate')) && !el('conf-small-print'), 'a number or small print in the base rate before Phase 5');
  need(before(win, el('identity-exp'), el('conf-base-rate')), 'base rate should follow the philosophy');
  need(!/confidence|mythic|rare|uncommon|sleeve|proxy/i.test(text('conf-badge') + ' ' + text('conf-base-rate')), 'old confidence wording, a rarity word or a cut tail in the label');

  // 4. The bars: "Your Mana Pool" in player mode, "Your colours" otherwise,
  //    and the same caption in every mode.
  need(text('res-bars-title') === BARS_TITLE[playerCopy ? 'player' : 'plain'] && el('res-bars-title') === el('res-bars-caption').previousElementSibling,
    `bars title "${text('res-bars-title')}"`);
  need(text('res-bars-caption') === "The name's the summary. The bars are what you said.", `bars caption "${text('res-bars-caption')}"`);
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
    const plainText = ['res-idcard', 'res-bars-title', 'next-door', 'conf-base-rate', 'conf-exp', 'res-mana-base']
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
      !threw && errors.length === 0 && text(win, 'conf-base-rate') === LABELS.MODERATE.line && waiting && !/held up when tested|\{pct\}/.test(page),
      `${threw || ''} ${text(win, 'conf-base-rate')}`);
    win.close();
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
  // plain modes: the colon headline for one or a few answers, the question
  // for "well", and a four-colour neighbour by its sentence name.
  {
    const EXAMPLES = [
      ['MONO-U', { U: 0.70, B: 0.64, W: 0.30, R: 0.20, G: 0.10 }, {
        player: [['up', 'DIMIR', 'Splash black: Dimir.', 'Your black was one answer short of moving in.']],
        plain: [['up', 'DIMIR', 'Add black: Dimir.', 'Black came in one answer short.']],
      }],
      ['MONO-R', { R: 0.85, G: 0.45, W: 0.30, U: 0.20, B: 0.10 }, {
        player: [['up', 'GRUUL', 'Splash green? Gruul.', 'Your green was well short. On nodding terms, no more.']],
        plain: [['up', 'GRUUL', 'Add green? Gruul.', 'Green was well short.']],
      }],
      ['BOROS', { W: 0.70, R: 0.62, U: 0.45, B: 0.20, G: 0.10 }, {
        player: [['up', 'JESKAI', 'Splash blue: Jeskai.', "Your blue was a few answers short. It's been round for a viewing."],
          ['down', 'MONO-W', 'Cut the Mountains: Mono-White.', 'Red made the cut by a few answers. It would be missed.']],
        plain: [['up', 'JESKAI', 'Add blue: Jeskai.', 'Blue was a few answers short.'], ['down', 'MONO-W', 'Drop red: Mono-White.', 'Red made it in by a few answers.']],
      }],
      ['ESPER', { W: 0.62, U: 0.70, B: 0.66, G: 0.20, R: 0.10 }, {
        player: [['up', 'WITCH', 'Splash green? Four-colour (no red).', 'Your green was well short. On nodding terms, no more.'],
          ['down', 'DIMIR', 'Cut the Plains: Dimir.', "White made the cut easily. Without it, it's a different deck."]],
        plain: [['up', 'WITCH', 'Add green? Four-colour (no red).', 'Green was well short.'], ['down', 'DIMIR', 'Drop white: Dimir.', 'White made it in comfortably.']],
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

  // 7. [9] Appeal the ruling: each next-door row has its own peek and appeal.
  //    The first tap on a row opens its own panel with that neighbour's
  //    philosophy, strengths and shadows; the panel's button is the second,
  //    separate tap. The page itself does not change until then, and the
  //    verdict stays in state.result.identity.
  const tick = () => new Promise((r) => setTimeout(r, 0));
  const APPEAL = {
    player: { peekNote: 'Just looking. The ruling stands unless you appeal.', after: 'Overturned on appeal. The original ruling stays on the record.' },
    plain: { peekNote: 'Just a look. Your result stays put unless you appeal.', after: 'Appeal noted. Your original result is kept too.' },
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
    need(a.chosen === 'SULTAI' && JSON.stringify(a.shown) === '["SULTAI","MONO-U"]' && a.copyVersion === 2
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
