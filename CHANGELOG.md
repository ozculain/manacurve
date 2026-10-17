# Changelog

Newest first. Dates are when the work was committed.

## 2026-10-17

- Commander descriptions: corrected 16 entries against Scryfall oracle text.

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
- Not live yet: the share-link builder in `index.html` (`buildResultURL`) still
  emits `?r=...`, so nothing links to these pages. It has to emit
  `r/<ID>.html?p=...&c=...&a=...` instead (a later change, owned by the
  presentation work).
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
