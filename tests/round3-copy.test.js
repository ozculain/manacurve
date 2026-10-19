#!/usr/bin/env node
'use strict';
// Round 3 copy: the rules the rewritten stems and options were written to, held on the live
// files (ROUND2_SCENARIOS in data.js, POOL_B and POOL_C in index.html).
//  1. Every option is 15 words or fewer.
//  2. No stem or option names a colour, a basic land or an identity from PROFILES, except
//     inside MTG_STALL, the one scenario that talks about Magic.
//  3. Every scenario still has exactly the identity keys it had before the rewrite
//     (tests/fixtures/round3-keys.json). Scoring reads the keys and never the words, so the
//     golden fixture does not move with a rewording; a changed key set is a change to the
//     instrument and is made on purpose.
//  4. Every pair of identities the bars can bring into one Round 3 with at most one tie has a
//     short situation (POOL_B or POOL_C), so a 31-answer list is met only when a pair's one
//     situation was used earlier in the same Round 3.
//  5. The guards themselves, on small made-up sources: each rule flags what it should and
//     nothing else, and tools/apply-round3-copy.js reads a draft, refuses a bad one, writes the
//     quoting each source uses and changes nothing the second time.
// The fixture is rewritten only when a scenario or an identity key is added or removed on
// purpose, in a commit of its own:
//   node tests/round3-copy.test.js --update-keys
// Usage: node tests/round3-copy.test.js [--update-keys] [path/to/index.html]
const fs = require('fs');
const path = require('path');
const { checklist } = require('./_lib/report');
const { pageArgs } = require('./_lib/load');
const tool = require('../tools/apply-round3-copy');

const FIXTURE = path.join(__dirname, 'fixtures', 'round3-keys.json');
const GROUPS = [tool.GENERIC, ...tool.POOLS];
const t = checklist('round3-copy');
const list = (arr, n = 4) => arr.slice(0, n).join('; ') + (arr.length > n ? `; ... (${arr.length} in all)` : '');

// ---------- the live sources ----------
const args = pageArgs();
const live = tool.readSources(args.htmlPath ? path.dirname(args.htmlPath) : tool.ROOT);
const keysOf = (model) => Object.fromEntries(model.scenarios.map((s) => [s.id, s.options.map((o) => o.key)]));

if (process.argv.includes('--update-keys')) {
  const note = 'The identity keys of each Round 3 scenario, as they were before the copy rewrite; see tests/round3-copy.test.js. Rewrite only with --update-keys, in a commit of its own.';
  const rows = Object.entries(keysOf(live)).map(([id, keys]) => '    ' + JSON.stringify(id) + ': ' + JSON.stringify(keys));
  fs.writeFileSync(FIXTURE, '{\n  "note": ' + JSON.stringify(note) + ',\n  "scenarios": {\n' + rows.join(',\n') + '\n  }\n}\n');
  console.log('wrote ' + path.relative(tool.ROOT, FIXTURE) + ' (' + rows.length + ' scenarios)');
  process.exit(0);
}

const fixture = JSON.parse(fs.readFileSync(FIXTURE, 'utf-8')).scenarios;
const fixtureIds = Object.keys(fixture);
const inGroup = (id, group) => (group === tool.GENERIC ? !id.startsWith('POOL_') : id.startsWith(group + '.'));
const optionCount = live.scenarios.reduce((n, s) => n + s.options.length, 0);

// The fixture has to describe the Round 3 set this repository ships, or the checks below mean little.
t.ok('the fixture holds 8 generic, 38 POOL_B and 85 POOL_C scenarios',
  GROUPS.map((g) => fixtureIds.filter((id) => inGroup(id, g)).length).join() === '8,38,85');
t.ok('the live sources hold 131 scenarios and 666 options (8 x 31 generic, 112 POOL_B, 306 POOL_C)',
  live.scenarios.length === 131 && optionCount === 666,
  `${live.scenarios.length} scenarios, ${optionCount} options`);

