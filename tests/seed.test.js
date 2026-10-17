#!/usr/bin/env node
'use strict';
// Shared-result links (?r=&p=&c=&a=).
//  1. buildResultURL() -> parseSeedURL() round-trips identity, confidence,
//     audience and the five bar percentages for a spread of results, and the
//     parsed seed renders through loadFromSeed().
//  2. The ten links recorded in tests/fixtures/seed-urls.json still open
//     straight onto their result: the page's own start-up code parses them and
//     renders the right identity, bars, confidence, audience and next-door row.
//  3. Unknown parameters are ignored and an unknown identity falls back to the
//     welcome screen.
//  4. An appealed link (&f=) opens on the appealed identity, marked, with the
//     verdict kept in state.result.identity; an unusable f is ignored.
//  5. Scoring and instrument versions (&s= &i=) and the appeal round-trip
//     through a link; old links read as version 1; workplace links drop f.
// Usage: node tests/seed.test.js [path/to/index.html]
const path = require('path');
const { bootPage, pageArgs, whenReady, isVisible } = require('./_lib/load');
const { run } = require('./_lib/report');

const WUBRG = ['W', 'U', 'B', 'R', 'G'];
const FIXTURE = path.join(__dirname, 'fixtures', 'seed-urls.json');
const sorted = (act) => Object.entries(act).sort((a, b) => b[1] - a[1]);

const ROUND_TRIPS = [
  { id: 'MONO-G', confidence: 'HIGH', audience: 'consumer', act: { G: 0.91, W: 0.42, R: 0.38, U: 0.2, B: 0.11 } },
  { id: 'ORZHOV', confidence: 'MODERATE', audience: 'workplace', act: { W: 0.74, B: 0.7, U: 0.35, G: 0.3, R: 0.28 } },
  { id: 'BANT', confidence: 'LOW', audience: 'consumer', act: { G: 0.62, W: 0.61, U: 0.6, R: 0.31, B: 0.2 } },
  { id: 'INK', confidence: 'MODERATE', audience: 'workplace', act: { R: 0.6, U: 0.58, W: 0.57, G: 0.55, B: 0.14 } },
  { id: 'WUBRG', confidence: 'HIGH', audience: 'consumer', act: { W: 0.52, U: 0.51, B: 0.5, R: 0.5, G: 0.49 } },
  // Edges: 0 and 100, and values that sit on a rounding boundary.
  { id: 'IZZET', confidence: 'LOW', audience: 'workplace', act: { U: 1, R: 0.995, W: 0.005, B: 0.0049, G: 0 } },
];

// The next-door row each recorded link must show, worked out by hand from its
// five bars: [direction, neighbour, margin]. The margin is the gap between the
// weakest colour in and the strongest colour out (50% when all five are in),
// in answers of about 8 points: one up to 1, few up to 3, well beyond.
const RECORDED_NEXT_DOOR = {
  '?r=MONO-W&p=70,22,34,40,58&c=high&a=consumer': [['up', 'SELESNYA', 'few']],
  '?r=MONO-B&p=35,33,73,46,58&c=high&a=workplace': [['up', 'GOLGARI', 'few']],
  '?r=AZORIUS&p=64,65,32,49,26&c=moderate&a=consumer': [['up', 'JESKAI', 'few'], ['down', 'MONO-U', 'few']],
  '?r=RAKDOS&p=48,28,49,83,24&c=low&a=workplace': [['up', 'MARDU', 'one'], ['down', 'MONO-R', 'one']],
  '?r=SIMIC&p=43,75,42,35,47&c=high&a=consumer': [['up', 'BANT', 'one'], ['down', 'MONO-U', 'one']],
  '?r=ESPER&p=68,48,59,33,15&c=moderate&a=consumer': [['up', 'YORE', 'few'], ['down', 'ORZHOV', 'few']],
  '?r=TEMUR&p=33,62,9,42,68&c=high&a=workplace': [['up', 'INK', 'few'], ['down', 'SIMIC', 'few']],
  // Black and red tie at 48; ties go to WUBRG order, so red is the weakest in.
  '?r=GLINT&p=17,56,48,48,64&c=moderate&a=consumer': [['up', 'WUBRG', 'well'], ['down', 'SULTAI', 'well']],
  '?r=WITCH&p=47,55,49,19,62&c=high&a=workplace': [['up', 'WUBRG', 'well'], ['down', 'SULTAI', 'well']],
  '?r=WUBRG&p=61,38,45,39,52&c=high&a=consumer': [['down', 'DUNE', 'one']],
};

