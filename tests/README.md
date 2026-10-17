# Tests

Each test file is a plain Node script: it prints one `PASS` or `FAIL` line per
check and exits non-zero if anything failed. They need jsdom in the repo's
`node_modules` (`npm ci`).

| File | Checks |
| --- | --- |
| `structure.test.js` | `index.html` markup: balanced `<div>`s, no duplicate ids, every `getElementById` target exists, no `#id` display rule beats `.hidden`, screens are siblings; the inline script and `data.js` parse; the SCRIPT END marker the other tests inject at is present |
| `render.test.js` | `showResults()` on a fake mono, guild, three-, four- and five-colour result, in both audience modes with player mode off and on: every key element is populated with that identity's data, the bars match the activation, the workplace mode hides the banter, and the Phase 2 pieces appear or stay away as specified (reveal order, typeline, next door, label words and base rates, bars caption, rules text, mana base); plus the peek and appeal flow, the all-31 path, and the share Card's export in the gilded and frames themes (html-to-image stubbed; the test checks the node it is handed) |
| `journey.test.js` | 43 checks over full journeys: the Round 2 gaming gate, weighted ally answers, session save and resume at every stage, the Round 3 clinch rule, Neither-neutral Round 1 ranking, the early-offer evidence floor, the context-disagreement caveat |
| `seed.test.js` | share links, which point at the preview pages (`<site root>/r/<ID>.html?p=...`): `siteRootURL()` on GitHub Pages, a localhost preview and a subfolder; `buildResultURL()` on each; the round trip through the preview page's forward to `parseSeedURL()` (with `s`, `i` and `f`); the ten old-form links and the two preview-page links in `fixtures/seed-urls.json` (recorded from the live build) open onto their result and its next-door row, and re-share as preview-page links; the share text, Web Share, clipboard and Copy Link carry the new form; all 31 identities link to a page that exists |
| `golden.test.js` | 186 seeded paths through the real Rounds 1-3 (every identity: one respondent at p = 1, five at p = 0.8, the simulator's ideal model) match `fixtures/golden.json`: Round 1 candidates and s1, Round 1 and final activation, early offer, identity, confidence, Round 3 matchups in order, and the result link's `r`, `p`, `c` and `a` (for a preview-page link, `r` is read from the page name and the fixture keeps its `?r=` shape) |
| `play.test.js` | Phase 3 play feel: the phone CSS (below 600px the answers stack at full width without their fixed height; plinths drop to about 20px) and where its block sits; one counter across a whole journey ("x of 45", each round's real length once known, never reset) and the length claims that match it; the one-question preflight and its two links; the theme switcher on the results page (Card Frames reachable, `localStorage` kept). jsdom cannot lay out, so the on-screen fit is checked in a browser |

`fixtures/golden.json` changes only when scoring changes on purpose. Rewrite it
with `node tests/golden.test.js --update`, in a commit of its own, and say in
that commit what moved. `fixtures/seed-urls.json` is never regenerated: its
`urls` (old `?r=` form) and `previewUrls` (preview-page form) stand in for links
people have already shared.

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

`node tests/simulate.js [--n 200] [--p 0.8] [--neither 0.05] [--seed 1] [--model ideal] [--engine 2] [--gaming] [--workers auto] [--out file]`
(or `npm run simulate`). Needs jsdom in the repo's `node_modules`.

It boots `index.html` with `data.js` in jsdom (one page per worker thread and
scoring engine, reset between respondents with the page's own `restart()`),
seeds the page's `Math.random`, and drives synthetic respondents through all
three rounds with the real handlers and scoring code. The respondent models
live in `_lib/respondent.js`, which the golden test shares.

- `--model ideal|misspecified` picks the respondent model (default `ideal`).
- `--models both` runs both models on the same respondents (same seeds, so the
  same item order and shuffles) and prints them side by side, per identity and
  per type, with the gap: ideal minus misspecified, in percentage points.
- `--p` takes a comma list (`--p 0.6,0.8,1`): each value gets its own report,
  followed by a table of exact recovery by type across the values.
- `--engine 1|2` picks the scoring engine: 2, the likelihood engine, is the
  page's default; 1 boots the page with `?engine=1`. `--engine 1,2` runs both
  on the same respondents and prints them side by side with the change, engine
  2 minus engine 1, so a before/after comes from one build.
- `--gaming` turns the gaming toggle on for every respondent, which lets the
  Magic-flavoured items into Rounds 1 and 2.
- `--out` writes the JSON somewhere other than `tests/out/simulation.json`.

Each report gives exact recovery per identity and per type (final, and Round 1's
top candidate alone), enemy-pair guilds (Orzhov, Izzet, Golgari, Simic, Boros)
against allied guilds, neighbourhood coverage (how often the true identity is
the result, the result plus its strongest unlit colour, or the result minus its
weakest lit colour, read from the final activation as the results screen does),
each confidence label's share and accuracy, how often the early-result offer
appears and how often the identity it offers is the true one (simulated
respondents always decline it), and the top confusions.

The run exits with status 1 if the page logs an error or any result breaks the
`state.result` contract in `docs/SCORING_CONTRACT.md`: an identity, a
confidence label, `scoringVersion` equal to the engine, `instrumentVersion` 1,
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

Defaults: 200 respondents per identity, p = 0.8, neither = 0.05, seed = 1,
model ideal, engine 2. The default run takes about 30 seconds on 8 cores;
`--models both` or `--engine 1,2` about twice that.

Output: a plain-text report and the same data in `tests/out/simulation.json`
(an object with a `runs` array when more than one model, engine or p is run).

Synthetic respondents measure how well the scoring pipeline recovers an identity
from answers generated by a known model. They say nothing about human validity.
