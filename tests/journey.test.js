#!/usr/bin/env node
'use strict';
// End-to-end journeys through the quiz in jsdom (43 checks): the Round 2
// gaming gate, weighted ally answers, the Round 3 badge, session save and
// resume at every stage (mid-Round 2, both round boundaries, mid-Round 3 and a
// finished result), the Round 3 clinch rule, Neither-neutral Round 1 ranking,
// the early-offer evidence floor and the context-disagreement caveat.
// Every page gets its own seeded Math.random, so runs are reproducible.
// Usage: node tests/journey.test.js [path/to/index.html]
const { bootPage, pageArgs, isVisible, waitForResults } = require('./_lib/load');
const { run } = require('./_lib/report');

const SESSION_KEY = 'mana_assessment_state';
let nextSeed = 1;
function makeDom() {
  const { win, errors } = bootPage({ ...pageArgs(), seed: nextSeed++ });
  return { win, errors };
}
const visible = isVisible;
const PREF = { W: 5, U: 4, B: 3, R: 2, G: 1 };
const pick = (opts) => opts.reduce((best, o) => (PREF[o.c] || 0) > (PREF[best.c] || 0) ? o : best, opts[0]);

function runRound1(win, gaming) {
  const h = win.__h; const s = h.state;
  s.mode = 'draft'; s.audience = 'consumer'; s.gamingFamiliar = gaming; s.disclaimerAcknowledged = true;
  h.startAssessment();
  let guard = 0;
  while (s.stage === 1 && guard++ < 40) {
    const q = s.poolA[s.qNum];
    const o = pick(q.r);
    h.answerQ(o, q.r.indexOf(o));
  }
  if (visible(win, 'screen-early-offer')) h.continueToRound2();
}

