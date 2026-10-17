# Changelog

Newest first. Dates are when the work was committed.

## 2026-10-17

- Commander descriptions: corrected 16 entries against Scryfall oracle text.

### Phase 1: Round 3 weight

- The problem: engine 2 reported the Round 3 candidate with the highest
  posterior even when the person had chosen against it in most of its
  head-to-heads. In simulation 6 to 11% of results had a losing Round 3 record
  (fewer wins than losses) and about 2% had won no match (0.3 to 0.8% were
  0-3; the rest lost the one or two they played before another candidate
  clinched).
- The change: a posterior leader with a losing record is reported only when
  its posterior is at least 3 times the runner-up's
  (`ROUND3_LOSING_RECORD_MARGIN`), or 16 times when it won no match
  (`ROUND3_NO_WINS_MARGIN`); otherwise the best candidate by posterior
  without a losing record is (`round3RecordRanking`). The posterior, the
  confidence rule and the tiebreak questions are unchanged; `allResults` and
  `round3Data.allScores` put the reported identity first, then the rest by
  posterior. `docs/SCORING_CONTRACT.md` says so, in its own commit.
- The grid (n = 100 per identity, seeds 1 and 2 pooled; overall exact /
  losing-record share, in percent; two standard errors of the current
  overall: 1.1 at p = 0.65, 1.2 at p = 0.8):

  | variant             | ideal 0.65  | ideal 0.8  | misspec 0.65 | misspec 0.8 |
  | ------------------- | ----------- | ---------- | ------------ | ----------- |
  | current             | 25.1 / 10.7 | 70.2 / 7.5 | 24.9 / 10.3  | 60.6 / 6.2  |
  | q = 0.65            | 25.2 / 12.9 | 69.3 / 9.4 | 24.4 / 12.5  | 59.8 / 7.9  |
  | q = 0.75            | 24.9 / 8.3  | 70.4 / 6.0 | 24.9 / 7.5   | 60.5 / 4.7  |
  | q = 0.85            | 24.6 / 6.4  | 69.5 / 3.8 | 24.5 / 5.3   | 59.6 / 3.0  |
  | q = 0.95            | 24.1 / 5.3  | 67.8 / 2.8 | 24.1 / 4.7   | 57.1 / 2.2  |
  | tournament-aware    | 21.9 / 9.0  | 60.1 / 6.3 | 23.2 / 6.7   | 56.5 / 3.7  |
  | record rule (taken) | 24.5 / 1.3  | 69.2 / 1.6 | 24.7 / 0.9   | 60.6 / 1.1  |

  Current: q averaged over 0.55 to 0.9, the posterior leader reported. A
  fixed q (the Round 3 discrimination) cuts losing records by at most half
  within two standard errors (q = 0.85), still reports no-win identities
  (0.6 to 1.0%), and makes the labels less accurate: at q = 0.85,
  misspecified, p = 0.8, HIGH is right 77% of the time and MODERATE 71%,
  against 84% and 75% with q averaged. q = 0.95 and the tournament-aware rule
  (report the tournament winner when it beat the posterior leader
  head-to-head) fall outside two standard errors. The simple rule beats every
  discrimination value. A margin of 4 instead of 3 costs the ideal
  respondents 1.2 points at p = 0.8, outside the band. Adding q = 0.75 to the
  rule wins back about 0.3 points there but makes misspecified MODERATE
  labels about 2.5 points less accurate, so it was not taken.
- Where the posterior leader and the tournament winner (the page's
  `getTournamentWinner`) disagree, 28 to 40% of results, the leader is the
  true identity 62% of the time and the winner 16% (ideal, p = 0.8);
  misspecified 48% and 20%; at p = 0.65, 22% and 11% (ideal), 21% and 13%.
