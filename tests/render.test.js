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
    result: { allResults: [], round3Data: { matchHistory: [] } },
  },
  {
    id: 'DIMIR', type: 'guild', confidence: 'MODERATE',
    activation: { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 },
    typeline: 'Legendary Creature — Human Advisor (Dimir)',
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
    result: { allResults: [], round3Data: {} },
  },
];

// a precedes b in document order
const before = (win, a, b) => !!(a && b && (a.compareDocumentPosition(b) & win.Node.DOCUMENT_POSITION_FOLLOWING));

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
  const altBox = el('alternative-results');
  if (altBox && altBox.style.display === 'block') need(el('alternatives-list').children.length > 0, 'alternatives box shown empty');
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
});
