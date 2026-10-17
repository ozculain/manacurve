'use strict';
// Shared page boot for the jsdom tests and the respondent simulator.
//
// bootPage() loads index.html into jsdom the way the old standalone harnesses
// did: data.js is inlined into the main <script> tag (the http://localhost/
// origin, needed for sessionStorage, cannot fetch it), the html-to-image CDN
// script is dropped, and a small helper block is injected just before the
// "SCRIPT END" comment so it shares the page's script scope. The helper block
// can stub the timers between rounds and exposes the page's state and handlers
// on window.__h. No scoring code is touched.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const { JSDOM, VirtualConsole } = require(path.join(ROOT, 'node_modules', 'jsdom'));

const INDEX_HTML = path.join(ROOT, 'index.html');
const DATA_JS = path.join(ROOT, 'data.js');
const MARKER = '// === SCRIPT END — all functions defined ===';

// Page globals exposed on window.__h when this build defines them. Each is a
// getter, so a later reassignment inside the page is always seen.
const EXPOSE = [
  'restart', 'startAssessment', 'answerQ', 'answerNeither', 'continueToRound2',
  'selectRefinementChoice', 'selectRefinementNeither', 'continueToStage2',
  'selectTournamentChoice', 'shouldTerminateEarly', 'initTournament',
  'recordTournamentResult', 'analyseGapBasedPatterns', 'decisivePairsWellAnswered',
  'finishS1', 'generateRefinementQuestions', 'saveSession', 'loadSession',
  'clearSession', 'restoreSession', 'offerSessionRestore', 'showResults',
  'buildResultURL', 'parseSeedURL', 'loadFromSeed', 'selectAudience', 'selectMode',
  'PROFILES', 'POOL_A', 'POOL_ALLY',
];