run('journey', async ({ ok }) => {
  // ---------- A: full journey with the gate OFF, plus save/resume snapshots ----------
  const { win, errors } = makeDom();
  const h = win.__h; const s = h.state;
  runRound1(win, false);
  ok('A1 Round 1 reaches refinement', s.stage === 'refinement', 'stage=' + s.stage);
  const ids = (s.refinementQuestions || []).map(q => q.id);
  ok('A2 gate off: no MTG- items in Round 2', ids.length > 0 && ids.every(id => !id.startsWith('MTG-')), ids.join(','));
  for (let i = 0; i < 2; i++) { const q = s.refinementQuestions[s.qNum]; const o = pick(q.r); h.selectRefinementChoice(o.c, q.pair); }
  const snapR2 = win.sessionStorage.getItem(SESSION_KEY);
  const parsedR2 = JSON.parse(snapR2 || '{}');
  ok('A3 Round 2 progress is saved', parsedR2.stage === 'refinement' && parsedR2.qNum === 2 && Array.isArray(parsedR2.refinementQuestions), 'stage=' + parsedR2.stage + ' qNum=' + parsedR2.qNum);
  // weighted ally tally: if a weighted item was answered, some tally is non-integer
  while (s.stage === 'refinement' && s.qNum < s.refinementQuestions.length) { const q = s.refinementQuestions[s.qNum]; const o = pick(q.r); h.selectRefinementChoice(o.c, q.pair); }
  const weightedAnswered = s.refinementAnswers.some(a => { const q = s.refinementQuestions.find(x => x.id === a.questionId); return q && q.w && q.w !== 1; });
  const tallies = Object.values(s.refinementPairwise).flatMap(p => Object.values(p));
  ok('A4 ally weights applied when a weighted item was answered', !weightedAnswered || tallies.some(v => v % 1 !== 0), 'weighted=' + weightedAnswered + ' tallies=' + tallies.join(','));
  ok('A5 interstitial shown after Round 2', visible(win, 'screen-interstitial'), '');
  h.continueToStage2();
  ok('A6 Round 3 started', s.stage === 3 && s.tournament && s.tournament.currentMatchup, 'stage=' + s.stage);
  ok('A7 Round 3 badge set to 3', win.document.getElementById('mc-loyalty-num').dataset.round === '3', win.document.getElementById('mc-loyalty-num').dataset.round);
  for (let i = 0; i < 2 && !s.result; i++) h.selectTournamentChoice(s.tournament.currentMatchup.a.id);
  const snapR3 = win.sessionStorage.getItem(SESSION_KEY);
  const parsedR3 = JSON.parse(snapR3 || '{}');
  ok('A8 Round 3 progress is saved', parsedR3.stage === 3 && parsedR3.tournament && parsedR3.tournament.questionCount === 2 && parsedR3.tournament.currentMatchup, 'qc=' + (parsedR3.tournament || {}).questionCount);
  let guard = 0;
  while (!s.result && guard++ < 20) h.selectTournamentChoice(s.tournament.currentMatchup.a.id);
  ok('A9 journey produces a result', s.result && s.result.identity && ['HIGH', 'MODERATE', 'LOW'].includes(s.result.confidence), JSON.stringify(s.result && { id: s.result.identity, conf: s.result.confidence }));
  ok('A10 results screen populated', (win.document.getElementById('res-id').textContent || '').trim().length > 0, '');
  ok('A11 no console/jsdom errors in full journey', errors.length === 0, errors.slice(0, 3).join(' | '));
  ok('A12 contextAgreement computed', s.contextAgreement && typeof s.contextAgreement.overall === 'number', '');

  // ---------- B: resume Round 2 in a fresh page ----------
  {
    const { win: w2, errors: e2 } = makeDom();
    w2.sessionStorage.setItem(SESSION_KEY, snapR2);
    const offered = w2.__h.offerSessionRestore();
    const bar = w2.document.getElementById('resume-bar');
    ok('B1 resume offer renders inside .mc-welcome', offered && bar && bar.parentElement.classList.contains('mc-welcome'), 'offered=' + offered + ' bar=' + !!bar);
    ok('B2 resume offer names Round 2, Question 3', bar && /Round 2, Question 3/.test(bar.textContent), bar && bar.textContent.trim().slice(0, 80));
    const restored = w2.__h.restoreSession(w2.__h.loadSession());
    const s2 = w2.__h.state;
    ok('B3 restoreSession resumes Round 2', restored && s2.stage === 'refinement' && visible(w2, 'screen-assessment'), 'restored=' + restored);
    const expected = parsedR2.refinementQuestions[2].sc;
    ok('B4 restored page shows the right question', w2.document.body.textContent.includes(expected), expected.slice(0, 60));
    while (s2.stage === 'refinement' && s2.qNum < s2.refinementQuestions.length) { const q = s2.refinementQuestions[s2.qNum]; const o = pick(q.r); w2.__h.selectRefinementChoice(o.c, q.pair); }
    w2.__h.continueToStage2();
    let g = 0; while (!s2.result && g++ < 20) w2.__h.selectTournamentChoice(s2.tournament.currentMatchup.a.id);
    ok('B5 resumed Round 2 journey completes', !!(s2.result && s2.result.identity), '');
    ok('B6 no errors on Round 2 resume', e2.length === 0, e2.slice(0, 3).join(' | '));
  }
  // ---------- B7/B8: round-boundary snapshots ----------
  {
    const { win: wb, errors: eb } = makeDom();
    const boundary = { ...parsedR2, stage: 1, qNum: 30, qTot: 30, refinementQuestions: undefined, refinementPairwise: undefined };
    wb.sessionStorage.setItem(SESSION_KEY, JSON.stringify(boundary));
    const offered = wb.__h.offerSessionRestore();
    const bar = wb.document.getElementById('resume-bar');
    ok('B7a end-of-Round-1 offer says "Round 1 complete"', offered && bar && /Round 1 complete/.test(bar.textContent), bar && bar.textContent.trim().slice(0, 80));
    const restored = wb.__h.restoreSession(wb.__h.loadSession());
    const sb = wb.__h.state;
    const landed = sb.stage === 'refinement' || visible(wb, 'screen-early-offer');
    ok('B7b end-of-Round-1 resume re-enters the flow', restored && landed && !visible(wb, 'screen-welcome'), 'restored=' + restored + ' stage=' + sb.stage + ' welcomeHidden=' + !visible(wb, 'screen-welcome'));
    ok('B7c no errors on end-of-Round-1 resume', eb.length === 0, eb.slice(0, 3).join(' | '));
  }
  {
    const { win: wc, errors: ec } = makeDom();
    const boundary = { ...parsedR2, qNum: parsedR2.refinementQuestions.length };
    wc.sessionStorage.setItem(SESSION_KEY, JSON.stringify(boundary));
    const offered = wc.__h.offerSessionRestore();
    const bar = wc.document.getElementById('resume-bar');
    ok('B8a end-of-Round-2 offer says "Round 2 complete"', offered && bar && /Round 2 complete/.test(bar.textContent), bar && bar.textContent.trim().slice(0, 80));
    const restored = wc.__h.restoreSession(wc.__h.loadSession());
    const sc = wc.__h.state;
    ok('B8b end-of-Round-2 resume rebuilds the interstitial', restored && visible(wc, 'screen-interstitial') && !visible(wc, 'screen-welcome') && Array.isArray(sc.pendingCandidates) && sc.pendingCandidates.length > 0, 'restored=' + restored + ' interstitial=' + visible(wc, 'screen-interstitial'));
    wc.__h.continueToStage2();
    let g = 0; while (!sc.result && g++ < 20) wc.__h.selectTournamentChoice(sc.tournament.currentMatchup.a.id);
    ok('B8c end-of-Round-2 resume completes', !!(sc.result && sc.result.identity), '');
    ok('B8d no errors on end-of-Round-2 resume', ec.length === 0, ec.slice(0, 3).join(' | '));
  }
  // ---------- C: resume Round 3 in a fresh page ----------
  {
    const { win: w3, errors: e3 } = makeDom();
    w3.sessionStorage.setItem(SESSION_KEY, snapR3);
    const offered = w3.__h.offerSessionRestore();
    const bar = w3.document.getElementById('resume-bar');
    ok('C1 Round 3 resume offer names Round 3, Question 3', offered && bar && /Round 3, Question 3/.test(bar.textContent), bar && bar.textContent.trim().slice(0, 80));
    const restored = w3.__h.restoreSession(w3.__h.loadSession());
    const s3 = w3.__h.state;
    ok('C2 restoreSession resumes Round 3', restored && s3.stage === 3 && visible(w3, 'screen-assessment') && w3.document.getElementById('mc-loyalty-num').dataset.round === '3', 'restored=' + restored);
    let g = 0; while (!s3.result && g++ < 20) w3.__h.selectTournamentChoice(s3.tournament.currentMatchup.a.id);
    ok('C3 resumed Round 3 journey completes', !!(s3.result && s3.result.identity), '');
    ok('C4 no errors on Round 3 resume', e3.length === 0, e3.slice(0, 3).join(' | '));
  }
  // ---------- D: finished result offer ----------
  {
    await waitForResults(win);
    const { win: w4 } = makeDom();
    w4.sessionStorage.setItem(SESSION_KEY, win.sessionStorage.getItem(SESSION_KEY));
    const offered = w4.__h.offerSessionRestore();
    const bar = w4.document.getElementById('resume-bar');
    const savedNow = JSON.parse(win.sessionStorage.getItem(SESSION_KEY) || '{}');
    ok('D1 finished result is offered with "See result"', offered && bar && /finished result/.test(bar.textContent) && /See result/.test(bar.textContent),
      'responses=' + (s.responses || []).length + ' savedResult=' + !!savedNow.result + ' savedStage=' + savedNow.stage + ' resultsVisible=' + visible(win, 'screen-results') + ' | ' + (bar && bar.textContent.trim().slice(0, 60)));
    const restored = w4.__h.restoreSession(w4.__h.loadSession());
    const resultsOrDisclaimer = visible(w4, 'screen-results') || visible(w4, 'screen-pre-result-disclaimer');
    ok('D2 "See result" hides the welcome screen', restored && !visible(w4, 'screen-welcome'), 'restored=' + restored + ' welcomeVisible=' + visible(w4, 'screen-welcome') + ' resultsOrDisclaimer=' + resultsOrDisclaimer);
    ok('D3 audience attribute restored', ['forfun', 'workplace'].includes(w4.document.body.dataset.audience), w4.document.body.dataset.audience);
    w4.close();
  }
  win.close();

  // ---------- E: gate ON lets MTG- items through (over several runs) ----------
  {
    const runs = 8;
    let sawMtg = 0, leaked = 0;
    for (let i = 0; i < runs; i++) {
      const { win: we } = makeDom();
      runRound1(we, true);
      if ((we.__h.state.refinementQuestions || []).some(q => q.id.startsWith('MTG-'))) sawMtg++;
      we.close();
    }
    ok('E1 gate on: MTG- items can appear in Round 2', sawMtg > 0, sawMtg + '/' + runs + ' runs');
    for (let i = 0; i < runs; i++) {
      const { win: we } = makeDom();
      runRound1(we, false);
      if ((we.__h.state.refinementQuestions || []).some(q => q.id.startsWith('MTG-'))) leaked++;
      we.close();
    }
    ok('E2 gate off: never leaks across runs', leaked === 0, leaked + '/' + runs + ' runs leaked');
  }

  // ---------- F: clinch considers every candidate ----------
  {
    const { win: wf } = makeDom();
    const hf = wf.__h;
    const t = hf.initTournament(['A', 'B', 'C', 'D'].map(id => ({ id, s1: 0.5 })));
    const play = (x, y, winner) => {
      t.currentMatchup = t.pendingPairs.find(p => (p.a.id === x && p.b.id === y) || (p.a.id === y && p.b.id === x));
      t.pendingPairs = t.pendingPairs.filter(p => p !== t.currentMatchup);
      hf.recordTournamentResult(t, winner);
    };
    play('A', 'B', 'A'); play('A', 'C', 'A'); play('D', 'A', 'D'); play('C', 'B', 'C'); play('B', 'D', 'B');
    const term = hf.shouldTerminateEarly(t);
    ok('F1 no clinch while C or D can still tie A', !term.terminate, JSON.stringify(term));
    play('C', 'D', 'C');
    const term2 = hf.shouldTerminateEarly(t);
    ok('F2 all matches played terminates as EXHAUSTED', term2.terminate && term2.reason === 'EXHAUSTED', JSON.stringify(term2));
    // Genuine clinch: A beats everyone it has played and nobody can reach its total.
    const t2 = hf.initTournament(['A', 'B', 'C', 'D'].map(id => ({ id, s1: 0.5 })));
    const play2 = (x, y, winner) => { t2.currentMatchup = t2.pendingPairs.find(p => (p.a.id === x && p.b.id === y) || (p.a.id === y && p.b.id === x)); t2.pendingPairs = t2.pendingPairs.filter(p => p !== t2.currentMatchup); hf.recordTournamentResult(t2, winner); };
    play2('A', 'B', 'A'); play2('A', 'C', 'A'); play2('A', 'D', 'A'); play2('B', 'C', 'B'); play2('B', 'D', 'D');
    const term3 = hf.shouldTerminateEarly(t2);
    ok('F3 real clinch still detected', term3.terminate && term3.reason === 'CLINCHED', JSON.stringify(term3));
    wf.close();
  }

  // ---------- G: Neither no longer drags a colour down the ranking ----------
  {
    const { win: wg } = makeDom();
    const hg = wg.__h; const sg = hg.state;
    sg.pairwise = { 'W-B': { W: 2, B: 0 }, 'U-R': { U: 3, R: 3 }, 'G-U': { G: 3, U: 3 }, 'W-R': { W: 2, R: 0 }, 'B-G': { B: 5, G: 1 } };
    sg.pairwiseNeither = { 'W-B': 4, 'W-R': 4 };
    sg.pairwiseBoostCount = {};
    const a = hg.analyseGapBasedPatterns();
    ok('G1 White (4/4 answered) ranks above Black (5/8)', a.sorted[0].color === 'W', a.sorted.map(c => c.color + ':' + c.expectedWins.toFixed(1)).join(' '));
    ok('G2 gaps measured on the rescaled scale', typeof a.gaps[0].gap === 'number' && a.gaps[0].gap === a.sorted[0].expectedWins - a.sorted[1].expectedWins, '');
    ok('G3 early-offer evidence floor rejects a mostly-Neither colour', hg.decisivePairsWellAnswered(['W']) === false, '');
    sg.pairwiseNeither = {};
    ok('G4 evidence floor accepts well-answered pairs', hg.decisivePairsWellAnswered(['W']) === true, '');
    wg.close();
  }

  // ---------- H: context-disagreement caveat renders ----------
  {
    const { win: wh } = makeDom();
    const hh = wh.__h; const sh = hh.state;
    sh.result = { identity: 'DIMIR', confidence: 'MODERATE', round3Data: { matchHistory: [], contextDisagreement: { color: 'U', agreement: 0.5 } } };
    sh.activationSorted = [['U', 0.78], ['B', 0.64], ['G', 0.31], ['W', 0.22], ['R', 0.11]];
    sh.responses = new Array(30).fill({ c: 'U' });
    sh.qualityFlags = { totalAnswered: 30, alwaysLeftCount: 5, allNeitherCount: 2, fastResponseCount: 1 };
    sh.disclaimerAcknowledged = true;
    let threw = null; try { hh.showResults(); } catch (e) { threw = e.message; }
    const conf = (wh.document.getElementById('conf-exp') || {}).textContent || '';
    ok('H1 showResults runs with a context disagreement', !threw, threw);
    ok('H2 caveat text mentions Round 1 and Round 2 disagreeing about Blue', /Round 1 and Round 2 disagreed about Blue/.test(conf), conf.slice(-220));
    wh.close();
  }
});
