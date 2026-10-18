#!/usr/bin/env node
'use strict';
// The name matches the bars (CHANGELOG, "Result matches the bars"). A player
// was told Mono-Blue, LOW, under bars of W56 U52 B38 R60 G39: Blue, the one
// colour lit, came third, and the explanation said the bars had broken a
// Round 3 loop that the posterior had decided. An identity may now be the
// result only when its colours are the top bars, give or take BARS_TOLERANCE
// (barsAllow in index.html).
//  A  the rule on the player's own bars
//  B  the player's case end to end: a recorded Round 1 and 2 answer pattern
//     whose bars come to W55 U52 B38 R60 G39. On the build before the rule,
//     engine 2 played MONO-U, IZZET, JESKAI and WUBRG in Round 3, and the
//     player's loop gave Mono-Blue. Now Round 3 plays only identities the bars
//     allow, and all 64 ways Round 3 can go, on both engines, end on one; and
//     round3Data.loopBrokenByBars is true only when the bars did break a loop
//     (engine 1's re-rank; never engine 2, whose posterior decides)
//  C  that old Round 3 (those four, the player's six answers) finished on this
//     build, as a session saved mid-Round 3 before the change would be
//  D  simulated respondents of all three populations (ideal, misspecified,
//     mixed) at p 0.65 and 0.8 on both engines: no result over the tolerance
//     (tests/simulate.js fails on one, as a contract violation)
// Usage: node tests/bars.test.js [path/to/index.html]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { bootPage, pageArgs, mulberry32, isVisible } = require('./_lib/load');
const { run } = require('./_lib/report');

const WUBRG = ['W', 'U', 'B', 'R', 'G'];
const PLAYER_BARS = [['R', 0.60], ['W', 0.56], ['U', 0.52], ['G', 0.39], ['B', 0.38]];

// Recorded on 638cfe3 (engine 2, page seed 3, Magic items off) by searching
// for answers whose bars land on the player's. Two Round 1 answers are
// Neither. On 638cfe3 the posterior after Round 2 put IZZET, JESKAI, MONO-U
// and WUBRG in Round 3, and the player's loop with these three other answers
// gave MONO-U, LOW, secondary lean IZZET.
const PATTERN = {
  seed: 3,
  round1: {
    'A-WB-PSY': 'W', 'A-UR-REV': 'N', 'A-BG-W12': 'G', 'A-WB-W05': 'W', 'A-GU-PSY': 'G', 'A-GU-L02': 'U',
    'A-WR-L03': 'R', 'A-BG-PSY3': 'B', 'A-UR-L01': 'U', 'A-BG-W10': 'G', 'A-WB-L01': 'B', 'A-WB-PSY2': 'W',
    'A-UR-W01': 'U', 'A-WB-W01': 'B', 'A-GU-L04': 'U', 'A-UR-W03': 'U', 'A-GU-PSY3': 'G', 'A-WB-L05': 'B',
    'A-WR-L06': 'N', 'A-BG-PSY': 'B', 'A-GU-W10': 'U', 'A-GU-W08': 'U', 'A-WR-W09': 'W', 'A-WR-PSY': 'R',
    'A-UR-L03': 'U', 'A-BG-PSY2': 'B', 'A-WR-PSY2': 'R', 'A-UR-PSY': 'R', 'A-WR-W11': 'R', 'A-BG-REV': 'G',
  },
  round2: {
    'AL-UB-02': 'B', 'AL-UB-05': 'U', 'AL-BR-02': 'R', 'AL-BR-03': 'R', 'AL-WU-04': 'W', 'AL-WU-HET': 'W',
    'A-BG-L02': 'G', 'A-BG-L06': 'B', 'A-WB-REV': 'W',
  },
  oldFour: ['IZZET', 'JESKAI', 'MONO-U', 'WUBRG'],
  // winner, loser: the player's loop (IZZET > WUBRG > MONO-U > IZZET) and the three other answers
  oldAnswers: [['IZZET', 'WUBRG'], ['WUBRG', 'MONO-U'], ['MONO-U', 'IZZET'], ['MONO-U', 'JESKAI'], ['JESKAI', 'WUBRG'], ['IZZET', 'JESKAI']],
};

const barsLine = (act) => WUBRG.map((c) => c + Math.round(100 * (act[c] || 0))).join(' ');

// Rounds 1 and 2 of the recorded pattern. Returns the bars, or null if the
// page drew an item the pattern does not answer (the draws moved: re-record).
function playRounds12(win) {
  const h = win.__h;
  win.Math.random = mulberry32(PATTERN.seed);
  h.restart();
  const s0 = h.state;
  s0.mode = 'draft'; s0.audience = 'consumer'; s0.gamingFamiliar = false; s0.disclaimerAcknowledged = true;
  h.startAssessment();
  let guard = 0;
  while (h.state.stage === 1 && guard++ < 60) {
    const q = h.state.poolA[h.state.qNum];
    if (!q) break;
    const c = PATTERN.round1[q.id];
    if (!c) return null;
    if (c === 'N') { h.answerNeither(q); continue; }
    const o = q.r.find((x) => x.c === c);
    h.answerQ(o, q.r.indexOf(o));
  }
  if (isVisible(win, 'screen-early-offer')) h.continueToRound2();
  guard = 0;
  while (h.state.stage === 'refinement' && h.state.qNum < (h.state.refinementQuestions || []).length && guard++ < 60) {
    const q = h.state.refinementQuestions[h.state.qNum];
    const c = PATTERN.round2[q.id];
    if (!c) return null;
    h.selectRefinementChoice(c, q.pair);
  }
  return Object.fromEntries(h.state.activationSorted);
}

