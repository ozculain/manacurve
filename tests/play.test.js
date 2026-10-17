#!/usr/bin/env node
'use strict';
// Phase 3, play feel (layout and flow), in jsdom. One section per piece:
//   1. phones: below 600px the two answers stack at full width without their
//      fixed height, and plinths drop to about 20px (the CSS rules; jsdom
//      cannot lay out, so the fit itself is checked in a browser)
//   2. one counter across the whole quiz ("x of 45"), recomputed as each
//      round's length becomes known, never reset; no "Enemy Pairs" in the
//      round labels; How This Works, the preflight and the early offer agree
// Usage: node tests/play.test.js [path/to/index.html]
const fs = require('fs');
const { bootPage, pageArgs, whenReady, isVisible, INDEX_HTML } = require('./_lib/load');
const { run } = require('./_lib/report');

const PREF = { W: 5, U: 4, B: 3, R: 2, G: 1 };
const pick = (opts) => opts.reduce((best, o) => (PREF[o.c] || 0) > (PREF[best.c] || 0) ? o : best, opts[0]);
const tick = () => new Promise((r) => setImmediate(r));

let nextSeed = 301;
async function page(opts = {}) {
  const p = bootPage({ ...pageArgs(), seed: nextSeed++, ...opts });
  await whenReady(p.win);
  return p;
}
const textOf = (win, id) => ((win.document.getElementById(id) || {}).textContent || '').trim();
const copy = (win) => win.eval('PLAY_COPY');

function begin(h, { gaming = false, audience = 'consumer', mode = 'draft' } = {}) {
  const s = h.state;
  s.mode = mode; s.audience = audience; s.gamingFamiliar = gaming; s.disclaimerAcknowledged = true;
  h.startAssessment();
}

// Answer the question on screen, in whichever round, by colour preference.
function answerOne(h, choose = pick) {
  const s = h.state;
  if (s.stage === 1 && s.qNum < s.poolA.length) {
    const q = s.poolA[s.qNum]; const o = choose(q.r, s.qNum);
    h.answerQ(o, q.r.indexOf(o)); return true;
  }
  if (s.stage === 'refinement' && s.qNum < s.refinementQuestions.length) {
    const q = s.refinementQuestions[s.qNum]; const o = choose(q.r, s.qNum);
    h.selectRefinementChoice(o.c, q.pair); return true;
  }
  if (s.stage === 3 && s.tournament && s.tournament.currentMatchup && !s.result) {
    h.selectTournamentChoice(s.tournament.currentMatchup.a.id); return true;
  }
  return false;
}
// Move past the early offer or the interstitial (transitions are stubbed).
function advance(h, win) {
  if (isVisible(win, 'screen-early-offer')) { h.continueToRound2(); return true; }
  if (isVisible(win, 'screen-interstitial')) { h.continueToStage2(); return true; }
  return false;
}
// A whole journey with the transitions stubbed, calling look() on every question.
function playThrough(h, win, look) {
  let guard = 0;
  while (!h.state.result && guard++ < 150) {
    if (isVisible(win, 'screen-assessment')) {
      look();
      if (!answerOne(h)) break;
    } else if (!advance(h, win)) break;
  }
}

// The stylesheet's rules, flattened one level into media rules.
function sheetRules(win) { return [...win.document.styleSheets].flatMap((sh) => [...sh.cssRules]); }
function mediaBlocks(win, re) { return sheetRules(win).filter((r) => r.media && re.test(r.media.mediaText)); }
function ruleFor(rules, selector) {
  return rules.find((r) => r.selectorText && r.selectorText.split(',').map((x) => x.trim()).includes(selector));
}

