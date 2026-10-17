# Changelog

Newest first. Dates are when the work was committed.

## 2026-10-17

### Phase 1: likelihood scoring engine

- Scoring engine 2, the likelihood engine, is the default
  (`SCORING_VERSION = 2`). Engine 1, the win-rate engine, is untouched and
  stays reachable with `?engine=1` for one release; with it, all 186 golden
  paths are reproduced exactly.
- Model: under identity S, an item's in-S option is chosen with probability p
  when exactly one of its two colours is in S, and either is a coin flip when
  both or neither are. "Neither" is no evidence, and an item's weight
  multiplies its log-likelihood. Each colour pair's log-likelihood ratio
  against a coin-flipping respondent is clamped to ±`PAIR_LOGLIK_CAP`
  (2.5 nats), summed over the ten pairs and averaged over p from 0.55 to 0.9.
  Round 3 adds a term of the same kind (the closer identity by Jaccard is
  chosen with probability q, averaged over the same grid). The prior is
  uniform over the 31 identities.
- Round 3 plays the top four identities by posterior, in the old candidate
  shape. The reported identity is the candidate with the highest posterior
  after Round 3, so it is not always the one with the best win-loss record;
  the tiebreak questions go to the posterior's top two. Confidence is the
  reported identity's posterior (below 0.5 LOW, 0.5 to 0.7 MODERATE, 0.7 and
  above HIGH), and the Round 3 guards can only lower it.
- `state.result` gains `scoringVersion` and `instrumentVersion` (both
  engines) and `posterior` (engine 2: all 31 identities, summing to 1).
  `docs/SCORING_CONTRACT.md` records what engine 2 puts in these fields.
  The bars still show activation.
- The early-result offer needs a Round 1 posterior of at least 0.9, the
  decisive pairs well answered, and the identity to keep a posterior of 0.6
  with any one colour pair set aside. That last guard exists because the
  misspecified respondents' offers were right only about 88% of the time
  without it. The offer had never appeared under engine 1. It now hides the
  question screen, and accepting it hides the offer.
- Response records log the order the options were shown in (Round 1 and
  Round 2 colours, Round 3 identity ids) with the item's id and weight.
  Option order was already shuffled per item.
- Sessions save the engine and its likelihood table. A session saved before
  this change resumes on engine 1 and is labelled `scoringVersion` 1.
- `tests/simulate.js`: `--engine 1|2|1,2` (both engines side by side from one
  build), `--gaming` and `--out`. Reports now give each confidence label's
  accuracy, neighbourhood coverage, enemy-pair against allied guilds, and the
  early offer's precision. The run exits 1 on a result that breaks the
  contract. Workers yield between respondents: the page's MutationObservers
  had been holding about 1.7 MB per respondent, which ran the heap out on
  large runs. Results are unchanged by this.
- `tests/fixtures/golden.json` is rewritten for engine 2, in its own commit.
- Measured (simulator, n = 200 per identity, seeds 1 to 3, mean; ideal /
  misspecified respondents):

  | p = 0.8      | engine 1      | engine 2      |
  | ------------ | ------------- | ------------- |
  | mono         | 41.2 / 40.7   | 72.5 / 70.1   |
  | guild        | 59.7 / 62.3   | 76.3 / 65.2   |
  | three        | 37.3 / 32.5   | 73.9 / 59.0   |
  | four         | 27.1 / 27.0   | 62.0 / 49.4   |
  | five         | 20.2 / 19.7   | 28.2 / 19.5   |
  | overall      | 43.0 / 42.1   | 71.1 / 60.0   |
  | Round 1 only | 35.9 / 31.9   | 44.6 / 39.2   |

  At p = 0.65, overall is 17.0 / 18.0 under engine 1 and 25.2 / 24.6 under
  engine 2. Under engine 2, HIGH is right 93% / 84% of the time, MODERATE
  84% / 73% and LOW 61% / 47% (at p = 0.65: 52 / 50, 44 / 38, 23 / 22).
  The truth is the result or one colour away (neighbourhood coverage) 86% /
  78% of the time (engine 1: 74% / 70%). The early offer appeared for 21 of
  37,200 respondents at p = 0.8, and all 21 offers were right; it never
  appeared at p = 0.65.
- Not reached:
  - Enemy-pair guilds (Orzhov, Izzet, Golgari, Simic, Boros) are level with
    allied guilds at p = 0.65 (27 against 27, 25 against 25). At p = 0.8
    they remain about 7 points behind: 73 against 80, and 62 against 69. In
    Round 1 alone the gap is 10 and 16 points, against 39 and 38 under
    engine 1. Round 1 sees
    an enemy-pair guild's own pair as a coin flip, so it has two informative
    enemy pairs where an allied guild has four. Choosing Round 2's items by
    expected information lifts both kinds by about 4 points without closing
    the gap.
  - At p = 0.65, misspecified guilds score 5.4 points below engine 1 (24.8
    against 30.3). Engine 1 leans towards guilds when the answers are noisy.
  - The early offer's precision is about 90% at scale: on 155,000 simulated
    respondents per model at p = 0.8, 90% ideal and 91.5% misspecified. At
    p = 0.65 it fired 4 times in 155,000 respondents, and 3 of those offers
    were wrong.

