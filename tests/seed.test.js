#!/usr/bin/env node
'use strict';
// Shared-result links. A link written today goes through the identity's
// link-preview page, <site root>/r/<ID>.html?p=&c=&a=&s=&i=[&f=], which
// forwards to index.html?r=<ID>&p=... (tests/_lib/forward.js runs the page's
// own script to do that). Links shared before the preview pages are
// index.html?r=<ID>&p=&c=&a= and still open directly.
//  0. siteRootURL() finds the site root for GitHub Pages (with and without
//     index.html), a localhost preview, a subfolder, a query and a hash, and
//     never throws; buildResultURL() builds on it for each way of serving.
//  1. buildResultURL() -> the preview page's forward -> parseSeedURL()
//     round-trips identity, confidence, audience and the five bar percentages
//     for a spread of results, and the parsed seed renders through
//     loadFromSeed().
//  2. The ten links recorded in tests/fixtures/seed-urls.json still open
//     straight onto their result: the page's own start-up code parses them and
//     renders the right identity, bars, confidence, audience and next-door row;
//     re-shared, each gives a preview-page link that opens the same result.
//     The two preview-page links recorded beside them, after the forward, parse
//     to the same seed as the same link in the old form and render the same.
//  3. Unknown parameters are ignored and an unknown identity falls back to the
//     welcome screen.
//  4. An appealed link (&f=) opens on the appealed identity, marked, with the
//     verdict kept in state.result.identity; an unusable f is ignored.
//  5. Scoring and instrument versions (&s= &i=) and the appeal round-trip
//     through a link; old links read as version 1; workplace links drop f.
//  6. Everything that shows or copies the link uses the preview-page form: the
//     share text, Web Share, the clipboard fallback, Copy Link; the three share
//     images carry the bare site address, never a link in the old form.
//  7. All 31 identities write a link to a preview page that exists and
//     forwards to their own result.
// Usage: node tests/seed.test.js [path/to/index.html]
const fs = require('fs');
const path = require('path');
const { ROOT, bootPage, pageArgs, whenReady, isVisible } = require('./_lib/load');
const { followShareLink } = require('./_lib/forward');
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

// The same, for the two preview-page links recorded in the fixture (previewUrls),
// worked out by hand from their bars. Dimir (blue 56, black 68; white 53 is the
// strongest colour out): the gap is 3 points, under one answer. Sultai (blue 57,
// black 52, green 61; white 34 is the strongest out): 18 points, two answers and
// a bit. Dimir plus white is Esper, minus blue is Mono-Black; Sultai plus white
// is Witch-Maw, minus black is Simic.
const RECORDED_PREVIEW_NEXT_DOOR = {
  'r/DIMIR.html?p=53,56,68,32,38&c=moderate&a=consumer&s=1&i=1': [['up', 'ESPER', 'one'], ['down', 'MONO-B', 'one']],
  'r/SULTAI.html?p=34,57,52,29,61&c=high&a=workplace&s=1&i=1': [['up', 'WITCH', 'few'], ['down', 'SIMIC', 'few']],
};

// Page URLs the site is reached by, and the root a share link must be built on:
// [page URL, site root, what it is].
const SITE_ROOTS = [
  ['https://ozculain.github.io/manacurve/', 'https://ozculain.github.io/manacurve/', 'GitHub Pages, no index.html'],
  ['https://ozculain.github.io/manacurve/index.html', 'https://ozculain.github.io/manacurve/', 'GitHub Pages, index.html'],
  ['https://ozculain.github.io/manacurve/index.html?r=DIMIR&p=22,78,64,11,31&c=moderate&a=consumer#top', 'https://ozculain.github.io/manacurve/', 'a result link after the preview page forwarded, with a hash'],
  ['https://ozculain.github.io/manacurve/?debug=1', 'https://ozculain.github.io/manacurve/', 'GitHub Pages, query string'],
  ['http://127.0.0.1:4179/index.html', 'http://127.0.0.1:4179/', 'a localhost preview'],
  ['http://127.0.0.1:4179/', 'http://127.0.0.1:4179/', 'a localhost preview, no index.html'],
  ['http://localhost:8000/manacurve/', 'http://localhost:8000/manacurve/', 'served from /manacurve/ without index.html'],
  ['http://localhost/', 'http://localhost/', 'the tests\' own origin'],
  ['https://example.com', 'https://example.com/', 'a bare host'],
  ['file:///C:/Users/me/MTGPsych/index.html', 'file:///C:/Users/me/MTGPsych/', 'opened from disk'],
];
// Page URLs that cannot be a base for a link: the live site stands in, and nothing throws.
const UNUSABLE_PAGES = ['about:srcdoc', 'about:blank', 'data:text/html,hi', '', undefined, null];

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
  // The banter box shows for a consumer when the profile has a closing line.
  need(!banter || (banter.style.display === 'none') === (want.audience === 'workplace' || !p.pubBanter), 'banter visibility for ' + want.audience);
  need(errors.length === 0, 'errors: ' + errors.slice(0, 2).join(' | '));
  return problems;
}

