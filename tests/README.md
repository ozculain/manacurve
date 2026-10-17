# Tests

Each test file is a plain Node script: it prints one `PASS` or `FAIL` line per
check and exits non-zero if anything failed. They need jsdom in the repo's
`node_modules` (`npm ci`).

| File | Checks |
| --- | --- |
| `structure.test.js` | `index.html` markup: balanced `<div>`s, no duplicate ids, every `getElementById` target exists, no `#id` display rule beats `.hidden`, screens are siblings; the inline script and `data.js` parse; the SCRIPT END marker the other tests inject at is present |
| `render.test.js` | `showResults()` on a fake mono, guild, three-, four- and five-colour result, in both audience modes: every key element is populated with that identity's data, the bars match the activation, and the workplace mode hides the banter |
| `journey.test.js` | 43 checks over full journeys: the Round 2 gaming gate, weighted ally answers, session save and resume at every stage, the Round 3 clinch rule, Neither-neutral Round 1 ranking, the early-offer evidence floor, the context-disagreement caveat |
| `seed.test.js` | `buildResultURL()` to `parseSeedURL()` round trips, and the ten links in `fixtures/seed-urls.json` (recorded from the live build) still open onto their result |

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

`node tests/simulate.js [--n 200] [--p 0.8] [--neither 0.05] [--seed 1] [--workers auto]`
(or `npm run simulate`). Needs jsdom in the repo's `node_modules`.

It boots `index.html` with `data.js` in jsdom (one page per worker thread, reset
between respondents with the page's own `restart()`), seeds the page's
`Math.random`, and drives synthetic respondents through all three rounds with
the real handlers and scoring code.

**Respondent model.** For each identity in `PROFILES`, with colour set C:

- Rounds 1 and 2: pick the option whose colour is in C with probability p,
  otherwise the other; if both or neither are in C, pick uniformly.
- Round 1 only: answer "Neither" with probability `neither` instead.
- Round 3: prefer the matchup identity whose colours have the higher Jaccard
  similarity to C, with probability p; ties are uniform.

Defaults: 200 respondents per identity, p = 0.8, neither = 0.05, seed = 1.
The default run takes about 35 seconds on 8 cores.

Output: a plain-text report and the same data in `tests/out/simulation.json`.

Synthetic respondents measure how well the scoring pipeline recovers an identity
from consistent answers. They say nothing about human validity.