// 1. The 15-word cap
const problems = tool.sourceProblems(live);
const found = (group, rule) => problems.filter((p) => inGroup(p.id, group) && p.rule === rule).map((p) => `${p.id} ${p.where}: ${p.detail}`);
for (const group of GROUPS) {
  t.ok(`${group}: every option is ${tool.WORD_CAP} words or fewer`, found(group, 'words').length === 0, list(found(group, 'words')));
}

// 2. No colour, basic land or identity names outside MTG_STALL
for (const group of GROUPS) {
  const hits = ['colour', 'basic land', 'identity'].flatMap((rule) => found(group, rule));
  t.ok(`${group}: no stem or option names a colour, a basic land or an identity${group === tool.GENERIC ? ' (MTG_STALL excepted)' : ''}`, hits.length === 0, list(hits));
}
t.ok('every stem and option is a non-empty string and no key repeats within a scenario',
  problems.filter((p) => p.rule === 'text' || p.rule === 'keys').length === 0,
  list(problems.filter((p) => p.rule === 'text' || p.rule === 'keys').map((p) => `${p.id} ${p.where}: ${p.detail}`)));

// 3. The keys
{
  const liveKeys = keysOf(live);
  const gone = fixtureIds.filter((id) => !(id in liveKeys)), added = Object.keys(liveKeys).filter((id) => !(id in fixture));
  t.ok('the same 131 scenarios as the fixture', gone.length === 0 && added.length === 0,
    `missing: ${list(gone)}; new: ${list(added)}; update the fixture only if that is on purpose`);
  for (const group of GROUPS) {
    const bad = [];
    for (const id of fixtureIds.filter((i) => inGroup(i, group))) {
      const want = fixture[id], have = liveKeys[id] || [];
      const lost = want.filter((k) => !have.includes(k)), extra = have.filter((k) => !want.includes(k));
      if (lost.length || extra.length) bad.push(`${id} lost [${lost}] gained [${extra}]`);
    }
    t.ok(`${group}: every scenario still has exactly its original keys`, bad.length === 0, list(bad));
  }
  const ids = Object.keys(live.PROFILES).sort().join();
  const short = live.scenarios.filter((s) => s.group === tool.GENERIC && s.options.map((o) => o.key).sort().join() !== ids).map((s) => s.id);
  t.ok('each generic scenario has one option for each of the 31 identities in PROFILES', short.length === 0, list(short));
}

// 4. Every pair a Round 3 can bring together with at most one tie in the bars has a short situation.
// The line-up holds only identities the bars allow (barsAllow: no colour an identity leaves out prints
// above one it holds; Five-colour when the five print close together). Two identities can meet when
// some order of the five bars, ties included, allows both. With one tie at most, that is a pair one
// inside the other, two of one width that differ by a single colour, or Five-colour with any other.
{
  const COLOURS = ['W', 'U', 'B', 'R', 'G'];
  const orders = []; // every order of the five bars, ties included, as levels (0 the highest)
  (function fill(lv) {
    if (lv.length === 5) { const n = new Set(lv).size; if ([...Array(n).keys()].every((k) => lv.includes(k))) orders.push(lv); return; }
    for (let l = 0; l < 5; l++) fill([...lv, l]);
  })([]);
  const allows = (lv, id) => {
    const held = live.PROFILES[id].colors || [];
    if (held.length === 5) return true;
    const level = (c) => lv[COLOURS.indexOf(c)];
    return Math.max(...held.map(level)) <= Math.min(...COLOURS.filter((c) => !held.includes(c)).map(level));
  };
  const written = new Set();
  for (const s of live.scenarios) {
    if (s.group === tool.GENERIC) continue;
    const owner = /\.([A-Z-]+)\[/.exec(s.id)[1];
    for (const o of s.options) if (o.key !== owner) written.add([owner, o.key].sort().join(' v '));
  }
  const ids = Object.keys(live.PROFILES);
  let meeting = 0;
  const missing = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      if (!orders.some((lv) => new Set(lv).size >= 4 && allows(lv, ids[i]) && allows(lv, ids[j]))) continue;
      meeting++;
      if (!written.has([ids[i], ids[j]].sort().join(' v '))) missing.push(ids[i] + ' v ' + ids[j]);
    }
  }
  t.ok(`every pair the bars can bring into one Round 3 with at most one tie has a short situation (${meeting} pairs)`,
    meeting === 260 && missing.length === 0, `${meeting} pairs; without a situation: ${list(missing)}`);
}

