# Changelog

Newest first. Dates are when the work was committed.

## 2026-10-19

### Round 3: the old short situations rewritten

A fresh reader went through all 93 Round 3 situations blind and judged 34
machine-made, 53 small-stakes and 30 as needing you to chair, coach or run
something. Every flagged short situation was one of the older entries (the
first two of each guild and three-colour identity, 33 in all); none of the 45
written on 18 Oct was flagged. The tells: a clipped command followed by a
short moral line ("Nobody will miss most of it"), the same few words again
and again (quietly, hard, properly, rally, rig up), the same temperaments in
every situation, so lines repeated ("a little at a time" in five), and nothing
concrete enough to picture.

- 38 situations rewritten, stem and answers: the 33 flagged, and five old ones
  with the same faults that the reader passed (the volunteers you organise,
  the wedding marquee's organiser and its "Rally everyone", the house move's
  "Nothing fancy." and "Let it go.", the rowing club's clipped answers, whose
  stem stays, and the pub quiz you run). They are set at home, in money,
  family, friends, neighbours and health, with one club you merely play for:
  a grandmother's two rings among seven grandchildren, a syndicate win of
  £40,000 when two friends hadn't paid, an electricity bill doubled to £280,
  a garden that floods since the estate went up, fifteen years of Sunday
  lunch at your mum's, £20,000 on five credit cards, a stolen car and six
  weeks till the insurer pays, a will with one child well off and one
  struggling, £8,000 under the floorboards. No stem gives the player a role.
- Each answer is a different course of action in plain words, of uneven
  length, some one sentence and some two, with no closing moral and none of
  the stock words. Before writing, a worksheet set down what each identity
  would want in the situation and the one line between the owner and each
  rival. Answers were checked against the other 55 situations for recycled
  lines, and a phrase two answers of one identity shared was changed.
- Grixis against Dimir, the house with two bidders. Two runs of the real
  quiz as a person who understands a thing before committing and then acts
  fast, openly ambitious and comfortable with leverage, both met this match,
  took Dimir's old answer ("Work out quietly what the seller most wants")
  over Grixis's ("Make one strong early offer, on terms that make theirs look
  weak"), and the result flipped to Dimir. Now Grixis finds out what the
  seller needs and offers exactly that today, with a deadline; Dimir keeps in
  with the agent and lets the other couple push their luck; Rakdos goes over
  the asking price because it loves the house. Every three-colour situation
  follows the same rule: the wider identity's answer is the guild's own good
  answer plus the colour it adds, never the rash or showy one.
- Four answers in the four-colour situations lose a stock word: "Rig up a
  live link", "Cost it properly", "quietly pay a gardener" and "Rally the
  town".
- Checked blind in three rounds, each fix made between them. A fresh reader
  each round saw the 38 new situations shuffled among 8 of the 18 Oct entries
  as controls, with the questions the first reader was asked: read as a
  person's 22, then 25, then 27 of the 38 (machine-made 2, 1, 1; vague 2, 0,
  0; needing a role 3, 2, 1), against 7, 8 and 6 of the 8 controls. Each
  owner-against-rival pair was also answered once as each side, the person
  given in the product's own words for the identity ("You believe..."): 166
  and then 170 of 170 picks went to the person's own answer. A first version
  of that check, with persons built from plain colour traits, matched 69% and
  found Naya and Selesnya reversed on the flood; that and the other pairs
  players meet most were fixed. At merge, two readers comparing old and new
  lines blind preferred the new in 94% of pairs, and a fresh read of all 93
  went from 35 to 83 read as a person's.
- Scoring unchanged: every situation keeps its owner, its place in its pool,
  its number of answers, each answer's identity key and the answer order.
  `tests/fixtures/golden.json` and `tests/fixtures/round3-keys.json` do not
  move, and `tools/round3-coverage.js` prints the same report before and
  after, line for line: 96.9% of 4,166 Round 3 questions get a short
  situation. `npm test` passes, 667 checks; `tests/round3-copy.test.js`
  needed no change.
- Left alone: the amateur dramatics group losing its dates and the Spanish
  for a job in Madrid, which the reader passed and which carry none of the
  faults; the six flagged 31-answer situations (`ROUND2_SCENARIOS` in
  `data.js`), outside this change; and stock words in later entries written
  on 18 Oct ("hard" twice, "properly", "proper", "gently", "patiently",
  "calmly"). The rowing club, whose stem was kept, is still read as small
  stakes; it is the one situation the last reader called machine-made.
- The instrument version stays 10. Every earlier question rewrite raised it;
  with other branches changing the questions at the same time, it is best
  raised once when they are merged.
- Not measured: real players. The readers are models, and the persona check
  answers in character from one paragraph per identity. The last two answers
  changed (Grixis and Rakdos on the house bid) had no blind read of their own.

### Red answers: conviction, not impulse

A classification test had a model play the live quiz, with no colours and no
key, as a person who runs their own affairs and plans a long way ahead,
understands a thing and then acts quickly, is ambitious and comfortable with
power, plays for big outcomes, feels things strongly and acts on it, and has
little patience for process or tradition. The author places that person at
Blue-Black-Red. Two runs both came out Blue-Black, with Red at 54% and 53%. On
the Blue-Red questions the person took Blue five times in six, because Red was
written as impulse ("No plan at all", "Yes, tonight. I know how I feel", the
roof window they could already see themselves waking up under), and Black over
Red on both Black-Red questions for the same reason (learning to fly, renting
where they love). Against White, where Red is candour and conviction, they
took Red every time. So the quiz found Red only in people who act rashly, the
same fault the author had already caught for Black.

- Blue-Red: all 13 items in `POOL_A` (11 ordinary, 2 Magic) are rewritten.
  Red is what a capable adult does on conviction: has the lump out, scar and
  all, rather than carry it round for six months, starts on the builder's
  sketch because his other lofts are good, says yes because living together
  answers the money-and-rows question faster, rings the friend tonight, backs
  its own read of the field. Blue needs to understand or verify first, and the
  situation shows the price: the other buyer at five, three months on the
  loft, a friend who signs on Friday, an ex who may not wait, a speech read
  word for word. No Red answer is "no plan" any more.
- Black-Red: all 10 items in `POOL_ALLY`. Red says the true thing there and
  then, backs its own work or idea, or takes the risk with its eyes open (an
  equal share in the restaurant, the idea sat on for years, the whole prize).
  Black plays for position and pays in deferral: a loan with the right to buy
  in later, five dull years before the boom, a name before the work it wants,
  twenty years of leaving the money alone. The prize split and the £400 deck
  now give Black a position play (sixty-forty while the opponent is nervous,
  a stronger deck later) where it read as caution and every reader took Red.
- Red-Green: two Magic items had impulse for Red (buying whichever card you
  love today, jumping at a new league). Red now sells cards it hoped to keep
  to buy the one it saved for, and takes the league to start again with new
  people. The other eight Red-Green items and all the White-Red ones already
  read as conviction and are kept.
- 25 items changed (12 stems, 48 answers, no labels). Ids, pairs, weights,
  answer colours and order are as they were, so the seeded draws and
  `tests/fixtures/golden.json` do not move, and
  `tests/fixtures/round12-keys.json` is untouched.
- Checked blind. Readers answered all 111 Round 1 and 2 questions in a
  shuffled order, answers unlabelled, in character. As the person above, on
  the old items they took Blue on 9 of the 13 Blue-Red questions; a first
  draft overshot to Red on 11; the final text gives Blue on 6 and 7 in two
  runs, and Black on 6 and 4 of the 10 Black-Red questions (5 before). Their
  colours came out Blue 64% and 69%, Black 86% and 82%, Red 73% and 76%,
  against White 16% and Green under 10%. Controls held on the final text: a
  careful analyst took Blue on all 13 Blue-Red questions, a passionate free
  spirit Red on all 13 and on all 10 Black-Red ones, and a strategist Black on
  all 10 (8 on the first draft, before the prize split and the deck were
  fixed). A critic held every item to the brief and its fixes are in: Her
  Story was lopsided (she is now "ninety and still sharp"), Second Chance's
  Red undercut itself, the car's and the speech's Blue cost nothing, and
  shapes and phrases repeated across the set.
- The question counter said "of 45" through Round 1 and then, for someone
  with no close enemy pair (a Round 2 of 7 questions), "of 43" from Round 2 on.
  Simulated respondents get a Round 2 of 9 about three times in four and 7 or 8
  otherwise, so no Round 1 estimate fits everyone. The counter now reads
  "Question x of up to 45" from start to finish: the welcome's figure, raised
  only when a 10-question Round 2 or a Round 3 tiebreak makes the quiz longer,
  never lowered (`counterTotal`). The progress line still counts what is left
  by the real length. `tests/play.test.js` checks the line, that the figure
  never drops, and a Round 2 of 7 and of 10 and a tiebreak (P2a, P2c, P2k,
  P2l); P5a counts the progress line by the real length.
- Instrument version 10: `INSTRUMENT_VERSION` is 10 and a result built now
  writes `i=10`. The contract line, the simulator's constant,
  `tests/play.test.js` and the tests README say so.
- Not measured: real players. The readers are models answering in character
  and the simulator answers by colour keys, so neither shows whether real
  Blue-Black-Red players now land there. Not checked in a browser: the longer
  counter line, which by the stylesheet's widths still leaves Undo beside it
  on a 375px screen in Blind Draft.

### Round 3: short situations for the matchups players meet

Round 3 plays the top four candidates against each other, and for each match
the page first looks for a short situation written for that pair, falling
back to one of the eight situations with an answer for each of the 31
identities. Naive readers have taken the short ones for a person's writing
and the lists for slot-filling, yet only 18% of the Round 3 questions
simulated players met were short ones. The reason is the line-up: the bars
allow only their top colours, so the four candidates are nearly always a
chain, one colour inside two inside three inside four (Mono-White, Selesnya,
Bant, four-colour without red). The 40 short situations covered one link of
that chain, two colours against three, and pairs that never meet, such as
two guilds.

- Measured first: `tools/round3-coverage.js` runs simulated players (the
  ideal, misspecified and mixed models at p 0.65 and 0.8, four per identity
  each, 744 in all) through the real rounds and counts the Round 3 questions
  a short situation covered, per model and p, with the pairs left to the
  lists, most frequent first. Before: 18.2% of 4,166 questions (17.0% to
  19.5% by model and p). After: 96.9% (95.2% to 99.1%). On three other seeds
  with two to three times the players, every model and p stays between 94.8%
  and 99.3%. What is left is mostly five colours against the rest, which
  keeps the lists.
- 45 new short situations, 165 answers, cover the other links: each guild
  against its two single colours (10, the third entry of each guild in
  `POOL_B`), each three-colour identity against its three (10, the third in
  `POOL_C`), and each four-colour identity against the single colours, guilds
  and three-colour identities inside it (25, five each, new `POOL_C`
  owners). They are set at home, in money, family, friends, neighbours,
  health and clubs: a mother who can't manage the stairs, a boiler dead in
  January, a builder's leaks, a friend on the sofa, an allotment plot at
  risk, a wall a foot over the boundary, a premium bond. No stem puts the player in charge
  of anything.
