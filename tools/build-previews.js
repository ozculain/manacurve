#!/usr/bin/env node
'use strict';
// Link-preview pages: one static page per colour identity, written to r/.
//
// Why. A shared result is a link like
//   https://ozculain.github.io/manacurve/?r=DIMIR&p=48,75,62,30,28&c=high&a=consumer
// The site is one dynamic page, so WhatsApp, Discord and iMessage find no per-result Open
// Graph tags and preview it as nothing. Each page written here gives one identity its own
// URL (r/DIMIR.html) with that identity's Open Graph and Twitter card tags, then forwards
// the visitor to index.html with the query string intact.
//
// Input: PROFILES and COMMANDER_ORACLE from data.js, and the header of each
// images/commanders/<ID>.jpg (the og:image size is read from the file, not assumed).
// Output: r/<ID>.html for every identity, and nothing else. The output is deterministic
// (no dates, no randomness, LF line endings, UTF-8 without a BOM): the same input gives
// byte-identical files, and tests/previews.test.js fails when the committed r/ is stale.
//
// Usage: node tools/build-previews.js [--out <dir>]        (or: npm run previews)
//   Re-run it after changing a PROFILES name, tag or philosophy, a commander, or a
//   commander image. --out exists for the test; the directory must be named "r".
//
// Forwarding. The script forwards with location.replace('../index.html' + query + hash).
// The query string and hash are kept exactly as they arrived. The one addition: index.html
// opens a result only when the query carries r=<identity>, and a link like
// r/DIMIR.html?p=48,75,62,30,28&c=high&a=consumer names the identity in its path, so the
// script puts r=<ID> in front when the link has no r of its own.
//
// Tags. og:url is the page itself, because scrapers that follow og:url (Facebook does) must
// land on a page that carries the tags; pointing it at index.html would send them to the
// generic page. rel=canonical is the forwarded URL, so search engines index index.html
// rather than 31 stubs.
//
// Nothing here touches index.html or data.js.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://ozculain.github.io/manacurve/';
const OUT_NAME = 'r';
const ID_RE = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;          // MONO-W, DIMIR, WUBRG
const FILE_RE = /^[A-Z0-9]+(?:-[A-Z0-9]+)*\.html$/;  // the only file names this tool writes
const DESCRIPTION_MAX = 200;

// ---------- data.js ----------
// data.js is a classic script that declares top-level consts (PROFILES, COMMANDER_ORACLE, ...)
// instead of exporting them, so run it in a fresh context and read the tables back with a
// trailing expression.
function loadData(root = ROOT) {
  const file = path.join(root, 'data.js');
  const source = fs.readFileSync(file, 'utf-8').replace(/^﻿/, '');
  let data;
  try {
    data = vm.runInNewContext(source + '\n;({ PROFILES, COMMANDER_ORACLE });', {}, { filename: file, timeout: 10000 });
  } catch (e) {
    throw new Error('could not evaluate data.js: ' + e.message);
  }
  for (const key of ['PROFILES', 'COMMANDER_ORACLE']) {
    if (!data[key] || typeof data[key] !== 'object') throw new Error('data.js does not define ' + key);
  }
  return data;
}

// ---------- JPEG header ----------
// Width and height from the first frame header (SOF0..SOF15, minus DHT, JPG and DAC), skipping
// every other segment by its length so bytes inside an EXIF thumbnail are never mistaken for it.
function jpegSize(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 4 || buf[0] !== 0xFF || buf[1] !== 0xD8) throw new Error('not a JPEG (no SOI marker)');
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xFF) throw new Error('bad JPEG marker at byte ' + i);
    while (buf[i] === 0xFF) i++;                       // fill bytes
    const marker = buf[i++];
    if (marker === undefined) break;
    if (marker === 0xD9) break;                        // EOI
    if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD8)) continue;   // TEM, RSTn, SOI: no length
    if (i + 2 > buf.length) break;
    const length = buf.readUInt16BE(i);
    if (length < 2) throw new Error('bad JPEG segment length at byte ' + i);
    if (marker === 0xDA) throw new Error('JPEG scan starts before any frame header');
    if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
      if (length < 8 || i + 7 > buf.length) break;
      const height = buf.readUInt16BE(i + 3);
      const width = buf.readUInt16BE(i + 5);
      if (!width || !height) throw new Error('JPEG frame header gives a zero size');
      return { width, height };
    }
    i += length;
  }
  throw new Error('no JPEG frame header found');
}

// ---------- text ----------
const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