- Before and after (n = 200 per identity, fresh seeds 3 and 4, ideal /
  misspecified; change on the same respondents with two paired standard
  errors):

  |                           | p = 0.65                | p = 0.8                 |
  | ------------------------- | ----------------------- | ----------------------- |
  | exact recovery            | 25.7 / 24.5 to 25.4 / 24.8 | 71.3 / 59.7 to 70.4 / 59.9 |
  | change (pp)               | -0.4 ±0.3 / +0.3 ±0.3   | -0.9 ±0.4 / +0.3 ±0.3   |
  | losing record             | 10.5 / 9.8 to 0.9 / 1.0 | 6.8 / 6.2 to 1.5 / 1.0  |
  | won no match              | 2.0 / 2.0 to 0 / 0      | 1.9 / 2.1 to 0.02 / 0.02 |
  | best or tied-best record  | 82 / 82 to 91 / 90      | 85 / 85 to 90 / 89      |
  | next door                 | 43.3 / 41.3 to 43.5 / 41.8 | 85.7 / 77.6 to 86.2 / 78.4 |

  Label accuracy at p = 0.8: HIGH 93.7 / 82.7 to 93.7 / 82.9, MODERATE 84.4 /
  72.1 to 84.7 / 72.7, LOW 60.6 / 46.7 to 59.2 / 47.2. Of the 49,600
  respondents, 990 had been given an identity with no wins (29% of them
  right); after the change 5 were, each with a posterior over 16 times the
  runner-up's, and all 5 were right. The ideal drop at p = 0.8 is inside two
  standard errors at the grid's sample size (1.2) but just outside them at
  this one (0.8); under the misspecified model nothing is lost.
- Commands (run on 34f2935, before the change; on later builds write `pm`
  for `page`, and add `+pm` to a `q` variant to leave the rule out):
  `node tests/simulate.js --n 100 --models both --p 0.65,0.8 --seed 1,2
  --r3 page,q=0.65,q=0.75,q=0.85,q=0.95,tour,tour:4,lostall,lostall:4,lostall:16,losing,losing:2,losing:4,losing:8,losing:16,losing:4+lostall,q=0.65+losing:4,q=0.75+losing:4,q=0.85+losing:4,q=0.95+losing:4`;
  then `--r3 page,losing:3,losing:4,losing:5,losing:6,net:2,net:3,net:4,losing:3+lostall:16,losing:4+lostall:16,q=0.75,q=0.75+losing:3,q=0.75+losing:4,q=0.75+losing:6,q=0.75+net:3,q=0.8,q=0.8+losing:3,q=0.8+losing:4`
  and `--r3 page,losing:3,losing:3:10,losing:3:16,losing:2:16,losing:3+lostall:16,net:3`
  with the same other flags. The before and after, on this build:
  `node tests/simulate.js --n 200 --models both --p 0.65,0.8 --seed 3,4 --r3 pm,page`.
- `tests/simulate.js`: `--r3` (variants above; a `q` runs on the page, a
  rule is applied to what the page recorded at its decision, and the run
  fails if a label disagrees with the record), `--seed` lists pooled into
  one report, and a path to another build. Without them the output is as
  before.
- `tests/fixtures/golden.json` rewritten for the rule, in its own commit.

### Phase 3: Round 3 copy

- Round 3 stems and options reworded from the reviewed copy drafts (revision 2): 48
  stems and 328 of the 378 options rewritten, 50 options kept (7 of those had curly
  apostrophes, now straight to match the rest). `ROUND2_SCENARIOS` in `data.js`: 8 stems
  and 211 of 248 options; `POOL_B` and `POOL_C` in `index.html`: 40 stems and 117 of 130
  options. Stems are plain situations, not questions; every option is 15 words or fewer
  (150 ran over before; the longest is now 15), and none outside MTG_STALL names a colour,
  a basic land or an identity. Identity keys are untouched, so scoring and the golden
  fixture are as they were. `tools/apply-round3-copy.js --draft <file>` applies a drafts
  file by scenario id and key; it refuses on a key mismatch, a 15-word breach or a
  forbidden name, and a second run changes nothing. `tests/round3-copy.test.js`, in
  `npm test`, holds the three rules on the live files against
  `tests/fixtures/round3-keys.json`.

### Link previews

- `r/<ID>.html`: 31 static pages, one per identity, written by
  `tools/build-previews.js` (`npm run previews`) from `PROFILES` and the
  commander art. Each carries Open Graph and Twitter card tags (name and
  tagline, a one-sentence description, the art at its real size), so a pasted
  link previews as that identity, then forwards to `index.html` with the query
  string and hash kept exactly. It adds `r=<ID>` when the link has none, since
  `index.html` opens a result only for `?r=`; a `<noscript>` meta refresh
  forwards to `?r=<ID>` alone for clients without JavaScript. The pages are
  committed, so Pages serves them as they are. They credit the card and
  Scryfall and carry "© Wizards of the Coast"; `COMMANDER_ORACLE` has no artist
  names yet, and an `artist` field on an entry would be credited.
