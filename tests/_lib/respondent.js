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

// ---------- Misspecified model ----------
// A respondent the scoring was not designed around (see tests/README.md):
// graded colour weights instead of a binary set, items that differ in how well
// and which way they discriminate, people who differ in consistency, a lean
// toward White and Green options, a lean toward the first option shown, a few
// people clicking at random, and Round 3 choices that are noisy near the
// boundary between neighbouring identities.
const WUBRG = ['W', 'U', 'B', 'R', 'G'];
const MIS = {
  disengaged: 0.05,             // share of coin-flippers
  consistency: [8, 3],          // Beta(a, b) per person; scales choice sharpness
  inSet: [0.6, 1.0],            // latent weight of a colour in the identity
  outSet: [0, 0.3],             // latent weight of a colour outside it
  itemLogSd: 0.35,              // discrimination a ~ LogNormal(0, 0.35)
  itemThresholdSd: 0.12,        // difficulty b ~ Normal(0, 0.12), in weight units
  desirability: 0.25,           // logit lean toward W and G options
  position: 0.2,                // logit lean toward the first option shown
  maxP: 0.99,                   // calibration target cap (p = 1 is not reachable)
};
const sigmoid = (z) => 1 / (1 + Math.exp(-z));
function normal(rnd) { // Box-Muller
  const u = 1 - rnd(), v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function gammaInt(rnd, k) { let s = 0; for (let i = 0; i < k; i++) s -= Math.log(1 - rnd()); return s; }
function beta(rnd, a, b) { const x = gammaInt(rnd, a), y = gammaInt(rnd, b); return x / (x + y); }
const BETA_MEAN = MIS.consistency[0] / (MIS.consistency[0] + MIS.consistency[1]);
const desirable = (c) => (c === 'W' || c === 'G' ? 1 : 0);
const uniformIn = (rnd, [lo, hi]) => lo + (hi - lo) * rnd();

// Item discrimination and difficulty: fixed per item id (not per run or per
// --seed), so an item is equally good or bad in every simulation.
const itemCache = new Map();
function itemParams(id) {
  let it = itemCache.get(id);
  if (!it) {
    const r = mulberry32(hashSeed('misspecified-item', id));
    it = { a: Math.exp(MIS.itemLogSd * normal(r)), b: MIS.itemThresholdSd * normal(r) };
    itemCache.set(id, it);
  }
  return it;
}
function latentWeights(rnd, C, ranges = MIS) {
  const w = {};
  for (const c of WUBRG) w[c] = C.includes(c) ? uniformIn(rnd, ranges.inSet) : uniformIn(rnd, ranges.outSet);
  return w;
}
// Identity-colour similarity: 1 - mean |indicator - weight| over the five
// colours. The true identity is always the most similar one (its colours are
// exactly those weighted above 0.5); neighbours differ from it by |2w - 1| / 5.
function similarity(colors, w) {
  let s = 0;
  for (const c of WUBRG) s += colors.includes(c) ? w[c] : 1 - w[c];
  return s / 5;
}

// Choice sharpness is calibrated so that, at the requested p, an engaged
// respondent picks the in-identity option of an item with one option in the
// identity and one outside it with average probability p (over people, items,
// colours and display order), and picks the true identity over a one-colour
// neighbour in Round 3 with average probability p. Deterministic per p.
const calibCache = new Map();
// Engaged respondents' one-in, one-out items and one-colour Round 3 matchups,
// drawn from a fixed seed, with latent weights in the given ranges.
function calibrationRows(ranges) {
  const rnd = mulberry32(hashSeed('misspecified-calibration'));
  const N = 20000, items = [], r3 = [];
  const IDS = [];
  for (let m = 1; m < 32; m++) IDS.push(WUBRG.filter((_, i) => m & (1 << i)));
  for (let n = 0; n < N; n++) {
    const u = beta(rnd, ...MIS.consistency) / BETA_MEAN;
    const a = Math.exp(MIS.itemLogSd * normal(rnd)), b = MIS.itemThresholdSd * normal(rnd);
    const cin = WUBRG[Math.floor(rnd() * 5)];
    const cout = WUBRG.filter((c) => c !== cin)[Math.floor(rnd() * 4)];
    const lean = MIS.desirability * (desirable(cin) - desirable(cout)) + (rnd() < 0.5 ? MIS.position : -MIS.position);
    items.push({ s: a * u, d: uniformIn(rnd, ranges.inSet) - uniformIn(rnd, ranges.outSet) - (rnd() < 0.5 ? b : -b), lean });
    const C = IDS[Math.floor(rnd() * IDS.length)], w = latentWeights(rnd, C, ranges);
    const flips = WUBRG.filter((c) => C.length > 1 || !C.includes(c));
    const flip = flips[Math.floor(rnd() * flips.length)];
    const N1 = C.includes(flip) ? C.filter((c) => c !== flip) : [...C, flip];
    r3.push({ s: u, d: similarity(C, w) - similarity(N1, w) });
  }
  return { items, r3 };
}
const meanChoice = (rows, k, withLean) => rows.reduce((acc, x) => acc + sigmoid(k * x.s * x.d + (withLean ? x.lean : 0)), 0) / rows.length;
function calibrateMisspecified(p) {
  const target = Math.min(MIS.maxP, Math.max(0.5, p));
  if (calibCache.has(target)) return calibCache.get(target);
  const { items, r3 } = calibrationRows(MIS);
  const solve = (rows, withLean) => {
    let lo = 0, hi = 1000;
    for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (meanChoice(rows, mid, withLean) < target) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  const calib = { target, k: solve(items, true), k3: solve(r3, false) };
  calibCache.set(target, calib);
  return calib;
}
// The signal a calibration gives respondents whose weights lie in other ranges
// (the mixed model's): the average probability of the in-identity option of a
// one-in, one-out item, and of the true identity over a one-colour neighbour.
function signalAt(calib, ranges) {
  const { items, r3 } = calibrationRows(ranges);
  return { items: meanChoice(items, calib.k, true), round3: meanChoice(r3, calib.k3, false) };
}

function misspecifiedRespondent({ colors: C, rnd, p, neither, seed, trueId, idx, win, calibration, weightRanges }) {
  const calib = calibration || calibrateMisspecified(p);
  const person = mulberry32(hashSeed(seed, trueId, idx, 'person'));
  const disengaged = person() < MIS.disengaged;
  const u = beta(person, ...MIS.consistency) / BETA_MEAN;
  const w = latentWeights(person, C, weightRanges || MIS);
  // Options in the order the page is showing them.
  const shown = (q) => {
    const texts = [...win.document.querySelectorAll('#choices .mc-choice__text')].map((e) => e.textContent);
    const order = texts.map((t) => q.r.find((o) => (o.t || o.text) === t)).filter(Boolean);
    return order.length === q.r.length ? order : q.r;
  };
  const choose = (q) => {
    if (disengaged) return q.r[Math.floor(rnd() * q.r.length)];
    const [o0, o1] = q.r, it = itemParams(q.id);
    const z = it.a * calib.k * u * (w[o0.c] - w[o1.c] - it.b)
      + MIS.desirability * (desirable(o0.c) - desirable(o1.c))
      + (shown(q)[0] === o0 ? MIS.position : -MIS.position);
    return rnd() < sigmoid(z) ? o0 : o1;
  };
  return {
    person: { disengaged, consistency: u * BETA_MEAN, weights: w },
    round1(q) { return !disengaged && rnd() < neither ? null : choose(q); },
    round2: choose,
    round3(aId, bId, colorsOf) {
      if (disengaged) return rnd() < 0.5 ? aId : bId;
      const z = calib.k3 * u * (similarity(colorsOf(aId), w) - similarity(colorsOf(bId), w));
      return rnd() < sigmoid(z) ? aId : bId;
    },
    shownIndex(q, o) { return shown(q).indexOf(o); },
  };
}

// ---------- Mixed model ----------
// Real people rarely hold a clean colour set: their colour weights are
// continuous and fairly flat, so the weakest colour they hold and the strongest
// they do not are often only a little apart. The mixed respondent is the
// misspecified one (the same person, items, leans, disengaged share, and k and
// k3 calibrated at p for the misspecified model) with flatter latent weights:
// each colour in the identity U(0.5, 0.8), each outside it U(0.2, 0.5). The
// identity is still exactly the colours weighted above 0.5, but many items
// and many Round 3 matches are close to coin flips, so the answers carry less
// signal than the misspecified model's at the same p (tests/README.md).
const MIXED = { inSet: [0.5, 0.8], outSet: [0.2, 0.5] };
function mixedRespondent(args) {
  return misspecifiedRespondent({ ...args, weightRanges: MIXED });
}

const MODELS = { ideal: idealRespondent, misspecified: misspecifiedRespondent, mixed: mixedRespondent };
const MODEL_NAMES = Object.keys(MODELS);

const round = (x, dp) => { const f = 10 ** dp; return Math.round(x * f) / f; };
const roundActivation = (sorted) => (sorted || []).map(([c, v]) => [c, round(v, 3)]);
// The bars as the results screen prints them, in WUBRG order: whole percentages,
// Math.round(bar * 100) on the page's own values (rounding the 3 dp record
// again could land a near tie on the other side of a half point).
const printedBars = (sorted) => { const a = Object.fromEntries(sorted || []); return WUBRG.map((c) => Math.round((a[c] || 0) * 100)); };

// params: { model = 'ideal', p, neither, seed, audience = 'consumer', gaming = false, calibration }
// gaming sets the page's gaming toggle (state.gamingFamiliar), which lets the
// Magic-flavoured items into Rounds 1 and 2.
// With trace, the result also carries what the golden test records.
function runRespondent(win, trueId, idx, params, { trace = false } = {}) {
  const { model = 'ideal', p, neither, seed, audience = 'consumer', gaming = false } = params;
  const h = win.__h;
  win.Math.random = mulberry32(hashSeed(seed, trueId, idx, 'page'));
  const rnd = mulberry32(hashSeed(seed, trueId, idx, 'resp'));
  const make = MODELS[model];
  if (!make) throw new Error('unknown respondent model ' + model);
  const colorsOf = (id) => h.PROFILES[id].colors;
  const resp = make({ ...params, colors: colorsOf(trueId), rnd, trueId, idx, win });

  h.restart(); // the page's own "Start fresh" path: rebuilds state, hides all screens
  const s0 = h.state;
  s0.mode = 'draft'; s0.audience = audience; s0.gamingFamiliar = !!gaming; s0.disclaimerAcknowledged = true;
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
  // The Round 1 bars as printed, which an early offer is held to.
  const out = { trueId, idx, r1Shown: printedBars(h.state.activationSorted) };
  if (trace) {
    out.r1 = (rc || []).map(c => [c.id, round(c.s1, 6)]);
    out.r1Activation = roundActivation(h.state.activationSorted);
  }
  // The simulated respondent always declines the early-result offer; the
  // identity it offered is kept so the offer's precision can be measured.
  let earlyOffer = false, earlyOfferId = null;
  if (isVisible(win, 'screen-early-offer')) {
    earlyOffer = true;
    earlyOfferId = (win.earlyConfidenceData && win.earlyConfidenceData.identity) || null;
    h.continueToRound2();
  }

  // Round 2
  guard = 0;
  while (h.state.stage === 'refinement' && h.state.qNum < (h.state.refinementQuestions || []).length && guard++ < 60) {
    const s = h.state, q = s.refinementQuestions[s.qNum];
    const o = resp.round2(q);
    h.selectRefinementChoice(o.c, q.pair);
  }
  if (!h.state.result && h.state.stage !== 3) h.continueToStage2();

  // What Round 3 starts from: the Round 1 + Round 2 posterior's leader over all
  // 31 identities (engine 2; Round 3 overwrites the record) and the first of the
  // candidates Round 3 plays, which on engine 2 is the one of them that posterior
  // rates highest (the top four the bars allow, best first).
  const lk = h.state.likelihood, t3 = h.state.tournament;
  if (lk && lk.posterior) {
    const best = Object.entries(lk.posterior).sort((a, b) => b[1] - a[1])[0];
    out.r12Leader = best ? best[0] : null;
  }
  out.r12Top = t3 && t3.candidates && t3.candidates[0] ? t3.candidates[0].id : null;

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
  Object.assign(out, { recovered: r ? r.identity : null, confidence: r ? r.confidence : 'NONE', earlyOffer, earlyOfferId, round1Pick });
  // What the simulator checks and reports beyond recovery: the final activation
  // (the neighbourhood is read from it) and the result's contract fields.
  out.finalActivation = roundActivation(h.state.activationSorted);
  out.finalShown = printedBars(h.state.activationSorted);
  if (r) {
    out.scoringVersion = r.scoringVersion;
    out.instrumentVersion = r.instrumentVersion;
    if (r.posterior) {
      out.posteriorSum = Object.values(r.posterior).reduce((a, b) => a + b, 0);
      out.posteriorOfResult = r.posterior[r.identity];
      out.posteriorIds = Object.keys(r.posterior).length;
    }
  }
  if (trace) {
    Object.assign(out, {
      activation: roundActivation(h.state.activationSorted),
      matchups,
      url: r ? h.buildResultURL() : null,
    });
  }
  return out;
}

module.exports = { MODELS, MODEL_NAMES, MIS, MIXED, jaccard, chooseOption, similarity, calibrateMisspecified, signalAt, runRespondent, round, roundActivation, printedBars };