// ---------- 5. the guards, on made-up sources ----------
// Four identities, a generic scenario and MTG_STALL (data.js), three pool scenarios (index.html), and
// a draft for them in the shape of section 1 of the copy drafts file.
const MINI_DATA = `const PROFILES = { 'MONO-W': { name: 'MONO-WHITE' }, AZORIUS: { name: 'AZORIUS' }, DIMIR: { name: 'DIMIR' }, INK: { name: 'FOUR-COLOR (No Black)' } };
const ROUND2_SCENARIOS = {
  CRISIS: {
    id: 'CRISIS',
    context: 'Old stem?',
    responses: {
      'MONO-W': 'Old one.',
      'AZORIUS': "Old two's.",
      'DIMIR': 'Old \\u2019three\\u2019.',
      'INK': 'Old four.'
    }
  },
  MTG_STALL: {
    id: 'MTG_STALL',
    context: 'Old stall.',
    responses: {
      'MONO-W': 'Old w.',
      'AZORIUS': 'Old a.',
      'DIMIR': 'Old \\u2019d\\u2019.',
      'INK': 'Old i.'
    }
  }
};
`;
const MINI_HTML = `<script>
const POOL_B = {
  AZORIUS:[{sc:'Old pool stem.',r:[{t:'Old a.',g:'AZORIUS'},{t:'Old b.',g:'DIMIR'}]},{sc:'Second.',r:[{t:'Old c.',g:'AZORIUS'},{t:'Old d.',g:'INK'}]}],
};
const POOL_C = {
  DIMIR:[{sc:'Third.',r:[{t:'Old e.',g:'DIMIR'},{t:'Old f.',g:'AZORIUS'}]}]
};
</script>
`;
const MINI_DRAFT = `# Copy drafts

## 1. Round 3 stems and options

- Total: 5 stems and 14 options.
- Against today's text: 5 stems and 8 options change; 6 options are kept.

### 1.1 Generic scenarios

#### CRISIS
\`ROUND2_SCENARIOS.CRISIS\` · 4 options · 3 changed

**Stem**
- was: Old stem?
- now: A new stem?

**Options**
- **MONO-W**
  - was: Old one.
  - now: New one.
- **AZORIUS** (keep) Old two's.
- **DIMIR**
  - was: Old ’three’.
  - now: New three—with a dash.
- **INK**
  - was: Old four.
  - now: Don't use "quotes" here.

*Note:* commentary is never copy. Blue, Dimir and a sixteen-word sentence do not matter here: one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen.

#### MTG_STALL
\`ROUND2_SCENARIOS.MTG_STALL\` · 4 options · 1 changed · Constructed mode only

**Stem**
- was: Old stall.
- now: A stall.

**Options**
- **MONO-W**
  - was: Old w.
  - now: A red Mountain.
- **AZORIUS** (keep) Old a.
- **DIMIR** (keep) Old ’d’.
- **INK** (keep) Old i.

### 1.2 Authored scenarios

#### POOL_B.AZORIUS[0]
keys AZORIUS, DIMIR · 2 options · 1 changed

**Stem**
- was: Old pool stem.
- now: New pool stem.

**Options**
- **AZORIUS**
  - was: Old a.
  - now: New a's.
- **DIMIR** (keep) Old b.

#### POOL_B.AZORIUS[1]
keys AZORIUS, INK · 2 options · 2 changed

**Stem**
- was: Second.
- now: Second, new.

**Options**
- **AZORIUS**
  - was: Old c.
  - now: New c.
- **INK**
  - was: Old d.
  - now: New d.

#### POOL_C.DIMIR[0]
keys DIMIR, AZORIUS · 2 options · 1 changed

**Stem**
- was: Third.
- now: Third, new.

**Options**
- **DIMIR**
  - was: Old e.
  - now: New e.
- **AZORIUS** (keep) Old f.

## 2. Rules-text strip

Nothing here is read.
`;

