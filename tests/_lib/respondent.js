'use strict';
// Synthetic respondents, shared by tests/simulate.js and tests/golden.test.js.
// runRespondent() drives one respondent through Rounds 1-3 on a page booted by
// bootPage() (with stubs.calculating 'skip'), using the page's own handlers and
// scoring code. Every respondent gets its own seeded streams, so a result does
// not depend on what ran before it on the same page or on how work is sharded.
const { mulberry32, hashSeed, isVisible } = require('./load');

function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  let inter = 0; for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

// ---------- Ideal model ----------
// Prefer an option in C with probability p; if all or none are in C, uniform.
function chooseOption(options, inC, rnd, p) {
  const pref = options.filter(inC), other = options.filter(o => !inC(o));
  const pool = (pref.length === 0 || other.length === 0) ? options : (rnd() < p ? pref : other);
  return pool[Math.floor(rnd() * pool.length)];
}

function idealRespondent({ colors: C, rnd, p, neither }) {
  const inC = (o) => C.includes(o.c);
  return {
    // Round 1 item: an option from q.r, or null for "Neither".
    round1(q) { return rnd() < neither ? null : chooseOption(q.r, inC, rnd, p); },
    round2(q) { return chooseOption(q.r, inC, rnd, p); },
    // Round 3 matchup: the id of the identity picked.
    round3(aId, bId, colorsOf) {
      const ja = jaccard(colorsOf(aId), C), jb = jaccard(colorsOf(bId), C);
      if (ja === jb) return rnd() < 0.5 ? aId : bId;
      const better = ja > jb ? aId : bId, worse = ja > jb ? bId : aId;
      return rnd() < p ? better : worse;
    },
  };
}

const MODELS = { ideal: idealRespondent };

const round = (x, dp) => { const f = 10 ** dp; return Math.round(x * f) / f; };
const roundActivation = (sorted) => (sorted || []).map(([c, v]) => [c, round(v, 3)]);

// params: { model = 'ideal', p, neither, seed, audience = 'consumer' }
// With trace, the result also carries what the golden test records.
function runRespondent(win, trueId, idx, params, { trace = false } = {}) {
  const { model = 'ideal', p, neither, seed, audience = 'consumer' } = params;
  const h = win.__h;
  win.Math.random = mulberry32(hashSeed(seed, trueId, idx, 'page'));
  const rnd = mulberry32(hashSeed(seed, trueId, idx, 'resp'));
  const make = MODELS[model];
  if (!make) throw new Error('unknown respondent model ' + model);
  const colorsOf = (id) => h.PROFILES[id].colors;
  const resp = make({ colors: colorsOf(trueId), rnd, p, neither, seed, trueId, idx, win });

  h.restart(); // the page's own "Start fresh" path: rebuilds state, hides all screens
  const s0 = h.state;
  s0.mode = 'draft'; s0.audience = audience; s0.gamingFamiliar = false; s0.disclaimerAcknowledged = true;
  h.startAssessment();

  // Round 1
  let guard = 0;
  while (h.state.stage === 1 && guard++ < 60) {
    const s = h.state, q = s.poolA[s.qNum];
    if (!q) break; // all answered; the page is waiting on the early-result offer
    const o = resp.round1(q);
    if (o === null) h.answerNeither(q);
    else h.answerQ(o, resp.shownIndex ? resp.shownIndex(q, o) : q.r.indexOf(o));
  }
  const rc = h.state.round1Candidates;
  const round1Pick = rc && rc[0] ? rc[0].id : null;
  const out = { trueId, idx };
  if (trace) {
    out.r1 = (rc || []).map(c => [c.id, round(c.s1, 6)]);
    out.r1Activation = roundActivation(h.state.activationSorted);
  }
  let earlyOffer = false;
  if (isVisible(win, 'screen-early-offer')) { earlyOffer = true; h.continueToRound2(); }

  // Round 2
  guard = 0;
  while (h.state.stage === 'refinement' && h.state.qNum < (h.state.refinementQuestions || []).length && guard++ < 60) {
    const s = h.state, q = s.refinementQuestions[s.qNum];
    const o = resp.round2(q);
    h.selectRefinementChoice(o.c, q.pair);
  }
  if (!h.state.result && h.state.stage !== 3) h.continueToStage2();

  // Round 3
  const matchups = [];
  guard = 0;
  while (!h.state.result && guard++ < 60) {
    const m = h.state.tournament && h.state.tournament.currentMatchup;
    if (!m) break;
    matchups.push([m.a.id, m.b.id]);
    h.selectTournamentChoice(resp.round3(m.a.id, m.b.id, colorsOf));
  }
  const r = h.state.result;
  Object.assign(out, { recovered: r ? r.identity : null, confidence: r ? r.confidence : 'NONE', earlyOffer, round1Pick });
  if (trace) {
    Object.assign(out, {
      activation: roundActivation(h.state.activationSorted),
      matchups,
      url: r ? h.buildResultURL() : null,
    });
  }
  return out;
}

module.exports = { MODELS, jaccard, chooseOption, runRespondent, round, roundActivation };
