#!/usr/bin/env node
'use strict';
// The name matches the bars (CHANGELOG, "Result matches the bars" and "Even
// bars and Five-colour"). A player was told Mono-Blue, LOW, under bars of W56
// U52 B38 R60 G39: Blue, the one colour lit, came third. The bars now count
// every answer once (barsFromTallies in index.html), and an identity may be the
// result only when its colours are the top bars as the results screen prints
// them, ties allowed, or, for Five-colour, when the five print within
// FIVE_COLOUR_BAND points of each other (barsAllow).
//  E  the bars: each answered Round 1 or Round 2 item, Round 2's enemy
//     re-tests included, counts its weight once for the colour chosen and once
//     in the denominator of both colours in its pair, and Neither in neither;
//     held against the answer records on recorded patterns and on simulated
//     respondents of all three populations, both engines
//  A  the rule on the player's own bars: exactly the top bars one to four deep
//  P  the printed order: on random bars, near ties at the half point included,
//     an identity of one to four colours is allowed exactly when no colour it
//     leaves out prints above one it holds, and the numbers the rule reads are
//     the ones the results screen prints
//  F  Five-colour: allowed exactly when the five print within the band; end to
//     end, a seeded five-colour respondent whose bars are that flat is told
//     Five-colour, and one whose bars are not gets an identity they allow
//  B  the player's case end to end: a Round 1 and 2 answer pattern whose bars
//     print W56 U52 B38 R61 G39 (PLAYER). Round 3 plays only identities the
//     bars allow, and all 64 ways it can go, on both engines, end on one,
//     never Mono-Blue; round3Data.loopBrokenByBars is true only when the bars
//     did break a loop (engine 1's re-rank; never engine 2, whose posterior
//     decides)
//  O  the pattern recorded on 638cfe3 for the player's old bars (OLD): its
//     bars, counted evenly, print W48 U64 B43 R56 G42, Blue first, where they
//     printed W55 U52 B38 R60 G39 when two Round 2 answers counted as much as
//     ten Round 1 answers
//  C  that old Round 3 (the old four, the player's six answers), finished on
//     this build with the bars the old build saved, as a session saved
//     mid-Round 3 before the change would be
//  D  simulated respondents of all three populations (ideal, misspecified,
//     mixed) at p 0.65 and 0.8 on both engines: no result against its printed
//     bars, and no early offer against the Round 1 bars (tests/simulate.js
//     fails on either, as a contract violation)
// Usage: node tests/bars.test.js [path/to/index.html]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { bootPage, pageArgs, mulberry32, isVisible } = require('./_lib/load');
const { runRespondent, calibrateMisspecified } = require('./_lib/respondent');
const { run } = require('./_lib/report');

const WUBRG = ['W', 'U', 'B', 'R', 'G'];
const PLAYER_BARS = [['R', 0.60], ['W', 0.56], ['U', 0.52], ['G', 0.39], ['B', 0.38]];
// FIVE_COLOUR_BAND as docs/SCORING_CONTRACT.md states it, in printed points.
const BAND = 20;

// The player's bars under the even count: found on this build (engine 2, page
// seed 3, Magic items off) by searching for Round 1 and 2 answers whose bars
// print as the player's; the nearest found is a point out on Red. None of the
// answers is Neither.
const PLAYER = {
  seed: 3,
  bars: 'W56 U52 B38 R61 G39',
  round1: {
    'A-WB-PSY': 'W', 'A-UR-REV': 'R', 'A-BG-W12': 'B', 'A-WB-W05': 'W', 'A-GU-PSY': 'G', 'A-GU-L02': 'U',
    'A-WR-L03': 'W', 'A-BG-PSY3': 'G', 'A-UR-L01': 'U', 'A-BG-W10': 'G', 'A-WB-L01': 'W', 'A-WB-PSY2': 'W',
    'A-UR-W01': 'R', 'A-WB-W01': 'W', 'A-GU-L04': 'U', 'A-UR-W03': 'U', 'A-GU-PSY3': 'G', 'A-WB-L05': 'B',
    'A-WR-L06': 'W', 'A-BG-PSY': 'G', 'A-GU-W10': 'U', 'A-GU-W08': 'G', 'A-WR-W09': 'R', 'A-WR-PSY': 'R',
    'A-UR-L03': 'R', 'A-BG-PSY2': 'B', 'A-WR-PSY2': 'W', 'A-UR-PSY': 'R', 'A-WR-W11': 'R', 'A-BG-REV': 'B',
  },
  round2: {
    'AL-GW-02': 'W', 'AL-GW-05': 'G', 'AL-RG-02': 'R', 'AL-RG-03': 'R', 'AL-WU-04': 'U', 'AL-WU-HET': 'U',
    'A-WR-L01': 'W', 'A-WR-PSY3': 'R', 'A-BG-L04': 'B',
  },
};

