'use strict';
// How a visitor gets from a share link to the result: the link-preview pages' forwarding script.
//
// A share link points at r/<ID>.html. Its inline script runs
// location.replace('../index.html' + query + hash) and adds r=<ID> when the query has none
// (tools/build-previews.js). These helpers run that script, the committed one, against a fake
// location, so a test can follow a link the way a browser does. tests/previews.test.js checks
// the script itself; tests/seed.test.js uses it to open share links.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { ROOT } = require('./load');

const { JSDOM } = require(path.join(ROOT, 'node_modules', 'jsdom'));
const PREVIEW_PATH = /\/r\/([A-Z0-9]+(?:-[A-Z0-9]+)*)\.html$/;

// Runs a page's inline script against a fake location; returns every URL it forwarded to.
function forward(code, search, hash = '') {
  const calls = [];
  const location = { search, hash, replace(url) { calls.push(url); } };
  vm.runInNewContext(code, { location, URLSearchParams }, { timeout: 1000 });
  return calls;
}

// The inline script of the committed r/<ID>.html.
function previewScript(id, dir = path.join(ROOT, 'r')) {
  const doc = new JSDOM(fs.readFileSync(path.join(dir, id + '.html'), 'utf8')).window.document;
  const scripts = [...doc.querySelectorAll('script')];
  if (scripts.length !== 1) throw new Error(`r/${id}.html has ${scripts.length} inline scripts, expected 1`);
  return scripts[0].textContent;
}

// Where a browser ends up after opening a share link, as an absolute URL. A preview-page link
// (<root>/r/<ID>.html?...) is forwarded by its page's own script to ../index.html with the query
// and hash kept and r=<ID> added when the link has none. Any other link, such as the
// ?r=<ID>&p=... form shared before the preview pages, opens index.html directly and is returned
// as it is.
function followShareLink(link) {
  const url = new URL(link);
  const m = PREVIEW_PATH.exec(url.pathname);
  if (!m) return url.href;
  const calls = forward(previewScript(m[1]), url.search, url.hash);
  if (calls.length !== 1) throw new Error(`r/${m[1]}.html forwarded ${calls.length} times for ${link}`);
  return new URL(calls[0], url).href;
}

module.exports = { forward, previewScript, followShareLink, PREVIEW_PATH };