- Neighbours do different things: where an answer and its rival differ by
  one colour, they choose different courses, never the same course for
  another reason or the first step of the other's plan (the dead boiler:
  have a go yourself tonight, order the part the engineer will need, ring
  round until an engineer comes today). The four-colour answers carry what
  they lack and one more of their colours: without red waits, without green
  starts again, without white goes ahead without permission, without blue
  acts before it plans, without black gives with nothing in it for itself.
- Scoring unchanged: each new pair has exactly one situation, and no two
  answers in one situation can meet in the same chain, so every match finds
  its situation unused and the tiebreak, which needs a second unused
  situation on its pair, fires exactly as before. `tests/fixtures/golden.json`
  does not move, and `tests/simulate.js` (12 per identity, all three models,
  p 0.65 and 0.8, both engines) gives every one of 4,464 players the same
  result and prints the same report. The comment above
  `getPoolScenarioForMatchup` says why a second situation on one of these
  pairs would change scoring.
- Checked as it was written: three rounds, each with a fresh naive reader
  who met each pair as a player does and a blind step that matched each
  answer to the five colours. Situations read as written by a person went
  from 30 of 45 to 42, then to 38 once the four-colour answers were pushed
  to carry a second colour; that round's flags (an architect on £12,000,
  suing a firm in administration, a safety worry the stem never named, a
  backstory handed to the player) are fixed, and the fixed text has not
  had a read of its own. In the blind matches 85% to 93% of answers read
  inside their own colours, and the pairs where the narrower identity's
  answer stays inside its colours while the wider one shows a colour the
  narrower lacks went from 73% to 63% to 76% (one reader a round, so the
  figures are rough).
- Instrument version 9: `INSTRUMENT_VERSION` is 9 and a result built now
  writes `i=9`. The contract line, the simulator's constant,
  `tests/play.test.js` and the tests README say so.
- Tests: `tests/fixtures/round3-keys.json` gains the new scenarios' keys, in
  its own commit; `tests/round3-copy.test.js` counts 93 scenarios and 543
  options, and every rule still holds; `tests/play.test.js` renders all 93
  stems. The tests README describes `tools/round3-coverage.js`.
- Not done: five colours' matches (about 2% of questions) and the old engine
  (`?engine=1`, whose line-up is not a chain: 44% short before, 67% after)
  still meet the lists. The four-colour answers still often read as their
  loudest colour alone, and five of the 45 stems are set in a club or a
  band, which some readers find narrower than home or money.

## 2026-10-18

### Questions: second naive-reader round

Fresh naive readers on three models read the plain text of every question
again, with no colours and no key, and a blind step matched the people they
described to the five colours. Against the first round, obvious answers fell
from 26 to 12, low stakes from 13 to 5, lopsided or one-sided splits from 10
to 2 and flagged Round 3 answers from 35 to 14, but 62 of the 111 Round 1
and 2 questions still failed. 21 of them, and 22 of the 48 Round 3
situations, assumed a job, a business or a work team, which strands anyone
without one now that the hint lines are gone. Readers recognised each
answer's colour a little less often (86%, from 88%), because many answers
had lost their reasons: Red read as Green or Black, Green as Red, White or
Blue, and Blue as Black or White. The template still showed: "do X, and do
Y", an action and a reason, answers opening on Keep, Stay or Leave, rules
against gut and data against feeling again and again, and in Round 3 "X,
then Y" and "Keep it simple".

- Work: the 21 Round 1 and 2 questions that needed a job are set elsewhere:
  a hip operation on the waiting list, a council flat, a plot next door, a
  rent strike, a degree and a band on tour, a town council seat, a
  scholarship, a wealthy aunt's offer, a sixteen-year-old who wants to be a
  chef, a doorbell camera, a painting in the attic, a charity carnival. Four
  of the 91 non-Magic questions still sit at work, all choices open to
  someone without a job (a choice between two job offers, starting a
  business, a careers test, a placement before law school). In Round 3 all
  22 work stems moved to a town festival, a club's savings, a booking gone
  wrong, a friend who broke a confidence, a bank, a wedding marquee, a house
  move, a choir, a local team, a volunteer café and the like; the one stem
  left that mentions a job is the Spanish a job in Madrid needs. No hint
  line came back.
- Colour: each of the 31 answers readers did not recognise (on 29
  questions) carries its colour's motive in the action or a short, specific
  reason. Red acts now on feeling or conviction ("Have it out now. My gut
  says don't wait", the classic car that makes you grin, speaking at the
  funeral whatever is planned). Green waits, belongs or lets things grow
  (the tree stays, the band gets there at its own pace, the novel finds
  readers by word of mouth). Blue finds out, checks or studies. Black says
  plainly what it wants (ambitions, a step up, a better deal for me). White
  goes by the rule, the vote, the turn or the promise.
- Obvious, low stakes, lopsided, both at once: all 19 questions flagged for
  these are rewritten. The pairs readers would have done together now
  exclude each other: the board meeting is a painting sold this week or
  researched for a year, the first home is a flat you have researched or one
  going cheap, the apprentice is a tree or solar panels, draft practice is
  the old way or the ratings.
- The template: answers opening on Keep, Stay or Leave fall from 32 to 17,
  "X, and Y" answers from 61 to 51 and "then" from 7 to 2; reasons come
  first, follow "because" or "so", or are left out where the action says it.
  In Round 3, "then" is gone from all 378 options (32 before), ", and" joins
  fall from 70 to 51, and "Keep it simple" is gone.
- Round 3: 29 of the 48 stems and 283 of the 378 options changed, the 14
  flagged answers among them. In the eight lists of 31, neighbouring
  identities, the ones a match usually pits against each other, now say
  different things (Dimir keeps quiet where Sultai repositions, Mono-Blue
  finds out where Azorius writes the rule), the near-duplicates and repeated
  phrases ("whichever works", "find out quietly", "from now on") are split
  up, and the five-colour answers no longer open on "Depends". The vague
  stems are concrete: a storm that cuts off a village, a footbridge, a
  library.
- Checked before handing over: three rounds of two naive readers each (and
  one Round 3 reader each) read the rewrite as it went, a blind step matched
  two of those rounds' descriptions to the colours, and every round's flags
  were fixed. In the last round the blind match recognised 91% of answers;
  those were working checks, not the full measurement, and the final version
  has not had a read of its own.
- Unchanged: every id, pair, weight, answer colour, identity key and order,
  so the seeded draws and `tests/fixtures/golden.json` do not move, and both
  key fixtures are untouched.
- Instrument version 8: `INSTRUMENT_VERSION` is 8 and a result built now
  writes `i=8`. The contract line, the simulator's constant,
  `tests/play.test.js` and the tests README say so.
- Not done: the comment in `showTournamentQuestion` still says 15 of the 48
  stems show a hint; it is outside this change. The twenty Magic items still
  lean on the game's words, which non-players flag, and readers still see a
  shared shape (a short action and its reason) across the set.

### Result screens: third naive-reader round

The 31 result screens went back to three naive readers, as a player and as a
non-player sees them. Pages read as written by a person rose from 70 to 83 of
93 and flags fell from 261 to 147: vague 46, repeats itself 27, contradicts
itself 19, a forced joke 12, machine-written 12, insulting 10, too long 10,
jargon 7, no sense 4. The line under the label counted in answers above bars
that print percentages, so "All five colours finished within two answers of
each other" sat over bars 14 points apart. Next door's "Blue was your lowest
colour" sat beside a blue bar of 80%, and "Green made the cut easily" sat in
the slot for the colour you would drop. Strengths and shadows are notes with
no subject, and the closing line under them switched to "You ...": readers
had the page as text, lost the box's "Pub banter" label, and saw every page
end on a joke. The colleague cards opened the same way for each colour on
every page ("Talk to them when ...", "Check with them before ..."), and the
same office props came round (the meeting about the meeting, a vote about a
vote, the fridge and cake rules, reply-all, quarters, favours).

- Units (`RESULT_COPY.confidence`, `RESULT_COPY_VERSION` 6). Every gap is in
  points, the difference between two bars as printed: "White nearly made it
  in, 5 points behind red.", "Black led white by 5 points.", "All five
  colours finished within 14 points of each other." The thresholds stay one
  answer (8 points) for "nearly made it in" and three (25) for "well". Next
  door gives the same gaps in the same unit.
- Next door (`RESULT_COPY.nextDoor`). The up row says how far short the
  added colour was ("Your white was 5 points short."; "well short" is gone).
  The down row names the dropped colour as the lowest of yours: "Red was the
  lowest of your three colours.", "Black was the lower of your two colours."
  When the line under the label said only "well behind", it also says how far
  that colour was ahead of the nearest one outside: "Blue was the lowest of
  your three colours, 40 points ahead of white."
- Banter. The box's label is text, not a CSS `::before`, so a copied page or
  a screen reader keeps it, and 11 profiles have no closing line and no box
  (Mono-Black, Mono-Green, Azorius, Golgari, Grixis, Jund, Naya, Mardu,
  Four-colour without white and without blue, Five-colour), among them the
  eight flagged as insulting or forced. Three are new: Mono-White's dress
  code, Dimir's "You know who's leaving before their manager does.", Bant's
  lunch order. The share Card falls back to the description.
