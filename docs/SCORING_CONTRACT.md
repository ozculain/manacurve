# Scoring and presentation contract

Agreed before the scoring branch (Phase 1) and the presentation branch (Phase 2) split. Both branches must honour this; either may propose a change by editing this file in its own commit, but not silently.

## `state.result` shape

```
{
  identity:          string,            // one of the 31 ids in PROFILES
  confidence:        'HIGH' | 'MODERATE' | 'LOW',
  allResults:        Array<{ id, ... }>,// as today, best first
  scoringVersion:    number,            // 1 = current engine, 2 = likelihood engine
  instrumentVersion: number,            // 9 = current items and screens (Red answers rewritten as conviction, not impulse: the Blue-Red and Black-Red items and two Red-Green ones; the question counter says "of up to 45"); 8 = second naive-reader round of the questions (Rounds 1 to 3 text); 7 = questions rewritten from naive readers (Rounds 1 to 3 text and the context hints); 6 = persona check of all questions (Rounds 1 to 3 text and the context hints); 5 = Round 1 and 2 items rewritten so the respondent has real stakes; 4 = Plain screens (the transitions, Round 3 line-up, early offer, progress line and undo seen while answering); 3 = Round 1 and 2 copy rewrite; 2 = Phase 3 quiz copy and flow; 1 = before, and any link or saved result without one
  posterior:         { [id]: number } | undefined, // present when scoringVersion >= 2; sums to 1
  round3Data:        { ... as today, scenarioContradiction, contextDisagreement, runnerUp, ... },
  earlyTermination:  boolean | undefined
}
```

- `state.activationSorted` stays `[[colour, 0..1], ...]` sorted descending. In release 1 the bars show activation, not posterior marginals.
- Each bar is how often the colour was picked when it was offered (Even bars and Five-colour): every answered Round 1 and Round 2 item, Round 2's enemy re-tests included, counts its weight `q.w` once for the colour chosen and once in the denominator of both colours in its pair, and "Neither" counts in neither (`barsFromTallies`). After Round 1, and in an early result, the bars count Round 1's answers alone. No smoothing; a colour never answered shows 50%. Before, each colour's enemy-pair and ally-pair rates were averaged with equal weight, so two Round 2 answers counted as much as ten Round 1 answers.
- The bars allow the identity: whatever the engine, `identity` is one whose colours are the top bars as the results screen prints them (whole percentages), ties allowed, or Five-colour when the five print within `FIVE_COLOUR_BAND` points of each other (below).
- Confidence is computed only by scoring code and written to `result.confidence`. Presentation maps it to a display label and a base-rate sentence; it never recomputes it. Until Phase 5 measures real results the sentence carries no figure and is the same for every `scoringVersion`; Phase 5's figures will be keyed by it.
- The neighbourhood ("next door") is derived from the five activation values only, so it renders for old links.

### What engine 2 puts there (added by Phase 1)

- `confidence` is the reported identity's posterior: below 0.5 LOW, 0.5 to 0.7 MODERATE, 0.7 and above HIGH. The Round 3 guards can only lower it: a Condorcet cycle through the reported identity makes it LOW, and the scenario-contradiction and context-disagreement guards cap HIGH at MODERATE. An early result (`earlyTermination: true`) uses the Round 1 posterior, which is at least 0.9 for the offer to appear, so it is HIGH.
- `posterior` covers all 31 identities and folds in Rounds 1 to 3 (Round 1 only for an early result).
- The reported identity is the Round 3 candidate with the highest posterior, not necessarily the one with the best win-loss record, unless that candidate has a losing Round 3 record (fewer wins than losses) and a posterior less than 3 times the runner-up's, or 16 times when it won no match; then it is the best candidate by posterior without a losing record (Phase 1: Round 3 weight). So `allResults` and `round3Data.allScores` put the reported identity first and the others in posterior order (`allResults[i][1].combined` is the posterior and each `allScores` entry gains `posterior`), `round3Data.runnerUp` is the next in that order, and `round3Data.gap`, still the win-loss difference between the two, can be negative. In simulation at p = 0.8 the reported identity had the best or tied-best record about 90% of the time (85% before that rule; engine 1: about 92%) and a losing record about 1% of the time (6% before); the rest is where the line "finished with the best record" (`displayFinalDetermination`) would not be true. Presentation now says, for `scoringVersion` 2, that the identity won on the weight of all the answers, and says so when its record was not the best; version 1 results keep the old line.
- Both engines set `scoringVersion` and `instrumentVersion`. A session saved before engine 2 existed resumes on engine 1, and its finished result is labelled 1 and 1.

### The name matches the bars (both engines)

- An identity's distance from the bars, `barsMargin(id, state.activationSorted)`, in printed points, on the bars as the results screen prints them (`barsShown`: `Math.round(bar * 100)`, the numbers a shared link carries in `p`): the strongest colour it leaves out minus the weakest colour it holds, or, when it holds all five, the spread of the five (strongest minus weakest) minus `FIVE_COLOUR_BAND`, 20. `barsAllow(id)` is that distance at most 0: no colour the identity leaves out prints above a colour it holds (ties allowed), and Five-colour needs the five printed within 20 points. (Until Even bars and Five-colour the distance was in bar units, with half an answer of tolerance, `BARS_TOLERANCE`, and 50% as the line for Five-colour, which no real five-colour respondent's bars reached.) On any bars the top bars one to four deep are allowed, so Round 3 always has four identities to play.
- Engine 2 seeds Round 3 with the four identities the bars allow that the Round 1 + Round 2 posterior rates highest (so `round3Data.allScores` and `allResults` hold only such identities), and reports the one of them the final posterior rates highest, the record rule acting among them. The posterior itself is unchanged by the bars, and `confidence` is still the reported identity's posterior.
- Engine 1 reports its tournament winner when the bars allow it; otherwise the best candidate they allow in its standings, or, if none, the identity of the top bars as wide as the winner (narrower, for five colours, until the bars allow it), with `confidence` LOW and the tournament's pick as `round3Data.runnerUp`.
- The early-result offer is made only for an identity the Round 1 bars, which an early result shows, allow. A session that reached Round 3 on an earlier build finishes on one the bars allow too, read from the bars it saved, which are the ones its results screen shows (engine 2: the best such candidate by posterior, or the best such identity of all 31 at 0-0).
- `round3Data.loopBrokenByBars` is true only when engine 1 re-ranked a Round 3 cycle by the bars and that pick stood; engine 2's posterior decides inside a cycle, so under engine 2 it is always false. The results screen no longer describes how a result was reached (Plain screens), so nothing shown reads it; it records what happened.
- `tests/simulate.js` counts a result its printed bars do not allow, or an early offer the printed Round 1 bars do not allow, as a contract violation.

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