function nextDoorRows(win) {
  return [...win.document.querySelectorAll('#next-door-chips .mc-nextdoor__chip')]
    .map((chip) => [chip.dataset.dir, chip.dataset.id, chip.dataset.margin]);
}

// Bars and labels rendered for a seed, compared with what the link says.
function renderProblems(win, h, want, errors) {
  const d = win.document, problems = [];
  const need = (cond, what) => { if (!cond) problems.push(what); };
  const p = h.PROFILES[want.id];
  need(isVisible(win, 'screen-results'), 'results screen hidden');
  need(!isVisible(win, 'screen-welcome'), 'welcome screen still visible');
  need(h.state.result && h.state.result.identity === want.id, 'state.result.identity ' + (h.state.result && h.state.result.identity));
  need((d.getElementById('res-id').textContent || '').trim() === p.name.trim(), 'res-id ' + d.getElementById('res-id').textContent);
  const pcts = [...d.querySelectorAll('#res-profile-bars .mc-profile__pct')].map((e) => e.textContent).join(',');
  need(pcts === want.pcts.map((v) => v + '%').join(','), `bars ${pcts} != ${want.pcts.join(',')}`);
  need(d.getElementById('conf-badge').dataset.level === want.confidence.toLowerCase(), 'confidence ' + d.getElementById('conf-badge').dataset.level);
  need(d.body.dataset.audience === (want.audience === 'workplace' ? 'workplace' : 'forfun'), 'body audience ' + d.body.dataset.audience);
  const banter = d.getElementById('res-counter-section');
  need(!banter || (banter.style.display === 'none') === (want.audience === 'workplace'), 'banter visibility for ' + want.audience);
  need(errors.length === 0, 'errors: ' + errors.slice(0, 2).join(' | '));
  return problems;
}

function parseQuery(q) {
  const u = new URLSearchParams(q);
  return {
    id: u.get('r'), confidence: (u.get('c') || '').toUpperCase(), audience: u.get('a') === 'workplace' ? 'workplace' : 'consumer',
    pcts: (u.get('p') || '').split(',').map((n) => Math.max(0, Math.min(100, parseInt(n, 10) || 0))),
  };
}