// The preview-page form of an old-form query: ?r=ID&rest becomes r/ID.html?rest.
const previewForm = (query) => query.replace(/^\?r=([^&]+)&/, 'r/$1.html?');

function parseQuery(q) {
  const u = new URLSearchParams(q);
  return {
    id: u.get('r'), confidence: (u.get('c') || '').toUpperCase(), audience: u.get('a') === 'workplace' ? 'workplace' : 'consumer',
    pcts: (u.get('p') || '').split(',').map((n) => Math.max(0, Math.min(100, parseInt(n, 10) || 0))),
  };
}

run('seed', async ({ ok }) => {
  // Pages for the preview-page tests take seeds from 300 up, apart from the older sections' own.
  let newSeed = 300;
  const openAt = async (url) => {
    const { win, h, errors } = bootPage({ ...pageArgs(), seed: newSeed++, url });
    await whenReady(win);
    return { win, h, errors };
  };

  // ---------- 0. The site root, and the link on each way of serving the site ----------
  {
    const { win, errors } = await openAt('http://localhost/');
    for (const [page, root, what] of SITE_ROOTS) {
      const got = win.siteRootURL(page);
      ok(`siteRootURL: ${what}  ${page}`, got === root, `got ${got}, wanted ${root}`);
    }
    for (const page of UNUSABLE_PAGES) {
      let got, threw = '';
      try { got = win.siteRootURL(page); } catch (e) { threw = e.message; }
      ok(`siteRootURL never throws, and gives the live site for ${JSON.stringify(page)}`,
        !threw && got === 'https://ozculain.github.io/manacurve/', threw || 'got ' + got);
    }
    ok('no errors while finding the site root', errors.length === 0, errors.slice(0, 2).join(' | '));
    win.close();
  }
  // buildResultURL() where the site is really served: the link goes to that site's r/ folder, the
  // preview page forwards to that site's index.html, and the page it lands on writes the same link.
  for (const [page, root, what] of SITE_ROOTS.filter(([p]) => /^https?:/.test(p) && !/[?#]/.test(p) && p !== 'http://localhost/')) {
    const { win, h, errors } = await openAt(page);
    const problems = [];
    h.state.result = { identity: 'DIMIR', confidence: 'MODERATE', allResults: [] };
    h.state.activationSorted = sorted({ U: 0.78, B: 0.64, G: 0.31, W: 0.22, R: 0.11 });
    h.state.audience = 'consumer';
    const url = h.buildResultURL();
    const want = root + 'r/DIMIR.html?p=22,78,64,11,31&c=moderate&a=consumer&s=1&i=1';
    if (url !== want) problems.push(`built ${url}, wanted ${want}`);
    const landed = followShareLink(url);
    const wantLanded = root + 'index.html?r=DIMIR&p=22,78,64,11,31&c=moderate&a=consumer&s=1&i=1';
    if (landed !== wantLanded) problems.push(`forwarded to ${landed}, wanted ${wantLanded}`);
    win.history.replaceState(null, '', landed);
    const seed = h.parseSeedURL() || {};
    if (seed.identity !== 'DIMIR' || seed.confidence !== 'MODERATE' || seed.audience !== 'consumer'
      || seed.activationSorted.map(([c, v]) => c + Math.round(v * 100)).join() !== 'U78,B64,G31,W22,R11') problems.push('parsed ' + JSON.stringify(seed));
    if (h.buildResultURL() !== url) problems.push('the landing page writes ' + h.buildResultURL());
    if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
    ok(`share link, ${what}: ${page} -> ${url}`, problems.length === 0, problems.join('; '));
    win.close();
  }

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
      // A visitor lands on index.html, not on the link: the preview page forwards there.
      win.history.replaceState(null, '', followShareLink(url));
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

    // Shared again, an old link comes out as a preview-page link, which opens onto the same seed.
    const again = [];
    const seedBefore = h.parseSeedURL();
    const reshared = h.buildResultURL();
    if (reshared !== 'http://localhost/' + previewForm(q) + '&s=1&i=1') again.push('re-shared as ' + reshared);
    win.history.replaceState(null, '', followShareLink(reshared));
    if (!seedBefore || JSON.stringify(h.parseSeedURL()) !== JSON.stringify(seedBefore)) again.push('the re-shared link parses to ' + JSON.stringify(h.parseSeedURL()) + ', not ' + JSON.stringify(seedBefore));
    ok('recorded link re-shares as a preview-page link that opens the same result ' + q, again.length === 0, again.join('; '));
    win.close();
  }

  // ---------- 2b. Recorded preview-page links ----------
  // Written by the build that points share links at the preview pages. After the page's forward
  // they are the old form with r=<ID> in front, so they must parse to the same seed and render
  // the same page as that old-form link.
  const { previewUrls } = require(FIXTURE);
  ok('fixture holds two recorded preview-page links', Array.isArray(previewUrls) && previewUrls.length === 2, 'found ' + (previewUrls && previewUrls.length));
  for (const link of previewUrls || []) {
    const m = /^r\/([A-Z0-9]+(?:-[A-Z0-9]+)*)\.html\?(.+)$/.exec(link);
    if (!m) { ok('recorded preview-page link is r/<ID>.html?<query> ' + link, false, 'no match'); continue; }
    const [, id, query] = m;
    const problems = [];
    if (/(^|&)r=/.test(query)) problems.push('the link carries r in its query');
    const landed = followShareLink('http://localhost/' + link);
    const wantLanded = `http://localhost/index.html?r=${id}&${query}`;
    if (landed !== wantLanded) problems.push(`forwarded to ${landed}, wanted ${wantLanded}`);
    const oldForm = `?r=${id}&${query}`;
    // The same seed for both pages, so anything the page randomises matches.
    const seed = newSeed++;
    const open = async (url) => { const page = bootPage({ ...pageArgs(), seed, url }); await whenReady(page.win); return page; };
    const viaPreview = await open(landed);
    const direct = await open('http://localhost/' + oldForm);
    const seedA = viaPreview.h.parseSeedURL(), seedB = direct.h.parseSeedURL();
    if (!seedA || JSON.stringify(seedA) !== JSON.stringify(seedB)) problems.push(`parses to ${JSON.stringify(seedA)}, the old form to ${JSON.stringify(seedB)}`);
    problems.push(...renderProblems(viaPreview.win, viaPreview.h, parseQuery(oldForm), viaPreview.errors));
    if (!isVisible(viaPreview.win, 'seed-banner')) problems.push('seed banner hidden');
    const rows = nextDoorRows(viaPreview.win), wantRows = RECORDED_PREVIEW_NEXT_DOOR[link];
    if (!isVisible(viaPreview.win, 'next-door') || JSON.stringify(rows) !== JSON.stringify(wantRows)) problems.push(`next door ${JSON.stringify(rows)} != ${JSON.stringify(wantRows)}`);
    const screenOf = (page) => page.win.document.getElementById('screen-results').innerHTML;
    if (screenOf(viaPreview) !== screenOf(direct)) problems.push('the results screen differs from the old form\'s');
    const rebuilt = viaPreview.h.buildResultURL();
    if (rebuilt !== 'http://localhost/' + link) problems.push('sharing it again writes ' + rebuilt);
    ok('recorded preview-page link opens onto the same result as the old form ' + link, problems.length === 0, problems.join('; '));
    viaPreview.win.close();
    direct.win.close();
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
    if (!/\/r\/DIMIR\.html\?p=22,78,64,11,31&c=moderate&a=consumer&s=2&i=3&f=SULTAI$/.test(url)) problems.push('built ' + url);
    win.history.replaceState(null, '', followShareLink(url));
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
    // Old links carry no versions: they read as 1, and links rebuilt from them say so, in the
    // preview-page form (the old ?r=ID&rest becomes r/ID.html?rest).
    const { win, h, errors } = await openLink(urls[2]);
    const r = h.state.result || {};
    ok('an old link reads as scoring and instrument version 1 ' + urls[2],
      r.scoringVersion === 1 && r.instrumentVersion === 1 && h.buildResultURL().endsWith(previewForm(urls[2]) + '&s=1&i=1') && errors.length === 0,
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

  // ---------- 6. Everything that shows or copies the link uses the preview-page form ----------
  {
    // A result opened on GitHub Pages: the page writes its link on that site.
    const { win, h, errors } = await openAt('https://ozculain.github.io/manacurve/index.html?r=DIMIR&p=22,78,64,11,31&c=moderate&a=consumer');
    const d = win.document, problems = [];
    const want = 'https://ozculain.github.io/manacurve/r/DIMIR.html?p=22,78,64,11,31&c=moderate&a=consumer&s=1&i=1';
    if (h.buildResultURL() !== want) problems.push('buildResultURL ' + h.buildResultURL());

    // The share text on the results screen, and what Copy to Clipboard copies from it.
    const preview = d.getElementById('share-preview').textContent;
    if (preview.split('\n').pop() !== 'Take the test: ' + want) problems.push('share text ends ' + JSON.stringify(preview.split('\n').pop()));
    let copied = null;
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async (s) => { copied = s; } } });
    win.copyResult();
    if (copied !== preview) problems.push('copyResult copied ' + JSON.stringify(copied));

    // Share, beside the identity: Web Share, then the clipboard fallback.
    let shared = null;
    Object.defineProperty(win.navigator, 'share', { configurable: true, value: async (data) => { shared = data; } });
    await win.shareResult(null);
    if (!shared || shared.url !== want) problems.push('Web Share ' + JSON.stringify(shared));
    delete win.navigator.share;
    copied = null;
    await win.shareResult(d.getElementById('res-banner-share'));
    if (!copied || !copied.endsWith(' ' + want)) problems.push('share clipboard ' + JSON.stringify(copied));

    // The share screen: Copy Link, and the footers of the three images.
    win.showShareScreen();
    copied = null;
    win.copyShareLink();
    if (copied !== want) problems.push('Copy Link ' + JSON.stringify(copied));
    for (const [selector, what] of [['#share-tcg .mc-tcg__foot', 'Card'], ['#share-scorecard .mc-card__foot', 'Scorecard'], ['#share-mani .mc-mani__cta', 'Story']]) {
      const foot = (d.querySelector(selector) || {}).textContent || '';
      if (!foot.includes('ozculain.github.io/manacurve')) problems.push(`${what} footer "${foot.trim()}" lacks the site address`);
    }
    // No old-form link anywhere a person reads or copies one.
    const shown = preview + '\n' + d.getElementById('screen-share').textContent;
    if (/[?&]r=[A-Z]/.test(shown) || /index\.html\?/.test(shown)) problems.push('an old-form link is on screen');
    if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
    ok('share text, Web Share, clipboard, Copy Link and the footers use the preview-page form ' + want, problems.length === 0, problems.join('; '));
    win.close();
  }

  // ---------- 7. Every identity writes a link to a preview page that exists ----------
  {
    const { win, h, errors } = await openAt('http://localhost/');
    const ids = Object.keys(h.PROFILES);
    const problems = [];
    for (const id of ids) {
      h.state.result = { identity: id, confidence: 'MODERATE', allResults: [] };
      h.state.activationSorted = sorted({ W: 0.5, U: 0.5, B: 0.5, R: 0.5, G: 0.5 });
      h.state.audience = 'consumer';
      const url = h.buildResultURL();
      if (url !== `http://localhost/r/${id}.html?p=50,50,50,50,50&c=moderate&a=consumer&s=1&i=1`) problems.push(`${id}: built ${url}`);
      if (!fs.existsSync(path.join(ROOT, 'r', id + '.html'))) { problems.push(`${id}: r/${id}.html is missing (run npm run previews)`); continue; }
      try {
        const landed = new URL(followShareLink(url));
        if (landed.pathname !== '/index.html' || landed.searchParams.get('r') !== id) problems.push(`${id}: forwards to ${landed.href}`);
      } catch (e) { problems.push(`${id}: ${e.message}`); }
    }
    ok(`all ${ids.length} identities write a link to their own preview page, which forwards to their result`, problems.length === 0 && errors.length === 0,
      problems.slice(0, 4).join('; ') + errors.slice(0, 2).join(' | '));
    win.close();
  }
});
