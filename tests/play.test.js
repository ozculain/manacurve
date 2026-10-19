#!/usr/bin/env node
'use strict';
// Phase 3, play feel (layout and flow), in jsdom. One section per piece:
//   1. phones: below 600px the two answers stack at full width without their
//      fixed height, and plinths drop to about 20px (the CSS rules; jsdom
//      cannot lay out, so the fit itself is checked in a browser)
//   2. one counter across the whole quiz ("x of up to 45", higher only when a
//      round's real length makes the quiz longer), never reset; the round labels
//      are "Round 1" to "Round 3", with no names; How This Works, the preflight
//      and the early offer agree
//   3. the one-question preflight ("Played Magic?"), its two links, and the
//      theme switcher on the results page
//   4. the welcome: Rule 0 under the title, the start under the lead line with
//      the explorer beside it, the long paragraph in the fold, the resume
//      offer's anchor, about 8 minutes
//   5. transitions that wait for a tap (the real showRoundTransition, not the
//      stub) and say which round is done, the Round 3 line-up (face-down
//      cards and one line), and the every-ten progress line
//   6. the free mulligan: one undo per round, only the final answer scored,
//      the first answer and both response times on the record
//   7. share beside the identity in the results banner
//   8. no colour cues while the scored rounds run (the sky and the Card Frames marks)
//   9. the stem is shown once (Round 3's eyebrow carries only the context hint)
// Usage: node tests/play.test.js [path/to/index.html]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { bootPage, pageArgs, whenReady, isVisible, waitForResults, INDEX_HTML, DATA_JS } = require('./_lib/load');
const { run } = require('./_lib/report');
const tool = require('../tools/apply-round3-copy');