// Recorded on 638cfe3 (engine 2, page seed 3, Magic items off) by searching
// for answers whose bars, as that build counted them, landed on the player's.
// Two Round 1 answers are Neither. On 638cfe3 the posterior after Round 2 put
// IZZET, JESKAI, MONO-U and WUBRG in Round 3, and the player's loop with these
// three other answers gave MONO-U, LOW, secondary lean IZZET.
const OLD = {
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
  // The bars 638cfe3 saved after Round 2 (it averaged each colour's Round 1
  // and Round 2 rates, Beta(1, 1) smoothed): W55 U52 B38 R60 G39 as printed.
  savedBars: [['R', 0.6], ['W', 0.5541505791505792], ['U', 0.5215924426450742], ['G', 0.39375000000000004], ['B', 0.38431372549019605]],
  oldFour: ['IZZET', 'JESKAI', 'MONO-U', 'WUBRG'],
  // winner, loser: the player's loop (IZZET > WUBRG > MONO-U > IZZET) and the three other answers
  oldAnswers: [['IZZET', 'WUBRG'], ['WUBRG', 'MONO-U'], ['MONO-U', 'IZZET'], ['MONO-U', 'JESKAI'], ['JESKAI', 'WUBRG'], ['IZZET', 'JESKAI']],
};

// Seeded ideal Five-colour respondents (tests/_lib/respondent.js, seed 7,
// p = 0.8): FIVE.flat's bars print within the band, FIVE.wide's do not.
const FIVE = { seed: 7, p: 0.8, flat: 34, wide: 3 };

const printed = (act) => Object.fromEntries(WUBRG.map((c) => [c, Math.round((act[c] || 0) * 100)]));
const barsLine = (act) => { const s = printed(act); return WUBRG.map((c) => c + s[c]).join(' '); };

// The rule, written out here from the contract, not read from the page.
function allowedByPrint(colours, act) {
  const s = printed(act);
  const out = WUBRG.filter((c) => !colours.includes(c));
  const inMin = Math.min(...colours.map((c) => s[c]));
  if (!out.length) return Math.max(...colours.map((c) => s[c])) - inMin <= BAND;
  return Math.max(...out.map((c) => s[c])) <= inMin;
}

// The bars counted from the answer records: each answered item's weight once
// for the colour chosen and once for both colours of its pair; Neither, nothing.
function barsFromRecords(st) {
  const picked = { W: 0, U: 0, B: 0, R: 0, G: 0 }, offered = { W: 0, U: 0, B: 0, R: 0, G: 0 };
  const count = (pair, choice, w) => {
    if (!pair || !WUBRG.includes(choice)) return;
    const [a, b] = pair.split('-');
    picked[choice] += w; offered[a] += w; offered[b] += w;
  };
  (st.responses || []).forEach((r) => count(r.pair, r.c, r.w || 1));
  (st.refinementAnswers || []).forEach((r) => count(r.pair, r.choice, r.w || 1));
  return Object.fromEntries(WUBRG.map((c) => [c, offered[c] ? picked[c] / offered[c] : 0.5]));
}
const sameBars = (a, b) => WUBRG.every((c) => Math.abs((a[c] || 0) - (b[c] || 0)) < 1e-12);