- `tests/previews.test.js` (in `npm test`) regenerates into a temporary
  directory and fails on a stale or hand-edited page. Re-run
  `npm run previews` after changing a profile's name, tag or philosophy, a
  commander, or a commander image.
- Share links now point at the preview pages: `buildResultURL` writes
  `<site root>/r/<ID>.html?p=...&c=...&a=...&s=...&i=...[&f=...]`, for example
  `https://ozculain.github.io/manacurve/r/DIMIR.html?p=22,78,64,11,31&c=moderate&a=consumer&s=1&i=1`,
  with no `r` of its own: the page adds `r=<ID>` when it forwards, so
  `parseSeedURL` is unchanged and links shared before this (`?r=...`) still
  open. The site root comes from the page URL (`siteRootURL`), so it is right
  on GitHub Pages with or without `index.html` and on a local preview. The
  share text, Web Share, the clipboard fallback and Copy Link all use it; the
  share images' footers print the site address, not a result link, and are as
  they were. The golden test still compares `r`, `p`, `c` and `a` (it reads `r`
  from the page name), and `tests/fixtures/seed-urls.json` gains two recorded
  preview-page links beside the ten old ones.
- `.github/workflows/deploy.yml.proposed` now copies `r/` alongside `index.html`,
  `data.js`, `favicon.svg` and `images/`, so enabling it keeps the preview pages.

### Phase 2: final copy

The results screen carries revision 2 of the copy drafts (17 October 2026)
with the editor's decisions applied. It all still lives in one block,
`RESULT_COPY`, above `showResults()` in `index.html`.