// ---------- Seeded randomness ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// FNV-1a over the parts, so every stream is reproducible regardless of run order.
function hashSeed(...parts) {
  let h = 2166136261;
  for (const ch of parts.join('|')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// ---------- HTML preparation ----------
function helperBlock({ stubs, expose }) {
  const L = ['// ---- injected by tests/_lib/load.js ----'];
  if (stubs.transitions) L.push('showRoundTransition = function (fromRound, toRound, callback) { callback(); };');
  if (stubs.lockAnswers) L.push('lockAnswers = function () {};');
  if (stubs.calculating === 'skip') L.push('showCalculating = function () {};');
  else if (stubs.calculating === 'instant') {
    L.push("showCalculating = function () { document.getElementById('screen-assessment').classList.add('hidden'); showResults(); };");
  }
  L.push('window.__h = {};');
  L.push("Object.defineProperty(window.__h, 'state', { get: function () { return state; }, enumerable: true });");
  for (const name of expose) {
    if (!/^[A-Za-z_$][\w$]*$/.test(name)) throw new Error('bad expose name ' + name);
    L.push(`if (typeof ${name} !== 'undefined') Object.defineProperty(window.__h, '${name}', { get: function () { return ${name}; }, enumerable: true });`);
  }
  return L.join('\n') + '\n';
}

function buildHtml({ htmlPath = INDEX_HTML, dataPath = DATA_JS, stubs = {}, expose = EXPOSE } = {}) {
  let html = fs.readFileSync(htmlPath, 'utf-8');
  const dataJs = fs.readFileSync(dataPath, 'utf-8');
  const dataTag = '<script src="data.js"></script>';
  if (!html.includes(dataTag)) throw new Error(`${dataTag} not found in ${path.basename(htmlPath)}`);
  html = html.replace(dataTag, '<!-- data.js inlined below -->');
  html = html.replace(/<!-- data\.js inlined below -->[\s\S]*?<script>/, () => '<script>\n' + dataJs + '\n');
  html = html.replace(/<script src="https:\/\/unpkg\.com\/html-to-image[^>]*><\/script>/, '');
  if (!html.includes(MARKER)) throw new Error(`SCRIPT END marker missing from ${path.basename(htmlPath)}: ${MARKER}`);
  const block = helperBlock({ stubs: { transitions: true, lockAnswers: true, calculating: 'timer', ...stubs }, expose });
  return html.replace(MARKER, () => block + MARKER);
}

// jsdom validates every `style.background = <gradient>` through css-tree, which
// throws and catches internally and dominates run time when the progress bar is
// repainted on every answer. Store the value without validating it. Presentation
// only; the simulator and the golden test use it, the render tests do not.
function storeBackgroundUnvalidated(win) {
  const probe = win.document.createElement('div').style;
  for (let proto = Object.getPrototypeOf(probe); proto && proto !== win.Object.prototype; proto = Object.getPrototypeOf(proto)) {
    if (Object.getOwnPropertyDescriptor(proto, 'background')) {
      const store = new WeakMap();
      Object.defineProperty(proto, 'background', {
        configurable: true, enumerable: true,
        get() { return store.get(this) || ''; },
        set(v) { store.set(this, String(v)); },
      });
      return;
    }
  }
}

// ---------- Boot ----------
// Options:
//   url            page URL (default http://localhost/, so sessionStorage works)
//   seed           number: replace the page's Math.random with a seeded stream
//                  before any page script runs
//   stubs          { transitions: true, lockAnswers: true, calculating: 'timer' }
//                  calculating: 'timer' keeps the page's 2 s "calculating" screen,
//                  'instant' renders the results at once, 'skip' never renders them
//   reducedMotion  matchMedia reports prefers-reduced-motion (default true), so the
//                  canvas background, which jsdom cannot draw, stays off
//   fastStyles     store style.background without validating it (default false)
//   htmlPath, dataPath, expose   overrides for the files and the exposed names
function bootPage(opts = {}) {
  const {
    url = 'http://localhost/', seed, stubs, reducedMotion = true, fastStyles = false,
    htmlPath, dataPath, expose,
  } = opts;
  const html = buildHtml({ htmlPath, dataPath, stubs, expose });
  const errors = [];
  const warnings = [];
  const vc = new VirtualConsole();
  vc.on('error', (...a) => errors.push(a.map(String).join(' ')));
  vc.on('warn', (...a) => warnings.push(a.map(String).join(' ')));
  vc.on('jsdomError', (e) => errors.push(e && e.message ? e.message : String(e)));
  const dom = new JSDOM(html, {
    url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      if (seed !== undefined && seed !== null) win.Math.random = mulberry32(seed);
      win.Element.prototype.scrollIntoView = function () {};
      win.HTMLElement.prototype.scrollTo = function () {};
      win.scrollTo = function () {};
      if (reducedMotion) {
        win.matchMedia = (query) => ({
          matches: /prefers-reduced-motion:\s*reduce/.test(query), media: query, onchange: null,
          addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
          dispatchEvent() { return false; },
        });
      }
      if (fastStyles) storeBackgroundUnvalidated(win);
    },
  });
  const win = dom.window;
  if (!win.__h) throw new Error('page script did not reach the SCRIPT END marker (window.__h missing); first error: ' + (errors[0] || 'none'));
  return { dom, win, h: win.__h, errors, warnings };
}

// The tests take an optional path to another build's index.html (with its
// data.js beside it); without one they load the repository's own files.
function pageArgs(argv = process.argv.slice(2)) {
  const file = argv.find((a) => /\.html?$/i.test(a));
  if (!file) return {};
  const htmlPath = path.resolve(file);
  return { htmlPath, dataPath: path.join(path.dirname(htmlPath), 'data.js') };
}

// Resolves once DOMContentLoaded has run (jsdom fires it after the constructor returns).
function whenReady(win) {
  if (win.document.readyState !== 'loading') return new Promise((r) => setImmediate(r));
  return new Promise((resolve) => win.document.addEventListener('DOMContentLoaded', () => setImmediate(resolve), { once: true }));
}

function isVisible(win, id) {
  const el = win.document.getElementById(id);
  return !!el && !el.classList.contains('hidden');
}

// After the last Round 3 answer, showResults runs behind the "calculating"
// timer; wait for the results screen instead of assuming it is there.
async function waitForResults(win, { timeoutMs = 10000, intervalMs = 50 } = {}) {
  const t0 = Date.now();
  while (!isVisible(win, 'screen-results') && Date.now() - t0 < timeoutMs) {
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return isVisible(win, 'screen-results');
}

module.exports = {
  ROOT, INDEX_HTML, DATA_JS, MARKER, EXPOSE,
  mulberry32, hashSeed, buildHtml, bootPage, pageArgs, whenReady, isVisible, waitForResults,
};