- Who to bring in (`COLOR_GAPS`). 66 of the 75 lines are new, built
  differently from one another: no opening word on more than six cards, none
  twice on a page, none echoing its own page (Gruul's manual, Rakdos's
  restlessness, Boros's facts). Five colours: "Every colour is in your
  result, so there's no gap to fill. Before a big decision, ask someone with
  one strong view to argue it hard." The legend's dashed line is "one of your
  colours and a missing colour that pulls against it."
- Profiles (`data.js`). Every flagged line is cut or rewritten. Strengths and
  shadows went from 218 to 204: 154 word for word, 50 new or rewritten. The
  five notes that had their own subject ("The transition was discussed in
  March") are cut or rewritten as notes about the person. Seven philosophies
  changed (Mono-Green, Selesnya, Orzhov, Dimir, Rakdos, four-colour without
  green and without black), eight taglines ("Ambition Without Apology",
  "Together, Slowly", "Rules That Pay", "Knowing More Than You Say", "The
  Long Game", "Everybody In", "Whatever Works", "All of the Above") and seven
  lists of roles. FOUR-COLOR and FIVE-COLOR are FOUR-COLOUR and FIVE-COLOUR,
  as the rest of the page spells them. Across what a result page says about
  an identity, meetings went from 13 profiles to 6, quarters 5 to 1, favours
  4 to 2, emails and reply-all 6 to 3, a crisis 5 to 3; the fridge, the cake
  and the vote are gone.
- Commander. Six rules-text jokes no longer repeat the card below them
  (Mono-White's +2/+2, K'rrik's life, Omnath's mana, Augustin's tax, Samut's
  haste) or say nothing (Esper's artifacts: "Your decisions can't be
  overturned by a show of hands."). Eight descriptions are rewritten in words
  ("one white mana" for {W}): the five readers found too long or senseless
  (Meren, Alesha, Samut, Trostani, Breya), Augustin's, which repeated its
  joke, and Rakdos's and Karador's, for their symbols. Four and five colours
  count their basics as one number ("six shocks, four Triomes and 23
  basics").
- 13 link previews in `r/` are rebuilt. Not changed: ids, data keys,
  colours, commanders, scoring and the question pools; the golden fixture
  does not move.
- Tests: `tests/visible-copy.test.js` (149 checks, 11 new) holds every gap in
  the line under the label and next door to points, the gap between the two
  bars as printed, never answers; next door's down row to "the lowest of
  your N colours", never "your lowest colour" or "made the cut", with the gap
  only where the line did not count it; the colleague cards to varied
  openings; the page to none of the third readers' flagged lines
  (`ROUND3_FLAGGED`); and the 31 profiles to limits on office props
  (`PROP_LIMITS`), no list note opening on "The", the banter box and its label
  on profiles with a closing line, and closing lines on 22 profiles at most.
  Run against the previous build it fails 19 of its 149 checks.
  `render.test.js` and `seed.test.js` follow the new copy.
- Not done: these pages have not had a reader of their own. Taglines still
  mostly read "X Through Y".

### Result screens: second naive-reader round

The 31 result screens, rendered to text as a player and as a non-player sees
them, went back to three naive readers on three models. Pages read as
written by a person rose from 26 to 70 of 93 and "makes no sense" fell from
153 flags to 6, but "sounds machine-written" rose from 23 to 120, and 93 of
those were three lines on every plain page: the bare next-door rows ("Add
white: Selesnya."), the commander block's stand-in ("The Magic: The
Gathering card matched to Mono-Green. The art at the top of the page is from
it.") and the footer's "Scoring version 1". Readers also caught the same
colleague blurbs on page after page, the diagram's legend, the page-style
note, two Share buttons, one gap counted as "less than an answer behind" in
one line and "one answer short" in the next, Five-colour "Locked in" beside
"Green only just made the cut", a sudden "we" in the closing lines, and joke
shapes that recur from page to page (the room, quietly, exact years, acting
while everyone else is still at something, a closing line turning on ", and").

- Next door (`RESULT_COPY.nextDoor`, `RESULT_COPY_VERSION` 5). Plain mode
  says each row as a sentence: "With white as well, you'd be Selesnya.",
  "Without red, you'd be Simic."; player mode keeps "Splash white:
  Selesnya.". Each reason reads the same two bars as the line under the
  label (`barGap`): the up row counts the gap in that line's words ("Your
  white was less than an answer short." under "less than an answer
  behind"), and the down row says only "Red was your lowest colour.", so the
  count is said twice on a page, not three times. A tie and an old link's
  inverted bars are said as they are ("Your green finished above black."),
  where both used to print "one answer short". Five colours' one row says
  "Green was your lowest colour.".
- The line under the label: within about one answer, "Blue nearly made it
  in, less than an answer behind black."; further off, "Green came next, one
  or two answers behind black."; one colour, "Black led white by about one
  answer."; five colours, "All five colours finished within two answers of
  each other.", which is the reason for that result, where it had named the
  highest and lowest colour.
- The commander block is player mode only. Everyone else gets "Card art:
  Omnath, Locus of Mana" in the banner, where "Commander ·" stood, and
  Natural Roles at full width.
- "Scoring version 2." closes the methodology under "View Full Breakdown",
  in every mode, and is gone from the footer.
- One Share, the one beside the identity: the action row's "⚜ Share my
  result" is gone and "Make an image" leads the row. The page-style switcher
  is its label and three names; its note about Card Frames is gone, as the
  note before it went.
- Working With Others. The legend is a key: "Solid line: two of your colours
  that get on.", "Dashed line: one of your colours against one you lack.".
  Who to bring in has one line per card, written for the identity
  (`COLOR_GAPS`, 75 lines), in place of a shared "what they bring" blurb and
  20 lines keyed by colour pair: no two pages print the same card, and none
  echoes its own page word for word. The mono pages keep 16 of the 20 old
  lines. The card's plus is drawn by CSS, its arrow gone. Five colours: "None
  of the five colours is missing from your result. Before a big decision,
  ask someone who will argue hard for one side."
- Profiles (`data.js`). Every line readers flagged as insulting, jargon, a
  forced joke, vague, too long, contradictory or repeated is cut or
  rewritten. 17 closing lines are new, among them the three with "we" or
  "us" (the surprise party, Dune's email, Boros's watches) and the stingers
  (Dimir's three attempts, Golgari's cycles of life, Glint's expenses
  policy). 13 philosophies changed, 8 in their first sentence: the four that
  opened on a list of their colours (Bant, Esper, Abzan, Four-colour without
  red), Rakdos's "too afraid to live", Boros's "some things are worth
  fighting for", Sultai's "strategic positioning" and Glint's "ethics".
  Power Through Ruthless Action is Power Through Pressure, and Innovation
  Without Nature is Innovation Without Nostalgia. Strengths and shadows went
  from 255 to 218: 132 word for word, 86 new or rewritten, 37 cut. Profiles
  using "the room" went from 12 to 2, "quietly" from 6 to 0, "everyone else"
  from 13 to 5, acting before or while others finish from 5 to 0, a year
  written out from 4 to 0, "we", "us" or "our" from 5 to 0, and closing
  lines turning on ", and" from 13 to 4. Ten roles lists lost jargon and
  repeats ("Mission Nonprofits", Dune's "Operations" twice). Rules text:
  Mono-Blue has "Hexproof from small talk" (feedback contradicted its
  "Updates their position when the evidence updates"), and Jeskai attacks
  "exactly as rehearsed". 10 link previews in `r/` are rebuilt.
- Not changed: ids, data keys, identity names, colours, commanders and their
  descriptions, the label words, scoring and the question pools; the golden
  fixture does not move.
- Tests: `tests/visible-copy.test.js` (138 checks, 12 new) renders all 31 in
  plain and player modes on seven bar shapes and holds next door to the line
  under the label (the sentence or colon headline by mode, the up row's
  count, a down row that never counts again, five colours' one row), each
  colleague card to one page, the whole page to none of the lines the second
  readers flagged (`ROUND2_FLAGGED`), the scoring version to the methodology
  and Share to one button; and the 31 profiles to one voice (no "we", "us"
  or "our", no strength or shadow opening on "You", no year, and limits on
  the recurring shapes). The colour lists the rhythm rules kept are gone,
  and the checkers are tested on the pages the second readers saw. Run
  against the previous build it fails 13 of its 138 checks. `render.test.js`,
  `play.test.js` and `seed.test.js` follow the new copy and the one Share.
- Not done: readers saw only the result screen, so the explorer, the dossier
  and the share studio, which print the same profiles, were checked by the
  tests alone. Natural Roles are still lists of jobs. This version has not
  had a reader of its own.

### Questions rewritten from naive readers

Five naive readers on three models read the plain text of every question,
with no colours, no answer key and no idea what the quiz measures, and said
what each one asks, which answer most people would pick, whether anyone would
hesitate and what kind of person picks each answer; a blind step matched
those people to the five colours. 53 of the 111 Round 1 and 2 questions
failed: one answer was the obviously decent or sensible one (26), little was
at stake (13), the split was lopsided (10), or an answer's motive read as
another colour's (Red read as Black 16 times, Blue and Green as White 14 and
11 times). Where a Black answer lied or hid (the survey, the successor, the
developer, the hidden mistake) the other answer became the decent one. In
Round 3 both readers flagged 35 of the 378 options as obviously best, a
confession or a joke, and the lists of 31 held near-duplicates. Every reader
said the set reads as built to a template: a short decision and a neat
reason, reasons that are sayings nobody says aloud, the same hint lines, the
same themes.

- Rounds 1 and 2: all 111 items changed (67 stems, 33 labels, 203 of the 222
  answers). Both answers are now ones a decent, sensible person could pick,
  with something real at stake, and each motive is its own colour's: Red
  acts on feeling, conviction or freedom, never for advantage; Blue wants to
  understand and get it right, never fairness; Green is patience, acceptance,
  tradition and roots, never fairness; Black is ambition a capable person
  would admit to, never a trick or a confession; White is fairness, rules,
  duty and the group. The items where Black lied or hid are rebuilt so both
  sides are open (the developer is a street selling together, the successor
  an offer from the boss), and the ones failed for low stakes now risk a
  home, a career, a child's schooling or a family's money.
- The template: 58% of the Round 1 and 2 answers, and most Round 3 options,
  are now the choice in plain words, with no reason. The reasons left are
  about the situation, never a saying, and no answer ends on one. Answers run
  from two words to twenty and take different shapes: an action, words said
  aloud, a reason first, a condition. "I'd rather" and "rather than" are
  gone, and Round 3 no longer joins two actions with "and" as a rule.
- Themes: no contrast appears in more than four or five items. Informal
  against formal groups is down from seven to three and speaking up now
  against holding back from about ten to five; tradition against change and
  checking first against leaping are four or five each. Where readers said
  they would do both answers, the stem now forces a choice (one evening, one
  fix, one free week, a deadline today).
- Hints: none. `CONTEXT_HINTS` is empty. Before, 23 Round 1 and 2 items and
  15 Round 3 stems showed one of six lines. A first cut to nine lines, each
  in its own words, still read to every reader as patches stuck on the work
  questions, and every stem is a situation anyone can picture. The Round 3
  stems that said "your team" now cast you in a role. The mechanism stays.
- Round 3: all 35 flagged options are rewritten, and 366 of the 378 changed.
  In each list of 31 every identity has its own move, read from its
  philosophy in `PROFILES`; the clusters readers saw (own it, attack the
  leader, build a cleaner version, take a week) are split up, and the
  aphoristic endings are gone. 21 of the 48 stems changed: the four that put
  little at stake (a skill to learn, a process that works, a vague shortcut,
  a club's decision rules) now have something riding on them, MTG_STALL
  names the title at stake, and the Magic items say "games group" for
  "playgroup".
- Checked before handing over: five fresh readers read a first version of
  this rewrite, and their flags shaped a second pass. The second version has
  not had a full read of its own.
- Unchanged: every id, pair, weight, answer colour, identity key and order,
  so the seeded draws and `tests/fixtures/golden.json` do not move, and both
  key fixtures are untouched.
- Tests: `tests/round12-copy.test.js` expects no hinted item and gains C5c,
  no hint line repeated; `tests/play.test.js` checks that no live Round 3
  stem shows a hint, and adds one for the test alone so the eyebrow line is
  still exercised.
- Instrument version 7: `INSTRUMENT_VERSION` is 7 and a result built now
  writes `i=7`. The contract line, the simulator's constant,
  `tests/play.test.js` and the tests README say so.
- Not done: the comment in `showTournamentQuestion` still says 15 of the 48
  stems show a hint; it is outside this change. About a fifth of Round 1 and
  2 items still sit at work, and the twenty Magic items still lean on the
  game's words, which non-players flag.
### Result screens rewritten from naive readers

All 31 result screens, rendered to text as a player and as a non-player sees
them, went to three readers who knew nothing about the quiz: 93 readings.
They liked the philosophy lines, the specific strengths and shadows and the
joke rules text, and flagged the frame around them: "makes no sense" 153
times, "vague" 98, "corporate jargon" 57, "contradicts itself" 54, "repeats
itself" 48, "insulting" 48. Every page said "Fairly clear. Your nearest
neighbour is next door.", the five-colour page included; the same What's
Missing paragraph told Mono-White it moves on instinct and Mono-Black that its
decisions defer; and many closing lines were insults ("You're slimy",
"Apparently rules are for suckers", the kidneys, the spreadsheet).

- The line under the label (`confidenceLine`, `RESULT_COPY.confidence`) is one
  sentence about this result's own bars, the same in both modes and read from
  the bars alone, so a shared link reads as it did: "Blue and black were well
  clear of the other three colours."; "The nearest colour outside yours was
  green, one or two answers behind black."; "Red led, with black about one
  answer behind."; "White was your highest colour and green your lowest, about
  one answer apart."; a tie, and an old link whose bars put a colour outside
  the result above one in it, have their own lines. Answers are counted as
  next door counts them (a twelfth of a bar), in words, never as a number.
  "Still shuffling" on bars that were clear adds "but your answers fitted more
  than one result". The labels themselves are unchanged.
- Working With Others. What's Missing is now "Who to bring in": each card says
  what a colleague strong in the missing colour brings and when to bring them
  in, and says nothing about the reader. The when-line (20 of them) is picked
  by the reader's colour that the missing one clashes with, or failing that an
  ally, the higher bar first: a result led by white calls on a red colleague
  "when a decision has been through every proper step and is still waiting",
  one led by blue "when the analysis is finished and nobody has said go". The
  five-colour paragraph is plain. The legend's "Ally edge (within you)" and
  "Tension to what you lack" are full sentences ("A dashed line joins one of
  your colours to a colour it clashes with."), and each shows only when the
  diagram draws that kind of line. The explorer uses the same cards.
- Non-players: the commander block is "Your card", the card's name and "The
  Magic: The Gathering card matched to Mono-Green. The art at the top of the
  page is from it." in place of the card text; the banner keeps "Commander ·
  Omnath, Locus of Mana". The next-door prompt is "The results one colour away
  from yours." (`RESULT_COPY_VERSION` 4). The theme switcher's "Table" is
  "Page style", and its note says what Card Frames does.
- Profiles (`data.js`). 27 of the 31 closing lines are new, each a joke with
  no insult in it ("Your out-of-office has an escalation path."); the four
  kept were already jokes (Naya's marching band, the surprise party, Dimir's
  three attempts, Golgari's cycles of life). The 22 insults readers flagged
  are gone: twelve closing lines, five taglines
  (Power Without Morality is Power Without Permission, Growth Through
  Exploitation is Growth Through Positioning, Action Without Analysis is Action
  Before Analysis, Altruism Without Pragmatism is Altruism Without an Angle,
  Perfection Without Passion is Perfection Without Haste), Witch's "You don't
  see what passion adds", the What's Missing paragraph and three shadows.
  Put-downs filed under Strengths moved or went. "Mistakes X for Y" and
  "Confuses X with Y" are left once each (Mono-Blue, Azorius). Esper, Bant,
  Grixis and Five-colour, the pages readers called generic or corporate, have
  new strengths and shadows. Strengths and shadows went from 300 to 255: 45
  cut, 55 rewritten. 11 philosophies were edited, 8 in their first sentence,
  so with the five taglines 13 link previews in `r/` are rebuilt.
- Glitches: "General Tazri" is no longer a Five-colour role (Chief of Staff);
  Elesh Norn's rules joke said +1/+1 where the card (Scryfall) gives +2/+2 and
  -2/-2; Orzhov's shadows no longer slip into "your performance review" and
  "the favour you accepted"; roles readers called jargon are cut (Master of
  Ceremonies, Innovation Labs, Culture & Values, Mission-Driven Leadership,
  Disruption, FinTech).
- Commander descriptions: 22 were checked against Scryfall and corrected or
  made plainer: Obzedat's "ETB", Urza's "impulse-draw", Yuriko and Yidris
  shortened, Breya's "various effects", Kenrith's "Five colours at once",
  Nekusar's missing first ability, Narset casting noncreature spells where it
  said playing cards, Karador once during each of your turns, Meren, Trostani,
  Rakdos, Saskia, Samut and Alesha. Three rules jokes that nearly repeated the
  card below them (Jund, Mardu, four-colour without black) are new jokes.
- Not changed: identity names, ids, colours, data keys, the label words,
  scoring and the question pools; the golden fixture does not move.
- Tests: `tests/visible-copy.test.js` (126 checks, 15 new) holds the line
  under the label to the bars on all 31 identities, seven bar shapes and three
  labels and as rendered in both modes (one sentence, no number, not an old
  line, naming one of the result's colours, "well" only past three answers,
  "level" only for bars printed alike, a count of answers the gap fits);
  renders the commander block and the colleague cards for all 31, on the
  result and in the explorer, and fails on any of the traits and jargon
  readers caught or a sentence opening on "You"; and tests its new checkers.
  `tests/render.test.js` checks each case's line, nine more lines by bar
  shape, the plain commander block and the new prompt.

### Profile rhythm

Plain profiles and pages took the em dashes and tacked-on jokes out of the
identity profiles, but they still read as machine-made because of their
rhythm. Mono-Blue's philosophy opened four sentences in a row on "You" and
ended "You'd rather be the last person to commit than the first one to be
wrong."; Golgari's was four short sentences of one shape ("What dies feeds
what comes next. Failure teaches; success teaches differently."); 15
commander descriptions ended on a line that summed up the card just
described ("The card rewards patience and accumulation."), and much of the
banter ended on a grudging compliment ("On one of those occasions you were
right.").

- Profiles (`data.js`): 153 of the 186 passages changed (philosophy,
  description, banter, commander description, strengths and shadows for all
  31 identities), mostly by cutting: closing lines that summed up or turned
  the passage ("You've decided the time is worth it.", "The team finds you
  brilliant and untrustworthy in roughly equal measure."), "You'd rather X
  than Y" and the other antitheses, the second beat of two-beat strengths
  and shadows ("Brilliant in chaos. Mildly destructive in stability."), and
  seven list items that were a joke or repeated another line ("Answered the
  personality test honestly and instinctively."); two more pairs are
  merged. Runs of short sentences are joined, and a run of openings on
  "You" gets other subjects.
  No description opens "You combine X with Y" any more (12 did), or closes
  on how the team or the room finds you. 32 of the 105 paragraphs that
  changed were only cut; 210 of the 309 list items are word for word as
  they were, and 300 remain. Each philosophy keeps its first sentence, so
  the link previews in `r/` do not change.
- Commander descriptions: every card fact stays word for word. The sentence
  after the facts that summed the card up is cut, in 28 of them, and
  Temur's three fact sentences ("Can't be countered. Your creatures can't be
  countered. Your other creatures have trample.") are one.
- Not changed: names, taglines, roles, colours, commanders, the card text
  and scoring; the golden fixture does not move.
- Tests: `tests/visible-copy.test.js` (111 checks, 10 new), section 16,
  reads the 31 profiles as the result screen and the explorer render them
  (tagline, philosophy, strengths, shadows, banter, roles, commander
  description and description: 248 passages) and fails on three sentences
  in a row that open on the same word; three short sentences (10 words or
  fewer) in a row with the same shape; "rather than", "would rather", "not
  X but Y", "X, not Y" and "the bigger the X, the calmer the Y"; a list of
  three or more that is not the identity's own colours or a card's modes
  (each list kept is named in the test); a closing line in the old
  formulas; an em dash, a rhetorical question, "actually", "genuinely",
  "simply", "truly" or "the real". Run against main it finds 81 problems (7
  runs of openings, 21 runs of short sentences, 14 antitheses, 9 lists, 30
  closing lines) and fails 5 of its checks; now it finds none. The checker
  is tested on the profiles' old passages and on made-up ones. A list of
  three with no comma before the "and", a neat closing line in new words
  and a joke are left to review.

### Even bars and Five-colour

The results screen draws five bars under "How often you picked each colour
when it was offered", and since Result matches the bars the name follows
them, give or take half an answer. On the player's result three things were
still wrong.

- The bars were not what you said. Each colour's bar averaged its enemy-pair
  rate (about twelve Round 1 answers) with its ally-pair rate (two or three
  Round 2 answers), each smoothed with Beta(1, 1), and a Round 1 item weighted
  below 1 still counted whole in the denominator. Two Round 2 answers counted
  as much as ten Round 1 answers. The answers recorded for the player's case
  in `tests/bars.test.js` show it: after Round 1 the bars read U73 B45 R44 G36
  W32, and two Round 2 answers for White over Blue and two for Red over Black
  took them to W55 U52 B38 R60 G39. Counted evenly, the same answers print
  W48 U64 B43 R56 G42: Blue first, Red second.
- Five-colour could not be the result. It needed its weakest bar within half
  an answer of 50%, and a five-colour respondent, who meets every pair at a
  coin flip, leaves the weakest bar near a third.
- Near ties printed out of order. Half an answer either way let a colour the
  name holds print below one it leaves out, on 6.5 to 14.7% of engine 2's
  results and 3.6 to 5.4% of engine 1's (below).

The change:

- The bars (`barsFromTallies`, both engines). Every answered Round 1 and
  Round 2 item, Round 2's enemy re-tests included, counts its weight once for
  the colour chosen and once in the denominator of both colours in its pair;
  Neither counts in neither. A Round 2 answer now moves a bar as far as a
  Round 1 answer of the same weight. A bar counts about fifteen answers (11.4
  from Round 1 and 3.6 from Round 2 on average in simulation, 13 to 17 for
  most respondents). No smoothing: no colour's count is small enough to need
  it, and a colour never answered (Neither throughout) shows 50%. The Round 1
  bars, which the early offer reads and an early result shows, count Round 1
  alone. The caption is now what the bars count, an item of weight 0.7 or
  0.8 counting that much. Round 1 and Round 2 are still read apart, smoothed
  as before, for the context-agreement guard only.
- The name matches the bars as printed (`barsAllow`, both engines). An
  identity of one to four colours may be the result only when no colour it
  leaves out prints above a colour it holds, ties allowed, on the whole
  percentages the screen and a shared link print (`barsShown`). This replaces
  half an answer either way (`BARS_TOLERANCE` is gone). On any bars the top
  bars one to four deep are allowed, so Round 3 still plays four. Engine 2's
  Round 3 filter and final pick, engine 1's hold on its tournament winner and
  the early offer all apply it.
- Five-colour (`FIVE_COLOUR_BAND`, 20 points). Allowed when all five bars print
  within 20 points of each other, about three answers a bar. The posterior,
  which on even answers favours the identities that predict the most coin
  flips, then decides among the identities the bars allow, as for any
  result. Bars wider than the band leave the identity they allow that the
  posterior rates highest; for a five-colour respondent that is a four-colour
  identity (the top four bars) 27 to 64% of the time. Flat answers do not
  make flat bars: with about fifteen answers to a colour, each a coin flip, a
  five-colour respondent's bars print a median 36 to 40 points apart, within
  20 for 6 to 12% of them and for 0.7 to 9% of everyone else. The band, on
  the same respondents (engine 2, seed 1, 3,100 per cell; recall and
  precision of Five-colour, the share of results it is given, and overall
  exact recovery against no Five-colour at all, in percent):

  | band          | recall  | precision, ideal p = 0.8 | precision, elsewhere | given to   | overall      |
  | ------------- | ------- | ------------------------ | -------------------- | ---------- | ------------ |
  | 10            | 0 to 3  | 100 (3 of 3)             | 0 to 20              | 0.1 to 0.3 | 0.0 to +0.1  |
  | 15            | 1 to 5  | 83 (5 of 6)              | 3 to 20              | 0.2 to 1.1 | -0.1 to +0.2 |
  | 20 (taken)    | 3 to 11 | 79 (11 of 14)            | 5 to 27              | 0.5 to 2.7 | -0.2 to +0.4 |

  20 points doubles 15's reach at much the same precision, and costs no
  overall recovery. Wider bands were not run: 25 points would let
  Five-colour through for 12 to 19% of everyone else at p = 0.65, against 6 to
  9% at 20, and for the player's bars, 22 points apart (on the answers
  recorded for them the posterior alone ranks Five-colour third). Five-colour
  results are LOW: in a separate run of 4,650 respondents at this band, all 69
  had a posterior under 0.3.
- What else reads the bars, checked. Engine 1's Round 3 candidates after
  Round 2 come from them (`recalculateCandidates`, same shape); its Round 1
  candidates still come from its own win rates. The scenario-contradiction
  guard needs the top bar 20 points clear of the result's colours, which the
  rule now rules out, so it still cannot fire. The context-agreement guard
  reads Round 1 and Round 2 apart, as above. The early offer is held to the
  Round 1 bars as printed. A shared link's `p` is the printed numbers, so a
  link's name and bars agree; old links carry their own and render as before
  (`tests/seed.test.js`, the ten recorded links). Next door and the mana base
  read the five values as before, and next door still draws Five-colour's
  line at 50%, so a Five-colour result's weakest colour reads as "only just
  made it in". `ONE_ANSWER_BY_VERSION` stays a twelfth of a bar, though an
  answer is now nearer a fifteenth, so links shared before read as they did.
  The results screen's fallback for missing bars counts them the same way.
- Measured on this build after merging the persona check (which changed no
  scoring: the golden fixture rewritten before the merge holds after it)
  against 0579763, with `tests/simulate.js`: n = 100 per identity, seeds 1 and
  2, 6,200 respondents per cell, all three populations, both engines;
  changes on the same respondents, with two paired standard errors.

  Against the bars as printed (a colour left out printed above one held), in
  percent, p = 0.65 / 0.8:

  | population   | engine 2 before | engine 1 before | after, both engines |
  | ------------ | --------------- | --------------- | ------------------- |
  | ideal        | 13.2 / 6.5      | 4.8 / 3.6       | 0 / 0               |
  | misspecified | 12.6 / 6.7      | 5.3 / 4.4       | 0 / 0               |
  | mixed        | 14.7 / 11.8     | 5.4 / 5.3       | 0 / 0               |

  No result is over half an answer from its bars, and none of the 74,400
  breaks the contract, early offers included. Exact recovery, in percent,
  p = 0.65 / 0.8:

  | population   | engine 2 before | engine 2 after                     | engine 1 before | engine 1 after                      |
  | ------------ | --------------- | ---------------------------------- | --------------- | ----------------------------------- |
  | ideal        | 24.0 / 66.5     | 24.1 / 66.4 (0.0 ±0.8 / 0.0 ±0.8)  | 17.4 / 44.6     | 19.0 / 48.9 (+1.6 ±1.0 / +4.2 ±1.2) |
  | misspecified | 23.2 / 57.9     | 24.4 / 57.6 (+1.2 ±0.8 / -0.3 ±0.8) | 17.4 / 42.8    | 19.1 / 45.0 (+1.7 ±1.0 / +2.2 ±1.2) |
  | mixed        | 9.2 / 23.0      | 9.5 / 23.5 (+0.2 ±0.6 / +0.6 ±0.8) | 8.0 / 18.9      | 8.9 / 19.9 (+0.9 ±0.8 / +1.0 ±1.0)  |

  By type, engine 2: monos gain 1.0 to 3.3 points, Five-colour goes from 0
  to 3.5 to 8.0% recall, four-colour identities move -0.9 to +2.6, guilds
  -1.5 to +0.3 and three-colour identities -1.9 to +0.4. Inside the guilds,
  the enemy-pair guilds (Orzhov, Izzet, Golgari, Simic, Boros) lose and the
  allied guilds gain: 25.5 to 21.5 and 66.7 to 61.7 against 24.8 to 26.0 and
  75.1 to 79.1 (ideal), 22.0 to 18.2 and 58.3 to 52.9 against 22.3 to 26.7
  and 64.6 to 67.1 (misspecified), 7.6 to 5.5 and 21.6 to 18.2 against 6.9 to
  8.5 and 21.4 to 25.4 (mixed). An enemy-pair guild's two colours meet in
  six Round 1 items that are coin flips for it, which now count in both
  bars as fully as the rest; the old average lifted them with the ally pairs
  they win. Five-colour, engine 2 (engine 1), p = 0.65 / 0.8: recall 5.5 / 8.0
  (3.0 / 5.0) ideal, 3.5 / 5.5 (1.5 / 4.0) misspecified, 3.5 / 5.0 (1.5 /
  2.0) mixed; precision 7.2 / 80.0 (9.7 / 83.3), 6.5 / 23.9 (7.5 / 38.1),
  3.7 / 10.0 (4.3 / 10.0); given to 0.3 to 3.0% of results; before, never.
  Next door, engine 2: 40.7 to 42.6 / 81.7 to 83.4 (ideal), 39.1 to 41.5 /
  76.1 to 77.3, 19.9 to 20.2 / 40.3 to 43.0; engine 1 up 1.3 to 4.1 points.
  Label accuracy at p = 0.8, engine 2, ideal / misspecified: HIGH 90.8 to
  92.4 / 81.7 to 81.7, MODERATE 83.6 to 83.8 / 73.7 to 72.8, LOW 54.4 to 54.0
  / 42.4 to 41.1. The early offer is unchanged (3 of 3 right for ideal and for
  misspecified respondents at p = 0.8, none at p = 0.65).
- `tests/fixtures/golden.json` is rewritten in its own commit: every path's
  bars move; 115 of 186 paths play a different four and 26 end elsewhere; the
  true identity is reported on 146 paths against 138 (31 of 31 at p = 1,
  where Dune and Five-colour had missed; 115 of 155 at p = 0.8 against 109),
  and Five-colour twice, both right.
- Tests: `tests/bars.test.js` holds the bars to the answer records (each
  answered item once, by weight; a Round 2 answer moves a bar as far as a
  Round 1 answer) on recorded patterns and on simulated respondents of all
  three populations on both engines; the rule on the player's bars (exactly
  the top bars one to four deep) and on 4,000 random bars with ties at the
  half point (allowed exactly when no colour left out prints above one held,
  on the numbers the screen and a link print); Five-colour within and outside
  the band, end to end on both engines; a re-recorded player's case whose even
  bars print W56 U52 B38 R61 G39, where all 64 Round 3 outcomes on both
  engines end on an identity the bars allow and never Mono-Blue; the old
  pattern counted evenly; and the old Round 3 finished on the bars that build
  saved (Jeskai, LOW). `tests/simulate.js` records the bars as printed, fails
  a result or early offer they do not allow, and reports Five-colour's recall
  and precision (`--five-band`, `--rows` for paired comparisons).
  `docs/SCORING_CONTRACT.md` says so, in its own commit.
- Not reached. Five-colour stays rare and, outside the cleanest population,
  usually wrong: flat answers rarely give flat bars over fifteen answers a
  colour. Enemy-pair guilds lose 2 to 5 points to the even count; more Round 2
  ally items for the top colours would help them, and the bars cannot without
  misreporting what was said. Next door still reads Five-colour against 50%,
  and an answer is still a twelfth of a bar there. Results and links saved
  before this build keep their identity and bars.
- Commands: `node tests/simulate.js --n 100 --seed 1,2 --models all --p
  0.65,0.8 --engine 1,2 --rows [0579763's index.html]` and the same on this
  build; the bands, `--n 100 --seed 1` with the same models, p and engines,
  on this build with `FIVE_COLOUR_BAND` set to 0, 10 and 15 and `--five-band`
  to match.

### Persona check of all questions

The real-stakes rewrite below had checked itself. This is a second reader's
check of every question in Rounds 1 to 3 against the author's three rules:
something real at stake for "you", two answers a capable person of that
colour would choose and admit to, and a situation where the colours act
differently.

- Blind first. A script printed every question with no ids, colours, pairs
  or identity keys, in a seeded order with the answers shuffled, and each was
  rated before the sources were opened. Of the 111 Round 1 and 2 items, 2 put
  nothing concrete at stake (Restless, Wrong Call), 2 put little at stake for
  "you" (Festival Committee, Cliquey League), 4 had one answer every sensible
  reader takes (The Scan, Smallholding, Builders, Buying a Car), 1 had an
  answer the stem rules out (Your Clients) and 1 offered two answers with the
  same reason (Choosing a School). In Round 3, 105 of the 378 options read as
  jokes, caricatures or confessions, two generic stems put little at stake,
  and all 40 `POOL_B` and `POOL_C` stems were set at work.
- Then a capable person of each colour, the guilds of each pair, and the
  author as Black-Blue-Red on every item with one of those colours. 24 Round 1
  and 2 items failed. On 6 the keyed answer was not the capable choice: a
  Black player holds out when a developer needs every signature, uses a
  survey selectively, and joins a testing team unless there is a reason to
  stay out; a Blue buyer offers on a fast-selling house before the survey; a
  White candidate applies fairly rather than handing the job to a staff vote.
  On 6 one answer cost nothing, so every colour took it. Nothing was at stake
  on 4. On 7 an answer drew another colour for its own reason (caution,
  politeness, accuracy or belonging), and 1 was incoherent. All 24 are fixed.
  Four milder cases are kept, with a note in the audit: Interview, Parish
  Council, Your Ruling and Cheating Rumour.
- Work: 33 of the 91 ordinary items were at work or in a business. Ten now
  have stakes anyone has: a speech at a brother's wedding, an ex and a shared
  flat, a restored house, a rent, a mother's money, a planning application, a
  house done up with friends, a first book, a craft, an ex asking to try
  again. The 23 left at work (25%) each show a hint. JOB ("Not working right
  now? Answer for a job you've had, or the kind you'd want.") is on 17 and
  BUSINESS on 4; COLLEAGUE and MANAGER stay on one each. Their patterns match
  those stems only, so Round 3 still shows its 15 hints. The four older hints
  are shorter and no longer lists.
- Round 3: 226 of the 378 options are rewritten as what a capable person of
  that identity would do, checked against each identity's philosophy in
  `PROFILES`. Gone are the slow clap, the arm wrestle, the pub, "explodes
  least", the tribunal in triplicate, "take over their half" and the
  Black-Blue-Red options that read as rudeness or petty revenge. Three-beat
  fragments became sentences. 31 of the 48 stems now put something at stake
  for "you": a project with your name on it, a bonus, a league final, a
  house bid, a family business, a club or a charity you built. The unhinted
  pool stems left the office; the hinted ones keep "your team".
- Rounds 1 and 2: 34 items changed (19 stems, 2 labels, 37 answers). Ids,
  pairs, weights, answer colours, identity keys and item order are as they
  were, so the seeded draws and `tests/fixtures/golden.json` do not move.
  `tests/fixtures/round12-keys.json` lists no kept items and is untouched.
  `tests/round12-copy.test.js` lists the 23 items that show a hint.
- Instrument version 6: `INSTRUMENT_VERSION` is 6 and a result built now
  writes `i=6`. The contract line, `tests/play.test.js`, the tests README
  and the simulator's constant (a commit of its own) say so.
- Not measured: whether players land closer to how they see themselves. The
  audit, with the blind ratings and every failure, is kept out of the
  repository.

### Round 1 and 2 items: real stakes

The author, who plays Black-Blue-Red, took the live quiz and came out White 56,
Blue 52, Black 38, Red 60, Green 39. Their reading of the questions: most put
little or nothing at stake for the person answering. At a friend's leaving do a
strategic Black player does not take the food first, because looking generous
is worth more to them than the food, so "get in early" scored them as White.
Offered £30 or £50 of a windfall, they do not care which. And a friend who has
played the same twenty albums for fifteen years matters to nobody but the
friend; the honest answer, "I don't care", was not on offer. Items like these
made Black petty, Blue fussy, Red reckless, White nice and Green lazy.

- An audit of the 111 items in `POOL_A` and `POOL_ALLY` rated the stakes for
  "you": 21 had none and 57 were trivial, against 24 moderate and 9 major.
- 101 items are rewritten so that "you" have something real at stake: a job or
  a promotion, money that matters, a home, health, a partner or family, creative
  work, a say over a group you belong to, or, in the Magic items, a tournament
  place, a prize, a valuable card or standing in a playgroup. 72 now have major
  stakes and 39 moderate. Both answers are what a capable, successful person of
  that colour would do at those stakes. Black takes positions and plays the long
  game; Blue finds out and gets it right where it counts; Red acts on conviction
  and takes the risk; White keeps its word and the agreed rules at a cost to
  itself; Green keeps its roots and lets things grow.
- Kept as they were, after the same checks: A-UR-W05 (builders), A-UR-L03
  (second-hand car), A-BG-L04 (drummer), A-BG-PSY (counselling), A-BG-PSY2 (job
  offer), AL-UB-04 (pay rise), AL-BR-02 (stolen idea), AL-BR-06 (wrong call),
  AL-RG-03 (year abroad) and AL-RG-06 (restless).
- The opinion items ("Which of these do you agree with more?") are now
  situations with a cost on both sides. They keep their weights and keys.
- Every item was read as fifteen people would read it: a strategic, successful
  person of each colour and of each guild. An item went back if the keyed
  colour's person would not choose their answer, if anyone would choose an
  answer for a reason outside its colour, or if a person of that colour would
  shrug. 21 items failed the first pass, 16 the second and 1 the third; the
  fourth found none. The usual fault was a White or Green answer that was also
  the safe or easy one, which Blue and Black readers take for their own reasons. A strategic Black-Blue-Red reader was checked on every item: none
  should now push them towards a White or Green answer.
- Settings: about 35 of the 91 ordinary items are at work or in a business,
  against 16 before, because careers carry real stakes. The rest are homes,
  money, family, health, friends, clubs, study and creative work.
- Hints: the rewritten work items say "your boss" or "someone you work with",
  so only the two kept work items still show a hint (COLLEAGUE on AL-BR-02,
  MANAGER on AL-BR-06). TEAM is still shown under Round 3 stems.
  `tests/round12-copy.test.js` and the tests README say so.
- Scoring is unchanged. Every id, pair, weight and answer colour, and the order
  of the items, are as they were, so the seeded draws and the golden fixture do
  not move, and `tests/fixtures/round12-keys.json` is untouched.
- Instrument version 5: `INSTRUMENT_VERSION` is 5 and a result built now
  writes `i=5`. The contract line, the simulator's check, `tests/play.test.js`
  and the tests README say so.
- Not measured: whether players now land closer to how they see themselves. The
  simulator answers by colour keys, not by reading the words, so it cannot tell.
  The working audit, with every item's stakes and persona results, is kept out
  of the repository.

### Plain profiles and pages

The site still read as AI writing everywhere Plain screens had not been,
down to a joke tacked onto Mono-Blue's strengths: "Finds the assumption
nobody questioned and questions it, gently. Particularly on Tuesdays." A
scan of that copy found 155 em dashes, 39 banned words, 115 tacked-on
endings, 94 tricolons and 22 sentences over 25 words across the identity
profiles, the commander descriptions, the player-mode card, the colour
cards, the dossier, the methodology, the explorer, the colour-interactions
screen and the share studio. Each string is now cut back to its claim: no
em dash used as a dash, no "not X, it's Y", no rhetorical question, no
"actually", "genuinely", "simply" or "truly", no tacked-on joke, no
sentence over 25 words, British spelling throughout. 453 strings changed:
295 cut, 158 rewritten (mostly two sentences joined, or a question turned
into a statement). Scoring is unchanged and the golden fixture does not
move; identity names, ids, colours, keys, roles and art credits are as
they were.

- Profiles (`data.js`): philosophy, description, banter, strengths and
  shadows for all 31 identities. Some lines two identities shared word for
  word now belong to one of them. Azorius keeps four strengths: the fifth
  ("Azorius doesn't enjoy meetings. Azorius IS meetings.") had no claim
  once the joke went. The link previews for Boros, Esper, Ink and Orzhov,
  whose philosophy opens differently now, are rebuilt.
- Commander descriptions: the card facts checked against Scryfall stay as
  they were; the sentences around them lose their tag lines ("The Dimir
  thesis in one mechanic.", "Red as compound impulse."). Yuriko's and
  Kynaios and Tiro's long fact sentences split where the cards split them,
  Rakdos loses its stray asterisks and Kenrith's line gets a full stop.
- Player-mode card: the rules strips lose their closing quips ("Back
  Thursday.", "It knew what the job was.") and Golgari's "Undergrowth —";
  the commanders' printed type lines keep their dash. The mana base loses
  its jokes: no mono-colour joke, "Maybeboard: <land>." at one answer or a
  few short, "and 13 basics" for five colours.
- Colour cards and explorer: no em dashes, "actually" or "not because ...,
  but because ..."; the colleague quotes lose their rhetorical questions
  and the grudging endings that followed most of them.
- Dossier: the Philosophy tab's boxes that read the same for every guild or
  three-colour identity are gone ("it's a genuine fusion with emergent
  properties"); "Common Enemies", untrue for most three-colour identities,
  is "What's Absent"; its sentences name the identity as the result page
  does ("When Mono-White is stressed").
- Methodology: "What this means" and the round notes lose their dashes,
  "genuinely" and "color"; the primary-colour note reads "White is your
  primary colour within this combination, 18 points above the next."; the
  commander row is "Legendary Commander · Yuriko".
- Colour interactions: British spelling, "White, Blue and Black", and no
  subtitle of three. Share studio: the Card's typeline is "Personality ·
  Dimir", and the Scorecard's "Closest" names the runner-up as the result
  page does ("Four-colour (no red)", not "Four-color (no red)").
- Counts after (em dashes, banned, tacked-on, tricolons, over 25 words):
  profiles 0/0/2/14/0, commander descriptions 0/0/2/4/0, player card
  28/0/4/1/0 (the 28 are type lines), colour cards 0/0/0/1/0, dossier
  0/0/0/2/0, methodology 0/0/0/0/0, explorer 0/0/0/2/0, interactions
  0/0/0/2/0, share studio 0/0/1/0/0. The tacked-on and tricolon hits left
  are claims, lists of an identity's colours, or false matches.
- Not changed: the identity names (MONO-WHITE, FOUR-COLOR (No Red)), which
  links and code read; the welcome's own words; the Round 1 to 3 items;
  engine 1's Round 3 line; and the stress list the dossier gives all 16
  three-, four- and five-colour identities, which describes none of them in
  particular and is left for a later pass.
- Tests: `tests/visible-copy.test.js` (101 checks, 13 new) renders all of
  the above and fails on the same dashes and banned phrases, a question
  mark outside a quotation, "not X, it's Y", "color" and the other US
  spellings, an unfilled placeholder and a sentence over 25 words. Run
  against main it fails 9 of its 101 checks. `render.test.js` follows the
  new rules strips and mana base.

### Result matches the bars

A player was told Mono-Blue, "Still shuffling", under bars of White 56, Blue
52, Black 38, Red 60, Green 39. Blue, the only colour lit, came third;
Jeskai, the top three bars, never reached Round 3; and the explanation said
the bars had broken a Round 3 loop (Izzet beat Five-colour beat Mono-Blue
beat Izzet), which under engine 2 they had not. Now the result is always one
whose colours are the top bars, give or take half an answer, on both
engines.

- Why. The name and the bars came from two calculations that never met. The
  bars average each colour's Round 1 (enemy pairs) and Round 2 (ally pairs)
  win rates with equal weight, so two Round 2 answers count as much as ten
  Round 1 answers. Engine 2's posterior reads each colour pair on its own,
  and under its 0.5 rule an identity holding both or neither of a pair's
  colours predicts a coin flip there and loses nothing when the pair comes
  out even: on a flat, mixed profile the identities that predict the most
  coin flips (Five-colour at all ten pairs, monos and fours at six) fit about
  as well as the one the bars point to. Round 3 played the posterior's top
  four, chosen without the bars, and its term (the identity closer by
  Jaccard similarity is preferred) reads each "the narrower one won" answer
  in a nested four as evidence for the narrowest. Engine 1's tie-break of a
  Round 3 loop by the bars still ran under engine 2; its pick was replaced
  by the posterior's, and the explanation still credited the bars.
- Reproduced. The answers recorded in `tests/bars.test.js` (page seed 3, two
  Round 1 Neithers) give bars W55 U52 B38 R60 G39. Red lost to Blue 0.8 to 4
  head to head but won both its Round 2 answers, which lift its bar to 60;
  Blue won 1 of its 3.7 weighted Round 2 answers, which hold it at 52. The
  posterior after Round 2 is flat (Izzet 11.3%, Jeskai 9.0%, Mono-Blue 7.8%,
  Five-colour 7.5%, which is the all-coin-flips score), so Round 3 played U,
  UR, UWR and WUBRG, each inside the next. With the player's loop and three
  more answers, five of the six agree with Mono-Blue under the Jaccard term
  (three for Izzet and Jeskai, one for Five-colour), and its posterior goes
  from 7.8% to 39%: Mono-Blue, LOW, secondary lean Izzet, and the player's
  explanation word for word. Over the 64 ways those six matches can go,
  engine 2 gave Mono-Blue 14 times (3 through the record rule, when Jeskai
  led on posterior with a losing record) and Five-colour 12 times; engine 1,
  whose four come from the bars' gaps (Jeskai, Ink, Boros, Izzet), never
  contradicted the bars there. Of 404 Round 1 and 2 answer sets built to land
  within 2.5 points of the player's bars, Jeskai led the posterior in 307
  and missed the four in 33, and Five-colour made the four in 65. None of
  the answer sets searched gave the player's exact four (Mono-Blue, Izzet and
  Five-colour without Jeskai).
- The lean in simulation (engine 2, before): on the mixed population at
  p = 0.65 it reported Five-colour for 9.4% of respondents (3.2% are
  Five-colour, and 7% of those results were right), a mono for 22.2%
  (16.1%) and a three-colour identity for 23.3% (32.3%).
- Contradiction, as measured: the strongest colour the result leaves out
  sits more than half an answer (1/24 of a bar; an answer moves a bar by
  about 1/12, `ONE_ANSWER_BY_VERSION`) above the weakest colour it holds,
  or, for Five-colour, the weakest sits more than that below 50%, the line
  next door draws for five colours. The player's Mono-Blue is 8 points out
  (Red over Blue), about one answer. In percent, p = 0.65 / 0.8, n = 6,200
  per cell (100 per identity, seeds 1 and 2), over half an answer (over one
  answer):

  | population   | engine 1 before          | engine 2 before            | after, both engines |
  | ------------ | ------------------------ | -------------------------- | ------------------- |
  | ideal        | 13.3 / 9.3 (9.5 / 6.3)   | 18.7 / 9.0 (11.3 / 4.6)    | 0 / 0               |
  | misspecified | 13.7 / 9.1 (9.9 / 5.7)   | 17.7 / 9.2 (10.9 / 4.9)    | 0 / 0               |
  | mixed        | 14.0 / 12.9 (10.2 / 9.2) | 22.5 / 17.1 (14.5 / 10.0)  | 0 / 0               |

  Within half an answer a lit bar can still print below an unlit one: after
  the change, on 13.1 / 6.5 (ideal), 12.6 / 6.7 (misspecified) and 14.7 /
  11.8% (mixed) of engine 2's results, and 3.6 to 5.4% of engine 1's
  (before, at p = 0.65: 26 to 32% and 18 to 19%).
- The change. `barsAllow(id)` holds an identity to its bars at that tolerance
  (`BARS_TOLERANCE`). Engine 2 plays Round 3 between the four identities the
  bars allow that the Round 1 + Round 2 posterior rates highest, and reports
  the best of them by the final posterior, the record rule acting among
  them; the posterior and the confidence rule are as they were. Engine 1
  reports its tournament winner when the bars allow it, and otherwise the
  best candidate they allow in its standings (LOW, the tournament's pick as
  runner-up). The early offer, on both engines, needs the Round 1 bars, which
  an early result shows, to allow it. A session that reached Round 3 on an
  earlier build finishes on an identity the bars allow too.
- Recovery, exact, in percent, p = 0.65 / 0.8 (change on the same
  respondents, with two paired standard errors):

  | population   | engine 1    | engine 2 before | engine 2 after                         | engine 1 after |
  | ------------ | ----------- | --------------- | -------------------------------------- | -------------- |
  | ideal        | 16.9 / 43.4 | 24.5 / 69.2     | 24.0 / 66.5 (-0.5 ±0.8 / -2.7 ±0.8)    | 17.4 / 44.6    |
  | misspecified | 17.7 / 42.1 | 24.7 / 60.6     | 23.2 / 57.9 (-1.6 ±0.8 / -2.7 ±0.8)    | 17.4 / 42.8    |
  | mixed        | 8.2 / 19.4  | 9.9 / 24.0      | 9.2 / 23.0 (-0.6 ±0.6 / -1.0 ±0.8)     | 8.0 / 18.9     |

  Next door (the truth within one colour of the result), engine 2 at
  p = 0.8: 85.8 to 81.7 (ideal), 78.9 to 76.1, 42.4 to 40.3. Label accuracy
  at p = 0.8, ideal / misspecified: HIGH 91.3 to 90.8 / 84.0 to 81.7,
  MODERATE 83.7 to 83.6 / 75.6 to 73.7, LOW 58.0 to 54.4 / 46.5 to 42.4.
- Five-colour is no longer reported. A five-colour respondent answers coin
  flips, which leave the weakest bar near 31 to 34%, not near 50%: 3 to 4%
  of them come within one answer of the line, and none within half. It had
  been right for 15 to 27% of true five-colour respondents, and was given to
  1.3 to 9.4% of all results, most often where it was least often right (7%
  on the mixed population at p = 0.65, 64% for ideal respondents at
  p = 0.8). It accounts for 0.5 to 0.9 points of engine 2's drop at
  p = 0.8.
- Options, measured on the same respondents (seed 1, n = 3,100 per cell;
  engine 2's change in exact recovery against live, in points, for ideal,
  misspecified and mixed respondents, then the share of results over half an
  answer from their bars, in percent; two paired standard errors on a change
  are 0.6 to 1.5):

  | option                                    | p = 0.65: change / over      | p = 0.8: change / over         |
  | ----------------------------------------- | ---------------------------- | ------------------------------ |
  | engine 2 as it was                        | 0, 0, 0 / 19, 18, 24         | 0, 0, 0 / 9, 9, 18             |
  | (d) engine 1 as the default               | -6.3, -7.8, -1.5 / 13, 14, 14 | -24.7, -17.3, -4.4 / 9, 10, 13 |
  | (a) top 1, 2 and 3 bars always in Round 3 | -0.3, -1.1, -0.7 / 12, 10, 13 | -2.8, -2.4, -0.7 / 6, 6, 9     |
  | (b) the final pick held to the bars       | -1.0, -1.7, -0.3 / 0         | -3.0, -2.4, -1.4 / 0           |
  | (a)+(b), no tolerance                     | -0.7, -3.5, -0.6 / 0         | -5.5, -4.9, -2.0 / 0           |
  | (a)+(b), a quarter of an answer           | -0.5, -2.6, -0.2 / 0         | -3.9, -4.0, -1.6 / 0           |
  | (a)+(b), half an answer (taken)           | +0.2, -2.1, -0.5 / 0         | -2.4, -3.0, -1.8 / 0           |
  | (a)+(b), one answer                       | +0.5, -1.0, +0.2 / 10, 9, 11 | -1.1, -1.5, -1.6 / 4, 4, 9     |
  | (c) posterior bars, name over 50%         | +0.5, +0.5, +0.4 / 0         | -0.6, +0.4, +0.5 / 0           |

  (d) keeps the contradictions and gives up most of engine 2's recovery.
  (a) alone keeps half the contradictions at the cost of (a)+(b). (b) alone
  matches (a)+(b) within noise, but plays identities in Round 3 that can
  never be the result and can report one that played no match; (a)+(b)
  plays only identities that can be. Half an answer rules out the player's
  case with room to spare (one answer, 8.3 points, would allow its 8) and
  costs up to 3 points less than no tolerance, which would also stop near
  ties printing out of order. (c), bars from the posterior (each colour's
  chance of being in the identity) with the colours over 50% as the name, is
  the only option that costs nothing, but it changes what the bars mean (the
  caption says how often each colour was picked), the units next door and
  the mana base read, and what shared links carry, and it lets the result be
  an identity Round 3 never played; it is a decision for the result screen,
  not a scoring fix, so it is not taken here.
- The explanation: Plain screens (below) removed the sentence about the bars
  breaking the loop, with the rest of the confidence explanation; this
  change had limited it to the loops the bars did break. The scoring still
  records `round3Data.loopBrokenByBars`, true only when engine 1's re-rank by
  the bars picked the result, never under engine 2; nothing shown reads it.
  The scenario-contradiction guard can no longer fire (it needed the top bar
  20 points clear of the result's colours).
- Tests: `tests/bars.test.js` (in `npm test`) checks the rule on the
  player's bars, the recorded pattern on both engines through all 64 Round 3
  outcomes, the old four finished on this build, the loop record, and the
  simulator over all three populations at p 0.65 and 0.8 on both engines,
  where the bound is zero: every result passes `barsAllow` before it is
  reported, and `tests/simulate.js` counts any that does not as a contract
  violation. The simulator gains the mixed population (`--model mixed`,
  `--models all`) and reports each result against its bars.
  `tests/fixtures/golden.json` is rewritten in its own commit (120 of 186
  paths play a different four, 29 end elsewhere; at p = 1, Five-colour and
  Dune no longer end on themselves). `docs/SCORING_CONTRACT.md` says so, in
  its own commit.
- Not reached: the recovery cost above; Five-colour; near ties shown out of
  order. The bars still weigh two Round 2 answers like ten Round 1 answers,
  which is where they and the posterior part company; they are activation by
  contract, so the name now follows them rather than the other way round.
  Results and links saved before this build keep their identity.
- Commands: `node tests/simulate.js --n 100 --seed 1,2 --models all --p
  0.65,0.8 --engine 1,2 [638cfe3's index.html]` and the same on this build
  (it reports the contradiction rates, and fails on 638cfe3, which breaks
  the new contract). For the options, (a) was 638cfe3 with the top bars'
  identities forced into Round 3; (b) and the tolerances were this change
  without its Round 3 filter or with another `BARS_TOLERANCE`; (c) was read
  from engine 2's final posterior on the same respondents.

### Plain screens

A player took the live quiz on a phone and the result screen said, under
"Still shuffling": "Your final-round preferences formed a loop (IZZET beat
WUBRG beat MONO-U, who beat IZZET), so the scenarios couldn't decide this",
then a soft read, a secondary lean and a caveat about Round 1 and Round 2.
The screens between rounds read the same way. Every string the quiz and the
result screen put around the identity is now the shortest plain sentence
that does the job: no flourish, no jokes in system text, nothing about how
the scoring works, no identity codes in capitals, no em dashes, no sentence
over 20 words. Scoring is unchanged: the golden fixture does not move, and
the Round 3 line-up keeps the one random draw its banter used to take.

- Confidence: the label and one line, nothing stacked under it. Locked in:
  "A clear result." Leaning: "Fairly clear. Your nearest neighbour is next
  door." Still shuffling: "Your answers were split between a few results.
  Have a look next door." The loop, the secondary lean, the scenario and
  Round 1 / Round 2 caveats, the borderline and width-shift lines and every
  "soft read" are gone from the page; the guards that lower the label are
  untouched.
- Quality: at most one small line under the confidence line, only when a
  flag fires (quick answers, then the first answer chosen most of the time,
  then many Neithers; the thresholds are as they were).
- Between rounds: "Round 1 done.", "Round 2 done.", "Round 3 done." and
  Continue. The Round 3 line-up is "Round 3", the face-down cards and "Four
  results are still in the running. You'll compare them two at a time.",
  then "Start Round 3". The early offer is "Round 1 done." and "We can call
  it now, or you can keep going for a firmer result." Every ten answers:
  "10 answered, 35 to go.", from the counter. The undo is "Free mulligan" or
  "Undo", with one plain confirm. "Neither"; "Working out your result"; the
  pre-result screen loses "A Caveat" and its joke. The banter, the
  "suspects", the trait lines and the all-Neither easter egg are gone.
- Result screen: next door gives one plain reason per row and no question
  headings (RESULT_COPY_VERSION 3); the share text is "I'm Dimir. What are
  you?"; the workplace notice, the "Not For Official Use" seal, the
  shared-link banner, the theme note and How This Works say one plain thing
  each; the divider reads "Personality · Dimir".
- Not changed, and a separate decision: the identity profiles, the
  commander block (with the mana base and the player-mode card), the colour
  cards under Working With Others, the methodology and dossier, the
  explorer, the colour-interactions screen, the share studio, and the
  welcome's lede, "Learn more" paragraphs and 40 taglines, which are the
  author's own words.
- Instrument version 4: a result built now writes `i=4`.
- Tests: `tests/visible-copy.test.js` (88 checks, in `npm test`) renders
  the transitions, the line-up, the early offer, the calculating and
  pre-result screens and the question screen's own lines in every mode, and
  the result screen in twelve states, and fails on the rules above. Run
  against the previous build it fails 71 of its 88 checks. `play.test.js`,
  `render.test.js` and `journey.test.js` follow the new words.
- Phones: not measured again in a browser. The screens carry fewer and
  shorter lines than before.

## 2026-10-17

- Commander descriptions: corrected 16 entries against Scryfall oracle text.

### Round 1 and 2 copy

The 111 items players answer in Rounds 1 and 2 had never been reviewed, and a
player found one that made no sense: an inkblot answered with two stories.
`POOL_A` holds 61 enemy-pair items (Round 1, and Round 2's enemy retests),
`POOL_ALLY` 50 ally-pair items (Round 2); 20 of them are Magic items, shown only
to players who said they play. All but one are rewritten in place. Scoring is
unchanged: every id, pair, weight and answer colour is as it was, so the pools,
the seeded draws and the golden fixture do not move.

- Each stem is a concrete situation or a plain question, 25 words or fewer (the
  longest is now 22), and both answers answer it. Each answer is something a
  person would say or do, 20 words or fewer (the longest is 18, against 40
  before), with a cost on both sides and nothing in the tone to say which is
  which. Round 1's contrasts stay wide; Round 2's two answers share ground and
  differ in what drives them, and where both take the same action (jury service,
  a family get-together) the reason is the difference.
- Fixed on the way: the inkblot is now a sharing game from a study. A-UR-HET
  asked which mistake you make more often but was keyed by what you value, so a
  careful person who admitted to sitting on things scored the other way; it now
  asks which habit in other people frustrates you more. Magic items no longer
  name a colour ("That pile is green"), sort by colour, name a card that points
  at one (Lightning Bolt), shout in capitals or use asterisks. The em dashes,
  "leverage", "Embrace the future" and "Analyze" are gone.
- Most items move from the office to everyday life: friends, home, money,
  neighbours, clubs, hobbies, travel. 16 of the 91 ordinary items stay at work (7
  in Round 1's pool, 9 in Round 2's), against about 50 before.
- The labels above the stems match the new stems (Lost Phone, Queue,
  Experiment...) and are four words or fewer.
- Kept after review: A-UR-REV ("Think about a decision you regret. What bothers
  you more?").
- Hints under the stems (`CONTEXT_HINTS`): the new stems call for three, TEAM on
  three items, COLLEAGUE on two and MANAGER on one, so the 17 that nothing in
  Rounds 1 to 3 shows any more are dropped (five of them had matched no stem
  before either). COLLEAGUE loses its em dash. Magic items no longer get "Don't
  play card games? ...", which only people who said they play ever saw. Round 3's
  15 hints are unchanged.
- Instrument version 3: `INSTRUMENT_VERSION` is 3 and a result built now writes
  `i=3`; the contract's line, the simulator's check and `tests/play.test.js` say
  so. A session saved before this build and resumed after it keeps the words of
  the items it had already drawn, and finishes as 3.
- Phones: the Phase 3 measurements below were taken on the old items. The new
  ones are shorter, so they should fit at least as well, but they have not been
  measured again in a browser.
- Tests: `tools/check-round12-copy.js` holds the rules and lists every item
  (`--list`). `tests/round12-copy.test.js` (53 checks, in `npm test`) holds them
  on the live files against `tests/fixtures/round12-keys.json` (each item's keys
  and a hash of its words before the rewrite), checks which items show which
  hint, renders all 111 items in Round 1's and Round 2's renderers, and plays a
  real Round 1 and 2 with Magic items off and on.
- Second cold read (two first-time readers, blind): 101 of the 111 items change
  again. Answers that dodged the stem, one-sided choices, unclear words and
  near-duplicate situations are fixed; the eight unhinted work items now happen
  at home or in town (8 ordinary items stay at work, 6 of them hinted); the
  "organise it or let it be" items get other situations; repeated phrases and
  "actually" are gone; 47 of 222 answers keep the "Action. Reason." shape (was
  134); A-UR-REV is rewritten, so nothing is kept after review. The longest stem
  is 24 words, the longest answer 16.

### Phase 3: quiz copy

The reviewed quiz-screen copy (revision 2) replaces the provisional strings in
`PLAY_COPY` in `index.html`. Player variants show when "Played Magic?" was
answered Yes and plain ones otherwise; the workplace audience always reads plain.
Scoring is unchanged: the golden fixture and the simulator's numbers are as they
were. Nothing shown during Rounds 1 to 3 names a colour, a basic land or an
identity, and `tests/play.test.js` checks every quiz-screen string for that.

- Welcome and preflight: Rule 0 with its second sentence; "One question first /
  Played Magic?" with what each answer does ("Adds the Magic jokes and a few Magic
  questions." / "Keeps it plain. Same 31 results."); the Constructed and Work mode
  links say what changed once switched on and end with the way back ("Back to Blind
  Draft", "Undo"); the results banner says "Work mode" too.
- Length lines: the welcome, the fold and the preflight say "Up to 45 questions,
  about 8 minutes" (the fold: "over three rounds"; the welcome adds "Less if you're
  decisive"). 45 is the one counter's computed total (`quizLengths`), not a number
  written into the copy, and a clinch in Round 3 can end the quiz before the counter
  gets there. The fold's per-round counts are gone; the counter is as it was.
- Between rounds: Round 1 to 2 reads "Round II / Closer calls" with a "Next round ›"
  button and no trait line; Round 2 to 3 reads "Round III / Head to head" with a
  trait line. The line-up before Round 3 reads "Suspects", "Four suspects remain."
  (the real count), "They stay face down. You'll meet them two at a time.", a line
  for the leading trait (or one line for players), "Bring them in ›" and "About 6
  questions, two suspects at a time.". Trait lines are keyed by the trait leading
  (group, homework, door, now, leave), or "balanced" when no colour is 0.1 ahead of
  the second, and never name its colour. The line-up's banter still takes exactly
  one random draw, even from a pool of one line, so the seeded Round 3 shuffles and
  the golden fixture do not move.
- Every-ten beats: after answers 10, 20 and 40 only (not 30, which ends Round 1, and
  not when a round ends on the answer, since a transition follows). Plain and Work
  mode get a line for the leading trait, its second line if it comes up again, and
  nothing once both are used. Players get a line for the pattern (the first with a
  clear lead, the same as last time, moved, none yet) instead, because players read
  a trait line as a colour. What each beat showed is kept in the session
  (`state.beats`), so a refresh or an undo shows the same line.
- Early offer: no identity, tagline, pips or "Preliminary read" chip, and no
  sentence about ally pairs: "The rest is optional.", what is left of the counter
  and the minutes, "Keep going" and "Show me now".
- Free mulligan: the button asks first ("Mulligan your last answer? It's free, once
  a round." with Mulligan / Keep; plain: "Undo your last answer? You get one per
  round." with Undo / Keep it); the question that comes back says "Mulligan taken.
  Same question, new answer." (plain: "Undone. Answer that one again."), and the
  rest of the round says the undo is used. The line under the button ("Just the one,
  like Commander." / "One per round.") is dropped below 600px.
- Phones, measured in a browser at 375x667 over every Round 1 and Round 2 item: the
  longest question with both answers and "Neither" ends 650px down (as before),
  666px with a beat line, 667px with the used-undo line; with both at once, only the
  longest Magic item runs over, to 684px.
- Round 3 shows its stem once. The stem line carries it alone; the line above holds
  the short context hint when the scenario has one (15 of the 48 stems: CONFLICT, 8
  in POOL_B, 6 in POOL_C) and is hidden otherwise. Rounds 1 and 2 label their items
  there, and no item's label is its own stem.
- Colour cues: `NEUTRAL_SKY_DURING_QUIZ = true`. Until the result is revealed the
  night sky no longer tints its stars and shooting stars toward the colours answered
  so far, nor builds the leading identity's constellation in Round 3, and the Card
  Frames theme's progress marks stay untinted. The motion is unchanged (twinkle,
  drift, a shimmer on each answer, shooting stars, the marks filling in). At the
  reveal most stars take their colours at once, and go back to neutral when the quiz
  starts over. Set the constant to false for the old behaviour.
- Instrument version 2: the items and screens changed, so `INSTRUMENT_VERSION` is 2
  and a result built now writes `i=2` into its link. A link without `i`, and a result
  saved before this build, still mean 1. The contract's line about
  `instrumentVersion` and the simulator's check say 2.
- Two Round 3 options that read as slips are fixed in `data.js` and `index.html`:
  Dune on ethics ("Notice goes in tomorrow. No philosophy degree needed.") and
  Orzhov in the Esper redesign scenario ("Whoever keeps the place running gets the
  final say. Everyone else gets informed."). Both are 15 words or fewer and the keys
  are untouched; a drafts file for `tools/apply-round3-copy.js` needs the same two
  lines, or the tool will call it stale.
- Still provisional, for want of reviewed text: the round names ("First
  Impressions", "Refinement", "Final Determination"; the transitions now say "Closer
  calls" and "Head to head"), the line-up screen's title ("Refinement Complete"), the
  line into the result ("Every card played. Time to turn them over."), and the
  results page's share button and table switcher.
- Tests: `tests/play.test.js` holds all of the above: a sample of the final strings
  word for word, the beat rules on made-up tallies, the single random draw, the single
  stem across all 48 Round 3 stems, the sky constant's effect and its revert, and
  `i=2` in a built link. `tests/README.md` lists it and `tests/round3-copy.test.js`.

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