// Round 3 by a preference: prefer(a, b) is the id picked.
function playRound3(win, prefer) {
  const h = win.__h;
  if (!h.state.result && h.state.stage !== 3) h.continueToStage2();
  let guard = 0;
  while (!h.state.result && guard++ < 60) {
    const m = h.state.tournament && h.state.tournament.currentMatchup;
    if (!m) break;
    h.selectTournamentChoice(prefer(m.a.id, m.b.id));
  }
  return h.state.result;
}

// The results screen's text for the current result.
function resultsText(win) {
  win.__h.showResults();
  const el = win.document.getElementById('screen-results');
  return el ? el.textContent : '';
}

// The bars broke a loop when the reported identity is a loop member with the
// highest mean bar over its colours (engine 1's re-rank, poolFit).
function isBarsPickOfLoop(win, cycle, id) {
  const act = Object.fromEntries(win.__h.state.activationSorted);
  const fit = (x) => { const cols = win.__h.PROFILES[x].colors; return cols.reduce((s, c) => s + act[c], 0) / cols.length; };
  return cycle.includes(id) && fit(id) >= Math.max(...cycle.map(fit)) - 1e-12;
}

run('bars', async ({ ok, note }) => {
  const files = pageArgs();
  const pages = {
    2: bootPage({ ...files, stubs: { calculating: 'skip' }, fastStyles: true }),
    1: bootPage({ ...files, url: 'http://localhost/?engine=1', stubs: { calculating: 'skip' }, fastStyles: true }),
  };
  const win2 = pages[2].win;
  const tolerance = win2.eval('BARS_TOLERANCE');

  // ---------- A: the rule on the player's bars ----------
  const allow = (id) => win2.barsAllow(id, PLAYER_BARS);
  ok(`A1 the bars allow half an answer (BARS_TOLERANCE ${tolerance.toFixed(4)})`, Math.abs(tolerance - 1 / 24) < 1e-12, String(tolerance));
  ok('A2 W56 U52 B38 R60 G39 does not allow Mono-Blue (Red 8 points above Blue, White 4)', !allow('MONO-U'), win2.barsMargin('MONO-U', PLAYER_BARS));
  ok('A3 ...nor Five-colour (Black 12 points below the 50% line)', !allow('WUBRG'), win2.barsMargin('WUBRG', PLAYER_BARS));
  ok('A4 ...and allows the top bars one, two, three and four deep: Mono-Red, Boros, Jeskai, Ink',
    ['MONO-R', 'BOROS', 'JESKAI', 'INK'].every(allow), ['MONO-R', 'BOROS', 'JESKAI', 'INK'].filter((id) => !allow(id)).join(','));
  const allowedIds = Object.keys(win2.__h.PROFILES).filter(allow).sort();
  ok('A5 ...and near ties within half an answer: Izzet and Mono-White (4 points), Yore (1 point); nothing else of the 31',
    JSON.stringify(allowedIds) === JSON.stringify(['BOROS', 'INK', 'IZZET', 'JESKAI', 'MONO-R', 'MONO-W', 'YORE']), allowedIds.join(','));

  // ---------- B: the player's case, every Round 3 outcome, both engines ----------
  for (const engine of [2, 1]) {
    const win = pages[engine].win, h = win.__h;
    const act = playRounds12(win);
    if (!ok(`B${engine}.1 engine ${engine}: the recorded answers still fit the items drawn`, !!act, 'an item drawn is not in the pattern; re-record it')) continue;
    ok(`B${engine}.2 engine ${engine}: the bars come to W55 U52 B38 R60 G39`, barsLine(act) === 'W55 U52 B38 R60 G39', barsLine(act));
    const four = h.state.pendingCandidates.slice(0, 4).map((c) => c.id);
    if (engine === 2) {
      ok('B2.3 engine 2: Round 3 plays only identities the bars allow (not Mono-Blue, not Five-colour)',
        four.length === 4 && four.every((id) => win.barsAllow(id)), four.join(','));
    } else note(`engine 1 plays ${four.join(', ')}`);
    const pairs = [];
    for (let i = 0; i < four.length; i++) for (let j = i + 1; j < four.length; j++) pairs.push([four[i], four[j]]);
    const outcomes = {}, bad = [];
    let loops = 0, broken = 0, wrongFlag = 0;
    for (let mask = 0; mask < (1 << pairs.length); mask++) {
      playRounds12(win);
      const r = playRound3(win, (a, b) => {
        const k = pairs.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a));
        return k < 0 ? a : ((mask >> k) & 1 ? pairs[k][1] : pairs[k][0]);
      });
      const id = r ? r.identity : 'none';
      outcomes[id] = (outcomes[id] || 0) + 1;
      if (!r || id === 'MONO-U' || !win.barsAllow(id)) bad.push(`${mask}: ${id}`);
      const rd = (r && r.round3Data) || {};
      if (rd.cycle) loops++;
      if (rd.loopBrokenByBars) {
        broken++;
        if (!rd.cycle || !isBarsPickOfLoop(win, rd.cycle, id)) wrongFlag++;
      }
    }
    ok(`B${engine}.4 engine ${engine}: all ${1 << pairs.length} Round 3 outcomes end on an identity the bars allow, never Mono-Blue`,
      bad.length === 0, bad.slice(0, 3).join('; '));
    note(`engine ${engine} results: ${Object.entries(outcomes).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    if (engine === 2) {
      ok(`B2.5 engine 2: no result records that the bars broke its loop (${loops} with a loop; the posterior decides)`,
        loops > 0 && broken === 0, `${broken} flagged`);
    } else {
      ok(`B1.5 engine 1: a result records that the bars broke its loop only when it is the loop's best member by the bars (${broken} of ${loops} loops)`,
        broken > 0 && wrongFlag === 0, `${wrongFlag} of ${broken} flagged wrongly`);
    }
  }

  // ---------- C: the old Round 3 finished on this build ----------
  {
    const win = win2, h = win.__h;
    playRounds12(win);
    // The four the build before the rule played, in its order (posterior after Round 2)
    const post = win.posteriorFromLogLik(win.identityLogLikelihoods(win.likelihoodEvidence()));
    const top4 = win.posteriorCandidates(post, 4).map((c) => c.id);
    ok('C1 the old four were the posterior\'s top four after Round 2', JSON.stringify(top4) === JSON.stringify(PATTERN.oldFour), top4.join(','));
    h.state.pendingCandidates = win.posteriorCandidates(post, 4);
    const beats = (a, b) => PATTERN.oldAnswers.some(([w, l]) => w === a && l === b);
    const r = playRound3(win, (a, b) => (beats(a, b) ? a : b));
    const rd = r.round3Data || {};
    ok('C2 the player\'s six answers no longer give Mono-Blue: the result is one the bars allow',
      r.identity !== 'MONO-U' && win.barsAllow(r.identity), `${r.identity} ${r.confidence}`);
    ok('C3 ...a loop runs through it, so it is still LOW, and the runner-up is one the bars allow',
      r.confidence === 'LOW' && !!rd.cycle && rd.cycle.includes(r.identity) && !!rd.runnerUp && win.barsAllow(rd.runnerUp.id),
      `${r.confidence} cycle ${(rd.cycle || []).join('>')} runner-up ${rd.runnerUp && rd.runnerUp.id}`);
    const text = resultsText(win);
    ok('C4 ...recorded as decided by the posterior, and the results screen names the result without crediting the bars',
      rd.loopBrokenByBars === false && text.includes(h.PROFILES[r.identity].name) && !/broke the loop/i.test(text), text.slice(0, 120));
    note(`old Round 3 on this build: ${r.identity} ${r.confidence}, runner-up ${rd.runnerUp && rd.runnerUp.id}`);
  }
  const errors = Object.values(pages).flatMap((p) => p.errors);
  ok('no console or jsdom errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  Object.values(pages).forEach((p) => p.win.close());

  // ---------- D: simulated respondents, all three populations ----------
  {
    const out = path.join(os.tmpdir(), `mana-bars-${process.pid}.json`);
    const sim = spawnSync(process.execPath, [path.join(__dirname, 'simulate.js'), '--n', '4', '--models', 'all', '--p', '0.65,0.8',
      '--engine', '1,2', '--out', out, ...(files.htmlPath ? [files.htmlPath] : [])], { encoding: 'utf-8', maxBuffer: 64 << 20 });
    ok('D1 the simulator ran clean: no page errors, and no contract violation (every result allowed by its bars)', sim.status === 0,
      (sim.stderr || '').trim().split('\n').slice(-2).join(' | '));
    if (fs.existsSync(out)) {
      const reports = JSON.parse(fs.readFileSync(out, 'utf-8')).runs || [];
      fs.unlinkSync(out);
      ok('D2 twelve reports: three populations, two engines, two p', reports.length === 12, String(reports.length));
      const total = reports.reduce((a, r) => a + r.respondents, 0);
      const over = reports.reduce((a, r) => a + Math.round(r.bars.overHalfAnswer * r.respondents), 0);
      ok(`D3 0 of ${total} simulated results over half an answer from their bars`, total > 0 && over === 0, `${over} over`);
      for (const r of reports) {
        note(`${r.params.model.padEnd(12)} engine ${r.params.engine} p ${r.params.p}: exact ${(100 * r.overallExact).toFixed(1)}%, `
          + `over half an answer ${(100 * r.bars.overHalfAnswer).toFixed(1)}%, shown out of order ${(100 * r.bars.shownOutOfOrder).toFixed(1)}%`);
      }
    }
  }
});
