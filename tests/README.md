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
