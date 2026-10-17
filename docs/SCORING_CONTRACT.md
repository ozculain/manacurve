# Scoring and presentation contract

Agreed before the scoring branch (Phase 1) and the presentation branch (Phase 2) split. Both branches must honour this; either may propose a change by editing this file in its own commit, but not silently.

## `state.result` shape

```
{
  identity:          string,            // one of the 31 ids in PROFILES
  confidence:        'HIGH' | 'MODERATE' | 'LOW',
  allResults:        Array<{ id, ... }>,// as today, best first
  scoringVersion:    number,            // 1 = current engine, 2 = likelihood engine
  instrumentVersion: number,            // 1 = current items and screens
  posterior:         { [id]: number } | undefined, // present when scoringVersion >= 2; sums to 1
  round3Data:        { ... as today, scenarioContradiction, contextDisagreement, runnerUp, ... },
  earlyTermination:  boolean | undefined
}
```

- `state.activationSorted` stays `[[colour, 0..1], ...]` sorted descending. In release 1 the bars show activation, not posterior marginals.
- Confidence is computed only by scoring code and written to `result.confidence`. Presentation maps it to a display label and a base-rate sentence; it never recomputes it. Until Phase 5 measures real results the sentence carries no figure and is the same for every `scoringVersion`; Phase 5's figures will be keyed by it.
- The neighbourhood ("next door") is derived from the five activation values only, so it renders for old links.

### What engine 2 puts there (added by Phase 1)

- `confidence` is the reported identity's posterior: below 0.5 LOW, 0.5 to 0.7 MODERATE, 0.7 and above HIGH. The Round 3 guards can only lower it: a Condorcet cycle through the reported identity makes it LOW, and the scenario-contradiction and context-disagreement guards cap HIGH at MODERATE. An early result (`earlyTermination: true`) uses the Round 1 posterior, which is at least 0.9 for the offer to appear, so it is HIGH.
- `posterior` covers all 31 identities and folds in Rounds 1 to 3 (Round 1 only for an early result).
- The reported identity is the Round 3 candidate with the highest posterior, not necessarily the one with the best win-loss record. So `allResults` and `round3Data.allScores` are ordered by posterior, best first (`allResults[i][1].combined` is the posterior and each `allScores` entry gains `posterior`), `round3Data.runnerUp` is the next candidate by posterior, and `round3Data.gap`, still the win-loss difference between the two, can be negative. In simulation the reported identity had the best or tied-best record about 85% of the time (engine 1: about 92%); the remaining 15% is where the line "finished with the best record" (`displayFinalDetermination`) was not true. Presentation now says, for `scoringVersion` 2, that the identity won on the weight of all the answers, and says so when its record was not the best; version 1 results keep the old line.
- Both engines set `scoringVersion` and `instrumentVersion`. A session saved before engine 2 existed resumes on engine 1, and its finished result is labelled 1 and 1.

## Engine switch

- `const SCORING_VERSION = 2;` at the top of the scoring section once Phase 1 lands. `?engine=1` in the URL selects the old engine for one release. Both engines must populate the shape above.

## Seed link parameters

Existing: `r` identity, `p` five integers 0..100 in WUBRG order, `c` confidence, `a` audience.
Added: `s` scoringVersion, `i` instrumentVersion, `f` appealed identity (optional), later `v` result code (optional).
Absent `s` or `i` means 1. Unknown parameters are ignored. `buildResultURL` writes `s` and `i`; `parseSeedURL` reads them into `state.result`.

- Shared links go through the identity's link-preview page: `buildResultURL` writes `<site root>/r/<ID>.html?p=...&c=...&a=...&s=...&i=...[&f=...]` with no `r`, and the page forwards to `index.html?r=<ID>&p=...` (query and hash kept, `r` added). `parseSeedURL` still reads `r` from the query, and links written before the preview pages (`?r=<ID>&...`) still open.
- `r` stays the verdict after an appeal; the appeal is `state.result.appeal = { chosen, shown, copyVersion, labelShown, timeToAppealMs }` (presentation-owned; scoring never writes it). `f` carries `appeal.chosen`, and is not written in workplace mode, where the appeal stays private.
- The golden test compares the result link on `r`, `p`, `c` and `a` only, so adding `s`, `i`, `f` (or `v`) to links never forces a fixture rewrite; a change of `SCORING_VERSION` shows up there through the identity, confidence and bars it changes, not through `s`.

## Region ownership in index.html (line numbers at commit 5e079fb; EOL renormalisation does not move them)

- Phase 1 (scoring): roughly 4989 to 7403 (Round 1 scoring, candidate generation, refinement, tournament), plus `saveSession`/`restoreSession` fields, `tests/simulate.js`, `tests/fixtures/`. Adds no CSS. Does not touch `showResults` or the share code.
- Phase 2 (presentation): 4717 to 4800 (seed link build/parse), 9753 to 10700 (results screen, alternatives, share), results markup around 2166 to 2300. Appends its CSS immediately before `</style>`. Does not touch scoring functions.
- Later phases insert CSS after a different anchor so no two branches add at the same spot.

## Things both must keep working

- Session save/resume at every stage (tests/journey.test.js).
- Ten recorded seed URLs (tests/seed.test.js) still parse and render.
- Golden fixture (tests/fixtures/golden.json) is rewritten only by a scoring branch, in its own commit.