// Profile text as one plain line: tags dropped (script and style bodies with them; a line
// break or block tag becomes a space, an inline tag such as <i> vanishes), common entities
// decoded, whitespace collapsed.
function plain(value) {
  return String(value == null ? '' : value)
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<\/?(?:br|p|div|li|ul|ol|h[1-6]|tr|td|th|blockquote)\b[^>]*>/gi, ' ')
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (all, dec, hex, name) => {
      if (name) { const v = NAMED_ENTITIES[name.toLowerCase()]; return v === undefined ? all : v; }
      const cp = dec ? parseInt(dec, 10) : parseInt(hex, 16);
      return cp > 0 && cp <= 0x10FFFF && !(cp >= 0xD800 && cp <= 0xDFFF) ? String.fromCodePoint(cp) : all;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function firstSentence(text) {
  const m = /^.+?[.!?]["'”’)]*(?=\s|$)/.exec(text);
  return m ? m[0] : text;
}

// At most max characters, cut on a word boundary, ending in an ellipsis when something was dropped.
function clip(text, max) {
  if (text.length <= max) return text;
  let cut = text.slice(0, max - 1);
  if (/[\uD800-\uDBFF]$/.test(cut)) cut = cut.slice(0, -1);
  const space = cut.lastIndexOf(' ');
  if (space > max / 2) cut = cut.slice(0, space);
  return cut.replace(/[\s,;:—-]+$/, '') + '…';
}

// Escapes for element text and double-quoted attribute values. Apostrophes stay as they are:
// some small unfurlers do not decode &#39; and would show it literally.
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESCAPES[c]);

// ---------- one page ----------
const STYLE = [
  ':root{color-scheme:dark}',
  '*{box-sizing:border-box}',
  'html,body{margin:0;background:#101b20;color:#eae7dc}',
  'body{min-height:100vh;display:flex;align-items:center;justify-content:center;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}',
  'main{width:100%;max-width:626px;padding:24px 16px;text-align:center}',
  'h1{margin:0;font-size:1.75rem;letter-spacing:.04em}',
  '.tag{margin:.25rem 0 1rem;opacity:.8}',
  'img{display:block;width:100%;height:auto;border-radius:8px}',
  '.status{margin:1rem 0 .25rem}',
  'a{color:inherit}',
  '.credit{margin-top:1.5rem;font-size:.75rem;opacity:.7}',
].join('\n');

// Everything the page says, as plain (unescaped) strings.
function pageModel({ id, profile, oracle, image, site = SITE }) {
  if (!ID_RE.test(id)) throw new Error('identity id ' + JSON.stringify(id) + ' cannot be used as a file name');
  const field = (key) => {
    const value = plain(profile && profile[key]);
    if (!value) throw new Error(id + ': PROFILES.' + id + '.' + key + ' is missing or empty');
    return value;
  };
  const name = field('name');
  const tag = field('tag');
  const cmd = field('cmd');
  const artist = oracle && typeof oracle.artist === 'string' ? plain(oracle.artist) : '';
  const forward = '../index.html?r=' + encodeURIComponent(id);
  return {
    id, name, tag, cmd, artist, image,
    title: 'The Mana Curve — ' + name,
    ogTitle: name + ' — ' + tag,
    description: clip(firstSentence(plain(profile.philosophy)) || tag, DESCRIPTION_MAX),
    pageUrl: site + OUT_NAME + '/' + id + '.html',
    forwardPath: forward,
    forwardUrl: site + forward.slice('../'.length),
    imagePath: '../images/commanders/' + id + '.jpg',
    imageUrl: site + 'images/commanders/' + id + '.jpg',
    imageAlt: 'Commander art: ' + cmd,
    credit: 'Card art via Scryfall: ' + cmd + (artist ? ' by ' + artist : '') + '. Magic: The Gathering is © Wizards of the Coast. ' +
      'Unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards.',
  };
}

function renderPage(m) {
  const meta = (attr, key, value) => '<meta ' + attr + '="' + key + '" content="' + esc(value) + '">';
  return [
    '<!doctype html>',
    '<!-- Generated by tools/build-previews.js from data.js. Do not edit; run npm run previews. -->',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>' + esc(m.title) + '</title>',
    meta('name', 'description', m.description),
    meta('name', 'theme-color', '#101b20'),
    '<link rel="canonical" href="' + esc(m.forwardUrl) + '">',
    '<link rel="icon" type="image/svg+xml" href="../favicon.svg">',
    meta('property', 'og:site_name', 'The Mana Curve'),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:url', m.pageUrl),
    meta('property', 'og:title', m.ogTitle),
    meta('property', 'og:description', m.description),
    meta('property', 'og:image', m.imageUrl),
    meta('property', 'og:image:type', 'image/jpeg'),
    meta('property', 'og:image:width', m.image.width),
    meta('property', 'og:image:height', m.image.height),
    meta('property', 'og:image:alt', m.imageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', m.ogTitle),
    meta('name', 'twitter:description', m.description),
    meta('name', 'twitter:image', m.imageUrl),
    meta('name', 'twitter:image:alt', m.imageAlt),
    '<!-- No-JS fallback only. A meta refresh cannot read the query string, so it forwards to the identity',
    '     alone and drops p, c, a and every other parameter. The script at the end of the body forwards',
    '     the whole query string. It sits in a noscript element so that, with scripts on, the refresh',
    '     cannot race the script and cost the parameters. -->',
    '<noscript><meta http-equiv="refresh" content="0;url=' + esc(m.forwardPath) + '"></noscript>',
    '<style>',
    STYLE,
    '</style>',
    '</head>',
    '<body>',
    '<main>',
    '<h1>' + esc(m.name) + '</h1>',
    '<p class="tag">' + esc(m.tag) + '</p>',
    '<img src="' + esc(m.imagePath) + '" width="' + m.image.width + '" height="' + m.image.height + '" alt="' + esc(m.imageAlt) + '">',
    '<p class="status" role="status">Opening your result…</p>',
    '<p><a href="' + esc(m.forwardPath) + '">Open your result</a> if you are not taken there automatically.</p>',
    '<p class="credit">' + esc(m.credit) + '</p>',
    '</main>',
    '<script>',
    '(function () {',
    '  var id = ' + JSON.stringify(m.id) + ';',
    '  var query = location.search;',
    '  // The link names the identity in its path; index.html reads it from ?r=. Add it unless the',
    '  // link already carries one. The rest of the query string follows byte for byte, then the hash.',
    '  if (!new URLSearchParams(query).get("r")) {',
    '    query = "?r=" + id + (query.length > 1 ? "&" + query.slice(1) : "");',
    '  }',
    '  location.replace("../index.html" + query + location.hash);',
    '})();',
    '</script>',
    '</body>',
    '</html>',
  ].join('\n') + '\n';
}

// ---------- all pages ----------
// Pure: reads data.js and the commander images, returns [{ id, name, html }] sorted by id.
function generate({ root = ROOT, site = SITE } = {}) {
  if (!/^https:\/\/.+\/$/.test(site)) throw new Error('site must be an https URL ending in /: ' + site);
  const { PROFILES, COMMANDER_ORACLE } = loadData(root);
  const ids = Object.keys(PROFILES).sort();
  if (!ids.length) throw new Error('data.js defines no PROFILES');
  return ids.map((id) => {
    if (!ID_RE.test(id)) throw new Error('identity id ' + JSON.stringify(id) + ' cannot be used as a file name');
    const imageFile = path.join(root, 'images', 'commanders', id + '.jpg');
    if (!fs.existsSync(imageFile)) throw new Error(id + ': ' + path.relative(root, imageFile) + ' does not exist');
    let image;
    try { image = jpegSize(fs.readFileSync(imageFile)); } catch (e) { throw new Error(id + ': ' + path.relative(root, imageFile) + ': ' + e.message); }
    const profile = PROFILES[id];
    const oracle = Object.prototype.hasOwnProperty.call(COMMANDER_ORACLE, profile && profile.cmd) ? COMMANDER_ORACLE[profile.cmd] : undefined;
    return { id, name: id + '.html', html: renderPage(pageModel({ id, profile, oracle, image, site })) };
  });
}

// Writes the pages into outDir and nothing anywhere else: the directory must be named "r",
// every file name must be an identity page name, an existing entry that is not a plain file
// (a symlink, say) is never written through, and pages left over from a removed identity are
// deleted. Writing identical bytes again changes nothing.
function writePages(pages, outDir) {
  const dir = path.resolve(outDir);
  if (path.basename(dir) !== OUT_NAME) throw new Error('refusing to write to ' + dir + ': the output directory must be named "' + OUT_NAME + '"');
  for (const page of pages) {
    if (!FILE_RE.test(page.name)) throw new Error('refusing to write ' + JSON.stringify(page.name) + ': not an identity page name');
  }
  fs.mkdirSync(dir, { recursive: true });
  if (path.basename(fs.realpathSync(dir)) !== OUT_NAME) throw new Error('refusing to write to ' + dir + ': it resolves outside a directory named "' + OUT_NAME + '"');
  const keep = new Set(pages.map((p) => p.name));
  let written = 0, unchanged = 0, removed = 0;
  for (const { name, html } of pages) {
    const target = path.join(dir, name);
    const bytes = Buffer.from(html, 'utf8');
    let stat = null;
    try { stat = fs.lstatSync(target); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    if (stat && !stat.isFile()) throw new Error('refusing to overwrite ' + target + ': not a plain file');
    if (stat && fs.readFileSync(target).equals(bytes)) { unchanged++; continue; }
    fs.writeFileSync(target, bytes);
    written++;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && FILE_RE.test(entry.name) && !keep.has(entry.name)) {
      fs.unlinkSync(path.join(dir, entry.name));
      removed++;
    }
  }
  return { dir, written, unchanged, removed };
}

// ---------- command line ----------
function main(argv) {
  let out = path.join(ROOT, OUT_NAME);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out' && i + 1 < argv.length) out = path.resolve(argv[++i]);
    else {
      console.error('usage: node tools/build-previews.js [--out <dir named "' + OUT_NAME + '">]');
      return 2;
    }
  }
  const pages = generate();
  const result = writePages(pages, out);
  const shown = path.relative(ROOT, result.dir);
  console.log((shown && !shown.startsWith('..') ? shown : result.dir) + ': ' + pages.length + ' pages (' +
    result.written + ' written, ' + result.unchanged + ' unchanged, ' + result.removed + ' removed)');
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error('build-previews: ' + e.message);
    process.exitCode = 1;
  }
}

module.exports = {
  ROOT, SITE, OUT_NAME, ID_RE, FILE_RE, DESCRIPTION_MAX,
  loadData, jpegSize, plain, firstSentence, clip, esc, pageModel, renderPage, generate, writePages, main,
};
