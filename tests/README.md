# Tests

Each test file is a plain Node script: it prints one `PASS` or `FAIL` line per
check and exits non-zero if anything failed. They need jsdom in the repo's
`node_modules` (`npm ci`).

| File | Checks |
| --- | --- |
| `structure.test.js` | `index.html` markup: balanced `<div>`s, no duplicate ids, every `getElementById` target exists, no `#id` display rule beats `.hidden`, screens are siblings; the inline script and `data.js` parse; the SCRIPT END marker the other tests inject at is present |
| `render.test.js` | `showResults()` on a fake mono, guild, three-, four- and five-colour result, in both audience modes with player mode off and on: every key element is populated with that identity's data, the bars match the activation, a consumer sees the profile's `you` lines as one list where Strengths and Shadows stood and workplace mode sees those two columns instead, the headings, labels, buttons and colour-card heads are in the audience's words (on a consumer page sentences and plain actions, "You'd do well in jobs like these.", "Save it as a picture", "White", with the jobs in sentence case and no heading over the colour cards but the divider's "Who to ask"; "Natural Roles", "Make an image", "White colleague" in workplace mode), the label a sentence about how clear the result was for a consumer ("Nothing else came close.") and the label word in workplace mode, the banter shows under its label ("Your friends would put it like this.") only for a consumer whose profile has one, and the Phase 2 pieces appear or stay away as specified, in the final copy (reveal order, the player-mode card of typeline, rules text and collector number, next door below the commander block, the label (a sentence or, in workplace mode, the word) and, under it, one sentence read from the bars (the closest call, in points as the bars print it, a tie, an old link's inverted bars, five level, a link with no bars), with no number but that gap and nothing stacked under them; the commander block's card text in player mode, and in other modes no block and the banner crediting the art, bar titles and caption, mana base, the scoring version at the foot of the methodology); plus the drafts' typeline, next-door (gaps in points, the dropped colour named as the weaker or weakest of yours on a consumer page and the lower or lowest of your colours in workplace mode, with a tie, an old link's inverted bars and five colours) and mana base examples (four and five colours counting their basics as one number), every identity's mana base (37 lands, nothing outside its colours in the deck, a maybeboard line only when a neighbour qualifies), the per-row peek and appeal flow (the neighbour's `you` lines in the peek, its strengths and shadows in workplace mode), the all-31 path, shares after an appeal, the Round 3 "what decided it" line under each engine, and the share Card's export in the gilded and frames themes (html-to-image stubbed; the test checks the node it is handed; its rules text is the first two `you` lines in consumer mode and three strengths under keywords in workplace mode) |
| `journey.test.js` | 46 checks over full journeys: the Round 2 gaming gate, weighted ally answers, session save and resume at every stage, the Round 3 clinch rule, Neither-neutral Round 1 ranking, the early-offer evidence floor, a context disagreement that the result page no longer spells out, and a session finishing on the scoring engine it started with (a player's session saved three matches into Round 3 ends Dimir, scoring version 2, when it was saved on engine 2, as it did for the player, and Grixis, version 3, when saved on engine 3), with `?engine=` pinning a new assessment |
| `seed.test.js` | share links, which point at the preview pages (`<site root>/r/<ID>.html?p=...`): `siteRootURL()` on GitHub Pages, a localhost preview and a subfolder; `buildResultURL()` on each; the round trip through the preview page's forward to `parseSeedURL()` (with `s`, `i` and `f`); a version 2 link and a version 3 link with the same result open alike, each as its own version; the ten old-form links and the two preview-page links in `fixtures/seed-urls.json` (recorded from the live build) open onto their result and its next-door row, and re-share as preview-page links; the share text, Web Share, clipboard and Copy Link carry the new form; all 31 identities link to a page that exists |
| `bars.test.js` | the bars and the name (`barsFromTallies`, `barsAllow`): the bars are the answers counted once each, by weight, Round 2's enemy re-tests included and Neither in neither, held against the answer records on recorded patterns and on simulated respondents of all three populations on engines 3 and 1, so a Round 2 answer moves a bar as far as a Round 1 answer; on the player's bars (W56 U52 B38 R60 G39) exactly the top bars one to four deep are allowed, not Mono-Blue, not Five-colour, nor the near ties the old half-answer rule let through; on 4,000 random bars (ties at the half point included) an identity is allowed exactly when no colour it leaves out prints above one it holds, the rule reads the numbers the results screen and a shared link print, and every width from one to four colours always has one; Five-colour is allowed exactly when the five print within `FIVE_COLOUR_BAND` (20 points), and a seeded five-colour respondent with flat bars is told Five-colour while one with wider bars gets an identity they allow, on engines 3 and 1; a Round 1 and 2 pattern whose even bars print W56 U52 B38 R61 G39 plays only identities the bars allow, and all 64 Round 3 outcomes on engines 3 and 1 end on one, never Mono-Blue; the pattern recorded for the player's old bars now prints W48 U64 B43 R56 G42; the old four with the player's six answers, finished on this build with the bars the old build saved, end on one those bars allow, and the results screen does not credit the bars; `round3Data.loopBrokenByBars` is set only when engine 1's re-rank by the bars picked the result, never on the likelihood engine; and `simulate.js` over all three populations at p 0.65 and 0.8 on all three engines (4 per identity) finds no result, and no early offer, its printed bars do not allow |
| `golden.test.js` | 186 seeded paths through the real Rounds 1-3 (every identity: one respondent at p = 1, five at p = 0.8, the simulator's ideal model) match `fixtures/golden.json`: Round 1 candidates and s1, Round 1 and final activation, early offer, identity, confidence, Round 3 matchups in order, and the result link's `r`, `p`, `c` and `a` (for a preview-page link, `r` is read from the page name and the fixture keeps its `?r=` shape) |
| `round3-copy.test.js` | the rules the Round 3 stems and options were written to, held on the live files (`ROUND2_SCENARIOS` in `data.js`, `POOL_B` and `POOL_C` in `index.html`): every option is 15 words or fewer, no stem or option outside MTG_STALL names a colour, a basic land or an identity, and each of the 93 scenarios still has exactly its identity keys (`fixtures/round3-keys.json`); then the same guards on made-up sources, and `tools/apply-round3-copy.js` on a made-up drafts file (it refuses a stale, over-long or colour-naming draft, keeps each source's quoting, and changes nothing the second time) |
| `round12-copy.test.js` | the rules the Round 1 and 2 questions were rewritten to, held on the live files (`POOL_A`, `POOL_ALLY`, `CONTEXT_HINTS` and `getContextHint` in `index.html`, read by `tools/check-round12-copy.js`): the same 111 items in the same order, each with its pair, weight and answer colours (`fixtures/round12-keys.json`, written before the rewrite), so the same counts per pool and per pair; stems 25 words or fewer, answers 20, labels 4, no two items with the same stem; no colour, basic land, identity, guild, tagline, mana or colour named in a stem, answer, label or hint; no em dash, exclamation mark, asterisk, capitals or question mark in an answer, British spelling, none of the brief's banned words; every item rewritten or listed as kept after review; which items show a hint (none now: `CONTEXT_HINTS` is empty, none on a Magic item either), every hint shown somewhere in Rounds 1 to 3, and no hint line repeated; Round 1's and Round 2's renderers on all 111 items, and a real Round 1 and 2 with Magic items off and on, showing each label, stem, hint and answer as written; then the same guards on made-up sources |
| `play.test.js` | Phase 3 play feel and quiz copy: the phone CSS (below 600px the answers stack at full width without their fixed height; plinths drop to about 20px; no standing undo hint, one tight beat line) and where its block sits; one counter across a whole journey ("x of up to 45": the stated length, raised only when a round's real length makes the quiz longer, never lowered and never reset) the round labels ("Round 1" to "Round 3", no names) and the length lines (welcome, fold and preflight: "up to 45 questions, about 8 minutes", 45 being the counter's computed total, which moves with it); the one-question preflight in its plain words, with the colours link (Constructed mode, which the preflight never names) and the Work mode link saying what changed and offering the way back; the early offer ("Round 1 done." and its one line, no identity, colour, pips or chip); the theme switcher on the results page (Card Frames reachable, `localStorage` kept); the welcome (Rule 0, the lead line in plain words, start under it with "See all 31 results" beside it, the long paragraph in the fold, the resume anchor); the every-ten progress line (answers 10, 20 and 40 only, "10 answered, 35 to go." by the quiz's real length in every mode, the same line on a re-render, taken back with an undone answer); transitions that wait for Continue (with the real `showRoundTransition`, not the stub: "Round 1 done.", "Round 2 done.", "Round 3 done." and nothing else), the Round 3 line-up ("Round 3", one face-down card per result still in the running, one line counting them in words, "Start Round 3", the same in every mode, and the one random draw it still takes, which the seeded Round 3 shuffles depend on); every quiz-screen string free of colour, basic land and identity names, and none of the lines four fresh readers flagged on the front page and between the questions, bar the progress line and the line before Round 3, which a blind test kept; the free mulligan in all three rounds (it asks first, says it is taken, then used; state restored, only the final answer scored, the first answer and both response times on the record), "Free mulligan" for players and "Undo" otherwise, the rest of the wording shared; share beside the identity in the results banner, the only Share on the result screen; no colour cues while the rounds run (`NEUTRAL_SKY_DURING_QUIZ`: the sky's weights equal and no constellation through Rounds 1 to 3, the real weighting at the reveal, a reverted build tinting again, the Card Frames marks untinted); the stem shown once (all 48 Round 3 stems, no live hint, and a hint added for the test shown in the line above its stem); the instrument version (`i=11` in a built link, early results included). jsdom cannot lay out, so the on-screen fit is checked in a browser |
| `visible-copy.test.js` | the plain-copy rules on what a player sees between the rounds and on the result screen, rendered for real in plain, player and workplace modes: the three transitions, the Round 3 line-up for four to one results, the early offer, the calculating and pre-result screens, the question screen's own lines (the progress line, the undo and its confirm, Neither), and the result screen in twelve states (a clean HIGH result; LOW with a Round 3 cycle, a runner-up and a context disagreement, as a player once saw on a phone; LOW with a context disagreement; a scenario contradiction, a near tie and a width shift; each quality flag and all three at once; workplace; Magic off; an early result; five colours), a shared link, a peek and an appeal (a consumer peek's heading and appeal button a sentence and a plain action), the share text and the line over the colour cards; then, for all 31 identities, the line under the label (one sentence naming the result's colours and true to its bars, on seven bar shapes and three labels, and as rendered in plain and player modes), next door (a sentence in every mode, "Splash white and you're Selesnya." for players and "With white as well, you'd be Selesnya." otherwise; the up row saying how far short the added colour was, the down row naming its colour as the weaker or weakest of yours, never "your lowest colour" or "made the cut", and saying how far it was ahead of the nearest colour outside only when the line under the label did not count the gap, five colours' one row saying only which colour was weakest), every gap in the line and next door in points, the gap between the two bars as printed, never in answers, the commander block (player mode only; otherwise the banner credits the art in a sentence), the colleague cards under Working With Others on the result and in the explorer (one per missing colour, each line on one identity's page only, none of the traits and jargon readers caught, no sentence opening on "You", no opening word on more than six cards or twice on one page, a legend naming only the lines drawn), the theme switcher (its label, a sentence on a consumer page, and three names) and the whole page (none of the lines the second and third naive readers flagged, the scoring version only in the methodology, one Share, none of the work headings a consumer page dropped ("Strengths", "Shadows", "Natural Roles", "Working With Others", "Who to bring in", "White colleague", "View Full Breakdown", "Make an image") nor the labels three fresh readers heard as a slide deck ("Locked in", "Who you need around you", "Make a picture", "Explore All 31 Types", "Page style", "Pub banter", "Card art: ...", "Solid line: ..." and the rest), and the author's disclaimer line above the one about hiring and firing). A check fails on an em dash or an en dash used as a dash, a banned phrase, the scoring's workings, an identity code in capitals, an exclamation or question mark, "not X, it's Y", a US spelling, an unfilled placeholder, a sentence over 20 words, or a confidence block of more than the label (a sentence on a consumer page) and its one line, more than one quality line, or anything else before the bars; then, held to 25 words a sentence, what a player reads about an identity and the pages around the result: the profile blocks on the result screen for all 31 identities (tagline, philosophy, the `you` lines, banter, roles, commander and description, the player-mode card and every mana base line, the colour cards), the explorer with all 31 details in both audiences, the dossier's five tabs for all 31, the methodology and full breakdown under both engines with Round 2 and Round 3 shown, the colour-interactions screen with and without a result, and the share studio's three formats for all 31; there a check fails on the same dashes, banned phrases and scoring words (not on the methodology, whose subject they are, nor "enemy pair" for the colour wheel), "the real", an exclamation mark, a question mark outside a quotation, "not X, it's Y", a US spelling ("color" and the rest), an unfilled placeholder, a sentence over 25 words, or an identity code in capitals in the dossier's sentences; the identity names, the commander's printed type line and the card's rules text are read past as data, and so are the author's two lines that open Mono-Blue's `you` lines (the only em dash a page may carry); the `you` lines are held to two to four a page, no line opening on the same word as the one above it (the author's two aside), no colour named, no word from the game and Mono-Blue opening on the author's lines; the 31 profiles are also held to one voice (no "we", "us" or "our", no strength or shadow opening on "You" or "The", "you" in every `you` line, no year written out, no joke shape such as "the room" or "quietly", nor office prop such as meetings, quarters or the fridge, on more profiles than its limit, and a closing line on 22 profiles at most); the checkers (the line, unit, next-door, colleague-card, card-opening and voice ones too) are tested on the lines the pages carried before and on made-up lines. `--dump` prints what it read |

`fixtures/golden.json` changes only when scoring changes on purpose. Rewrite it
with `node tests/golden.test.js --update`, in a commit of its own, and say in
that commit what moved. `fixtures/seed-urls.json` is never regenerated: its
`urls` (old `?r=` form) and `previewUrls` (preview-page form) stand in for links
people have already shared.

The page's `Math.random` is one seeded stream per respondent, shared with the
shuffles in Rounds 1 to 3, so the golden paths also depend on how many draws the
page makes between questions: the Round 3 line-up takes exactly one (it used to
pick a line of banter; the banter is gone and the draw stays, showing nothing),
and `play.test.js` counts it. A wording change never moves the fixture; a draw
added or dropped does.
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

`node tests/simulate.js [--n 200] [--p 0.8] [--neither 0.05] [--seed 1] [--model ideal] [--engine 3] [--r3 variants] [--gaming] [--workers auto] [--out file] [--rows] [--five-band 20] [path/to/index.html]`
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
- `--engine 1|2|3` picks the scoring engine: 3, the likelihood engine, is the
  page's default; 2 boots the page with `?engine=2` (the likelihood engine with
  Round 3 answers weighed as in scoring version 2) and 1 with `?engine=1` (the
  win-rate engine). A list (`--engine 2,3`, or `--engine all`) runs them on the
  same respondents and prints them side by side with the change from the
  lowest, so a before/after comes from one build.
- `--seed` takes a comma list (`--seed 1,2`): the respondents of every seed are
  pooled into one report, so `--n 100 --seed 1,2` reports 200 per identity.
- `--gaming` turns the gaming toggle on for every respondent, which lets the
  Magic-flavoured items into Rounds 1 and 2.
- `--out` writes the JSON somewhere other than `tests/out/simulation.json`.
- `--rows` adds each respondent's seed, true identity, index and result to the
  JSON, so two builds run on the same respondents can be compared pair by
  pair.
- `--five-band N` sets the Five-colour band the checks and the report assume
  (the page's `FIVE_COLOUR_BAND`, 20 points), to measure a build that uses
  another.
- A path to another build's `index.html` (its `data.js` beside it) simulates
  that build, as the page tests do.

`--r3` (the likelihood engine, 2 or 3) compares ways of turning the Round 3
answers into the reported identity, on the same respondents:
`--r3 page,jaccard,symdiff+qg=0.55:0.75`. Each comma-separated variant is one
of these, or several joined with `+`:

- `page`: the build as it is.
- `q=X`: the Round 3 discrimination fixed at X. The page's
  `round3LogLikelihoods` gets `qGrid: [X]` wherever the page passes no grid of
  its own (as built it averages q over `ROUND3_Q_GRID`). The posterior decides
  the tiebreak questions, so each `q` runs the respondents on the page again.
- Round 3 models, which replace the page's `round3LogLikelihoods` with the
  simulator's own (`round3ModelLogLik`, written out there so a variant does not
  lean on the page's code) and so also run the respondents on the page again.
  A match's sign for identity S is s, from -1 to +1, and S's term for it is
  log(1 + (2q - 1) s), averaged over q (exactly the page's terms at s = +1, -1
  and 0):
  - `jaccard`: s = +1 when the winner's colours are closer to S's by Jaccard
    similarity, -1 when the loser's are, 0 on a tie: the page's own sign on
    engines 2 and 3, and the sign when none is named. On this build `jaccard`
    reproduces `page` (engine 3) exactly, and `jaccard+qg=0.55:0.9` reproduces
    engine 2.
  - `symdiff`: s from the colours where the winner and the loser differ: the
    share of them on which S agrees with the winner minus the share on which it
    agrees with the loser. A match between identities one colour apart counts
    in full; a split counts nothing.
  - `qg=A:B`: q averaged over A, A + 0.05, ..., B instead of the page's
    `ROUND3_Q_GRID` (with these parts, `q=X` fixes it at X).
  - `own`: a match counts only for the two identities that played it.
  - `cap=X`: no identity's Round 3 term more than X nats below the best one's.
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
often each was the true identity; what Round 3 did to Round 1 and 2's answer
(below), with the changes in the nested downgrades and in "bars say more" from
the first variant on the same respondents, with two paired standard errors;
and each label's share and accuracy with neighbourhood coverage. `--rows` adds
each variant's results respondent by respondent. The page's functions are
wrapped only under `--r3`; without it the run is the plain one above.

What Round 3 did to Round 1 and 2's answer, in every report: the lead is the
first candidate Round 3 played, which on the likelihood engine is the one of
the four the bars allow that the Round 1 + Round 2 posterior rates highest
(Round 3 can report no other). The report gives how often the lead was the
true identity; how often the result is not the lead ("overturned"), and how
often the result, and the lead, was then right; how often the result's colours
are a proper subset of the lead's ("nested down") or a proper superset ("nested
up"), with the same two shares; and how often the bars say more than the name:
the result leaves out a colour whose printed bar is at least 50 and at least 25
points above every other colour it leaves out (a result of one to three
colours; the bars always allow the result with that colour added), with how
often the result was right. Each respondent's lead, and the Round 1 + Round 2
posterior's leader over all 31 identities (`r12Top`, `r12Leader`), come from
`_lib/respondent.js`.

Each report gives exact recovery per identity and per type (final, and Round 1's
top candidate alone), enemy-pair guilds (Orzhov, Izzet, Golgari, Simic, Boros)
against allied guilds, neighbourhood coverage (how often the true identity is
the result, the result plus its strongest unlit colour, or the result minus its
weakest lit colour, read from the final activation as the results screen does),
each confidence label's share and accuracy, how often the early-result offer
appears and how often the identity it offers is the true one (simulated
respondents always decline it), the result against its own bars, Five-colour,
and the top confusions. "Against its bars" reads the final activation as the
results screen draws it: a result's distance from its bars is the strongest
colour it leaves out minus the weakest colour it holds (for all five colours,
the spread of the five, strongest minus weakest, minus the Five-colour band),
and the report gives how often that is over one answer (1/12 of a bar) and
over half an answer on the bars behind the screen, and above zero on the bars
as printed (whole percentages, recorded on the page as it prints them: a
colour it leaves out printed above one it holds, or five colours printed
further apart than the band). "Five-colour" gives its recall (true
Five-colour respondents told Five-colour), precision (Five-colour results that
are right), how often it is given, where the true Five-colour respondents go
otherwise, and how often the printed bars sit within the band, of everyone and
of the true Five-colour respondents (the JSON keeps the spread of each, 0 to
100 points, so another band can be read off). The band is the page's
`FIVE_COLOUR_BAND`, which the simulator holds its own copy of (20 points);
`--five-band N` measures a build that uses another.

The run exits with status 1 if the page logs an error or any result breaks the
`state.result` contract in `docs/SCORING_CONTRACT.md`: an identity, a
confidence label, `scoringVersion` equal to the engine, `instrumentVersion` 9,
under engine 2 a posterior over all 31 identities that sums to 1, an identity
its bars allow as printed (no colour it leaves out printed above one it holds;
for Five-colour, the five printed within the band), and an early offer the
Round 1 bars allow the same way.

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

# Round 3 coverage

`node tools/round3-coverage.js [--n 4] [--seed 1] [--models ideal,misspecified,mixed] [--p 0.65,0.8] [--engine 2] [--top 40] [--json file] [path/to/index.html]`

It runs the simulator's respondents (by default four per identity for each of the
three models at p 0.65 and 0.8) through the real Rounds 1 to 3 and counts the
Round 3 questions a short situation covered (`POOL_B`, `POOL_C`) against those
that fell back to a 31-answer list (`ROUND2_SCENARIOS`), per model and p. Then
it lists the pairs left to the lists, most frequent first, each with how many
short situations cover it at all (none, or all used up by earlier matches of the
same Round 3). It checks nothing, and exits non-zero only on a page error.