const edit = (text, from, to) => {
  if (!text.includes(from)) throw new Error('test setup: "' + from + '" is not in the text');
  return text.replace(from, to);
};
// The text with everything from one marker up to (not including) the next removed.
const cut = (text, from, until) => {
  const a = text.indexOf(from), b = text.indexOf(until, a);
  if (a < 0 || b < 0) throw new Error('test setup: cannot cut "' + from + '" to "' + until + '"');
  return text.slice(0, a) + text.slice(b);
};
// The rules each made-up draft trips, and the plan.
function trial(draft = MINI_DRAFT, sources = { dataJs: MINI_DATA, indexHtml: MINI_HTML }) {
  const model = tool.readModel(sources);
  const parsed = tool.parseDraft(draft);
  const plan = tool.buildPlan(parsed, model);
  return { model, parsed, plan, rules: [...new Set(plan.problems.map((p) => p.rule))].sort().join(',') };
}
const wordsLong = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen.';
const wordsOk = wordsLong.replace(' sixteen.', '.');

{
  const base = trial();
  t.ok('a made-up draft that follows the rules raises no problem', base.plan.problems.length === 0, list(base.plan.problems.map((p) => p.rule + ' ' + p.id + ' ' + p.detail)));
  const s = base.plan.stats.total;
  t.ok('its counts: 5 stems and 8 options changed, 6 options unchanged, 1 kept line straightened',
    s.scenarios === 5 && s.stemsChanged === 5 && s.optionsChanged === 8 && s.optionsUnchanged === 6 && s.straightened === 1,
    JSON.stringify(s));

  const data = tool.applyToDataJs(MINI_DATA, base.plan), html = tool.applyToIndexHtml(MINI_HTML, base.plan);
  const lines = (text) => new Set(text.split('\n'));
  const dataLines = lines(data.text), htmlLines = lines(html.text);
  const has = (set, line) => set.has(line);
  t.ok('data.js keeps its quoting: single quotes, double quotes around an apostrophe, a backslash-u line stays escaped, escapes where both quotes occur',
    has(dataLines, "    context: 'A new stem?',") && has(dataLines, "      'MONO-W': 'New one.',")
    && has(dataLines, `      'AZORIUS': "Old two's.",`) && has(dataLines, "      'DIMIR': 'New three\\u2014with a dash.',")
    && has(dataLines, "      'INK': 'Don\\'t use \"quotes\" here.'") && has(dataLines, `      'DIMIR': "Old 'd'.",`),
    list([...dataLines].filter((l) => !MINI_DATA.split('\n').includes(l))));
  t.ok('index.html keeps its quoting: single quotes, apostrophes escaped, kept options untouched, no trailing comma added or lost',
    has(htmlLines, "  AZORIUS:[{sc:'New pool stem.',r:[{t:'New a\\'s.',g:'AZORIUS'},{t:'Old b.',g:'DIMIR'}]},{sc:'Second, new.',r:[{t:'New c.',g:'AZORIUS'},{t:'New d.',g:'INK'}]}],")
    && has(htmlLines, "  DIMIR:[{sc:'Third, new.',r:[{t:'New e.',g:'DIMIR'},{t:'Old f.',g:'AZORIUS'}]}]"),
    list([...htmlLines].filter((l) => !MINI_HTML.split('\n').includes(l))));
  const live2 = { dataJs: MINI_DATA, indexHtml: MINI_HTML, ...base.model };
  t.ok('what was written reads back as planned, in the same order, with every other line as it was',
    tool.verifyApplied(live2, data.text, html.text, base.plan).length === 0,
    list(tool.verifyApplied(live2, data.text, html.text, base.plan).map((p) => p.detail)));
  const again = trial(MINI_DRAFT, { dataJs: data.text, indexHtml: html.text });
  const a = again.plan.stats.total;
  t.ok('run a second time it finds nothing to change',
    again.plan.problems.length === 0 && a.stemsChanged === 0 && a.optionsChanged === 0
    && tool.applyToDataJs(data.text, again.plan).literals === 0 && tool.applyToIndexHtml(html.text, again.plan).literals === 0,
    JSON.stringify(a));
}

