#!/usr/bin/env node
'use strict';
// Link-preview pages (r/<ID>.html, written by tools/build-previews.js).
//  1. The committed r/ is exactly what the generator writes today: it regenerates into a
//     temporary directory and compares file names and bytes, so a stale or hand-edited page
//     fails. A second run changes nothing, and the generator refuses to write outside r/.
//  2. Each of the 31 pages carries og:title, og:description, og:image (an absolute https URL
//     of an image that exists, with its real size), og:url, twitter:card and a canonical
//     link, shows the identity and the art, and loads nothing that is missing.
//  3. The forwarding script keeps the query string and hash exactly as they arrived (it is
//     evaluated against a fake location), adds r=<ID> only when the link has none, and the
//     forwarded link opens the real page onto the right result.
//  4. The generator's own rules: JPEG header parsing, escaping, one-sentence descriptions.
// Usage: node tests/previews.test.js [path/to/index.html]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { ROOT, bootPage, pageArgs, whenReady, isVisible } = require('./_lib/load');
const { forward } = require('./_lib/forward');
const { run } = require('./_lib/report');
const gen = require('../tools/build-previews');
const { JSDOM } = require(path.join(ROOT, 'node_modules', 'jsdom'));

const CLI = path.join(ROOT, 'tools', 'build-previews.js');
const COMMITTED = path.join(ROOT, 'r');
const { SITE } = gen;
const WUBRG = ['W', 'U', 'B', 'R', 'G'];

const htmlFiles = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []);
const parse = (html) => new JSDOM(html).window.document;
const attr = (doc, selector, name) => { const el = doc.querySelector(selector); return el ? el.getAttribute(name) : null; };
const content = (doc, selector) => attr(doc, selector, 'content');
const withoutSite = (url) => (typeof url === 'string' && url.startsWith(SITE) ? url.slice(SITE.length) : null);

// A JPEG made of the given marker segments, for the header parser.
function segment(marker, payload) {
  const length = Buffer.alloc(2);
  length.writeUInt16BE(payload.length + 2);
  return Buffer.concat([Buffer.from([0xFF, marker]), length, payload]);
}
function frame(marker, width, height) {
  const p = Buffer.alloc(15);
  p[0] = 8;                       // precision
  p.writeUInt16BE(height, 1);
  p.writeUInt16BE(width, 3);
  p[5] = 3;                       // components
  return segment(marker, p);
}
const SOI = Buffer.from([0xFF, 0xD8]);
const SOS = segment(0xDA, Buffer.from([0, 0, 0]));

