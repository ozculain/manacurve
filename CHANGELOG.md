# Changelog

Newest first. Dates are when the work was committed.

## 2026-10-17

- Commander descriptions: corrected 16 entries against Scryfall oracle text.

### Phase 3: play feel

The layout and flow half. Every new string is provisional and lives in one
block, `PLAY_COPY` (with `QUIZ_LENGTH`), at the top of the quiz-screen code in
`index.html`; markup takes its copy from `data-copy` attributes filled on load.
Nothing shown during Rounds 1 to 3 names a colour or a basic land. Scoring is
unchanged: the golden fixture and the simulator's numbers are as they were.

- Phones: below 600px the two answers stack at full width and lose their
  220px minimum height, the chrome, stem and instruction line tighten,
  plinths drop to about 20px of padding, and in Blind Draft the I / II marker
  moves into the card's corner. With the longest items, both answers and
  "Neither" fit a 375x667 screen (the lowest ends 650px down). CSS only, in a
  block after the responsive media queries.
- One counter across the quiz: "Question x of 45", where 45 is 30 + Round 2 +
  Round 3, each counted for real once built and estimated before (Round 2 is
  usually 9 questions; Round 3 six head-to-heads, up to two more on a
  tiebreak). A clinch in Round 3 ends the quiz before the count reaches its
  total. The rune track spans the whole quiz. How This Works
  (30, about 9, about 6), the welcome and the preflight (about 8 minutes) and
  the early offer (about 15 more questions, about 3 minutes) read the same
  numbers. Round 1 is "First Impressions"; "Enemy Pairs" is gone from the
  round labels.
- The preflight is one question, "Played Magic?": "Yes" sets
  `state.gamingFamiliar` (the Magic items and player mode), "Not really" does
  not, and either starts the quiz in Blind Draft. "Prefer to see the mana?
  Constructed mode" and "Taking this at work?" are links under the cards. The
  theme switcher moved to the results page ("Table"), still kept in
  `localStorage`; Card Frames picked there shows its earned frame at once and
  deals the next quiz face-down. `selectMode`, `selectAudience`, `selectTheme`
  and `toggleGaming` still work.
- Welcome: "Rule 0: it's a bit of fun, not science." under the title; the
  start button straight under the bold line, with "Explore all 31" beside it;
  the long paragraph moved into "Learn more". The resume offer goes in just
  before `#resume-anchor`.
- Between rounds nothing moves on by itself: the transition shows the round, a
  one-line beat and a trait line, and waits for Continue (disabled for the
  answer debounce, then focused). The interstitial before Round 3 shows one
  face-down card per remaining candidate ("Four suspects remain": Round 3
  plays four) instead of the five percentage bars, and its button says
  "Continue to Round 3". The banter that named a colour ("Your White is
  showing.") is gone; trait lines are keyed to the leading colour but never
  name it. After every tenth answer a line appears above the next question.
  Animations run only under `prefers-reduced-motion: no-preference`.
- The free mulligan: one undo per round ("Undo", or "Free mulligan" in player
  mode). Each answer handler first stores the `saveSession` snapshot
  (`sessionSnapshot()`); Undo restores it through `restoreSession`, so the
  taken-back answer leaves no trace and only the replacement is scored. The
  replacement's record carries `redo: true`, `firstAnswer` and
  `firstResponseMs`, and every response record now carries `responseMs`. The
  spent mulligan is saved with the session.
- Results: a Share button beside the identity in the banner, the same action
  as the share button below.
- Round 3's eyebrow reads "Head to head" instead of repeating the scenario.
- Tests: `tests/play.test.js` (in `npm test`) covers all of the above in
  jsdom, with the real `showRoundTransition` for the tap-through checks. The
  fit was checked in a browser over a full journey at 375x812 (with the Magic
  items), and with the longest items at 375x667.

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

### Phase 0: repository hygiene and tests
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