run('play', async (t) => {
  const { ok } = t;

  // ---------- 1: phones ----------
  {
    const { win } = await page();
    const phone = mediaBlocks(win, /max-width:\s*599px/);
    const rules = phone.flatMap((m) => [...m.cssRules]);
    const choices = ruleFor(rules, '.mc-choices');
    const card = ruleFor(rules, '#choices .mc-choice');
    const plinth = ruleFor(rules, '.mc-plinth');
    ok('P1a below 600px the answers stack in one full-width column',
      !!choices && choices.style.getPropertyValue('grid-template-columns').trim() === '1fr',
      choices ? choices.style.cssText : 'no .mc-choices rule in a max-width: 599px block');
    const marker = ruleFor(rules, 'body[data-mode="draft"] #choices .mc-choice__head');
    ok('P1b below 600px the answer cards lose their fixed tall height, and in Blind Draft the I / II marker floats in the corner',
      !!card && /^0(px)?$|^auto$/.test(card.style.getPropertyValue('min-height').trim())
        && !!marker && marker.style.getPropertyValue('position') === 'absolute',
      card ? card.style.cssText : 'no #choices .mc-choice rule');
    const pad = plinth ? plinth.style.getPropertyValue('padding').trim() : '';
    ok('P1c below 600px plinths drop to about 20px of padding, over their inline padding',
      !!plinth && /^(1[6-9]|2[0-4])px/.test(pad) && plinth.style.getPropertyPriority('padding') === 'important',
      plinth ? plinth.style.cssText : 'no .mc-plinth rule');
    // The block's anchor: after the responsive media queries, ahead of the
    // themes and the Phase 2 block that ends the stylesheet.
    const html = fs.readFileSync(pageArgs().htmlPath || INDEX_HTML, 'utf-8');
    const at = html.indexOf('PHASE 3 — PLAY FEEL');
    ok('P1d the phase 3 CSS follows the responsive media queries, ahead of the themes and the Phase 2 block',
      at > html.indexOf('/* High DPI displays */') && at < html.indexOf('THEMES — body[data-theme]') && at < html.indexOf('PHASE 2 — RESULTS')
        && html.indexOf('</style>') === html.lastIndexOf('</style>'), `at=${at}`);
    // A stray closing tag or a parse error would drop every rule after the block.
    const all = sheetRules(win);
    const styleText = [...win.document.querySelectorAll('style')].map((el) => el.textContent).join('\n');
    ok('P1e the stylesheet still parses past the block (the themes and the Phase 2 rules load)',
      !!ruleFor(all, 'body[data-theme="borderless"] .mc-choice') && !!ruleFor(all, '.mc-manabase')
        && styleText.includes('PHASE 3 — PLAY FEEL') && styleText.includes('PHASE 2 — RESULTS'),
      `borderless=${!!ruleFor(all, 'body[data-theme="borderless"] .mc-choice')} manabase=${!!ruleFor(all, '.mc-manabase')}`);
    win.close();
  }

  // ---------- 2: one counter across a whole journey ----------
  {
    const { win, h, errors } = await page();
    const P = copy(win);
    begin(h);
    await tick(); // let the rune track's MutationObserver run
    const runes = win.document.getElementById('mc-rune-track').children.length;
    const counter = win.document.querySelector('.mc-q__count').textContent.replace(/\s+/g, ' ').trim();
    ok('P2a the counter starts at "Question 1 of 45" and the rune track spans the whole quiz',
      counter === 'Question 1 of 45' && runes === 45, `counter="${counter}" runes=${runes}`);
    const seen = [];
    playThrough(h, win, () => {
      const s = h.state;
      seen.push({
        round: s.stage === 'refinement' ? 2 : s.stage === 3 ? 3 : 1,
        num: +textOf(win, 'q-num'), tot: +textOf(win, 'q-tot'), label: textOf(win, 'stage-label'),
        max: s.tournament ? s.tournament.maxQuestions : null,
      });
    });
    const s = h.state;
    const r2 = (s.refinementQuestions || []).length;
    const r3 = s.tournament ? s.tournament.matchHistory.length : 0;
    const steps = seen.map((x, i) => (i === 0 ? x.num === 1 : x.num === seen[i - 1].num + 1));
    ok('P2b the counter never resets: one step per answer across all three rounds',
      seen.length === 30 + r2 + r3 && steps.every(Boolean), seen.map((x) => x.num).join(','));
    const totals = seen.map((x) => (x.round === 1 ? 45 : x.round === 2 ? 30 + r2 + 6 : 30 + r2 + x.max));
    const bad = seen.filter((x, i) => x.tot !== totals[i]).map((x) => `R${x.round} ${x.num}/${x.tot}`);
    ok('P2c the total is 30 + Round 2 + Round 3, each counted for real once known (estimates 9 and 6 before)',
      bad.length === 0 && seen[seen.length - 1].num === 30 + r2 + r3, `${bad.slice(0, 4).join('; ')} last=${seen[seen.length - 1].num} r2=${r2} r3=${r3}`);
    const labels = [...new Set(seen.map((x) => x.label))];
    ok('P2d round labels keep the round names, and "Enemy Pairs" is gone',
      labels.includes('Round 1: ' + P.rounds[1]) && labels.includes('Round 2: Refinement') && labels.some((l) => l.startsWith('Round 3: Final Determination'))
        && labels.every((l) => !/enemy/i.test(l)), labels.join(' | '));
    ok('P2e no console or jsdom errors over the journey', errors.length === 0, errors.slice(0, 3).join(' | '));
    win.close();
  }

  // ---------- 2: the quiz-length claims agree with the counter ----------
  {
    const { win, h } = await page();
    const counts = [1, 2, 3].map((n) => +(textOf(win, 'how-count-' + n).match(/\d+/) || [0])[0]);
    const howNames = [1, 2, 3].map((n) => textOf(win, 'how-name-' + n));
    const welcomeText = win.document.getElementById('screen-welcome').textContent;
    ok('P2f How This Works counts the rounds as the counter does (30, about 9, about 6 = 45) and drops "Enemy Pairs"',
      counts.join(',') === '30,9,6' && !/enemy pairs/i.test(welcomeText) && howNames.join('|') === 'First Impressions|Refinement|Final Determination',
      counts.join(',') + ' ' + howNames.join('|'));
    ok('P2g the preflight says about 8 minutes, and nothing says 15',
      /About 8 minutes/.test(textOf(win, 'preflight-length'))
        && !/15\s*min|~\s*15/i.test(welcomeText + win.document.getElementById('screen-preflight').textContent),
      textOf(win, 'preflight-length'));
    // The early offer: what is left of the one counter. It comes at the end
    // of Round 1, before Round 2 is built.
    begin(h);
    h.state.qNum = 30;
    win.showEarlyTerminationOffer({ identity: 'DIMIR', confidence: 0.95, message: 'An early read.' });
    const early = textOf(win, 'early-length');
    ok('P2h the early offer counts what is left of the one counter (45 - 30 = about 15, about 3 minutes)',
      isVisible(win, 'screen-early-offer') && early === 'Refining is about 15 more questions · about 3 minutes', early);
    win.close();
  }
});