run('seed', async ({ ok }) => {
  // ---------- 1. Round trip on one page ----------
  {
    const { win, h, errors } = bootPage({ ...pageArgs(), seed: 7 });
    await whenReady(win);
    for (const c of ROUND_TRIPS) {
      const problems = [];
      h.state.result = { identity: c.id, confidence: c.confidence, allResults: [] };
      h.state.activationSorted = sorted(c.act);
      h.state.audience = c.audience;
      const url = h.buildResultURL();
      win.history.replaceState(null, '', url);
      const seed = h.parseSeedURL();
      if (!seed) problems.push('parseSeedURL returned null for ' + url);
      else {
        if (seed.identity !== c.id) problems.push('identity ' + seed.identity);
        if (seed.confidence !== c.confidence) problems.push('confidence ' + seed.confidence);
        if (seed.audience !== c.audience) problems.push('audience ' + seed.audience);
        const back = Object.fromEntries(seed.activationSorted);
        const diff = WUBRG.filter((col) => Math.round(back[col] * 100) !== Math.round(c.act[col] * 100));
        if (diff.length) problems.push('percentages differ for ' + diff.join(''));
        const order = seed.activationSorted.map(([, v]) => v);
        if (order.some((v, i) => i > 0 && v > order[i - 1])) problems.push('activation not sorted descending');
        h.loadFromSeed(seed);
        const want = { id: c.id, confidence: c.confidence, audience: c.audience, pcts: WUBRG.map((col) => Math.round(c.act[col] * 100)) };
        problems.push(...renderProblems(win, h, want, errors));
      }
      ok(`round trip ${c.id} ${c.confidence} ${c.audience}  ${url.replace(/^https?:\/\/[^/]+\//, '')}`, problems.length === 0, problems.join('; '));
    }
    win.close();
  }

  // ---------- 2. Recorded links open onto their result ----------
  const { urls } = require(FIXTURE);
  ok('fixture holds ten recorded links', Array.isArray(urls) && urls.length === 10, 'found ' + (urls && urls.length));
  let seedNum = 50;
  const openLink = async (query) => {
    const { win, h, errors } = bootPage({ ...pageArgs(), seed: seedNum++, url: 'http://localhost/' + query });
    await whenReady(win);
    return { win, h, errors };
  };
  for (const q of urls) {
    const { win, h, errors } = await openLink(q);
    const want = parseQuery(q);
    const problems = renderProblems(win, h, want, errors);
    if (!isVisible(win, 'seed-banner')) problems.push('seed banner hidden');
    const rows = nextDoorRows(win), wantRows = RECORDED_NEXT_DOOR[q];
    if (!isVisible(win, 'next-door') || JSON.stringify(rows) !== JSON.stringify(wantRows)) {
      problems.push(`next door ${JSON.stringify(rows)} != ${JSON.stringify(wantRows)}`);
    }
    ok('recorded link renders with its next-door row ' + q, problems.length === 0, problems.join('; '));
    win.close();
  }

  // ---------- 3. Unknown parameters and identities ----------
  {
    const q = urls[0] + '&s=1&i=1&utm_source=test&zz=';
    const { win, h, errors } = await openLink(q);
    const problems = renderProblems(win, h, parseQuery(urls[0]), errors);
    ok('unknown parameters are ignored ' + q, problems.length === 0, problems.join('; '));
    win.close();
  }
  // ---------- 4. An appealed link (&f=) ----------
  {
    const q = '?r=DIMIR&p=22,78,64,11,31&c=moderate&a=consumer&f=SULTAI';
    const { win, h, errors } = await openLink(q);
    const d = win.document, problems = [];
    const r = h.state.result || {};
    if (r.identity !== 'DIMIR' || !r.appeal || r.appeal.chosen !== 'SULTAI') problems.push('state.result ' + JSON.stringify({ identity: r.identity, appeal: r.appeal }));
    if ((d.getElementById('res-id').textContent || '').trim() !== h.PROFILES.SULTAI.name) problems.push('res-id ' + d.getElementById('res-id').textContent);
    if (!isVisible(win, 'res-appeal-mark') || d.getElementById('res-appeal-mark').title !== 'Originally Dimir. You appealed.') problems.push('appeal mark');
    if (JSON.stringify(nextDoorRows(win)) !== JSON.stringify([['up', 'SULTAI', 'well'], ['down', 'MONO-U', 'well']])) problems.push('next door ' + JSON.stringify(nextDoorRows(win)));
    if (!/&f=SULTAI(&|$)/.test(h.buildResultURL())) problems.push('rebuilt link lost the appeal: ' + h.buildResultURL());
    if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
    ok('an appealed link opens on the appeal, marked ' + q, problems.length === 0, problems.join('; '));
    win.close();
  }
  // ---------- 5. Versions and the appeal round-trip (&s= &i= &f=) ----------
  {
    const { win, h, errors } = bootPage({ ...pageArgs(), seed: seedNum++ });
    await whenReady(win);
    const problems = [];
    const act = { U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 };
    h.state.result = { identity: 'DIMIR', confidence: 'MODERATE', allResults: [], scoringVersion: 2, instrumentVersion: 3, appeal: { chosen: 'SULTAI', shown: ['SULTAI', 'MONO-U'], copyVersion: 1, labelShown: 'Leaning', timeToAppealMs: 4200 } };
    h.state.activationSorted = sorted(act);
    h.state.audience = 'consumer';
    const url = h.buildResultURL();
    if (!/\?r=DIMIR&p=22,78,64,11,31&c=moderate&a=consumer&s=2&i=3&f=SULTAI$/.test(url)) problems.push('built ' + url);
    win.history.replaceState(null, '', url);
    const seed = h.parseSeedURL() || {};
    if (seed.scoringVersion !== 2 || seed.instrumentVersion !== 3 || !seed.appeal || seed.appeal.chosen !== 'SULTAI') {
      problems.push('parsed ' + JSON.stringify({ s: seed.scoringVersion, i: seed.instrumentVersion, f: seed.appeal }));
    }
    h.loadFromSeed(seed);
    const r = h.state.result || {};
    if (r.identity !== 'DIMIR' || r.scoringVersion !== 2 || r.instrumentVersion !== 3 || !r.appeal || r.appeal.chosen !== 'SULTAI') {
      problems.push('loaded ' + JSON.stringify(r));
    }
    if (!isVisible(win, 'res-appeal-mark') || (win.document.getElementById('res-id').textContent || '').trim() !== h.PROFILES.SULTAI.name) problems.push('appeal not on screen');
    if (h.buildResultURL() !== url) problems.push('rebuilt ' + h.buildResultURL());
    // Workplace mode keeps the appeal out of the link.
    h.state.audience = 'workplace';
    if (!/&a=workplace&s=2&i=3$/.test(h.buildResultURL())) problems.push('workplace ' + h.buildResultURL());
    if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
    ok('s, i and f round-trip through a link ' + url.replace(/^https?:\/\/[^/]+\//, ''), problems.length === 0, problems.join('; '));
    win.close();
  }
  {
    // Old links carry no versions: they read as 1, and links rebuilt from them say so.
    const { win, h, errors } = await openLink(urls[2]);
    const r = h.state.result || {};
    ok('an old link reads as scoring and instrument version 1 ' + urls[2],
      r.scoringVersion === 1 && r.instrumentVersion === 1 && h.buildResultURL().endsWith(urls[2] + '&s=1&i=1') && errors.length === 0,
      JSON.stringify({ s: r.scoringVersion, i: r.instrumentVersion, url: h.buildResultURL() }));
    win.close();
  }
  for (const v of ['s=abc&i=0', 's=-2&i=1.5', 's=&i=']) {
    const q = urls[0] + '&' + v;
    const { win, h, errors } = await openLink(q);
    const r = h.state.result || {};
    ok('unusable versions read as 1 ' + q, r.scoringVersion === 1 && r.instrumentVersion === 1 && errors.length === 0 && isVisible(win, 'screen-results'),
      JSON.stringify({ s: r.scoringVersion, i: r.instrumentVersion }));
    win.close();
  }

  for (const f of ['NOT-AN-IDENTITY', 'DIMIR', '']) {
    const q = '?r=DIMIR&p=22,78,64,11,31&c=moderate&a=consumer&f=' + f;
    const { win, h, errors } = await openLink(q);
    const appeal = h.state.result && h.state.result.appeal;
    ok('an unusable f is ignored ' + q, !appeal && !isVisible(win, 'res-appeal-mark') && errors.length === 0 && !/[?&]f=/.test(h.buildResultURL()),
      JSON.stringify(appeal) + ' ' + errors.slice(0, 2).join(' | '));
    win.close();
  }

  {
    const { win, h, errors } = await openLink('?r=NOT-AN-IDENTITY&p=50,50,50,50,50&c=high&a=consumer');
    ok('unknown identity falls back to the welcome screen', isVisible(win, 'screen-welcome') && !isVisible(win, 'screen-results') && !h.state.result && errors.length === 0,
      'welcome=' + isVisible(win, 'screen-welcome') + ' results=' + isVisible(win, 'screen-results') + ' errors=' + errors.slice(0, 2).join(' | '));
    win.close();
  }
});