run('previews', async ({ ok }) => {
  const { PROFILES } = gen.loadData();
  const ids = Object.keys(PROFILES).sort();
  const pageUrl = (id) => SITE + 'r/' + id + '.html';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mana-previews-'));

  try {
    // ---------- 1. The committed r/ is a fresh build ----------
    const out = path.join(tmp, 'r');
    const first = spawnSync(process.execPath, [CLI, '--out', out], { encoding: 'utf8' });
    ok('generator runs into a temporary r/', first.status === 0 && htmlFiles(out).length === ids.length, (first.stderr || first.stdout || '').trim());

    const want = htmlFiles(out);
    const have = htmlFiles(COMMITTED);
    const missing = want.filter((n) => !have.includes(n));
    const extra = have.filter((n) => !want.includes(n));
    ok(`committed r/ holds exactly the ${ids.length} identity pages`,
      want.length === ids.length && !missing.length && !extra.length,
      (missing.length ? 'missing ' + missing.join(', ') + '; ' : '') + (extra.length ? 'unexpected ' + extra.join(', ') : '') + ' (run npm run previews)');

    const stale = want.filter((n) => have.includes(n) && !fs.readFileSync(path.join(out, n)).equals(fs.readFileSync(path.join(COMMITTED, n))));
    ok('committed r/ matches a fresh build byte for byte', stale.length === 0 && !missing.length,
      'stale: ' + stale.concat(missing).join(', ') + ' (run npm run previews)');

    const again = spawnSync(process.execPath, [CLI, '--out', out], { encoding: 'utf8' });
    ok('a second run changes nothing', again.status === 0 && /\(0 written, \d+ unchanged, 0 removed\)/.test(again.stdout),
      (again.stderr || again.stdout || '').trim());

    fs.writeFileSync(path.join(out, 'OLD-IDENTITY.html'), 'left over');
    fs.writeFileSync(path.join(out, 'notes.txt'), 'not a page');
    const pruned = spawnSync(process.execPath, [CLI, '--out', out], { encoding: 'utf8' });
    ok('a page left over from a removed identity is deleted, other files are left alone',
      pruned.status === 0 && !fs.existsSync(path.join(out, 'OLD-IDENTITY.html')) && fs.existsSync(path.join(out, 'notes.txt')) && /1 removed/.test(pruned.stdout),
      (pruned.stderr || pruned.stdout || '').trim());

    // ---------- Refusals: nothing is written outside r/ ----------
    const pages = gen.generate();
    ok('generate() returns one page per PROFILES identity, sorted', pages.length === ids.length && pages.every((p, i) => p.id === ids[i] && p.name === ids[i] + '.html'),
      pages.length + ' pages for ' + ids.length + ' identities');
    const thrown = (fn) => { try { fn(); return ''; } catch (e) { return e.message; } };
    const throws = (fn, pattern) => pattern.test(thrown(fn));
    ok('writePages refuses a directory not named r, and creates nothing',
      throws(() => gen.writePages(pages, path.join(tmp, 'elsewhere')), /must be named "r"/) && !fs.existsSync(path.join(tmp, 'elsewhere')),
      thrown(() => gen.writePages(pages, path.join(tmp, 'elsewhere'))));
    const nameDir = path.join(tmp, 'names', 'r');
    const badNames = ['../evil.html', 'index.html', 'A/B.html', 'A\\B.html', 'dimir.html', 'DIMIR.htm', ''];
    const nameProblems = badNames.filter((name) => !throws(() => gen.writePages([{ name, html: 'x' }], nameDir), /not an identity page name/));
    ok('writePages refuses a path-like or non-identity file name, and creates nothing',
      !nameProblems.length && !fs.existsSync(path.join(tmp, 'names')) && !fs.existsSync(path.join(tmp, 'evil.html')),
      'accepted or mis-reported: ' + JSON.stringify(nameProblems));
    const plainDir = path.join(tmp, 'plain', 'r');
    fs.mkdirSync(path.join(plainDir, pages[0].name), { recursive: true });
    ok('writePages never writes through an entry that is not a plain file',
      throws(() => gen.writePages(pages, plainDir), /not a plain file/), thrown(() => gen.writePages(pages, plainDir)));
    const refused = spawnSync(process.execPath, [CLI, '--out', path.join(tmp, 'elsewhere')], { encoding: 'utf8' });
    ok('command line refuses --out outside a directory named r', refused.status !== 0 && /must be named "r"/.test(refused.stderr) && !fs.existsSync(path.join(tmp, 'elsewhere')),
      'status ' + refused.status + ' ' + (refused.stderr || '').trim());
    ok('command line rejects an unknown argument', spawnSync(process.execPath, [CLI, '--nope'], { encoding: 'utf8' }).status === 2);

    // ---------- 2. Tags, image and body on every page ----------
    const scripts = {};
    for (const id of ids) {
      const file = path.join(COMMITTED, id + '.html');
      const problems = [];
      const need = (cond, what) => { if (!cond) problems.push(what); };
      if (!fs.existsSync(file)) { ok(`r/${id}.html tags, image and body`, false, 'file is missing (run npm run previews)'); continue; }
      const html = fs.readFileSync(file, 'utf8');
      const doc = parse(html);
      const p = PROFILES[id];
      need(!html.includes('\r') && html.charCodeAt(0) !== 0xFEFF && html.endsWith('</html>\n'), 'not LF, BOM-free and newline-terminated');
      need(/^<!doctype html>/.test(html) && doc.documentElement.lang === 'en', 'doctype or lang');
      need(doc.querySelector('meta[charset]') && /utf-8/i.test(attr(doc, 'meta[charset]', 'charset')), 'charset');
      need(/width=device-width/.test(content(doc, 'meta[name="viewport"]') || ''), 'viewport');
      need(doc.title === 'The Mana Curve — ' + p.name, 'title ' + doc.title);

      const ogTitle = content(doc, 'meta[property="og:title"]');
      need(ogTitle === p.name + ' — ' + p.tag, 'og:title ' + ogTitle);
      const ogDesc = content(doc, 'meta[property="og:description"]');
      const philosophy = p.philosophy.replace(/\s+/g, ' ').trim();
      need(ogDesc && ogDesc.length <= gen.DESCRIPTION_MAX && !/[<>]/.test(ogDesc) && philosophy.startsWith(ogDesc.replace(/…$/, '')), 'og:description ' + ogDesc);
      need(content(doc, 'meta[name="description"]') === ogDesc, 'meta description differs from og:description');
      need(content(doc, 'meta[property="og:type"]') === 'website', 'og:type');
      need(content(doc, 'meta[property="og:url"]') === pageUrl(id), 'og:url ' + content(doc, 'meta[property="og:url"]'));

      const ogImage = content(doc, 'meta[property="og:image"]');
      need(/^https:\/\/[^/\s]+\/\S+\.jpg$/.test(ogImage || ''), 'og:image is not an absolute https URL: ' + ogImage);
      const imageRel = withoutSite(ogImage);
      const imageFile = imageRel && path.join(ROOT, ...imageRel.split('/'));
      need(imageRel === 'images/commanders/' + id + '.jpg' && imageFile && fs.existsSync(imageFile), 'og:image does not point at an existing images/commanders/' + id + '.jpg: ' + ogImage);
      if (imageFile && fs.existsSync(imageFile)) {
        const size = gen.jpegSize(fs.readFileSync(imageFile));
        need(content(doc, 'meta[property="og:image:width"]') === String(size.width) && content(doc, 'meta[property="og:image:height"]') === String(size.height),
          `og:image size ${content(doc, 'meta[property="og:image:width"]')}x${content(doc, 'meta[property="og:image:height"]')} != file ${size.width}x${size.height}`);
        // Twitter's large-card limits: at least 300x157, at most 4096x4096 and 5 MB.
        need(size.width >= 300 && size.height >= 157 && size.width <= 4096 && size.height <= 4096 && fs.statSync(imageFile).size < 5 * 1024 * 1024, 'image outside the card limits');
        need(attr(doc, 'img', 'width') === String(size.width) && attr(doc, 'img', 'height') === String(size.height), 'img width/height attributes');
      }
      need(content(doc, 'meta[property="og:image:type"]') === 'image/jpeg', 'og:image:type');
      need(!!content(doc, 'meta[property="og:image:alt"]'), 'og:image:alt');

      need(content(doc, 'meta[name="twitter:card"]') === 'summary_large_image', 'twitter:card');
      need(content(doc, 'meta[name="twitter:title"]') === ogTitle && content(doc, 'meta[name="twitter:description"]') === ogDesc && content(doc, 'meta[name="twitter:image"]') === ogImage, 'twitter:title, description or image differ from og:');

      const canonical = attr(doc, 'link[rel="canonical"]', 'href');
      need(canonical === SITE + 'index.html?r=' + id, 'canonical ' + canonical);
      need(attr(doc, 'noscript meta[http-equiv="refresh"]', 'content') === '0;url=../index.html?r=' + id, 'noscript meta refresh');
      need(!doc.querySelector('head > meta[http-equiv="refresh"]'), 'a meta refresh outside noscript would race the script');
      need(/query string/.test(html.slice(0, html.indexOf('<noscript>'))), 'comment explaining the no-JS fallback');

      need(doc.querySelector('h1') && doc.querySelector('h1').textContent === p.name, 'h1');
      need(attr(doc, 'img', 'src') === '../images/commanders/' + id + '.jpg', 'img src');
      need(/Opening your result…/.test(doc.body.textContent), 'status line');
      need(attr(doc, 'a[href]', 'href') === '../index.html?r=' + id, 'fallback link');
      need(/© Wizards of the Coast/.test(doc.body.textContent) && /Scryfall/.test(doc.body.textContent), 'art credit');
      need(/#101b20/.test(html) && /#eae7dc/.test(html), 'page colours');
      for (const [selector, name] of [['img', 'src'], ['link[rel="icon"]', 'href'], ['a[href]', 'href']]) {
        const target = attr(doc, selector, name);
        need(target && fs.existsSync(path.resolve(COMMITTED, target.split('?')[0])), `${selector} target ${target} does not exist`);
      }

      const inline = [...doc.querySelectorAll('script')];
      need(inline.length === 1 && !inline[0].getAttribute('src') && /location\.replace\(/.test(inline[0].textContent), 'exactly one inline forwarding script');
      if (inline.length === 1) scripts[id] = inline[0].textContent;
      ok(`r/${id}.html tags, image and body`, problems.length === 0, problems.join('; '));
    }

    // ---------- 3. The forwarding script ----------
    const sample = '?p=48,75,62,30,28&c=high&a=consumer';
    for (const id of ids) {
      const code = scripts[id];
      if (!code) { ok(`r/${id}.html forwards ${sample}`, false, 'no script to run'); continue; }
      const problems = [];
      let calls = [];
      try { calls = forward(code, sample); } catch (e) { problems.push('script threw ' + e.message); }
      const wantRel = '../index.html?r=' + id + '&' + sample.slice(1);
      if (calls.length !== 1) problems.push('forwarded ' + calls.length + ' times');
      else {
        if (calls[0] !== wantRel) problems.push(`forwarded to ${calls[0]}, wanted ${wantRel}`);
        const resolved = new URL(calls[0], pageUrl(id)).href;
        if (resolved !== SITE + 'index.html?r=' + id + '&' + sample.slice(1)) problems.push('resolves to ' + resolved);
      }
      ok(`r/${id}.html forwards ${sample}`, problems.length === 0, problems.join('; '));
    }

    {
      const id = 'DIMIR';
      const code = scripts[id] || '';
      if (!code) ok('DIMIR forwarding script is present for the edge cases', false, 'r/DIMIR.html has no inline script');
      const cases = [
        // [description, search, hash, expected forwarded URL, the r that index.html will read]
        ['keeps the hash', sample, '#share', '../index.html?r=DIMIR&p=48,75,62,30,28&c=high&a=consumer#share', 'DIMIR'],
        ['no query string: identity only', '', '', '../index.html?r=DIMIR', 'DIMIR'],
        ['no query string, with a hash', '', '#top', '../index.html?r=DIMIR#top', 'DIMIR'],
        ['a link that already carries r is not touched', '?r=DIMIR&p=48,75,62,30,28&c=high&a=consumer', '', '../index.html?r=DIMIR&p=48,75,62,30,28&c=high&a=consumer', 'DIMIR'],
        ["an r later in the query is the link's own and is not touched", '?c=high&r=AZORIUS', '', '../index.html?c=high&r=AZORIUS', 'AZORIUS'],
        ['odd bytes survive verbatim', '?p=1%2C2&note=a+b%20c&x=%E2%9C%93&y=&=z&&', '', '../index.html?r=DIMIR&p=1%2C2&note=a+b%20c&x=%E2%9C%93&y=&=z&&', 'DIMIR'],
        ['an empty r gives way to the identity', '?r=&p=1', '', '../index.html?r=DIMIR&r=&p=1', 'DIMIR'],
        ['later parameters (s, i, f, v) are kept in order', sample + '&s=2&i=1&f=SIMIC&v=K7Q2', '', '../index.html?r=DIMIR&p=48,75,62,30,28&c=high&a=consumer&s=2&i=1&f=SIMIC&v=K7Q2', 'DIMIR'],
      ];
      for (const [what, search, hash, expected, effectiveR] of cases) {
        let calls = [];
        let error = '';
        try { calls = forward(code, search, hash); } catch (e) { error = 'script threw ' + e.message; }
        const got = calls.length === 1 ? calls[0] : calls.length + ' calls';
        const read = calls.length === 1 ? new URLSearchParams(calls[0].split('#')[0].split('?')[1] || '').get('r') : null;
        ok(`DIMIR forward ${what}`, !error && got === expected && read === effectiveR, error || `got ${got} (r=${read}), wanted ${expected} (r=${effectiveR})`);
      }
    }

    // ---------- The forwarded link opens the real page onto the result ----------
    // index.html opens a result only for ?r=<identity>, which is why the script supplies it.
    const journeys = [
      { id: 'DIMIR', search: '?p=48,75,62,30,28&c=high&a=consumer', pcts: [48, 75, 62, 30, 28], confidence: 'HIGH', audience: 'consumer' },
      { id: 'MONO-W', search: '?p=90,10,5,12,8&c=moderate&a=workplace', pcts: [90, 10, 5, 12, 8], confidence: 'MODERATE', audience: 'workplace' },
      { id: 'WUBRG', search: '?p=52,51,50,50,49&c=low&a=consumer', pcts: [52, 51, 50, 50, 49], confidence: 'LOW', audience: 'consumer' },
    ];
    let seed = 400;
    for (const j of journeys) {
      const problems = [];
      if (!scripts[j.id]) { ok(`r/${j.id}.html${j.search} opens the ${j.id} result`, false, 'no forwarding script to run'); continue; }
      const [forwarded] = forward(scripts[j.id], j.search, '');
      const query = new URL(forwarded, 'http://localhost/manacurve/r/' + j.id + '.html').search;
      const { win, h, errors } = bootPage({ ...pageArgs(), seed: seed++, url: 'http://localhost/' + query });
      await whenReady(win);
      const result = h.state.result;
      if (!isVisible(win, 'screen-results')) problems.push('results screen hidden');
      if (!result || result.identity !== j.id) problems.push('identity ' + (result && result.identity));
      if (result && result.confidence !== j.confidence) problems.push('confidence ' + result.confidence);
      if (h.state.audience !== j.audience) problems.push('audience ' + h.state.audience);
      const bars = Object.fromEntries(h.state.activationSorted || []);
      const got = WUBRG.map((c) => Math.round((bars[c] || 0) * 100));
      if (got.join(',') !== j.pcts.join(',')) problems.push('bars ' + got.join(',') + ' != ' + j.pcts.join(','));
      if (errors.length) problems.push('errors: ' + errors.slice(0, 2).join(' | '));
      ok(`r/${j.id}.html${j.search} opens the ${j.id} result`, problems.length === 0, problems.join('; '));
      win.close();
    }

    // ---------- 4. The generator's own rules ----------
    {
      const dims = (buf) => { try { const s = gen.jpegSize(buf); return s.width + 'x' + s.height; } catch (e) { return 'throws: ' + e.message; } };
      const exif = segment(0xE1, Buffer.concat([Buffer.from('Exif\0\0'), Buffer.from([0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x10, 0x00, 0x20, 0x03])]));
      ok('jpegSize reads a baseline frame header', dims(Buffer.concat([SOI, segment(0xE0, Buffer.alloc(14)), frame(0xC0, 626, 457), SOS])) === '626x457');
      ok('jpegSize reads a progressive frame header', dims(Buffer.concat([SOI, frame(0xC2, 1200, 630), SOS])) === '1200x630');
      ok('jpegSize skips marker bytes inside other segments (an EXIF thumbnail)', dims(Buffer.concat([SOI, exif, frame(0xC0, 564, 291), SOS])) === '564x291');
      ok('jpegSize does not take a Huffman table for the frame header', dims(Buffer.concat([SOI, segment(0xC4, Buffer.from([0, 0, 8, 0, 9, 0, 7, 0])), frame(0xC0, 300, 200), SOS])) === '300x200');
      ok('jpegSize accepts fill bytes before a marker', dims(Buffer.concat([SOI, Buffer.from([0xFF, 0xFF]), frame(0xC0, 40, 30), SOS])) === '40x30');
      ok('jpegSize rejects a PNG', /not a JPEG/.test(dims(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))));
      ok('jpegSize rejects a JPEG cut off before its frame header', /throws/.test(dims(Buffer.concat([SOI, segment(0xE0, Buffer.alloc(14))]))));
      ok('jpegSize rejects a scan with no frame header before it', /throws/.test(dims(Buffer.concat([SOI, SOS]))));
      ok('jpegSize rejects a zero size', /throws/.test(dims(Buffer.concat([SOI, frame(0xC0, 0, 10), SOS]))));
    }
    {
      const stripped = gen.plain('<b>Hi</b>&nbsp;there &amp; <i>you</i>, &lt;ok&gt; &#39;x&#39; &#x2014; done<br>Next<p>Para</p><style>p{color:red}</style>');
      ok('plain drops tags and decodes entities', stripped === "Hi there & you, <ok> 'x' — done Next Para", JSON.stringify(stripped));
      ok('plain leaves a bare less-than sign alone', gen.plain('if x < y and y > z') === 'if x < y and y > z');
      ok('firstSentence stops at the first full stop', gen.firstSentence('One thing. Another thing.') === 'One thing.');
      ok('firstSentence keeps a closing quote and ignores a stop inside a number', gen.firstSentence('He said "stop." Then left.') === 'He said "stop."' && gen.firstSentence('It is 3.5 times worse! Really.') === 'It is 3.5 times worse!');
      ok('firstSentence returns text with no terminator whole', gen.firstSentence('no end here') === 'no end here');
      const long = ('word '.repeat(80)).trim();
      const clipped = gen.clip(long, 200);
      ok('clip cuts on a word boundary within the limit and marks the cut', clipped.length <= 200 && clipped.endsWith('…') && /word…$/.test(clipped) && gen.clip('short', 200) === 'short', clipped.length + ' chars');
    }
    {
      const image = { width: 10, height: 20 };
      const profile = { name: 'A&B "C" <i>', tag: "It's <b>bold</b> & loud", cmd: 'The <script>alert(1)</script> Card', philosophy: 'You say "hi" & <script>alert(2)</script> go. Next sentence.' };
      const html = gen.renderPage(gen.pageModel({ id: 'TEST-X', profile, oracle: { artist: 'Ann & Bob "B"' }, image }));
      const doc = parse(html);
      ok('hostile profile text is escaped: attributes and text read back as plain text',
        content(doc, 'meta[property="og:title"]') === 'A&B "C" — It\'s bold & loud' &&
        content(doc, 'meta[property="og:description"]') === 'You say "hi" & go.' &&
        doc.querySelector('h1').textContent === 'A&B "C"' &&
        /by Ann & Bob "B"\./.test(doc.querySelector('.credit').textContent) &&
        doc.querySelectorAll('script').length === 1 && !/alert/.test(html),
        content(doc, 'meta[property="og:title"]') + ' | ' + content(doc, 'meta[property="og:description"]'));
      // COMMANDER_ORACLE holds no artist names today, so the committed pages credit the card; an
      // `artist` field on an entry is picked up when one is added.
      const credit = parse(gen.renderPage(gen.pageModel({ id: 'TEST-X', profile, image }))).querySelector('.credit').textContent;
      ok('without an artist in COMMANDER_ORACLE the credit names only the card',
        credit.startsWith('Card art via Scryfall: The Card. Magic: The Gathering is © Wizards of the Coast.'), credit);
      ok('pageModel refuses an identity that is not a safe file name', throws(() => gen.pageModel({ id: '../x', profile, image }), /cannot be used as a file name/) && throws(() => gen.pageModel({ id: 'lower', profile, image }), /cannot be used/));
      ok('pageModel names the identity and field when profile text is missing', throws(() => gen.pageModel({ id: 'TEST-X', profile: { ...profile, tag: ' ' }, image }), /TEST-X.*\.tag is missing/));
      ok('a long philosophy sentence is clipped to the description limit', gen.pageModel({ id: 'TEST-X', profile: { ...profile, philosophy: ('word '.repeat(100)).trim() + '.' }, image }).description.length <= gen.DESCRIPTION_MAX);
      ok('the description falls back to the tagline when there is no philosophy', gen.pageModel({ id: 'TEST-X', profile: { ...profile, philosophy: '' }, image }).description === "It's bold & loud");
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
