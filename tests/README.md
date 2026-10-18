# Tests

Each test file is a plain Node script: it prints one `PASS` or `FAIL` line per
check and exits non-zero if anything failed. They need jsdom in the repo's
`node_modules` (`npm ci`).

| File | Checks |
| --- | --- |
| `structure.test.js` | `index.html` markup: balanced `<div>`s, no duplicate ids, every `getElementById` target exists, no `#id` display rule beats `.hidden`, screens are siblings; the inline script and `data.js` parse; the SCRIPT END marker the other tests inject at is present |
| `render.test.js` | `showResults()` on a fake mono, guild, three-, four- and five-colour result, in both audience modes with player mode off and on: every key element is populated with that identity's data, the bars match the activation, the workplace mode hides the banter, and the Phase 2 pieces appear or stay away as specified, in the final copy (reveal order, the player-mode card of typeline, rules text and collector number, next door below the commander block, label words and base rates with no number, bar titles and caption, mana base); plus the drafts' typeline, next-door and mana base examples, every identity's mana base (37 lands, nothing outside its colours in the deck, a maybeboard line only when a neighbour qualifies), the per-row peek and appeal flow, the all-31 path, shares after an appeal, the Round 3 "what decided it" line under each engine, and the share Card's export in the gilded and frames themes (html-to-image stubbed; the test checks the node it is handed) |
| `journey.test.js` | 43 checks over full journeys: the Round 2 gaming gate, weighted ally answers, session save and resume at every stage, the Round 3 clinch rule, Neither-neutral Round 1 ranking, the early-offer evidence floor, the context-disagreement caveat |
| `seed.test.js` | share links, which point at the preview pages (`<site root>/r/<ID>.html?p=...`): `siteRootURL()` on GitHub Pages, a localhost preview and a subfolder; `buildResultURL()` on each; the round trip through the preview page's forward to `parseSeedURL()` (with `s`, `i` and `f`); the ten old-form links and the two preview-page links in `fixtures/seed-urls.json` (recorded from the live build) open onto their result and its next-door row, and re-share as preview-page links; the share text, Web Share, clipboard and Copy Link carry the new form; all 31 identities link to a page that exists |
| `golden.test.js` | 186 seeded paths through the real Rounds 1-3 (every identity: one respondent at p = 1, five at p = 0.8, the simulator's ideal model) match `fixtures/golden.json`: Round 1 candidates and s1, Round 1 and final activation, early offer, identity, confidence, Round 3 matchups in order, and the result link's `r`, `p`, `c` and `a` (for a preview-page link, `r` is read from the page name and the fixture keeps its `?r=` shape) |
| `round3-copy.test.js` | the rules the Round 3 stems and options were written to, held on the live files (`ROUND2_SCENARIOS` in `data.js`, `POOL_B` and `POOL_C` in `index.html`): every option is 15 words or fewer, no stem or option outside MTG_STALL names a colour, a basic land or an identity, and each of the 48 scenarios still has exactly its original identity keys (`fixtures/round3-keys.json`); then the same guards on made-up sources, and `tools/apply-round3-copy.js` on a made-up drafts file (it refuses a stale, over-long or colour-naming draft, keeps each source's quoting, and changes nothing the second time) |
| `round12-copy.test.js` | the rules the Round 1 and 2 questions were rewritten to, held on the live files (`POOL_A`, `POOL_ALLY`, `CONTEXT_HINTS` and `getContextHint` in `index.html`, read by `tools/check-round12-copy.js`): the same 111 items in the same order, each with its pair, weight and answer colours (`fixtures/round12-keys.json`, written before the rewrite), so the same counts per pool and per pair; stems 25 words or fewer, answers 20, labels 4, no two items with the same stem; no colour, basic land, identity, guild, tagline, mana or colour named in a stem, answer, label or hint; no em dash, exclamation mark, asterisk, capitals or question mark in an answer, British spelling, none of the brief's banned words; every item rewritten or listed as kept after review; which six items show a hint (none on a Magic item) and every hint shown somewhere in Rounds 1 to 3; Round 1's and Round 2's renderers on all 111 items, and a real Round 1 and 2 with Magic items off and on, showing each label, stem, hint and answer as written; then the same guards on made-up sources |
| `play.test.js` | Phase 3 play feel and quiz copy: the phone CSS (below 600px the answers stack at full width without their fixed height; plinths drop to about 20px; no standing undo hint, one tight beat line) and where its block sits; one counter across a whole journey ("x of 45", each round's real length once known, never reset) and the length lines (welcome, fold and preflight: "up to 45 questions, about 8 minutes", 45 being the counter's computed total, which moves with it); the one-question preflight in its reviewed words, with the Constructed and Work mode links saying what changed and offering the way back; the early offer (no identity, colour, pips or chip, and what is left of the counter); the theme switcher on the results page (Card Frames reachable, `localStorage` kept); the welcome (Rule 0, start under the lead line, explorer beside it, the long paragraph in the fold, the resume anchor); every-ten beats (answers 10, 20 and 40 only, by trait or, for players, by pattern, a second line then none, the same line on a re-render, taken back with an undone answer); transitions that wait for Continue (with the real `showRoundTransition`, not the stub: Round II "Closer calls", Round III "Head to head" with its trait line), the face-down line-up (the count, the banter by trait or for a player, the questions to come, and the one random draw its banter takes, which the seeded Round 3 shuffles depend on); every quiz-screen string free of colour, basic land and identity names; the free mulligan in all three rounds (it asks first, says it is taken, then used; state restored, only the final answer scored, the first answer and both response times on the record), player and plain wording; share beside the identity in the results banner; no colour cues while the rounds run (`NEUTRAL_SKY_DURING_QUIZ`: the sky's weights equal and no constellation through Rounds 1 to 3, the real weighting at the reveal, a reverted build tinting again, the Card Frames marks untinted); the stem shown once (all 48 Round 3 stems, the 15 hints in the line above it); the instrument version (`i=3` in a built link, early results included). jsdom cannot lay out, so the on-screen fit is checked in a browser |

`fixtures/golden.json` changes only when scoring changes on purpose. Rewrite it
with `node tests/golden.test.js --update`, in a commit of its own, and say in
that commit what moved. `fixtures/seed-urls.json` is never regenerated: its
`urls` (old `?r=` form) and `previewUrls` (preview-page form) stand in for links
people have already shared.

The page's `Math.random` is one seeded stream per respondent, shared with the
shuffles in Rounds 1 to 3, so the golden paths also depend on how many draws the
page makes between questions: the line-up's banter takes exactly one (`pickLine`,
even from a pool of one line), and `play.test.js` counts it. A wording change
never moves the fixture; a draw added or dropped does.
`fixtures/round3-keys.json` changes only when a Round 3 scenario or identity key
is added or removed on purpose (`node tests/round3-copy.test.js --update-keys`,
in a commit of its own). `fixtures/round12-keys.json` likewise changes only when
a Round 1 or 2 item is added, removed or re-keyed on purpose
(`node tools/check-round12-copy.js --write-fixture`, which keeps the hash of
each item's words from before the rewrite and lists a new item as kept after
review), in a commit of its own.

A share link opens `r/<ID>.html`, whose own script forwards to `index.html`.
`_lib/forward.js` runs that committed script against a fake location, and
`followShareLink(link)` returns where a browser would land, so a test follows a
link the way a visitor does and then boots `index.html` there.
`previews.test.js` checks the script, `seed.test.js` follows links with it, and
`golden.test.js` reads the identity from the same page-name pattern.

The page tests (all but `structure`) boot `index.html` through `_lib/load.js`:
`data.js` is inlined into the main script tag, the html-to-image CDN script is
dropped, and a helper block is injected just before the
`// === SCRIPT END — all functions defined ===` comment, so it shares the page's
script scope. The helpers skip the round-transition animation and the answer
debounce, and expose the page's `state` and handlers on `window.__h`. Pages load
at `http://localhost/` (so `sessionStorage` works), with `Math.random` seeded and
`prefers-reduced-motion` on (jsdom cannot draw the canvas background). No
scoring code is replaced. Every test also takes an optional path to another
build's `index.html`, with its `data.js` beside it:
`node tests/render.test.js ../other-checkout/index.html`.

# Respondent simulation

`node tests/simulate.js [--n 200] [--p 0.8] [--neither 0.05] [--seed 1] [--model ideal] [--engine 2] [--r3 variants] [--gaming] [--workers auto] [--out file] [path/to/index.html]`
(or `npm run simulate`). Needs jsdom in the repo's `node_modules`.

It boots `index.html` with `data.js` in jsdom (one page per worker thread and
scoring engine, reset between respondents with the page's own `restart()`),
seeds the page's `Math.random`, and drives synthetic respondents through all
three rounds with the real handlers and scoring code. The respondent models
live in `_lib/respondent.js`, which the golden test shares.

- `--model ideal|misspecified|mixed` picks the respondent model (default `ideal`).
- `--models both` runs the ideal and misspecified models on the same
  respondents (same seeds, so the same item order and shuffles) and prints them
  side by side, per identity and per type, with the gap: ideal minus each
  other model, in percentage points. `--models all` adds the mixed model, and
  `--models a,b` runs any list.
- `--p` takes a comma list (`--p 0.6,0.8,1`): each value gets its own report,
  followed by a table of exact recovery by type across the values.
- `--engine 1|2` picks the scoring engine: 2, the likelihood engine, is the
  page's default; 1 boots the page with `?engine=1`. `--engine 1,2` runs both
  on the same respondents and prints them side by side with the change, engine
  2 minus engine 1, so a before/after comes from one build.
- `--seed` takes a comma list (`--seed 1,2`): the respondents of every seed are
  pooled into one report, so `--n 100 --seed 1,2` reports 200 per identity.
- `--gaming` turns the gaming toggle on for every respondent, which lets the
  Magic-flavoured items into Rounds 1 and 2.
- `--out` writes the JSON somewhere other than `tests/out/simulation.json`.
- A path to another build's `index.html` (its `data.js` beside it) simulates
  that build, as the page tests do.

`--r3` (engine 2 only) compares ways of turning the Round 3 answers into the
reported identity, on the same respondents: `--r3 pm,page,q=0.85`. Each
comma-separated variant is one of these, or several joined with `+`:

- `page`: the build as it is.
- `q=X`: the Round 3 discrimination fixed at X. The page's
  `round3LogLikelihoods` gets `qGrid: [X]` wherever the page passes no grid of
  its own (as built it averages q over `ROUND3_Q_GRID`). The posterior decides
  the tiebreak questions, so each `q` runs the respondents on the page again.
- `pm`: the candidate with the highest final posterior, which engine 2
  reported before `round3RecordRanking`; on the current build, `pm` is the
  "before" and `page` the "after" of that change.
- `tour`: the tournament winner (the page's `getTournamentWinner` on the same
  matches), when it beat the posterior maximum head-to-head.
- `lostall` and `losing`: the best-posterior candidate that did not lose every
  match, or that has no losing record (fewer wins than losses), when the
  posterior maximum lost every match, or has a losing record.
- `net`: as `losing`, but the margin below is raised to the power of the
  posterior maximum's net losses (losses minus wins).
- `rule:M` keeps the posterior maximum when its posterior is at least M times
  the runner-up's (the next candidate by posterior); `losing:M:M0` uses M0
  instead when the posterior maximum won no match. `losing:3:16` is the rule
  the page now applies (`ROUND3_LOSING_RECORD_MARGIN`, `ROUND3_NO_WINS_MARGIN`).
  Rules joined with `+` are tried in order; the first that changes the result
  decides it.

A rule acts after the last answer, so it changes no question: it is applied to
what the page recorded when it decided (each candidate's final posterior and
record, the matches, the tournament winner, and the label the page would give
each candidate as the result), and costs no extra page run. The run fails if a
result's label differs from the recorded one. The report gives, per p, each
variant's exact recovery per type and overall (with two binomial standard
errors, per seed, and the change from the first variant on the same
respondents with two paired standard errors); the reported identity's Round 3
record (losing, lost every match, of those the ones that lost three or more,
and how often they were right, not the best record); where the posterior
maximum and the tournament winner disagree, how
often each was the true identity; and each label's share and accuracy with
neighbourhood coverage. The page's functions are wrapped only under `--r3`;
without it the run is the plain one above.

Each report gives exact recovery per identity and per type (final, and Round 1's
top candidate alone), enemy-pair guilds (Orzhov, Izzet, Golgari, Simic, Boros)
against allied guilds, neighbourhood coverage (how often the true identity is
the result, the result plus its strongest unlit colour, or the result minus its
weakest lit colour, read from the final activation as the results screen does),
each confidence label's share and accuracy, how often the early-result offer
appears and how often the identity it offers is the true one (simulated
respondents always decline it), the result against its own bars, and the top
confusions. "Against its bars" reads the final activation as the results screen
draws it: a result's distance from its bars is the strongest colour it leaves
out minus the weakest colour it holds (for all five colours, 50% minus the
weakest), and the report gives how often that is over one answer (1/12 of a
bar), over half an answer, and above zero on the bars as printed (whole
percentages: a colour shown out of order).

The run exits with status 1 if the page logs an error or any result breaks the
`state.result` contract in `docs/SCORING_CONTRACT.md`: an identity, a
confidence label, `scoringVersion` equal to the engine, `instrumentVersion` 3,
and under engine 2 a posterior over all 31 identities that sums to 1.

**Ideal model.** For each identity in `PROFILES`, with colour set C:

- Rounds 1 and 2: pick the option whose colour is in C with probability p,
  otherwise the other; if both or neither are in C, pick uniformly.
- Round 1 only: answer "Neither" with probability `neither` instead.
- Round 3: prefer the matchup identity whose colours have the higher Jaccard
  similarity to C, with probability p; ties are uniform.

**Misspecified model.** A respondent the scoring was not designed around. It
assumes:

- Graded colour weights, not a set. Each colour in the identity gets a latent
  weight drawn uniformly from 0.6 to 1.0, each colour outside it from 0 to 0.3.
  The identity is still exactly the colours weighted above 0.5, so it is
  recoverable in principle, but an item with both options in the identity now
  leans to the stronger colour (and an item with neither to the less weak one)
  instead of splitting 50/50.
- Items differ. Each item has a discrimination a ~ LogNormal(0, 0.35) and a
  difficulty (a threshold, in weight units) b ~ Normal(0, 0.12), drawn once per
  item id from a fixed seed: the same in every run, whatever `--seed` is.
- People differ. Each respondent's consistency u ~ Beta(8, 3) scales how
  sharply they follow their weights, relative to the population mean (8/11).
- A two-option item is answered with
  P(first listed option) = logistic(a·k·u·(w1 − w2 − b) + 0.25·(d1 − d2) ± 0.2),
  where d is 1 for a White or Green option (a small social-desirability lean)
  and ±0.2 favours whichever option the page shows first (position bias).
- About 5% of respondents are disengaged: they pick at random throughout and
  never answer "Neither". The others answer "Neither" in Round 1 with
  probability `neither`, as in the ideal model.
- Round 3: an identity's similarity to the respondent is 1 minus the mean
  absolute difference between its colour indicator and the five weights. The
  respondent picks A over B with probability logistic(k3·u·(sim A − sim B)), so
  the true identity is always the most similar, but a one-colour neighbour
  trails it by only |2w − 1| / 5 and those matchups are noisy.
- Calibration: k and k3 are fixed per p (a deterministic Monte Carlo solve) so
  that an engaged respondent picks the in-identity option of a one-in, one-out
  item with average probability p, and the true identity over a one-colour
  neighbour in Round 3 with average probability p. Both models therefore carry
  the same average signal at the same p, and the gap measures the structure,
  not the strength. p above 0.99 is treated as 0.99.
- Not modelled: position bias or social desirability in Round 3, fatigue or
  drift across the quiz, and "Neither" depending on how well the options fit.
  The gaming toggle is off unless `--gaming` is given.

**Mixed model.** Real people rarely hold a clean colour set: their colour
weights are continuous and fairly flat. The mixed respondent is the
misspecified one (the same person, items, leans and disengaged share, and the
same k and k3, calibrated at p for the misspecified model) with flatter
weights: each colour in the identity from 0.5 to 0.8, each outside it from 0.2
to 0.5. The identity is still exactly the colours weighted above 0.5, but the
weakest colour held and the strongest not held are often only a little apart,
so the answers carry less signal than the misspecified model's at the same p:
an engaged mixed respondent picks the in-identity option of a one-in, one-out
item, and the true identity over a one-colour neighbour in Round 3, with
average probability 0.57 at p = 0.65 and 0.66 at p = 0.8 (the calibration line
of the report prints these). Their bars are flatter too, as a real player's
often are.

Defaults: 200 respondents per identity, p = 0.8, neither = 0.05, seed = 1,
model ideal, engine 2. The default run takes about 30 seconds on 8 cores;
`--models both` or `--engine 1,2` about twice that, `--models all` three times.

Output: a plain-text report and the same data in `tests/out/simulation.json`
(an object with a `runs` array when more than one model, engine or p is run).

Synthetic respondents measure how well the scoring pipeline recovers an identity
from answers generated by a known model. They say nothing about human validity.