- `.gitattributes` keeps text files LF in the repository and the working tree
  (`* text=auto eol=lf`, `*.jpg binary`, `*.svg text`). Renormalising changed
  no file: everything tracked was already stored with LF.
- `tests/_lib/load.js` is the one jsdom page boot shared by every test and the
  simulator: `data.js` inlined into the main script, the html-to-image CDN
  script dropped, test helpers injected before the SCRIPT END comment, a seeded
  `Math.random`, `http://localhost/` so `sessionStorage` works, and a wait for
  the results screen.
- New tests, each printing PASS/FAIL lines and exiting non-zero on failure:
  - `tests/structure.test.js`: balanced `<div>`s, unique ids, every
    `getElementById` target present, no `#id` display rule beating `.hidden`,
    screens as siblings, and the inline script and `data.js` parse.
  - `tests/render.test.js`: the results screen for a mono, guild, three-,
    four- and five-colour result in both audience modes.
  - `tests/journey.test.js`: the 43-check journey harness used to verify the
    scoring audit fixes, now in the repository and seeded.
  - `tests/seed.test.js`: result-link round trips, and ten links recorded from
    the live build (`tests/fixtures/seed-urls.json`) that must keep opening
    onto their result.
  - `tests/golden.test.js`: 186 seeded paths through Rounds 1-3 (every
    identity at p = 1 and p = 0.8) must match `tests/fixtures/golden.json`,
    which only a deliberate scoring change rewrites (`--update`, in its own
    commit).
- `tests/simulate.js` gains a misspecified respondent model
  (`--model misspecified`: graded colour weights, item and person
  heterogeneity, social-desirability and position leans, 5% random clickers,
  noisy Round 3 near the boundary), `--models both` for a side-by-side report
  with the per-type gap, and a comma list for `--p`. It now exits 1 if the page
  logs errors. The respondent models live in `tests/_lib/respondent.js`.
- `npm test` runs structure, render, journey, seed, golden and a 30-per-identity
  simulation smoke run, in that order. `package-lock.json` is committed and
  `engines.node` is `>=20.19` (jsdom 29's floor on Node 20).
- `docs/SCORING_CONTRACT.md`: the `state.result` shape, seed-link parameters and
  file regions the scoring and presentation work have agreed to honour.
- `.github/workflows/test.yml` runs `npm ci` and `npm test` on Node 20 for
  every push and pull request.
- `.github/workflows/deploy.yml.proposed` is a Pages deployment that would
  publish only `index.html`, `data.js`, `favicon.svg` and `images/`, and only
  after the tests pass. It is inactive (GitHub runs only `.yml`/`.yaml` files),
  and the current Pages deployment is unchanged: Pages still publishes every
  tracked file on `main`. Enabling it is a separate, manual step: rename it to
  `deploy.yml`, then set Settings > Pages > Source to "GitHub Actions".

### Respondent simulation harness (5e079fb)

- `tests/simulate.js` boots `index.html` and `data.js` in jsdom (one page per
  worker thread, reset between respondents with the page's own `restart()`),
  seeds the page's `Math.random`, and drives synthetic respondents through
  Rounds 1-3 with the real handlers and scoring code. It reports exact recovery
  per identity and type, Round 1 recovery alone, top confusions, confidence
  labels and the early-offer share, and writes `tests/out/simulation.json`.
  No scoring code changed.

### Scoring audit fixes (4d89eaf)

- Round 2's ally pool honours the gaming toggle; MTG- items had been reaching
  everyone (Round 1 and the enemy retests were already gated).
- Ally answers add the item's authored weight instead of 1.
- Round 1 ranks colours by win rate rescaled to 12 questions, so "Neither"
  answers no longer demote a colour.
- Round 3's early clinch compares the leader with every candidate's best
  possible total, not just the current runner-up's.
- The early-result offer after Round 1 requires the decisive pairs to be well
  answered.
- Disagreement between the enemy-pair and ally-pair tallies now caps HIGH
  confidence at MODERATE and adds a caveat on the results screen.
- Round 3 sets the loyalty badge to III.
- Session save and resume cover Round 2, Round 3, the round boundaries and the
  finished result; the resume offer renders again (it had targeted a selector
  that no longer existed).
- The four- and five-colour breakdown note no longer contradicts the headline.
