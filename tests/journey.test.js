#!/usr/bin/env node
'use strict';
// End-to-end journeys through the quiz in jsdom (46 checks): the Round 2
// gaming gate, weighted ally answers, the Round 3 badge, session save and
// resume at every stage (mid-Round 2, both round boundaries, mid-Round 3 and a
// finished result), the Round 3 clinch rule, Neither-neutral Round 1 ranking,
// the early-offer evidence floor, a context disagreement that the result
// page no longer spells out, and a session finishing on the scoring engine it
// started with (a mid-Round 3 session from engine 2 and the same from engine
// 3), with ?engine= pinning a new one.
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

  // ---------- H: a context disagreement says nothing on screen ----------
  // The guard still caps the confidence in the scoring code; the result page
  // shows the label and its one line, with no caveat stacked under them.
  {
    const { win: wh } = makeDom();
    const hh = wh.__h; const sh = hh.state;
    sh.result = { identity: 'DIMIR', confidence: 'MODERATE', round3Data: { matchHistory: [], contextDisagreement: { color: 'U', agreement: 0.5 } } };
    sh.activationSorted = [['U', 0.78], ['B', 0.64], ['G', 0.31], ['W', 0.22], ['R', 0.11]];
    sh.responses = new Array(30).fill({ c: 'U' });
    sh.qualityFlags = { totalAnswered: 30, alwaysLeftCount: 5, allNeitherCount: 2, fastResponseCount: 1 };
    sh.disclaimerAcknowledged = true;
    let threw = null; try { hh.showResults(); } catch (e) { threw = e.message; }
    const block = wh.document.querySelector('.mc-verdict-status').textContent.replace(/\s+/g, ' ').trim();
    const page = wh.document.getElementById('screen-results').textContent;
    ok('H1 showResults runs with a context disagreement', !threw, threw);
    ok('H2 the confidence block is the label and its one line about the bars, with no caveat about Round 1 and Round 2',
      block === 'Leaning Blue and black were well clear of the other three colours.' && !wh.document.getElementById('conf-exp')
        && !/caveat|disagreed|Round 1 and Round 2|softer than/i.test(page), block);
    wh.close();
  }

  // ---------- I: a session finishes on the scoring engine it started with ----------
  // A session saved mid-Round 3 carries its engine (state.scoringEngine), and a
  // result says which engine built it (scoringVersion). Engine 3, the default,
  // reads a Round 3 answer at a lower q than engine 2 did (ROUND3_Q_GRID against
  // ROUND3_Q_GRID_BY_VERSION[2]), so it counts for less. The session below is a
  // player's from the author's runs (seed 101: bars U88 B82 R56 W9 G0; after
  // Rounds 1 and 2, Grixis 84%, Dimir 12%), three matches in (Dimir beat
  // Four-colour without green, Grixis beat Mono-Blue, Dimir beat Mono-Blue),
  // with Dimir against Grixis still to answer.
  {
    const midRound3 = (engine) => {
      const cand = (id, s1) => ({ id, s1, combinedScore: s1, wins: 0, losses: 0, opponents: [] });
      const c = { GRIXIS: cand('GRIXIS', 0.8355), DIMIR: cand('DIMIR', 0.1231), YORE: cand('YORE', 0.0202), 'MONO-U': cand('MONO-U', 0.0043) };
      const matchHistory = [['DIMIR', 'YORE'], ['GRIXIS', 'MONO-U'], ['DIMIR', 'MONO-U']].map(([w, l], i) => {
        c[w].wins++; c[w].opponents.push(l); c[l].losses++; c[l].opponents.push(w);
        return { a: { id: w }, b: { id: l }, winner: { id: w }, loser: { id: l }, type: 'ROUND_ROBIN', scenarioId: null, questionNum: i };
      });
      const pair = (a, b) => ({ a: c[a], b: c[b], type: 'ROUND_ROBIN' });
      return JSON.stringify({
        stage: 3, qNum: 3, qTot: 6, mode: 'draft', audience: 'consumer', gamingFamiliar: false, disclaimerAcknowledged: true,
        responses: [], refinementAnswers: [],
        pairwise: { 'W-B': { W: 0, B: 5.8 }, 'U-R': { U: 5.3, R: 1.7 }, 'G-U': { G: 0, U: 5.3 }, 'W-R': { W: 1, R: 4.8 }, 'B-G': { B: 5.6, G: 0 } },
        refinementPairwise: { 'W-U': { W: 0, U: 0 }, 'U-B': { U: 1.8, B: 0 }, 'B-R': { B: 1, R: 1 }, 'R-G': { R: 1.7, G: 0 }, 'G-W': { G: 0, W: 0 } },
        activationSorted: [['U', 0.8794], ['B', 0.8158], ['R', 0.5576], ['W', 0.0862], ['G', 0]],
        tournament: {
          candidates: Object.values(c), matchHistory, pendingPairs: [pair('GRIXIS', 'YORE'), pair('YORE', 'MONO-U')], currentMatchup: pair('DIMIR', 'GRIXIS'),
          questionCount: 3, maxQuestions: 6, terminated: false, termReason: null, usedPoolScenarios: [], tiebreakAdded: false, poolQuestionsServed: 0,
        },
        scoringEngine: engine, likelihood: null, mulligan: { usedRounds: [], pending: null }, timestamp: Date.now(),
      });
    };
    const finish = (engine) => {
      const { win: wi, errors: ei } = makeDom();
      wi.sessionStorage.setItem(SESSION_KEY, midRound3(engine));
      const restored = wi.__h.restoreSession(wi.__h.loadSession());
      wi.__h.selectTournamentChoice('DIMIR'); // Dimir over Grixis, as the player chose
      const r = wi.__h.state.result || {};
      const out = { restored, identity: r.identity, confidence: r.confidence, version: r.scoringVersion, grixis: r.posterior && r.posterior.GRIXIS, dimir: r.posterior && r.posterior.DIMIR, errors: ei.length };
      wi.close();
      return out;
    };
    const pct = (x) => (100 * x).toFixed(1);
    const e2 = finish(2), e3 = finish(3);
    ok(`I1 saved on engine 2, it finishes on engine 2 as it did for the player: ${e2.identity} ${e2.confidence} (Dimir ${pct(e2.dimir)}%, Grixis ${pct(e2.grixis)}%), scoring version 2`,
      e2.restored && e2.version === 2 && e2.identity === 'DIMIR' && e2.confidence === 'MODERATE' && pct(e2.dimir) === '54.1' && pct(e2.grixis) === '43.3' && !e2.errors, JSON.stringify(e2));
    ok(`I2 saved on engine 3, the same answers finish on engine 3: ${e3.identity} ${e3.confidence} (Grixis ${pct(e3.grixis)}%, Dimir ${pct(e3.dimir)}%), scoring version 3`,
      e3.restored && e3.version === 3 && e3.identity === 'GRIXIS' && e3.confidence === 'MODERATE' && pct(e3.grixis) === '61.9' && pct(e3.dimir) === '34.9' && !e3.errors, JSON.stringify(e3));
    // A new assessment runs on engine 3; ?engine=2 and ?engine=1 still select the earlier ones.
    const pinned = [['', 3], ['?engine=2', 2], ['?engine=1', 1], ['?engine=7', 3]].map(([q, want]) => {
      const { win: wp } = bootPage({ ...pageArgs(), seed: nextSeed++, url: 'http://localhost/' + q });
      wp.__h.state.mode = 'draft'; wp.__h.state.disclaimerAcknowledged = true;
      wp.__h.startAssessment();
      const got = wp.__h.state.scoringEngine;
      wp.close();
      return [q || '(none)', got, want];
    });
    ok('I3 a new assessment pins engine 3; ?engine=2 and ?engine=1 pin the earlier engines, and anything else the current one',
      pinned.every(([, got, want]) => got === want), JSON.stringify(pinned));
  }
});