// Rounds 1 and 2 of a recorded pattern. Returns the bars, or null if the page
// drew an item the pattern does not answer (the draws moved: re-record).
function playRounds12(win, pattern) {
  const h = win.__h;
  win.Math.random = mulberry32(pattern.seed);
  h.restart();
  const s0 = h.state;
  s0.mode = 'draft'; s0.audience = 'consumer'; s0.gamingFamiliar = false; s0.disclaimerAcknowledged = true;
  h.startAssessment();
  let guard = 0;
  while (h.state.stage === 1 && guard++ < 60) {
    const q = h.state.poolA[h.state.qNum];
    if (!q) break;
    const c = pattern.round1[q.id];
    if (!c) return null;
    if (c === 'N') { h.answerNeither(q); continue; }
    const o = q.r.find((x) => x.c === c);
    h.answerQ(o, q.r.indexOf(o));
  }
  if (isVisible(win, 'screen-early-offer')) h.continueToRound2();
  guard = 0;
  while (h.state.stage === 'refinement' && h.state.qNum < (h.state.refinementQuestions || []).length && guard++ < 60) {
    const q = h.state.refinementQuestions[h.state.qNum];
    const c = pattern.round2[q.id];
    if (!c) return null;
    if (c === 'N') h.selectRefinementNeither(q.pair);
    else h.selectRefinementChoice(c, q.pair);
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
  const ids = Object.keys(win2.__h.PROFILES);
  const colours = (id) => win2.__h.PROFILES[id].colors;

  // ---------- E: the bars count every answer once ----------
  {
    const win = win2, h = win.__h;
    const act = playRounds12(win, OLD);
    const st = h.state;
    const retests = (st.refinementAnswers || []).filter((a) => a.type === 'ENEMY_RETEST').length;
    const neithers = (st.responses || []).filter((r) => r.c === 'NEITHER').length;
    const weighted = [...(st.responses || []), ...(st.refinementAnswers || [])].filter((r) => (r.w || 1) !== 1).length;
    ok(`E1 the recorded pattern: the bars are its answers counted once each, by weight (${st.responses.length} Round 1 answers with ${neithers} Neither, `
      + `${st.refinementAnswers.length} Round 2 with ${retests} enemy re-tests, ${weighted} weighted below 1)`,
      !!act && retests > 0 && neithers > 0 && weighted > 0 && sameBars(act, barsFromRecords(st)), act && `${barsLine(act)} against ${barsLine(barsFromRecords(st))}`);
    // A Round 2 answer moves a bar as far as a Round 1 answer of the same weight:
    // turn one ally answer and one Round 1 answer to the same colour, on the
    // page's own tallies, and compare each move per unit of weight.
    const barsAfter = (pair, from, to, w, ally) => {
      const pw = JSON.parse(JSON.stringify(st.pairwise)), rp = JSON.parse(JSON.stringify(st.refinementPairwise));
      const t = ally ? rp : pw;
      t[pair][from] -= w; t[pair][to] += w;
      return win.barsFromTallies([pw, rp]);
    };
    const allyAns = st.refinementAnswers.find((a) => a.type !== 'ENEMY_RETEST' && WUBRG.includes(a.choice));
    const [a1, b1] = allyAns.pair.split('-');
    const other = allyAns.choice === a1 ? b1 : a1;
    const r1 = st.responses.find((r) => r.pair && r.pair.split('-').includes(other) && WUBRG.includes(r.c) && r.c !== other);
    const moveAlly = (barsAfter(allyAns.pair, allyAns.choice, other, allyAns.w || 1, true)[other] - act[other]) / (allyAns.w || 1);
    const moveR1 = (barsAfter(r1.pair, r1.c, other, r1.w || 1, false)[other] - act[other]) / (r1.w || 1);
    ok(`E2 ...so a Round 2 answer moves its colour's bar as far as a Round 1 answer of the same weight does (${(100 * moveAlly).toFixed(1)} points for ${other} either way)`,
      moveAlly > 0 && Math.abs(moveAlly - moveR1) < 1e-12, `${moveAlly} vs ${moveR1}`);
    // The Round 1 bars, which the early offer reads, are Round 1's answers alone.
    win.Math.random = mulberry32(OLD.seed);
    h.restart();
    Object.assign(h.state, { mode: 'draft', audience: 'consumer', gamingFamiliar: false, disclaimerAcknowledged: true });
    h.startAssessment();
    while (h.state.stage === 1 && h.state.poolA[h.state.qNum]) {
      const q = h.state.poolA[h.state.qNum], c = OLD.round1[q.id];
      if (c === 'N') h.answerNeither(q); else { const o = q.r.find((x) => x.c === c); h.answerQ(o, q.r.indexOf(o)); }
    }
    const r1Bars = Object.fromEntries(h.state.activationSorted);
    ok(`E3 the Round 1 bars are Round 1's answers counted the same way (${barsLine(r1Bars)})`,
      sameBars(r1Bars, barsFromRecords({ responses: h.state.responses })), barsLine(barsFromRecords({ responses: h.state.responses })));
    // Simulated respondents, every population and both engines: the bars after
    // Round 3 are still the Round 1 and 2 answers counted once each.
    const bad = [];
    let checked = 0;
    for (const engine of [2, 1]) for (const model of ['ideal', 'misspecified', 'mixed']) for (let k = 0; k < 8; k++) {
      const win = pages[engine].win, id = ids[(7 * k + (engine === 1 ? 3 : 0)) % ids.length];
      const params = { model, p: 0.65, neither: 0.1, seed: 11 };
      if (model !== 'ideal') params.calibration = calibrateMisspecified(0.65);
      runRespondent(win, id, k, params);
      const act = Object.fromEntries(win.__h.state.activationSorted);
      checked++;
      if (!sameBars(act, barsFromRecords(win.__h.state))) bad.push(`${model} e${engine} ${id} #${k}: ${barsLine(act)}`);
    }
    ok(`E4 on ${checked} simulated respondents (three populations, both engines), the bars are the answers counted once each`, bad.length === 0, bad.slice(0, 3).join('; '));
  }

  // ---------- A: the rule on the player's bars ----------
  const allow = (id, bars = PLAYER_BARS) => win2.barsAllow(id, bars);
  ok(`A1 FIVE_COLOUR_BAND is ${BAND} points, as the contract says`, win2.eval('FIVE_COLOUR_BAND') === BAND, String(win2.eval('FIVE_COLOUR_BAND')));
  ok('A2 W56 U52 B38 R60 G39 does not allow Mono-Blue (Red prints 8 points above Blue, White 4)', !allow('MONO-U'), win2.barsMargin('MONO-U', PLAYER_BARS));
  ok(`A3 ...nor Five-colour (the five print 22 points apart; the band is ${BAND})`, !allow('WUBRG'), win2.barsMargin('WUBRG', PLAYER_BARS));
  const allowedIds = ids.filter((id) => allow(id)).sort();
  ok('A4 ...and allows exactly the top bars one, two, three and four deep: Mono-Red, Boros, Jeskai, Four-colour (no black)',
    JSON.stringify(allowedIds) === JSON.stringify(['BOROS', 'INK', 'JESKAI', 'MONO-R']), allowedIds.join(','));
  ok('A5 ...so the near ties the old half-answer rule let through print out of order and are not allowed: Izzet and Mono-White (Blue and White under Red), Yore (Black 38 under Green 39)',
    ['IZZET', 'MONO-W', 'YORE'].every((id) => !allow(id)), ['IZZET', 'MONO-W', 'YORE'].filter((id) => allow(id)).join(','));

  // ---------- P: the printed order ----------
  {
    const rnd = mulberry32(2026);
    const pick = () => {
      const k = Math.floor(rnd() * 4);
      if (k === 0) return Math.floor(rnd() * 101) / 100;           // a whole percent
      if (k === 1) return (Math.floor(rnd() * 100) + 0.5) / 100;   // exactly on a half point
      if (k === 2) return (Math.floor(rnd() * 100) + 0.5) / 100 + (rnd() < 0.5 ? -1 : 1) * 1e-9; // just either side of one
      return rnd();
    };
    let cases = 0, ties = 0, wrong = 0;
    const bad = [];
    for (let n = 0; n < 4000; n++) {
      const act = {};
      WUBRG.forEach((c) => { act[c] = pick(); });
      // Every fifth draw, two bars a hair apart, so they often print equal.
      if (n % 5 === 0) { const [x, y] = [WUBRG[n % 5], WUBRG[(n + 2) % 5]]; act[y] = act[x] + (rnd() - 0.5) * 0.004; }
      const sorted = Object.entries(act).sort((a, b) => b[1] - a[1]);
      if (new Set(Object.values(printed(act))).size < 5) ties++;
      for (const id of ids) {
        cases++;
        const want = allowedByPrint(colours(id), act), got = win2.barsAllow(id, sorted);
        if (want === got) continue;
        wrong++;
        if (bad.length < 3) bad.push(`${id} under ${barsLine(act)} (${JSON.stringify(act)}): page ${got}, rule ${want}`);
      }
    }
    ok(`P1 on 4,000 random bars (${ties} with printed ties) and all 31 identities, the page allows exactly the identities whose colours print on top, ties allowed (${cases} cases)`,
      wrong === 0, `${wrong} wrong; ${bad.join('; ')}`);
    // Each width always has one identity the bars allow: the top bars as printed.
    let missing = 0;
    for (let n = 0; n < 500; n++) {
      const act = {}; WUBRG.forEach((c) => { act[c] = pick(); });
      const sorted = Object.entries(act).sort((a, b) => b[1] - a[1]);
      for (let k = 1; k <= 4; k++) if (!ids.some((id) => colours(id).length === k && win2.barsAllow(id, sorted))) missing++;
    }
    ok('P2 on any bars, some identity of each width from one to four colours is allowed (so Round 3 always has four to play)', missing === 0, `${missing} widths with none`);
    // The rule reads the numbers the results screen prints: a near tie at the
    // half point, rendered, and the rule on the same bars.
    const h = win2.__h;
    const act = { W: 0.555, U: 0.5549999, B: 0.38, R: 0.60, G: 0.385 };
    h.state.result = { identity: 'BOROS', confidence: 'LOW', allResults: [], scoringVersion: 2, instrumentVersion: 5 };
    h.state.activationSorted = Object.entries(act).sort((a, b) => b[1] - a[1]);
    h.state.disclaimerAcknowledged = true;
    h.showResults();
    const shown = [...win2.document.querySelectorAll('#res-profile-bars .mc-profile__pct')].map((e) => parseInt(e.textContent, 10));
    const want = WUBRG.map((c) => printed(act)[c]);
    ok(`P3 the rule reads the bars as the results screen prints them (${WUBRG.map((c, i) => c + shown[i]).join(' ')})`,
      JSON.stringify(shown) === JSON.stringify(want) && JSON.stringify(Object.values(win2.barsShown(h.state.activationSorted))) === JSON.stringify(want),
      `screen ${shown.join(',')}, rule ${JSON.stringify(win2.barsShown(h.state.activationSorted))}`);
    const linkP = new URL(h.buildResultURL()).searchParams.get('p');
    ok(`P4 ...and a shared link carries the same numbers (p=${linkP}), so a link's name and bars agree too`, linkP === want.join(','), linkP);
    h.restart();
  }

  // ---------- F: Five-colour ----------
  {
    const flat = (v) => Object.entries(v).sort((a, b) => b[1] - a[1]);
    ok('F1 five equal bars allow Five-colour', allow('WUBRG', flat({ W: 0.5, U: 0.5, B: 0.5, R: 0.5, G: 0.5 })));
    ok(`F2 five bars printed exactly ${BAND} points apart allow it`, allow('WUBRG', flat({ W: 0.6, U: 0.55, B: 0.5, R: 0.45, G: 0.4 })));
    ok(`F3 ${BAND + 1} points apart do not`, !allow('WUBRG', flat({ W: 0.61, U: 0.55, B: 0.5, R: 0.45, G: 0.4 })));
    ok('F4 ...a half point that prints as a whole one counts as printed (0.605 prints 61)', !allow('WUBRG', flat({ W: 0.605, U: 0.55, B: 0.5, R: 0.45, G: 0.4 })));
    for (const engine of [2, 1]) {
      const win = pages[engine].win, h = win.__h;
      const flatRun = runRespondent(win, 'WUBRG', FIVE.flat, { model: 'ideal', p: FIVE.p, neither: 0.05, seed: FIVE.seed });
      const flatAct = Object.fromEntries(h.state.activationSorted);
      const spread = (s) => Math.max(...s) - Math.min(...s);
      ok(`F5.${engine} engine ${engine}: a seeded five-colour respondent whose bars print ${barsLine(flatAct)} (a spread of ${spread(flatRun.finalShown)}) is told Five-colour`,
        flatRun.recovered === 'WUBRG' && spread(flatRun.finalShown) <= BAND, `${flatRun.recovered} ${barsLine(flatAct)}`);
      const wideRun = runRespondent(win, 'WUBRG', FIVE.wide, { model: 'ideal', p: FIVE.p, neither: 0.05, seed: FIVE.seed });
      const wideAct = Object.fromEntries(h.state.activationSorted);
      ok(`F6.${engine} engine ${engine}: one whose bars print ${barsLine(wideAct)} (a spread of ${spread(wideRun.finalShown)}) is told ${wideRun.recovered}, an identity those bars allow`,
        wideRun.recovered !== 'WUBRG' && spread(wideRun.finalShown) > BAND && allowedByPrint(colours(wideRun.recovered), wideAct), `${wideRun.recovered} ${barsLine(wideAct)}`);
    }
  }

  // ---------- B: the player's case, every Round 3 outcome, both engines ----------
  for (const engine of [2, 1]) {
    const win = pages[engine].win, h = win.__h;
    const act = playRounds12(win, PLAYER);
    if (!ok(`B${engine}.1 engine ${engine}: the player's answers still fit the items drawn`, !!act, 'an item drawn is not in the pattern; re-record it')) continue;
    ok(`B${engine}.2 engine ${engine}: the bars print ${PLAYER.bars}`, barsLine(act) === PLAYER.bars, barsLine(act));
    const four = h.state.pendingCandidates.slice(0, 4).map((c) => c.id);
    if (engine === 2) {
      const post = win.posteriorFromLogLik(win.identityLogLikelihoods(win.likelihoodEvidence()));
      const unfiltered = win.posteriorCandidates(post, 6).map((c) => c.id);
      ok(`B2.3 engine 2: Round 3 plays only identities the bars allow (${four.join(', ')}; the posterior alone would have had ${unfiltered.slice(0, 4).join(', ')})`,
        four.length === 4 && four.every((id) => win.barsAllow(id) && allowedByPrint(colours(id), act)), four.join(','));
    } else note(`engine 1 plays ${four.join(', ')}`);
    const pairs = [];
    for (let i = 0; i < four.length; i++) for (let j = i + 1; j < four.length; j++) pairs.push([four[i], four[j]]);
    const outcomes = {}, bad = [];
    let loops = 0, broken = 0, wrongFlag = 0;
    for (let mask = 0; mask < (1 << pairs.length); mask++) {
      playRounds12(win, PLAYER);
      const r = playRound3(win, (a, b) => {
        const k = pairs.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a));
        return k < 0 ? a : ((mask >> k) & 1 ? pairs[k][1] : pairs[k][0]);
      });
      const id = r ? r.identity : 'none';
      outcomes[id] = (outcomes[id] || 0) + 1;
      if (!r || id === 'MONO-U' || !win.barsAllow(id) || !allowedByPrint(colours(id), act)) bad.push(`${mask}: ${id}`);
      const rd = (r && r.round3Data) || {};
      if (rd.cycle) loops++;
      if (rd.loopBrokenByBars) {
        broken++;
        if (!rd.cycle || !isBarsPickOfLoop(win, rd.cycle, id)) wrongFlag++;
      }
    }
    ok(`B${engine}.4 engine ${engine}: all ${1 << pairs.length} Round 3 outcomes end on an identity whose colours print on top, never Mono-Blue`,
      bad.length === 0, bad.slice(0, 3).join('; '));
    note(`engine ${engine} results: ${Object.entries(outcomes).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ')}`);
    if (engine === 2) {
      ok(`B2.5 engine 2: no result records that the bars broke its loop (${loops} with a loop; the posterior decides)`, broken === 0, `${broken} flagged`);
    } else {
      ok(`B1.5 engine 1: a result records that the bars broke its loop only when it is the loop's best member by the bars (${broken} of ${loops} loops)`,
        wrongFlag === 0, `${wrongFlag} of ${broken} flagged wrongly`);
    }
  }

  // ---------- O: the old pattern, counted evenly ----------
  {
    const act = playRounds12(win2, OLD);
    ok('O1 the answers recorded for the player\'s old bars, counted evenly, print W48 U64 B43 R56 G42: Blue first, where the old count printed W55 U52 B38 R60 G39',
      !!act && barsLine(act) === 'W48 U64 B43 R56 G42' && barsLine(Object.fromEntries(OLD.savedBars)) === 'W55 U52 B38 R60 G39', act && barsLine(act));
  }

  // ---------- C: the old Round 3 finished on this build ----------
  {
    const win = win2, h = win.__h;
    playRounds12(win, OLD);
    // The four the build before the bars rule played, in its order (posterior after Round 2)
    const post = win.posteriorFromLogLik(win.identityLogLikelihoods(win.likelihoodEvidence()));
    const top4 = win.posteriorCandidates(post, 4).map((c) => c.id);
    ok('C1 the old four were the posterior\'s top four after Round 2', JSON.stringify(top4) === JSON.stringify(OLD.oldFour), top4.join(','));
    // A session saved mid-Round 3 on that build carries the bars it saved.
    h.state.activationSorted = OLD.savedBars.map(([c, v]) => [c, v]);
    h.state.pendingCandidates = win.posteriorCandidates(post, 4);
    const beats = (a, b) => OLD.oldAnswers.some(([w, l]) => w === a && l === b);
    const r = playRound3(win, (a, b) => (beats(a, b) ? a : b));
    const rd = r.round3Data || {};
    const saved = Object.fromEntries(OLD.savedBars);
    ok('C2 the player\'s six answers no longer give Mono-Blue: the result is one the saved bars allow, as printed',
      r.identity !== 'MONO-U' && win.barsAllow(r.identity) && allowedByPrint(colours(r.identity), saved), `${r.identity} ${r.confidence}`);
    ok('C3 ...Jeskai, the one of the old four whose colours print on top of those bars (Izzet and Mono-Blue leave White 55 out, Five-colour spans 22 points), LOW',
      r.identity === 'JESKAI' && r.confidence === 'LOW' && OLD.oldFour.filter((id) => allowedByPrint(colours(id), saved)).join() === 'JESKAI',
      `${r.identity} ${r.confidence} runner-up ${rd.runnerUp && rd.runnerUp.id}`);
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
    ok('D1 the simulator ran clean: no page errors, and no contract violation (every result and early offer allowed by its printed bars)', sim.status === 0,
      (sim.stderr || '').trim().split('\n').slice(-2).join(' | '));
    if (fs.existsSync(out)) {
      const reports = JSON.parse(fs.readFileSync(out, 'utf-8')).runs || [];
      fs.unlinkSync(out);
      ok('D2 twelve reports: three populations, two engines, two p', reports.length === 12, String(reports.length));
      const total = reports.reduce((a, r) => a + r.respondents, 0);
      const against = reports.reduce((a, r) => a + Math.round(r.bars.shownOutOfOrder * r.respondents), 0);
      const over = reports.reduce((a, r) => a + Math.round(r.bars.overHalfAnswer * r.respondents), 0);
      ok(`D3 0 of ${total} simulated results against their bars as printed, and so none over half an answer`, total > 0 && against === 0 && over === 0, `${against} against, ${over} over`);
      for (const r of reports) {
        note(`${r.params.model.padEnd(12)} engine ${r.params.engine} p ${r.params.p}: exact ${(100 * r.overallExact).toFixed(1)}%, `
          + `Five-colour given to ${(100 * r.fiveColour.share).toFixed(1)}% (${r.fiveColour.right} of ${r.fiveColour.given} right)`);
      }
    }
  }
});
