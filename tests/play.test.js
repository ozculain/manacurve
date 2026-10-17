#!/usr/bin/env node
'use strict';
// Phase 3, play feel (layout and flow), in jsdom. One section per piece:
//   1. phones: below 600px the two answers stack at full width without their
//      fixed height, and plinths drop to about 20px (the CSS rules; jsdom
//      cannot lay out, so the fit itself is checked in a browser)
//   2. one counter across the whole quiz ("x of 45"), recomputed as each
//      round's length becomes known, never reset; no "Enemy Pairs" in the
//      round labels; How This Works, the preflight and the early offer agree
//   3. the one-question preflight ("Played Magic?"), its two links, and the
//      theme switcher on the results page
//   4. the welcome: Rule 0 under the title, the start under the lead line with
//      the explorer beside it, the long paragraph in the fold, the resume
//      offer's anchor, about 8 minutes
// Usage: node tests/play.test.js [path/to/index.html]
const fs = require('fs');
const { bootPage, pageArgs, whenReady, isVisible, INDEX_HTML } = require('./_lib/load');
const { run } = require('./_lib/report');

const SESSION_KEY = 'mana_assessment_state';
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

  // ---------- 3: the preflight is one question ----------
  {
    const { win, h } = await page();
    const d = win.document;
    const P = copy(win);
    win.showPreflight();
    const pf = d.getElementById('screen-preflight');
    const answers = [...pf.querySelectorAll('.mc-preflight__answer')];
    ok('P3a the preflight asks one question, "Played Magic?", with two big cards',
      isVisible(win, 'screen-preflight') && pf.querySelectorAll('.mc-preflight__question').length === 1
        && textOf(win, 'preflight-question') === P.preflight.question && answers.length === 2
        && answers[0].querySelector('.mc-mode__title').textContent === 'Yes' && answers[1].querySelector('.mc-mode__title').textContent === 'Not really',
      textOf(win, 'preflight-question') + ' / ' + answers.map((a) => a.textContent.trim()).join(' | '));
    ok('P3b the old four-grid is gone from the preflight (no mode, audience or theme cards, no gaming toggle)',
      pf.querySelectorAll('.mc-mode-grid, #mode-draft, #mode-constructed, #aud-consumer, #aud-workplace, #gaming-toggle, [id^="theme-"]').length === 0, '');
    const modeLink = d.getElementById('preflight-mode-link');
    const workLink = d.getElementById('preflight-work-link');
    const modeOff = modeLink.textContent;
    modeLink.click();
    const constructedOn = h.state.mode === 'constructed' && d.body.dataset.mode === 'constructed' && modeLink.dataset.on === 'true';
    modeLink.click();
    ok('P3c Blind Draft is the default; "Prefer to see the mana? Constructed mode" switches to Constructed and back',
      modeOff === P.preflight.constructedOff && constructedOn && h.state.mode === 'draft' && modeLink.textContent === modeOff, modeOff);
    workLink.click();
    const workOn = h.state.audience === 'workplace' && d.body.dataset.audience === 'workplace' && workLink.dataset.on === 'true';
    workLink.click();
    ok('P3d "Taking this at work?" sets the workplace audience (and back)',
      workOn && h.state.audience === 'consumer' && workLink.textContent === P.preflight.workOff, workLink.textContent);
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
    ok('P4a "Rule 0" sits directly under the title', title.nextElementSibling === d.getElementById('welcome-rule0')
      && textOf(win, 'welcome-rule0') === P.welcome.rule0 && P.welcome.rule0 === "Rule 0: it's a bit of fun, not science.", textOf(win, 'welcome-rule0'));
    const lede = d.getElementById('welcome-lede');
    const actions = lede.nextElementSibling;
    const start = d.getElementById('welcome-start');
    const explore = d.getElementById('welcome-explore');
    ok('P4b the start button comes straight after the bold line, with "Explore all 31" beside it as a ghost button',
      actions && actions.id === 'welcome-actions' && actions.firstElementChild === start && start.nextElementSibling === explore
        && /showPreflight/.test(start.getAttribute('onclick')) && /showExplorer/.test(explore.getAttribute('onclick'))
        && explore.classList.contains('mc-btn--ghost') && explore.textContent === 'Explore all 31', explore.textContent);
    const intro = d.getElementById('learn-more-intro');
    ok('P4c the long paragraph moved into the "Learn more" fold',
      d.getElementById('learn-more-content').contains(intro) && /5 colours/.test(intro.textContent)
        && ![...lede.parentElement.children].some((el) => el.tagName === 'P' && /5 colours/.test(el.textContent)), '');
    ok('P4d the welcome says about 8 minutes, for the 45 questions the counter starts from',
      textOf(win, 'welcome-length').startsWith('About 8 minutes · 45 questions'), textOf(win, 'welcome-length'));
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
});