{
  const refused = (label, rule, draft, sources) => {
    const r = trial(draft, sources);
    t.ok(`refused: ${label}`, r.rules.split(',').includes(rule), `wanted ${rule}, got ${r.rules || 'no problem'}`);
  };
  refused('an identity key in the draft that the source does not have', 'keys', edit(MINI_DRAFT, '- **INK**\n  - was: Old d.', '- **GHOST**\n  - was: Old d.'));
  refused('an identity key in the source that the draft does not have', 'keys', edit(MINI_DRAFT, '- **INK** (keep) Old i.\n', ''));
  refused('a scenario in the draft that the source does not have', 'keys', edit(MINI_DRAFT, '## 2. Rules-text strip', '#### POOL_C.AZORIUS[0]\nkeys AZORIUS · 1 options · 0 changed\n\n**Stem**\n- was: A.\n- now: B.\n\n**Options**\n- **AZORIUS** (keep) C.\n\n## 2. Rules-text strip'));
  refused('a scenario in the source that the draft does not have', 'keys', cut(MINI_DRAFT, '#### POOL_C.DIMIR[0]', '## 2. Rules-text strip'));
  refused('an option over 15 words', 'words', edit(MINI_DRAFT, 'now: New c.', 'now: ' + wordsLong));
  refused('an option over 15 words inside MTG_STALL', 'words', edit(MINI_DRAFT, 'now: A red Mountain.', 'now: ' + wordsLong));
  refused('a colour in an option', 'colour', edit(MINI_DRAFT, 'now: New c.', 'now: A Red one.'));
  refused('a colour in a stem', 'colour', edit(MINI_DRAFT, 'now: Second, new.', 'now: Out of the blue.'));
  refused('a basic land in an option', 'basic land', edit(MINI_DRAFT, 'now: New c.', 'now: Move mountains.'));
  refused('an identity name in an option', 'identity', edit(MINI_DRAFT, 'now: New c.', "now: Ask Dimir's lot."));
  refused('an identity key that is also a word (INK)', 'identity', edit(MINI_DRAFT, 'now: New c.', 'now: Sign in ink.'));
  refused('a profile name in an option (FOUR-COLOR)', 'identity', edit(MINI_DRAFT, 'now: New c.', 'now: Try four-colour.'));
  refused('a "was" line that is not what the source says', 'stale', edit(MINI_DRAFT, 'was: Old one.', 'was: Somebody edited this.'));
  refused('a "keep" line that is not what the source says', 'stale', edit(MINI_DRAFT, '(keep) Old b.', '(keep) Somebody edited this.'));
  refused('a header that miscounts its options', 'draft', edit(MINI_DRAFT, '· 4 options · 3 changed', '· 5 options · 3 changed'));
  refused('totals that disagree with the blocks', 'draft', edit(MINI_DRAFT, '14 options', '15 options'));

  // What must not be flagged.
  const mtg = trial().plan.finalModel.scenarios.find((s) => s.id === tool.MTG_STALL).options[0].text;
  t.ok('MTG_STALL may name a colour and a basic land (its option "' + mtg + '" raises no problem)', mtg === 'A red Mountain.' && trial().plan.problems.length === 0, mtg);
  const clear = (label, now) => {
    const r = trial(edit(MINI_DRAFT, 'now: New c.', 'now: ' + now));
    t.ok(label, r.plan.problems.length === 0, r.plan.problems.map((p) => p.detail).join('; '));
  };
  clear('"think", "tired" and "brown" are whole words that merely contain "ink" and "red", so they pass', "I'm tired, so I think the brown one.");
  clear('an option of exactly 15 words passes', wordsOk);

  let message = '';
  try { tool.parseDraft(edit(MINI_DRAFT, '- **AZORIUS** (keep) Old two\'s.', '- **AZORIUS** keep Old two\'s.')); } catch (e) { message = e.message; }
  t.ok('a line in an Options block that is not a known shape stops the parse, with its line number', /draft line \d+: unexpected line in \*\*Options\*\*/.test(message), message || 'no error');
}

t.finish();