- Rules text: the 31 revision 2 lines.
- Typeline: the commander's own printed type line for all 31 identities
  ("Legendary Creature — Human Ninja"), no parenthetical. In player mode the
  name, tagline, typeline, rules text and collector number ("MC2 • EN •
  009/031") read as one card under the banner, and the typeline takes the
  "Personality" divider's place, so the page has one. Plain mode keeps the
  divider and prints "Scoring version 2" in the footer.
- Confidence: the label words stay; each base-rate sentence is the same in
  both modes, joke-free and without a number ("The colours are usually
  right. One more or one fewer is where it wobbles."). The simulated
  figures, their small print and `CONFIDENCE_BASE_RATES` are gone; the
  Phase 5 lines with `{pct}` and `{date}` wait in `RESULT_COPY.labels`,
  unused. The bars are "Your Mana Pool" in player mode, "Your colours"
  otherwise.
- Next door: a "well" short up row asks its headline ("Splash green?
  Gruul."), and the bar-points-to-answers conversion is set per scoring
  version (`ONE_ANSWER_BY_VERSION`). The row moves directly below the
  commander block and its mana base, and each row has its own panel: the
  first tap peeks at that neighbour's philosophy, strengths and shadows, the
  panel's own button appeals, and the rest of the page no longer changes
  during a peek.
- Appeal: "Appeal this ruling", "Appeal: I'm Sultai", "Overturned on
  appeal...", "Withdraw the appeal", "None of these. Show me all 31."; plain
  mode says "appeal" too. `RESULT_COPY_VERSION` is 2.
- Mana base: Command Tower opens every two- and three-colour base; four
  colours count "six shocks, four Triomes" (23 basics), five "all ten
  shocks, all ten Triomes, and 13 basics, mostly for the Cultivate". The
  next-door land is a maybeboard line outside the 37, shown only when the up
  neighbour is one answer short ("just in case") or a few ("It's been there
  a while"); a mono base then drops its joke. `MANA_BASE_LANDS` gains
  `commandTower`.
- Share text: one line in every mode, "I'm Azorius. Esper lives next door.
  What are you?". After an appeal, consumer shares name the identity on the
  page with "(on appeal)" and the link carries both; workplace shares name
  the verdict. Share images keep the verdict, unmarked. The approved
  player-mode line naming the commander waits in `RESULT_COPY.share`, unused.
- Engine 2: Round 3 of "How we read you" says the identity won on the weight
  of all your answers, adding "though not with the best record in this
  round" when that is so, and the confidence explanation no longer credits
  the head-to-heads alone. `?engine=1` results keep the old wording.
- Tests: the render test checks a sample of every section in player and
  plain modes, the drafts' five typeline examples, the next-door worked
  examples, the drafts' mana base lines, all 31 mana bases (37 lands, no
  off-identity land in the deck, a maybeboard only when a neighbour
  qualifies), the per-row appeal, shares after an appeal, and the Round 3
  line for a result without the best record.

### Phase 2: presentation, one verdict and next door

All new result-screen copy is provisional and lives in one block,
`RESULT_COPY` (with `CONFIDENCE_BASE_RATES`, `NEXT_DOOR_MARGINS` and
`ROLES_HIDDEN_FOR_FUN`), just above `showResults()` in `index.html`.
"Player mode" is `state.gamingFamiliar` until a "Played Magic?" question
replaces the toggle; workplace mode always gets the plain copy.

- The reveal lands first: the plinth opens on the philosophy; the
  confidence badge, its explanation and the quality warning follow it. In
  player mode the banner adds a typeline under the commander
  ("Legendary Creature — Human Advisor (Dimir)").
- Next door replaces the LOW/MODERATE-only alternatives box and shows at
  every confidence level: one colour up (add the strongest colour the
  identity does not run) and one down (drop its weakest), from the five
  bars alone, so old links render it. The margin wording (one answer, a
  few, well short) measures the gap between the weakest colour in and the
  strongest out, about 8 bar points to an answer (50% when all five are
  in). Splash/cut copy in player mode, add/drop otherwise.
- Confidence labels read "Locked in", "Leaning" and "Still shuffling"
  (links keep `c=high|moderate|low`), each with a base-rate sentence from
  `CONFIDENCE_BASE_RATES`, keyed by `state.result.scoringVersion`: version
  1 holds today's simulator numbers (54, 53 and 31%); version 2 is a
  marked placeholder that falls back to version 1. No rarity mark: the
  frames theme's mythic/rare/uncommon gem becomes a plain status dot.
- "Your Mana Pool" gains the caption "The name's the summary. The bars are
  what you said."
- Player mode: a rules-text strip above strengths and shadows, and a
  37-land Commander mana base under the commander (shock, fetch and check
  for guilds; Triome and shocks for three colours; Command Tower, Mana
  Confluence, City of Brass and Exotic Orchard for four and five; basics
  and a utility land for mono), with basics split by the bars and a
  next-door splash land when that colour is within a few answers. Land
  names are a new `MANA_BASE_LANDS` constant in `data.js`, checked against
  Scryfall.
- Appeal the verdict: the first tap on a neighbour peeks at its
  philosophy, rules text, strengths and shadows; a separate button appeals.
  The verdict stays in `state.result.identity`; the appeal is
  `state.result.appeal = { chosen, shown, copyVersion, labelShown,
  timeToAppealMs }`, saved with the session, shown as "(on appeal)" with a
  way back. "Neither. Show me all 31." appeals from the explorer.
- Seed links: `s` and `i` (scoring and instrument version, 1 when absent)
  and `f` (the appealed identity; not written in workplace mode). The ten
  recorded links still render, now with their next-door rows. The golden
  test compares links on `r`, `p`, `c` and `a` only (contract updated).
- Share Card: the confidence word is gone from the set-symbol slot; in
  player mode it carries a collector number, "MC1 • EN • 009/031". Share
  images and share text keep showing the verdict, never an appeal.
- Share text dares a friend: "I'm Dimir. Sultai lives next door. What are
  you?" (three drafted lines; workplace mode always uses the first).
- Consumer mode leaves 21 corporate-sounding entries out of "Natural
  Roles"; the data keeps them and workplace mode shows them all.
- Fixed: the explorer's profile detail never appeared (an inline display
  could not beat `.hidden`).
- Tests: the render test runs every case with player mode off and on and
  covers each item above, the peek and appeal flow, the all-31 path and
  the Card export in the gilded and frames themes (html-to-image stubbed);
  the seed test covers the next-door rows of the recorded links and the
  `s`, `i` and `f` round trip.

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

### Phase 0: repository hygiene and tests

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