const SESSION_KEY = 'mana_assessment_state';
// Nothing shown during the scored rounds may name a colour or a basic land.
const COLOUR_WORDS = /\b(white|blue|black|red|green|plains|islands?|swamps?|mountains?|forests?)\b/i;
// ... nor an identity: the kinds of name a string uses (colour, basic land, identity), by the same
// whole-word rules the Round 3 copy is held to
const forbiddenIn = (PROFILES, text) => tool.nameRules(PROFILES).filter(({ re }) => re.test(text)).map(({ kind }) => kind);
const PREF = { W: 5, U: 4, B: 3, R: 2, G: 1 };
const pick = (opts) => opts.reduce((best, o) => (PREF[o.c] || 0) > (PREF[best.c] || 0) ? o : best, opts[0]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
function finishRound(h, round) {
  let g = 0;
  const inRound = () => (round === 1 ? h.state.stage === 1 : round === 2 ? h.state.stage === 'refinement' : h.state.stage === 3 && !h.state.result);
  while (inRound() && g++ < 60 && answerOne(h)) { /* answer on */ }
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
    // The quiz copy's phone rules, which keep the longest question, both answers
    // and "Neither" on a 375x667 screen with the beat line or the "used" line
    // (measured in a browser): no standing mulligan hint, one tight beat line.
    const lastRule = (sel) => rules.filter((r) => r.selectorText && r.selectorText.split(',').map((x) => x.trim()).includes(sel)).pop();
    const hintRule = lastRule('.mc-mulligan-note[data-kind="hint"]'), beatRule = lastRule('.mc-q__beat');
    ok('P1f below 600px the undo\'s standing hint is dropped and the beat is one tight 14px line, so the longest question still fits a 375x667 phone with either',
      !!hintRule && hintRule.style.getPropertyValue('display') === 'none' && !!beatRule && beatRule.style.getPropertyValue('font-size') === '14px',
      `${hintRule ? hintRule.style.cssText : 'no hint rule'} | ${beatRule ? beatRule.style.cssText : 'no beat rule'}`);
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
    ok('P2a the counter starts at "Question 1 of up to 45" and the rune track spans the whole quiz',
      counter === 'Question 1 of up to 45' && runes === 45, `counter="${counter}" runes=${runes}`);
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
    // "of up to 45": the stated length, unless the real length so far (30 + Round 2 + Round 3,
    // each counted for real once known, estimates 9 and 6 before) is longer
    const real = seen.map((x) => (x.round === 1 ? 45 : x.round === 2 ? 30 + r2 + 6 : 30 + r2 + x.max));
    const totals = real.map((n) => Math.max(45, n));
    const bad = seen.filter((x, i) => x.tot !== totals[i]).map((x) => `R${x.round} ${x.num}/${x.tot}`);
    ok('P2c the total is "up to 45", or 30 + Round 2 + Round 3 (each counted for real once known) when that is longer, and the last question is 30 + Round 2 + Round 3',
      bad.length === 0 && seen[seen.length - 1].num === 30 + r2 + r3, `${bad.slice(0, 4).join('; ')} last=${seen[seen.length - 1].num} r2=${r2} r3=${r3}`);
    // The figure never drops: a shorter Round 2 leaves "up to 45" as it was
    const drops = seen.filter((x, i) => i > 0 && x.tot < seen[i - 1].tot).map((x) => `${x.num}/${x.tot}`);
    ok('P2k the counter\'s "up to" figure never drops between rounds, and every question says "of up to"',
      drops.length === 0 && /^Question \d+ of up to \d+$/.test(win.document.querySelector('.mc-q__count').textContent.replace(/\s+/g, ' ').trim()),
      drops.join(', ') || win.document.querySelector('.mc-q__count').textContent);
    const labels = [...new Set(seen.map((x) => x.label))];
    ok('P2d round labels are "Round 1", "Round 2" and "Round 3" ("Round 3: Tiebreaker" for a tiebreak), with no round names and no "Enemy Pairs"',
      labels.includes('Round 1') && labels.includes('Round 2') && labels.includes('Round 3')
        && labels.every((l) => /^Round [123](: Tiebreaker)?$/.test(l)) && Object.keys(P.rounds).length === 0, labels.join(' | '));
    ok('P2e no console or jsdom errors over the journey', errors.length === 0, errors.slice(0, 3).join(' | '));
    win.close();
  }

  // ---------- 2: the quiz-length claims agree with the counter ----------
  {
    const { win, h } = await page();
    const howNames = [1, 2, 3].map((n) => textOf(win, 'how-name-' + n));
    const welcomeText = win.document.getElementById('screen-welcome').textContent;
    ok('P2f How This Works gives one length line for the whole quiz, the counter\'s own total (45), with "Round 1", "Round 2" and "Round 3" under it (no round names) and no "Enemy Pairs"',
      textOf(win, 'how-length') === 'Up to 45 questions over three rounds.' && !win.document.querySelector('.mc-how__count')
        && !/enemy pairs/i.test(welcomeText) && howNames.join('|') === 'Round 1|Round 2|Round 3',
      textOf(win, 'how-length') + ' ' + howNames.join('|'));
    ok('P2g the preflight says "up to 45 questions, about 8 minutes" (a clinch can end the quiz early), and nothing says 15 minutes',
      textOf(win, 'preflight-length') === 'Up to 45 questions, about 8 minutes.'
        && !/15\s*min|~\s*15/i.test(welcomeText + win.document.getElementById('screen-preflight').textContent),
      textOf(win, 'preflight-length'));
    // The early offer comes at the end of Round 1, before Round 2 is built.
    begin(h);
    h.state.qNum = 30;
    win.showEarlyTerminationOffer({ identity: 'DIMIR', confidence: 0.95, message: 'Your Round 1 answers already point clearly to DIMIR.' });
    const early = textOf(win, 'early-message');
    ok('P2h the early offer says "Round 1 done." and "We can call it now, or you can keep going for a firmer result."',
      isVisible(win, 'screen-early-offer') && win.document.querySelector('#screen-early-offer h2').textContent === 'Round 1 done.'
        && early === 'We can call it now, or you can keep going for a firmer result.', early);
    // The caller's own message names the identity; the offer must not show it.
    const offer = win.document.getElementById('screen-early-offer');
    const offerText = offer.textContent.replace(/\s+/g, ' ').trim();
    ok('P2i the early offer names neither the identity nor a colour: no pips, name, tagline or "Preliminary read" chip; its two buttons are "Keep going" and "Show my result", and that is all it says',
      !/dimir|preliminary|already point/i.test(offerText) && !COLOUR_WORDS.test(offerText)
        && offer.querySelectorAll('.mc-pip, .mc-confidence, .mc-manastrip, #early-result-name, #early-result-tag').length === 0
        && textOf(win, 'early-keep-going') === 'Keep going' && textOf(win, 'early-show-now') === 'Show my result'
        && offerText === '✦ Round 1 done. We can call it now, or you can keep going for a firmer result. Keep going Show my result', offerText);
    // The claims are the counter's computed total, not a number written into the copy:
    // a longer Round 2 estimate moves the welcome, the fold and the preflight together
    win.eval('QUIZ_LENGTH.round2 = 12');
    win.applyPlayCopy();
    ok('P2j the length lines follow the counter\'s computed total (a Round 2 estimate of 12 makes 48 everywhere)',
      win.eval('quizLengths().total') === 48 && textOf(win, 'preflight-length') === 'Up to 48 questions, about 8 minutes.'
        && textOf(win, 'welcome-length') === 'Up to 48 questions, about 8 minutes.' && textOf(win, 'how-length') === 'Up to 48 questions over three rounds.',
      `${textOf(win, 'preflight-length')} | ${textOf(win, 'welcome-length')} | ${textOf(win, 'how-length')}`);
    win.close();
  }
  {
    // A Round 2 of 7 (someone with no close enemy pair) leaves "of up to 45" as it was, and the
    // progress line counts by the real 43; 10 in Round 2, or a Round 3 tiebreak, raises the figure
    const { win, h } = await page();
    begin(h);
    const s = h.state;
    const show = (stage, r2, r3) => {
      s.stage = stage; s.refinementQuestions = h.POOL_ALLY.slice(0, r2); s.qNum = 0;
      s.tournament = stage === 3 ? { maxQuestions: r3, questionCount: 0 } : null;
      win.renderQuizCounter();
      return win.document.querySelector('.mc-q__count').textContent.replace(/\s+/g, ' ').trim();
    };
    const seven = show('refinement', 7), ten = show('refinement', 10);
    const tiebreak = show(3, 9, 8), shortR3 = show(3, 7, 6);
    s.stage = 'refinement'; s.refinementQuestions = h.POOL_ALLY.slice(0, 7); s.tournament = null; s.qNum = 5;
    const left = win.eval('quizLengths().total') - win.eval('quizAnswered()');
    ok('P2l a short Round 2 keeps "of up to 45" (the progress line still counts 43); a 10-question Round 2 or a tiebreak raises it',
      seven === 'Question 31 of up to 45' && ten === 'Question 31 of up to 46' && tiebreak === 'Question 40 of up to 47'
        && shortR3 === 'Question 38 of up to 45' && left === 8,
      `${seven} | ${ten} | ${tiebreak} | ${shortR3} | left=${left}`);
    win.close();
  }

  // ---------- 3: the preflight is one question ----------
  {
    const { win, h } = await page();
    const d = win.document;
    const P = copy(win);
    win.showPreflight();
    const pf = d.getElementById('screen-preflight');
    const answers = [...pf.querySelectorAll('.mc-preflight__answer')];
    ok('P3a the preflight asks one question, "Played Magic?", with two big cards, under "One question first"',
      isVisible(win, 'screen-preflight') && pf.querySelectorAll('.mc-preflight__question').length === 1
        && textOf(win, 'preflight-eyebrow') === 'One question first'
        && textOf(win, 'preflight-question') === 'Played Magic?' && answers.length === 2
        && answers[0].querySelector('.mc-mode__title').textContent === 'Yes' && answers[1].querySelector('.mc-mode__title').textContent === 'Not really',
      textOf(win, 'preflight-question') + ' / ' + answers.map((a) => a.textContent.trim()).join(' | '));
    ok('P3a2 what each answer does: Yes "Adds a few Magic questions and puts your result in Magic terms."; Not really "Keeps it plain. Same 31 results."',
      answers[0].querySelector('.mc-mode__desc').textContent === 'Adds a few Magic questions and puts your result in Magic terms.'
        && answers[1].querySelector('.mc-mode__desc').textContent === 'Keeps it plain. Same 31 results.',
      answers.map((a) => a.querySelector('.mc-mode__desc').textContent).join(' | '));
    ok('P3b the old four-grid is gone from the preflight (no mode, audience or theme cards, no gaming toggle)',
      pf.querySelectorAll('.mc-mode-grid, #mode-draft, #mode-constructed, #aud-consumer, #aud-workplace, #gaming-toggle, [id^="theme-"]').length === 0, '');
    const modeLink = d.getElementById('preflight-mode-link');
    const workLink = d.getElementById('preflight-work-link');
    const modeOff = modeLink.textContent;
    // The format names mean nothing to someone who has never played, and everyone sees this screen
    const formatNames = /constructed|blind draft/i;
    const plainOff = !formatNames.test(pf.textContent);
    modeLink.click();
    const constructedOn = h.state.mode === 'constructed' && d.body.dataset.mode === 'constructed' && modeLink.dataset.on === 'true';
    const modeOnText = modeLink.textContent, modeUndo = modeLink.querySelector('.mc-textlink__undo');
    const plainOn = !formatNames.test(pf.textContent);
    modeLink.click();
    ok('P3c the colours stay hidden by default (Blind Draft); "Show me each answer\'s colours as I go." switches to Constructed, says what changed, and hides them again, and the preflight never names either format',
      modeOff === "Show me each answer's colours as I go." && constructedOn && h.state.mode === 'draft' && modeLink.textContent === modeOff
        && modeOnText === 'Colours on every answer. Easier to steer, so the result tells you a little less. Hide the colours'
        && !!modeUndo && modeUndo.textContent === 'Hide the colours' && plainOff && plainOn, `${modeOff} / ${modeOnText}`);
    const workOff = workLink.textContent;
    workLink.click();
    const workOn = h.state.audience === 'workplace' && d.body.dataset.audience === 'workplace' && workLink.dataset.on === 'true';
    const workOnText = workLink.textContent, workUndo = workLink.querySelector('.mc-textlink__undo');
    workLink.click();
    ok('P3d "Taking this at work?" sets the workplace audience, says "Work mode: no roasting, nothing you\'d mind your manager reading." with an Undo, and goes back',
      workOff === 'Taking this at work?' && workOn && h.state.audience === 'consumer' && workLink.textContent === workOff
        && workOnText === "Work mode: no roasting, nothing you'd mind your manager reading. Undo" && !!workUndo && workUndo.textContent === 'Undo',
      `${workOff} / ${workOnText}`);
    // The old setters still work for any caller.
    let threw = null;
    try {
      h.selectMode('constructed'); h.selectMode('draft');
      h.selectAudience('workplace'); h.selectAudience('consumer');
      win.selectTheme('borderless'); win.selectTheme('gilded');
      const before = h.state.gamingFamiliar; win.toggleGaming(); if (h.state.gamingFamiliar === before) throw new Error('toggleGaming did not flip'); win.toggleGaming();
    } catch (e) { threw = e.message; }
    ok('P3e selectMode, selectAudience, selectTheme and toggleGaming still work', !threw, threw);
    // "Yes" starts the quiz in player mode, Blind Draft, for fun.
    d.getElementById('preflight-yes').click();
    ok('P3f "Yes" sets gamingFamiliar and starts the quiz in Blind Draft',
      h.state.gamingFamiliar === true && h.state.mode === 'draft' && h.state.stage === 1 && isVisible(win, 'screen-assessment') && !isVisible(win, 'screen-preflight'),
      `gaming=${h.state.gamingFamiliar}`);
    win.close();
  }
  {
    const { win, h } = await page();
    win.showPreflight();
    win.document.getElementById('preflight-no').click();
    const mtg = (h.state.poolA || []).filter((q) => q.id.startsWith('MTG-')).length;
    ok('P3g "Not really" leaves gamingFamiliar off (no Magic items) and starts the quiz',
      h.state.gamingFamiliar === false && h.state.stage === 1 && h.state.poolA.length === 30 && mtg === 0, `mtg=${mtg}`);
    win.close();
  }

  // ---------- 3: the theme switcher lives on the results page ----------
  {
    const { win, h } = await page();
    const d = win.document;
    const sw = d.getElementById('theme-switch');
    ok('P3h the theme switcher sits on the results page with all three tables',
      !!sw && d.getElementById('screen-results').contains(sw) && ['gilded', 'frames', 'borderless'].every((t) => sw.contains(d.getElementById('theme-' + t))), '');
    const s = h.state;
    s.result = { identity: 'DIMIR', confidence: 'MODERATE', allResults: [], round3Data: {} };
    s.activationSorted = [['U', 0.78], ['B', 0.64], ['G', 0.31], ['W', 0.22], ['R', 0.11]];
    s.responses = new Array(30).fill({ c: 'U' });
    s.disclaimerAcknowledged = true;
    h.showResults();
    d.getElementById('theme-frames').click();
    const earned = d.body.dataset.theme === 'frames' && d.body.dataset.revealed === '1'
      && d.getElementById('theme-frames').getAttribute('aria-pressed') === 'true' && win.localStorage.getItem('mc_theme') === 'frames';
    h.restart();
    const faceDown = d.body.dataset.theme === 'frames' && d.body.dataset.revealed === undefined;
    d.getElementById('theme-gilded').click();
    ok('P3i Card Frames is reachable from the results page (earned frame now, face-down next quiz) and persists in localStorage',
      earned && faceDown && win.localStorage.getItem('mc_theme') === 'gilded', `earned=${earned} faceDown=${faceDown}`);
    win.close();
  }

  // ---------- 4: the welcome ----------
  {
    const { win, h } = await page();
    const d = win.document;
    const P = copy(win);
    const title = d.querySelector('#screen-welcome .mc-welcome__title');
    ok('P4a "Rule 0" sits directly under the title, in one sentence', title.nextElementSibling === d.getElementById('welcome-rule0')
      && textOf(win, 'welcome-rule0') === P.welcome.rule0 && P.welcome.rule0 === "Rule 0: it's a bit of fun, not science.", textOf(win, 'welcome-rule0'));
    const lede = d.getElementById('welcome-lede');
    const actions = lede.nextElementSibling;
    const start = d.getElementById('welcome-start');
    const explore = d.getElementById('welcome-explore');
    ok('P4b the start button comes straight after the bold line, with "See all 31 results" beside it as a ghost button',
      actions && actions.id === 'welcome-actions' && actions.firstElementChild === start && start.nextElementSibling === explore
        && /showPreflight/.test(start.getAttribute('onclick')) && /showExplorer/.test(explore.getAttribute('onclick'))
        && explore.classList.contains('mc-btn--ghost') && explore.textContent === 'See all 31 results', explore.textContent);
    ok('P4b2 the bold line says what the quiz is, glosses Magic as a card game and tells a non-player they can take it: no aside, no press-release gloss',
      lede.textContent === "A personality test based on the card game Magic: The Gathering. You don't need to have played it.", lede.textContent);
    const intro = d.getElementById('learn-more-intro');
    ok('P4c the long paragraph moved into the "Learn more" fold',
      d.getElementById('learn-more-content').contains(intro) && /5 colours/.test(intro.textContent)
        && ![...lede.parentElement.children].some((el) => el.tagName === 'P' && /5 colours/.test(el.textContent)), '');
    ok('P4d the welcome says "up to 45 questions, about 8 minutes", the counter\'s own total',
      textOf(win, 'welcome-length') === 'Up to 45 questions, about 8 minutes.', textOf(win, 'welcome-length'));
    // The resume offer still lands after the crest, at its anchor.
    begin(h);
    for (let i = 0; i < 4; i++) answerOne(h);
    const saved = win.sessionStorage.getItem(SESSION_KEY);
    win.close();
    const { win: w2 } = await page();
    w2.sessionStorage.setItem(SESSION_KEY, saved);
    const offered = w2.__h.offerSessionRestore();
    const bar = w2.document.getElementById('resume-bar');
    ok('P4e the resume offer goes in after the crest, just before its anchor',
      offered && bar && bar.parentElement.classList.contains('mc-welcome') && bar.nextElementSibling === w2.document.getElementById('resume-anchor')
        && bar.previousElementSibling.classList.contains('mc-welcome__crest'), bar ? bar.textContent.trim().slice(0, 60) : 'no bar');
    w2.close();
  }

  // ---------- 5: the progress line and the transitions; no colour named ----------
  {
    // A whole journey in plain mode: the progress line shows above the question
    // after answers 10, 20 and 40 only (never after 30, which ends Round 1, nor
    // when a round ends on the answer), and counts what is left by the quiz's
    // real length as far as it is known (the counter's own total in Round 1;
    // from Round 2 it can be less than the counter's "up to" figure).
    const { win, h, errors } = await page();
    const P = copy(win);
    begin(h);
    const seen = [];
    playThrough(h, win, () => seen.push({
      num: +textOf(win, 'q-num'), tot: +textOf(win, 'q-tot'), real: win.eval('quizLengths().total'), label: textOf(win, 'stage-label'),
      beat: isVisible(win, 'q-beat') ? textOf(win, 'q-beat') : '',
    }));
    const shown = seen.filter((x) => x.beat);
    const wrongPlace = shown.filter((x) => ![11, 21, 41].includes(x.num)).map((x) => x.num);
    const wrongWords = shown.filter((x) => x.beat !== `That's ${x.num - 1} done, ${x.real - x.num + 1} to go.`
      || (x.num < 31 && x.real !== x.tot)).map((x) => `${x.num}:"${x.beat}"`);
    ok('P5a the progress line shows above the question after answers 10, 20 and 40 (never 30), and reads "That\'s 10 done, 35 to go." by the quiz\'s real length (the counter\'s total in Round 1)',
      seen.length > 40 && shown.length >= 2 && wrongPlace.length === 0 && wrongWords.length === 0 && shown[0].beat === "That's 10 done, 35 to go.",
      `lines at ${shown.map((x) => x.num)} wrong=${wrongPlace} words=${wrongWords.slice(0, 2)}`);
    const leaks = seen.filter((x) => COLOUR_WORDS.test(x.label + ' ' + x.beat)).map((x) => x.num);
    ok('P5b the stage label and the progress line never name a colour during the rounds', leaks.length === 0 && errors.length === 0, leaks.join(',') + errors.slice(0, 2).join(' | '));
    const strings = [];
    const walk = (v) => { if (typeof v === 'string') strings.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    ['rounds', 'welcome', 'preflight', 'stems', 'round3', 'beats', 'mulligan', 'transition', 'interstitial', 'earlyOffer'].forEach((k) => walk(P[k]));
    const named = strings.map((x) => ({ x, kinds: forbiddenIn(h.PROFILES, x) })).filter((y) => y.kinds.length);
    ok('P5c every quiz-screen string (round names, welcome, preflight, stems, progress line, undo, transitions, line-up, early offer) names no colour, basic land or identity',
      strings.length > 45 && named.length === 0, named.map((y) => `${y.kinds}: ${y.x}`).join(' | '));
    win.close();
  }
  {
    // The progress line's rules, on made-up counts: the same line in every
    // mode and on a re-render; the skip on a round's first question; an undo
    // takes it back.
    // The line the question after this many answers would carry (answers 10 and
    // 20 in Round 1; 40 and later as questions into Round 2's count)
    const lineAfter = (win, h, answered) => {
      const s = h.state;
      if (answered <= 20) { s.stage = 1; s.qNum = answered; }
      else { s.stage = 'refinement'; s.refinementQuestions = new Array(40).fill({}); s.qNum = answered - 30; }
      win.renderQuizBeat();
      return isVisible(win, 'q-beat') ? textOf(win, 'q-beat') : '';
    };
    {
      const lines = [];
      for (const opts of [{}, { gaming: true }, { gaming: true, audience: 'workplace' }]) {
        const { win, h } = await page();
        begin(h, opts);
        const a = lineAfter(win, h, 10), again = lineAfter(win, h, 10), b = lineAfter(win, h, 20);
        lines.push(`${a} | ${again} | ${b}`);
        win.close();
      }
      ok('P5p plain, player and workplace modes show the same line, the same again on a re-render: "That\'s 10 done, 35 to go.", then "That\'s 20 done, 25 to go."',
        lines.every((x) => x === "That's 10 done, 35 to go. | That's 10 done, 35 to go. | That's 20 done, 25 to go."), lines.join(' / '));
    }
    {
      // A Round 2 of 40 questions makes the total 30 + 40 + 6 = 76: the line counts from the counter's own total
      const { win, h } = await page();
      begin(h);
      const later = lineAfter(win, h, 40);
      ok('P5q the line counts from the counter\'s computed total once a round\'s real length is known (40 answered of 76)',
        later === "That's 40 done, 36 to go." && win.eval('quizLengths().total') === 76, `40:"${later}"`);
      win.close();
    }
    {
      // answer 30 has just ended Round 1: Round 2's first question carries no line
      const { win, h } = await page();
      begin(h);
      h.state.stage = 'refinement'; h.state.qNum = 0; h.state.refinementQuestions = new Array(9).fill({});
      win.renderQuizBeat();
      const first = isVisible(win, 'q-beat');
      h.state.qNum = 1; // the next question is answer 31, not a multiple of ten: still none
      win.renderQuizBeat();
      ok('P5q2 the first question of Round 2 (answer 30 has just ended Round 1) carries no line', first === false && isVisible(win, 'q-beat') === false, `first=${first}`);
      win.close();
    }
    {
      // No line when the answer ends a round: a Round 2 of ten questions ends on answer 40
      const { win, h } = await page();
      begin(h);
      h.state.stage = 3;
      h.state.refinementQuestions = new Array(10).fill({});
      h.state.tournament = { questionCount: 0, maxQuestions: 6 };
      win.renderQuizBeat();
      const endsRound = isVisible(win, 'q-beat');
      h.state.refinementQuestions = new Array(9).fill({});
      h.state.tournament.questionCount = 1; // 30 + 9 + 1 = 40 answers, mid-round
      win.renderQuizBeat();
      ok('P5u answer 40 ending Round 2 skips the line (a transition follows); answer 40 mid-round shows it, with 5 to go',
        !endsRound && isVisible(win, 'q-beat') && textOf(win, 'q-beat') === "That's 40 done, 5 to go.", `endsRound=${endsRound} "${textOf(win, 'q-beat')}"`);
      win.close();
    }
    {
      // An undone answer takes its line with it
      const { win, h } = await page();
      begin(h);
      for (let i = 0; i < 10; i++) answerOne(h); // the tenth: the next question carries the line
      const had = isVisible(win, 'q-beat') && textOf(win, 'q-beat') === "That's 10 done, 35 to go.";
      win.document.getElementById('mulligan-btn').click();
      win.document.getElementById('mulligan-yes').click();
      const undone = !isVisible(win, 'q-beat') && h.state.qNum === 9;
      answerOne(h);
      ok('P5v undoing the tenth answer takes the line back with it, and answering again shows it again',
        had && undone && isVisible(win, 'q-beat') && textOf(win, 'q-beat') === "That's 10 done, 35 to go.", `had=${had} undone=${undone}`);
      win.close();
    }
  }
  {
    const { win, h, errors } = await page({ stubs: { transitions: false } });
    const d = win.document;
    const P = copy(win);
    h.state.activationSorted = [['W', 0.8], ['U', 0.6], ['B', 0.4], ['R', 0.3], ['G', 0.2]];
    let calls = 0;
    win.showRoundTransition(1, 2, () => { calls++; });
    const screen = d.getElementById('screen-round-transition');
    const btn = d.getElementById('transition-continue');
    const screenText = () => screen.textContent.replace(/\s+/g, ' ').trim();
    ok('P5d Round 1 to 2: "Round 1 done." and a "Continue" control, and nothing else on the screen',
      isVisible(win, 'screen-round-transition') && textOf(win, 'transition-title') === 'Round 1 done.' && btn.textContent === 'Continue'
        && screenText() === 'Round 1 done. Continue', screenText());
    ok('P5e the transition names no colour', !COLOUR_WORDS.test(screen.textContent), screenText());
    await sleep(1700); // longer than the old 1.5 s auto-advance
    ok('P5f it does not advance on its own', calls === 0 && isVisible(win, 'screen-round-transition') && !btn.disabled, `calls=${calls}`);
    btn.click();
    btn.click();
    ok('P5g Continue advances exactly once', calls === 1 && !isVisible(win, 'screen-round-transition'), `calls=${calls}`);
    // Into Round 3: "Round 2 done.", the same whoever leads and in every mode.
    const intoThree = (activation, gaming, audience) => {
      h.state.activationSorted = activation; h.state.gamingFamiliar = gaming; h.state.audience = audience;
      win.showRoundTransition(2, 3, () => {});
      return screenText();
    };
    const lead = [['W', 0.8], ['U', 0.6], ['B', 0.4], ['R', 0.3], ['G', 0.2]];
    const level = [['W', 0.5], ['U', 0.48], ['B', 0.47], ['R', 0.46], ['G', 0.45]];
    const into = [intoThree(lead, false, 'consumer'), intoThree(lead, true, 'consumer'), intoThree(lead, true, 'workplace'), intoThree(level, false, 'consumer')];
    ok('P5d2 Round 2 to 3: "Round 2 done." and "Continue", in plain, player and workplace modes, with or without a clear lead',
      into.every((x) => x === 'Round 2 done. Continue'), into.join(' | '));
    h.state.gamingFamiliar = false; h.state.audience = 'consumer';
    win.showRoundTransition(3, 4, () => {});
    ok('P5d5 into the result: "Round 3 done." and "Continue"', screenText() === 'Round 3 done. Continue', screenText());
    // Motion only under prefers-reduced-motion: no-preference.
    const motion = mediaBlocks(win, /prefers-reduced-motion:\s*no-preference/).flatMap((m) => [...m.cssRules]);
    const animated = (sel) => { const r = ruleFor(motion, sel); return !!r && /mc\w+/.test(r.style.getPropertyValue('animation')); };
    const topLevel = sheetRules(win).filter((r) => r.selectorText && /mc-transition__continue|mc-cardback|mc-q__beat/.test(r.selectorText));
    ok('P5h reduced motion is respected: the nudge, the deal and the beat animate only under no-preference',
      animated('.mc-transition__continue:not(:disabled)') && animated('.mc-cardback') && animated('.mc-q__beat:not(.hidden)')
        && topLevel.every((r) => !r.style.getPropertyValue('animation')), topLevel.filter((r) => r.style.getPropertyValue('animation')).map((r) => r.selectorText).join(', '));
    ok('P5i no errors in the transition', errors.length === 0, errors.slice(0, 2).join(' | '));
    win.close();
  }
  {
    // The real flow, untimed: each round waits for its Continue.
    const { win, h, errors } = await page({ stubs: { transitions: false } });
    const d = win.document;
    const P = copy(win);
    begin(h);
    // Alternate the shown sides so Round 1 stays undecided (no early offer).
    const alternate = (opts, i) => opts[i % 2];
    let g = 0;
    while (h.state.stage === 1 && h.state.qNum < 30 && g++ < 40) answerOne(h, alternate);
    const offer = isVisible(win, 'screen-early-offer');
    if (offer) h.continueToRound2();
    const waiting12 = offer || (isVisible(win, 'screen-round-transition') && h.state.stage === 1 && h.state.refinementQuestions === undefined);
    await sleep(1700);
    const stillWaiting = offer || (h.state.stage === 1 && isVisible(win, 'screen-round-transition'));
    if (!offer) d.getElementById('transition-continue').click();
    ok('P5j after Round 1 the transition holds Round 2 back until Continue is tapped',
      waiting12 && stillWaiting && h.state.stage === 'refinement' && isVisible(win, 'screen-assessment'), `offer=${offer} stage=${h.state.stage}`);
    finishRound(h, 2);
    const waiting23 = isVisible(win, 'screen-round-transition') && !isVisible(win, 'screen-interstitial') && textOf(win, 'transition-title') === 'Round 2 done.';
    await sleep(400);
    d.getElementById('transition-continue').click();
    const inter = d.getElementById('screen-interstitial');
    const cards = inter.querySelectorAll('#inter-suspects .mc-cardback').length;
    const want = Math.min(4, (h.state.pendingCandidates || []).length);
    ok('P5k after Round 2 the transition waits, then the line-up shows "Round 3", one face-down card per result still in the running, and "Four results are still in the running. You\'ll compare them two at a time."',
      waiting23 && isVisible(win, 'screen-interstitial') && cards === want && cards === 4 && inter.querySelector('h2').textContent === 'Round 3'
        && textOf(win, 'inter-line') === "Four results are still in the running. You'll compare them two at a time.",
      `cards=${cards} want=${want} line=${textOf(win, 'inter-line')}`);
    const interText = inter.textContent.replace(/\s+/g, ' ').trim();
    ok('P5k2 the line-up says nothing else: the title, the cards\' marks, the line and the button',
      interText === `✦ Round 3 ${'✦'.repeat(4)} Four results are still in the running. You'll compare them two at a time. Start Round 3`
        && d.getElementById('inter-suspects').getAttribute('aria-hidden') === 'true', interText);
    ok('P5l the interstitial has no bars, percentages or colour names',
      inter.querySelectorAll('.mc-profile__row, .mc-pip, [data-color]').length === 0 && !/%/.test(inter.textContent) && !COLOUR_WORDS.test(inter.textContent),
      interText.slice(0, 200));
    ok('P5m the interstitial button reads "Start Round 3"', textOf(win, 'inter-continue') === 'Start Round 3', textOf(win, 'inter-continue'));
    h.continueToStage2();
    finishRound(h, 3);
    const waiting34 = isVisible(win, 'screen-round-transition') && textOf(win, 'transition-title') === P.transition.done[4] && !isVisible(win, 'screen-calculating');
    await sleep(400);
    d.getElementById('transition-continue').click();
    const reached = await waitForResults(win);
    ok('P5n after Round 3 the transition waits, then the result follows', waiting34 && reached && !!h.state.result, `waiting=${waiting34} reached=${reached}`);
    ok('P5o no errors over the tapped-through journey', errors.length === 0, errors.slice(0, 3).join(' | '));
    win.close();
  }
  {
    // The line-up says the same in every mode, whoever leads
    const { win, h } = await page();
    const cands = ['A', 'B', 'C', 'D'].map((id) => ({ id, s1: 0.2 }));
    const lineFor = (activation, gaming, audience, refined = true) => {
      h.state.activationSorted = activation; h.state.gamingFamiliar = gaming; h.state.audience = audience; h.state.refinementAnswers = refined ? [{ choice: 'W' }] : [];
      win.showInterstitial(cands);
      return win.document.querySelector('#screen-interstitial h2').textContent + ' / ' + textOf(win, 'inter-line') + ' / ' + textOf(win, 'inter-continue');
    };
    const spread = (c) => [[c, 0.8], ...['W', 'U', 'B', 'R', 'G'].filter((x) => x !== c).map((x) => [x, 0.3])];
    const got = [
      ...['W', 'U', 'B', 'R', 'G'].map((c) => lineFor(spread(c), false, 'consumer')),
      lineFor([['W', 0.5], ['U', 0.48], ['B', 0.47], ['R', 0.46], ['G', 0.45]], false, 'consumer'),
      lineFor(spread('W'), true, 'consumer'), lineFor(spread('W'), true, 'workplace'),
      lineFor(spread('W'), false, 'consumer', false), // Round 2 asked nothing
    ];
    const want = "Round 3 / Four results are still in the running. You'll compare them two at a time. / Start Round 3";
    ok('P5w the line-up reads the same in plain, player and workplace modes, whoever leads, and after a Round 2 with nothing to ask',
      got.every((x) => x === want), [...new Set(got)].join(' | '));
    // The line-up used to draw one line of banter, and the draw stays (the page takes it and shows
    // nothing): the seeded respondents share one random stream with Round 3's shuffles, so a draw
    // more or fewer here would move every golden path.
    let draws = 0;
    const realRandom = win.Math.random;
    win.Math.random = () => { draws++; return realRandom(); };
    lineFor(spread('W'), false, 'consumer');
    win.Math.random = realRandom;
    ok('P5w2 the line-up still takes exactly one random draw, so the seeded Round 3 shuffles after it do not move', draws === 1, `draws=${draws}`);
    h.state.activationSorted = spread('W');
    const counts = [1, 2, 3].map((n) => { win.showInterstitial(cands.slice(0, n)); return textOf(win, 'inter-line') + ' (' + win.document.querySelectorAll('#inter-suspects .mc-cardback').length + ')'; });
    ok('P5x fewer results (the old engine): the line counts them in words, and one result is just "still in the running"',
      counts.join(' | ') === "One result is still in the running. (1) | Two results are still in the running. You'll compare them two at a time. (2) | Three results are still in the running. You'll compare them two at a time. (3)",
      counts.join(' | '));
    win.close();
  }

  // ---------- 6: the free mulligan ----------
  {
    const { win, h, errors } = await page();
    const d = win.document;
    const btn = d.getElementById('mulligan-btn');
    const clone = (x) => JSON.parse(JSON.stringify(x));
    begin(h);
    const s = () => h.state;
    const note = d.getElementById('mulligan-note');
    const box = d.getElementById('mulligan-confirm');
    const undo = () => { btn.click(); d.getElementById('mulligan-yes').click(); };
    ok('P6a Round 1 starts with nothing to undo: "Undo", disabled, with "One per round." under it',
      btn.disabled && btn.textContent === 'Undo' && note.textContent === 'One per round.' && note.dataset.kind === 'hint' && box.classList.contains('hidden'), btn.dataset.state);
    answerOne(h);
    const afterQ1 = { pairwise: clone(s().pairwise), colorScores: clone(s().colorScores), flags: clone(s().qualityFlags), n: s().responses.length };
    ok('P6b after an answer the undo is ready', !btn.disabled && btn.dataset.state === 'ready', btn.dataset.state);
    const q2 = s().poolA[1];
    const first = pick(q2.r), second = q2.r.find((o) => o !== first);
    h.answerQ(first, q2.r.indexOf(first));
    // The button only asks: nothing is undone until the confirm says so, and "Keep it" leaves everything be.
    btn.click();
    const asked = !box.classList.contains('hidden') && note.classList.contains('hidden')
      && textOf(win, 'mulligan-confirm-text') === 'Undo your last answer? You get one per round.'
      && textOf(win, 'mulligan-yes') === 'Undo' && textOf(win, 'mulligan-no') === 'Keep it'
      && s().qNum === 2 && s().responses.length === afterQ1.n + 1;
    d.getElementById('mulligan-no').click();
    const keptIt = box.classList.contains('hidden') && !note.classList.contains('hidden') && s().qNum === 2 && s().responses.length === afterQ1.n + 1 && !btn.disabled;
    ok('P6b2 the button asks first ("Undo your last answer? You get one per round." / Undo, Keep it); "Keep it" changes nothing and the undo stays ready',
      asked && keptIt, `asked=${asked} keptIt=${keptIt}`);
    undo();
    ok('P6c undo restores the state before the answer: tallies, flags, records, question',
      s().qNum === 1 && s().responses.length === afterQ1.n && JSON.stringify(s().pairwise) === JSON.stringify(afterQ1.pairwise)
        && JSON.stringify(s().colorScores) === JSON.stringify(afterQ1.colorScores) && JSON.stringify(s().qualityFlags) === JSON.stringify(afterQ1.flags)
        && textOf(win, 'q-num') === '2' && textOf(win, 'scenario').startsWith(q2.sc.slice(0, 20)),
      `qNum=${s().qNum} n=${s().responses.length}`);
    ok('P6d once used, the undo disables for the rest of the round, and the question that comes back says "Undone. Answer that one again."',
      btn.disabled && btn.dataset.state === 'used' && box.classList.contains('hidden') && note.dataset.kind === 'after' && note.textContent === 'Undone. Answer that one again.',
      `${btn.dataset.state} / ${note.textContent}`);
    h.answerQ(second, q2.r.indexOf(second));
    const rec = s().responses[s().responses.length - 1];
    ok('P6e the replacement is recorded with the first answer, redo: true and both response times',
      rec.c === second.c && rec.redo === true && rec.firstAnswer === first.c && typeof rec.responseMs === 'number' && typeof rec.firstResponseMs === 'number'
        && rec.id === q2.id, JSON.stringify({ c: rec.c, redo: rec.redo, firstAnswer: rec.firstAnswer, ms: rec.responseMs, firstMs: rec.firstResponseMs }));
    const w = q2.w || 1;
    ok('P6f only the final answer is scored',
      s().pairwise[q2.pair][second.c] === afterQ1.pairwise[q2.pair][second.c] + w && s().pairwise[q2.pair][first.c] === afterQ1.pairwise[q2.pair][first.c],
      JSON.stringify(s().pairwise[q2.pair]));
    const savedBook = JSON.parse(win.sessionStorage.getItem(SESSION_KEY) || '{}').mulligan || {};
    answerOne(h);
    ok('P6g still disabled after the next answer, the line under it now says "Undo used for this round.", and the spent mulligan is saved with the session',
      btn.disabled && note.dataset.kind === 'used' && note.textContent === 'Undo used for this round.'
        && (savedBook.usedRounds || []).includes(1) && savedBook.pending === null, JSON.stringify(savedBook));
    finishRound(h, 1);
    if (isVisible(win, 'screen-early-offer')) h.continueToRound2();
    ok('P6h Round 2 brings a fresh mulligan, ready after its first answer, with "One per round." under it again',
      h.state.stage === 'refinement' && btn.disabled && btn.dataset.state === 'idle' && note.dataset.kind === 'hint' && answerOne(h) && !btn.disabled, btn.dataset.state);
    const r2n = s().refinementAnswers.length;
    const r2tally = clone(s().refinementPairwise);
    const q = s().refinementQuestions[s().qNum];
    const f2 = q.r[0], g2 = q.r[1];
    h.selectRefinementChoice(f2.c, q.pair);
    undo();
    h.selectRefinementChoice(g2.c, q.pair);
    const r2rec = s().refinementAnswers[s().refinementAnswers.length - 1];
    ok('P6i Round 2: undo, then the record keeps the first choice and only the second is tallied',
      s().refinementAnswers.length === r2n + 1 && r2rec.redo === true && r2rec.firstAnswer === f2.c && r2rec.choice === g2.c
        && typeof r2rec.firstResponseMs === 'number' && typeof r2rec.responseMs === 'number' && btn.disabled
        && (!s().refinementPairwise[q.pair] || s().refinementPairwise[q.pair][f2.c] === r2tally[q.pair][f2.c]),
      JSON.stringify(r2rec));
    finishRound(h, 2);
    h.continueToStage2();
    ok('P6j Round 3 starts with nothing to undo', h.state.stage === 3 && btn.disabled && btn.dataset.state === 'idle', btn.dataset.state);
    answerOne(h);
    const m = s().tournament.currentMatchup;
    const before = clone(s().tournament.candidates.map((c) => [c.id, c.wins, c.losses]));
    const hist = s().tournament.matchHistory.length;
    h.selectTournamentChoice(m.a.id);
    if (!s().result) {
      undo();
      const restored =JSON.stringify(s().tournament.candidates.map((c) => [c.id, c.wins, c.losses])) === JSON.stringify(before)
        && s().tournament.matchHistory.length === hist && s().tournament.currentMatchup.a.id === m.a.id;
      h.selectTournamentChoice(m.b.id);
      const r3rec = s().tournament.matchHistory[hist];
      ok('P6k Round 3: undo, then the match record keeps the first pick and only the second counts',
        restored && r3rec.redo === true && r3rec.firstAnswer === m.a.id && r3rec.winner.id === m.b.id
          && typeof r3rec.firstResponseMs === 'number' && typeof r3rec.responseMs === 'number', JSON.stringify({ restored, redo: r3rec.redo, first: r3rec.firstAnswer, winner: r3rec.winner.id }));
    } else {
      ok('P6k Round 3: undo, then the match record keeps the first pick and only the second counts', false, 'Round 3 ended before the undo could be tried');
    }
    ok('P6l no errors with the mulligan in all three rounds', errors.length === 0, errors.slice(0, 3).join(' | '));
    win.close();
  }
  {
    // A first-ever "Neither" taken back leaves no Neither behind.
    const { win, h } = await page();
    begin(h);
    answerOne(h);
    h.answerNeither(h.state.poolA[1]);
    win.document.getElementById('mulligan-btn').click();
    win.document.getElementById('mulligan-yes').click();
    const s = h.state;
    ok('P6m undoing the first Neither of the quiz clears its tallies too',
      s.qNum === 1 && !s.neitherCount && (!s.pairwiseNeither || Object.values(s.pairwiseNeither).every((v) => v === 0)) && s.qualityFlags.allNeitherCount === 0,
      JSON.stringify({ n: s.neitherCount, pn: s.pairwiseNeither }));
    win.close();
  }
  {
    // Same answers, one of them mulliganed on the way: Round 1 scores identically.
    const runR1 = async (mulligan) => {
      const { win, h } = await page({ seed: 777 });
      begin(h);
      let g = 0;
      while (h.state.stage === 1 && h.state.qNum < 30 && g++ < 40) {
        const q = h.state.poolA[h.state.qNum];
        const o = pick(q.r);
        if (mulligan && h.state.qNum === 7) {
          const other = q.r.find((x) => x !== o);
          h.answerQ(other, q.r.indexOf(other));
          win.document.getElementById('mulligan-btn').click();
          win.document.getElementById('mulligan-yes').click();
        }
        h.answerQ(o, q.r.indexOf(o));
      }
      const out = JSON.stringify({ p: h.state.pairwise, c: h.state.colorScores, r1: (h.state.round1Candidates || []).map((x) => x.id) });
      win.close();
      return out;
    };
    const plain = await runR1(false);
    const redone = await runR1(true);
    ok('P6n a mulliganed Round 1 scores exactly like the same final answers given straight', plain === redone, `${plain.slice(0, 80)} vs ${redone.slice(0, 80)}`);
  }
  {
    const player = await page();
    begin(player.h, { gaming: true });
    const work = await page();
    begin(work.h, { gaming: true, audience: 'workplace' });
    const P = copy(player.win);
    const labels = [...Object.values(P.mulligan.player), ...Object.values(P.mulligan.plain)];
    ok('P6o player mode says "Free mulligan" (with "One per round." under it), workplace mode "Undo" even for players, and no line names a colour',
      textOf(player.win, 'mulligan-btn') === 'Free mulligan' && textOf(player.win, 'mulligan-note') === 'One per round.'
        && textOf(work.win, 'mulligan-btn') === 'Undo' && textOf(work.win, 'mulligan-note') === 'One per round.' && labels.every((x) => !COLOUR_WORDS.test(x)),
      `${textOf(player.win, 'mulligan-btn')} / ${textOf(work.win, 'mulligan-btn')}`);
    // The whole player flow: ask, the confirm in its words, the line on the question that comes back, then "used up"
    const pd = player.win.document, ph = player.h;
    answerOne(ph);
    answerOne(ph);
    pd.getElementById('mulligan-btn').click();
    const ask = textOf(player.win, 'mulligan-confirm-text'), yes = textOf(player.win, 'mulligan-yes'), no = textOf(player.win, 'mulligan-no');
    pd.getElementById('mulligan-yes').click();
    const taken = textOf(player.win, 'mulligan-note');
    answerOne(ph);
    answerOne(ph);
    const spent = textOf(player.win, 'mulligan-note');
    ok('P6p the player confirm reads as the plain one, "Undo your last answer? You get one per round." (Undo / Keep it), then "Undone. Answer that one again.", then "Mulligan used for this round."',
      ask === 'Undo your last answer? You get one per round.' && yes === 'Undo' && no === 'Keep it'
        && taken === 'Undone. Answer that one again.' && spent === 'Mulligan used for this round.', `${ask} | ${yes}/${no} | ${taken} | ${spent}`);
    answerOne(work.h); // the same flow in the plain wording, as workplace mode shows it
    answerOne(work.h);
    work.win.document.getElementById('mulligan-btn').click();
    const wAsk = textOf(work.win, 'mulligan-confirm-text'), wYes = textOf(work.win, 'mulligan-yes'), wNo = textOf(work.win, 'mulligan-no');
    work.win.document.getElementById('mulligan-no').click();
    work.win.document.getElementById('mulligan-btn').click();
    work.win.document.getElementById('mulligan-yes').click();
    const wTaken = textOf(work.win, 'mulligan-note');
    answerOne(work.h);
    answerOne(work.h);
    ok('P6q the plain confirm reads "Undo your last answer? You get one per round." (Undo / Keep it), then "Undone. Answer that one again.", then "Undo used for this round."',
      wAsk === 'Undo your last answer? You get one per round.' && wYes === 'Undo' && wNo === 'Keep it' && wTaken === 'Undone. Answer that one again.'
        && textOf(work.win, 'mulligan-note') === 'Undo used for this round.', `${wAsk} | ${wYes}/${wNo} | ${wTaken} | ${textOf(work.win, 'mulligan-note')}`);
    player.win.close(); work.win.close();
  }

  // ---------- 7: share beside the identity ----------
  {
    const { win, h, errors } = await page();
    const d = win.document;
    const s = h.state;
    s.result = { identity: 'DIMIR', confidence: 'MODERATE', allResults: [], round3Data: {} };
    s.activationSorted = [['U', 0.78], ['B', 0.64], ['G', 0.31], ['W', 0.22], ['R', 0.11]];
    s.responses = new Array(30).fill({ c: 'U' });
    s.disclaimerAcknowledged = true;
    h.showResults();
    const share = d.getElementById('res-banner-share');
    const row = d.getElementById('res-id').parentElement;
    ok('P7a a share button sits in the banner meta, next to the identity',
      !!share && d.querySelector('.mc-result__banner-meta').contains(share) && row.contains(share) && row.classList.contains('mc-result__name-row') && /Share/.test(share.textContent),
      share ? share.textContent : 'missing');
    // The one Share on the page: the action row's "Share my result" read to
    // naive readers as a duplicate and is gone ("Make an image" stays).
    const shares = [...d.querySelectorAll('#screen-results button')].filter((b) => /\bshare\b/i.test(b.textContent) && !b.closest('.hidden'));
    const copied = [];
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async (x) => { copied.push(x); } } });
    share.click();
    await tick(); await tick();
    ok('P7b it is the only Share on the result screen, and it sends the dare and the link',
      copied.length === 1 && copied[0] === `${win.shareDareText()} ${h.buildResultURL()}` && share.textContent === '✓ Link copied'
        && shares.length === 1 && shares[0] === share && !d.getElementById('share-result-btn'), `${JSON.stringify(copied)} shares=${shares.length}`);
    ok('P7c no errors on the results page', errors.length === 0, errors.slice(0, 2).join(' | '));
    win.close();
  }

  // ---------- 8: no colour cues while the scored rounds run ----------
  // The night sky and the Card Frames progress marks tint toward the colours
  // answered so far; with NEUTRAL_SKY_DURING_QUIZ on they stay as they are before
  // the quiz until the result. jsdom has no canvas, so the sky gets a context
  // that draws nothing and is built here (the page skips it under reduced motion).
  const quietContext = () => new Proxy({}, {
    get: (o, k) => (k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : (k in o ? o[k] : () => {})),
    set: (o, k, v) => { o[k] = v; return true; },
  });
  const addSky = (win) => {
    win.HTMLCanvasElement.prototype.getContext = quietContext;
    win.eval('_sky = new StarSky(document.getElementById("wisp-bg"))');
    return () => win.eval('_sky');
  };
  const weightsOf = (sky) => Object.values(sky().weights).map((w) => +w.toFixed(6));
  const allEqual = (ws) => ws.every((w) => w === ws[0]);
  const runeTint = (win) => win.document.body.style.getPropertyValue('--rune-done');
  const html0 = pageArgs().htmlPath || INDEX_HTML;
  const NEUTRAL_ON = 'const NEUTRAL_SKY_DURING_QUIZ = true;';
  {
    const { win, h, errors } = await page();
    const sky = addSky(win);
    begin(h);
    for (let i = 0; i < 14; i++) answerOne(h); // always the first-preference colour
    await tick(); // the chrome's MutationObserver
    const w = weightsOf(sky);
    ok('P8a Round 1, 14 answers all one way: the sky keeps equal weights, lights no constellation, and the Card Frames marks stay untinted',
      win.eval('NEUTRAL_SKY_DURING_QUIZ') === true && win.eval('colourCuesHidden()') === true && allEqual(w) && sky().identityColors === null && runeTint(win) === '',
      `weights=${w} rune="${runeTint(win)}"`);
    win.close();
  }
  {
    // The one-line revert: with the constant false the sky weights and the marks tint again.
    const src = fs.readFileSync(html0, 'utf-8');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-play-'));
    try {
      ok('P8b index.html declares the constant on one line, true', src.split(NEUTRAL_ON).length === 2, 'expected exactly one "' + NEUTRAL_ON + '"');
      fs.writeFileSync(path.join(dir, 'index.html'), src.replace(NEUTRAL_ON, 'const NEUTRAL_SKY_DURING_QUIZ = false;'));
      const off = await page({ htmlPath: path.join(dir, 'index.html'), dataPath: pageArgs().dataPath || DATA_JS });
      const sky = addSky(off.win);
      begin(off.h);
      for (let i = 0; i < 14; i++) answerOne(off.h);
      await tick();
      const w = weightsOf(sky);
      const heaviest = Object.entries(sky().weights).sort((a, b) => b[1] - a[1])[0][0];
      const mostAnswered = Object.entries(off.h.state.colorScores).sort((a, b) => b[1] - a[1])[0][0];
      ok('P8c set to false, the same answers tint the sky toward the colour answered most, and the marks again',
        off.win.eval('colourCuesHidden()') === false && !allEqual(w) && heaviest === mostAnswered && runeTint(off.win) !== '',
        `weights=${w} heaviest=${heaviest} mostAnswered=${mostAnswered} rune="${runeTint(off.win)}"`);
      off.win.close();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  {
    const { win, h, errors } = await page();
    const sky = addSky(win);
    begin(h);
    const seen = [];
    playThrough(h, win, () => seen.push({ round: win.eval('quizRound()'), equal: allEqual(weightsOf(sky)), lit: sky().identityColors }));
    const sameAtTheLastAnswer = allEqual(weightsOf(sky)) && sky().identityColors === null; // the result exists; the "calculating" screen is up
    await waitForResults(win);
    const rounds = [...new Set(seen.map((x) => x.round))].join();
    const during = seen.filter((x) => !x.equal || x.lit !== null);
    const result = h.state.result;
    const colours = result ? h.PROFILES[result.identity].colors : [];
    const w = weightsOf(sky);
    const heaviest = Object.entries(sky().weights).sort((a, b) => b[1] - a[1])[0][0];
    ok('P8d through Rounds 1, 2 and 3, and on the "calculating" screen after the last answer, the weights stay equal and no constellation is lit',
      rounds === '1,2,3' && seen.length > 40 && during.length === 0 && sameAtTheLastAnswer, `rounds=${rounds} questions=${seen.length} off=${during.length} last=${sameAtTheLastAnswer}`);
    ok('P8e at the result reveal the real weighting resumes: unequal weights, heaviest on the colour the result leads with, the identity\'s constellation lit',
      !!result && isVisible(win, 'screen-results') && !allEqual(w) && heaviest === h.state.activationSorted[0][0] && JSON.stringify(sky().identityColors) === JSON.stringify(colours),
      `weights=${w} heaviest=${heaviest} lead=${h.state.activationSorted[0][0]} lit=${JSON.stringify(sky().identityColors)} want=${JSON.stringify(colours)}`);
    h.restart();
    ok('P8f starting over puts the sky back to the neutral palette (no constellation, equal weights)',
      allEqual(weightsOf(sky)) && sky().identityColors === null && win.eval('_skyNeutral') === true, `weights=${weightsOf(sky)}`);
    ok('P8g no errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    win.close();
  }

  // ---------- 9: the stem is shown once ----------
  // Round 3 used to print the stem in the eyebrow (#ctx) and again in #scenario.
  // Now #scenario carries it alone; #ctx carries the short context hint when the
  // scenario has one and is hidden otherwise. No live stem has one (CONTEXT_HINTS is
  // empty), so a hint is added here for one stem, to show where it would go. Rounds
  // 1 and 2 label the item in #ctx, and must not repeat the stem there either.
  {
    const { win, h, errors } = await page();
    const d = win.document;
    const norm = (x) => String(x).replace(/\s+/g, ' ').trim().toLowerCase();
    begin(h);
    const eyes = [];
    playThrough(h, win, () => {
      const stem = d.getElementById('scenario');
      const own = stem.firstChild && stem.firstChild.nodeType === 3 ? stem.firstChild.textContent : stem.textContent;
      const screen = d.getElementById('screen-assessment').textContent;
      eyes.push({ round: win.eval('quizRound()'), ctx: d.getElementById('ctx').textContent, own, count: screen.split(own).length - 1 });
    });
    const dupes = eyes.filter((x) => x.count !== 1 || norm(x.ctx) === norm(x.own) || norm(x.ctx).includes(norm(x.own)));
    ok('P9a over a whole journey every question prints its stem once, and the line above it is never the stem (Rounds 1, 2 and 3)',
      eyes.length > 40 && [...new Set(eyes.map((x) => x.round))].join() === '1,2,3' && dupes.length === 0,
      dupes.slice(0, 2).map((x) => `R${x.round} x${x.count} ctx="${x.ctx.slice(0, 40)}"`).join('; '));
    const asked = [...(h.state.poolA || []), ...(h.state.refinementQuestions || [])];
    const same = asked.filter((q) => norm(q.ctx || '') === norm(q.sc || ''));
    ok('P9b no Round 1 or Round 2 item has a label that is its own stem', asked.length > 35 && same.length === 0, same.slice(0, 3).map((q) => q.id).join(' '));
    win.close();
  }
  {
    const { win, h, errors } = await page();
    const d = win.document;
    const args = pageArgs();
    const live = tool.readSources(args.htmlPath ? path.dirname(args.htmlPath) : tool.ROOT);
    begin(h);
    finishRound(h, 1);
    if (isVisible(win, 'screen-early-offer')) h.continueToRound2();
    finishRound(h, 2);
    h.continueToStage2();
    win.eval('getPoolScenarioForMatchup = function () { return window.__scenario; }'); // render each of the 93 in the live Round 3
    const hintOf = win.eval('getContextHint');
    const liveHinted = live.scenarios.filter((sc) => hintOf(sc.stem, sc.id)).map((sc) => sc.id);
    // A hint for the test alone, under ETHICS, so the eyebrow's hint line is still exercised.
    win.eval("CONTEXT_HINTS.TEST_ONLY = { hint: 'A line for the test.', patterns: [/legal but dodgy/] }");
    const eyebrow = d.getElementById('ctx');
    const stemEl = d.getElementById('scenario');
    const bad = [], hinted = [];
    for (const sc of live.scenarios) {
      win.__scenario = { id: sc.id, context: sc.stem, responses: Object.fromEntries(sc.options.map((o) => [o.key, o.text])), isPool: true };
      win.showTournamentQuestion();
      const hint = hintOf(sc.stem, sc.id);
      const shown = stemEl.textContent.trim();
      const times = d.getElementById('screen-assessment').textContent.split(sc.stem).length - 1;
      const problems = [];
      if (shown !== sc.stem) problems.push('stem line reads "' + shown.slice(0, 40) + '"');
      if (times !== 1) problems.push('the stem is on screen ' + times + ' times');
      if (stemEl.children.length) problems.push('a hint box is still inside the stem');
      if (hint) {
        hinted.push(sc.id);
        if (eyebrow.classList.contains('hidden') || eyebrow.textContent !== '💡 ' + hint || !eyebrow.classList.contains('mc-eyebrow--hint')) problems.push('the hint is not in the eyebrow');
      } else if (!eyebrow.classList.contains('hidden') || eyebrow.textContent !== '') problems.push('the eyebrow is not hidden');
      if (problems.length) bad.push(sc.id + ': ' + problems.join(', '));
    }
    ok('P9c all 93 Round 3 stems: shown once in the stem line, the hint (when there is one) in the eyebrow above it, the eyebrow hidden when there is none',
      live.scenarios.length === 93 && bad.length === 0, bad.slice(0, 3).join(' | '));
    ok('P9d no live Round 3 stem shows a hint, and the one added for the test shows under ETHICS alone',
      liveHinted.length === 0 && hinted.length === 1 && hinted[0] === 'ETHICS', `live: ${liveHinted.join(' ')}; with the test hint: ${hinted.join(' ')}`);
    // Back to a real question afterwards: the eyebrow and the hint class come off with the next Round 1 quiz
    h.restart();
    begin(h);
    ok('P9e a new quiz after Round 3 shows its Round 1 label again, as an ordinary eyebrow',
      !eyebrow.classList.contains('hidden') && !eyebrow.classList.contains('mc-eyebrow--hint') && eyebrow.textContent === h.state.poolA[0].ctx && eyebrow.textContent !== '',
      `"${eyebrow.textContent}" classes=${eyebrow.className}`);
    ok('P9f no errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    win.close();
  }

  // ---------- 10: the instrument version ----------
  // The items and screens changed (the Phase 3 copy, then the Round 1 and 2 copy,
  // then the plain screens seen while answering, then the Round 1 and 2 items
  // rewritten for real stakes, then the persona check of all questions, then the
  // questions rewritten from naive readers, then their second naive-reader round, then
  // Round 3's short situations for the matchups players meet, then the Red answers rewritten
  // as conviction and the counter's "of up to"), so a result built now is instrument 10 and
  // its link says i=10; a link without i still means 1
  // (tests/seed.test.js).
  {
    const { win, h, errors } = await page();
    begin(h);
    playThrough(h, win, () => {});
    await waitForResults(win);
    const url = h.buildResultURL();
    ok('P10a INSTRUMENT_VERSION is 10, a finished quiz carries it, and its link ends s=2&i=10',
      win.eval('INSTRUMENT_VERSION') === 10 && !!h.state.result && h.state.result.instrumentVersion === 10 && /\/r\/[A-Z0-9-]+\.html\?p=[\d,]+&c=\w+&a=consumer&s=2&i=10$/.test(url), url);
    // An early result (the offer taken) carries it as well
    h.restart();
    begin(h);
    h.state.activationSorted = [['U', 0.82], ['B', 0.7], ['G', 0.3], ['W', 0.2], ['R', 0.1]];
    win.earlyConfidenceData = { identity: 'DIMIR', confidence: 0.95 };
    win.showResultsEarly();
    ok('P10b an early result is instrument 10 too, and its link says i=10',
      h.state.result.earlyTermination === true && h.state.result.instrumentVersion === 10 && /&s=2&i=10$/.test(h.buildResultURL()), h.buildResultURL());
    ok('P10c no errors', errors.length === 0, errors.slice(0, 3).join(' | '));
    win.close();
  }
});
