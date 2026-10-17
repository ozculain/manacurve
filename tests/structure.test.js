#!/usr/bin/env node
'use strict';
// Structural checks on index.html (ported from scripts/check_structure.js).
// Catches the bug classes that have hit this project repeatedly:
//   1. Unclosed / mismatched <div>
//   2. Duplicate ids
//   3. getElementById targets that do not exist in the markup
//   4. #id { display: ... } rules that beat .hidden on specificity
//   5. Screens that are not siblings at the top level of <body>
// plus the hooks the jsdom tests rely on: the inline script parses, data.js
// is loaded by its own tag, and the SCRIPT END marker is present.
// Usage: node tests/structure.test.js [path/to/index.html]
const fs = require('fs');
const path = require('path');
const { checklist } = require('./_lib/report');
const { MARKER } = require('./_lib/load');

const FILE = path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html'));
const src = fs.readFileSync(FILE, 'utf-8');
const t = checklist('structure ' + path.basename(FILE));

// getElementById lookups that are allowed to miss, with the reason.
const OPTIONAL_TARGETS = {
  'res-syms': 'legacy mana-symbol row replaced by the banner; showResults guards the lookup',
};

const lineStarts = [0];
for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) lineStarts.push(i + 1);
function lineOf(pos) {
  let lo = 0, hi = lineStarts.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= pos) lo = mid; else hi = mid - 1; }
  return lo + 1;
}
const blank = (m) => m.replace(/[^\n]/g, ' ');
// Comments, scripts and styles blanked out (same length, same line numbers).
const markup = src
  .replace(/<!--[\s\S]*?-->/g, blank)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, blank)
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, blank);
const list = (arr, n = 5) => arr.slice(0, n).join('; ') + (arr.length > n ? `; ... (${arr.length} in all)` : '');

// 1. Balanced <div>
{
  const stack = [], problems = [];
  const re = /<(\/?)div\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(markup)) !== null) {
    if (m[1] === '/') {
      if (stack.length === 0) problems.push(`line ${lineOf(m.index)}: </div> without matching open`);
      else stack.pop();
    } else {
      const id = /id=["']([^"']+)["']/.exec(m[2] || '');
      stack.push({ line: lineOf(m.index), id: id ? id[1] : null, attrs: (m[2] || '').trim().slice(0, 60) });
    }
  }
  for (const s of stack.slice(-5)) problems.push(`line ${s.line}: unclosed <div${s.id ? ` id="${s.id}"` : ''}${s.attrs && !s.id ? ' ' + s.attrs : ''}>`);
  t.ok('div tags balance', problems.length === 0, list(problems));
}

// 2. Duplicate ids
const idLines = new Map();
{
  const re = /\sid=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!idLines.has(m[1])) idLines.set(m[1], []);
    idLines.get(m[1]).push(lineOf(m.index));
  }
  const dups = [...idLines].filter(([, lines]) => lines.length > 1).map(([id, lines]) => `id="${id}" at lines ${lines.join(', ')}`);
  t.ok('no duplicate ids', dups.length === 0, list(dups));
}

// 3. getElementById targets exist (in markup, in template strings, or assigned in JS)
{
  const defined = new Set(idLines.keys());
  const assigned = /\.id\s*=\s*['"]([\w-]+)['"]/g;
  let m;
  while ((m = assigned.exec(src)) !== null) defined.add(m[1]);
  const referenced = new Map();
  const re = /getElementById\(['"]([\w-]+)['"]\)/g;
  while ((m = re.exec(src)) !== null) {
    if (!referenced.has(m[1])) referenced.set(m[1], []);
    referenced.get(m[1]).push(lineOf(m.index));
  }
  const missing = [], optional = [];
  for (const [id, lines] of referenced) {
    if (defined.has(id)) continue;
    const where = `'${id}' (line ${lines.slice(0, 3).join(', ')}${lines.length > 3 ? ', ...' : ''})`;
    if (OPTIONAL_TARGETS[id]) optional.push(`${where}: ${OPTIONAL_TARGETS[id]}`);
    else missing.push(where);
  }
  t.ok(`getElementById targets exist (${referenced.size} ids referenced)`, missing.length === 0, 'missing ' + list(missing));
  for (const o of optional) t.note('allowed missing target ' + o);
}

// 4. #id { display: ... } must not beat .hidden
{
  const css = [...src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  const re = /(?:^|\})\s*(#[\w-]+)\s*\{([^}]*?display\s*:\s*([^;}]+))/gm;
  const offenders = [];
  let m;
  while ((m = re.exec(css)) !== null) {
    const id = m[1].slice(1), display = m[3].trim();
    if (display === 'none') continue;
    const usedHidden = new RegExp(`id=["']${id}["'][^>]*class=["'][^"']*\\bhidden\\b|class=["'][^"']*\\bhidden\\b[^>]*id=["']${id}["']`).test(src);
    if (usedHidden && !new RegExp(`#${id}\\.hidden\\s*\\{[^}]*display\\s*:\\s*none`).test(css)) {
      offenders.push(`#${id} { display: ${display} } beats .hidden; add "#${id}.hidden { display: none }"`);
    }
  }
  t.ok('no #id display rule beats .hidden', offenders.length === 0, list(offenders));
}

// 5. Screens are siblings at one div depth
{
  const body = /<body\b[^>]*>/i.exec(markup);
  const seen = [];
  if (body) {
    const re = /<(\/?)div\b([^>]*)>/g;
    re.lastIndex = body.index + body[0].length;
    let depth = 0, m;
    while ((m = re.exec(markup)) !== null) {
      if (m[1] === '/') { depth = Math.max(0, depth - 1); continue; }
      const id = /\sid=["'](screen-[\w-]+)["']/.exec(m[2] || '');
      if (id) seen.push({ id: id[1], depth, line: lineOf(m.index) });
      depth++;
    }
  }
  const counts = {};
  for (const s of seen) counts[s.depth] = (counts[s.depth] || 0) + 1;
  const expected = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const nested = expected ? seen.filter((s) => String(s.depth) !== expected[0])
    .map((s) => `${s.id} (line ${s.line}) at div depth ${s.depth}, most screens at ${expected[0]}`) : [];
  t.ok(`screens are siblings (${seen.length} screens)`, seen.length >= 2 && nested.length === 0, seen.length < 2 ? 'fewer than two screen-* divs found' : list(nested));
}

// 6. Hooks the jsdom tests depend on
{
  const inline = [...src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter((m) => !/\bsrc\s*=/.test(m[1]));
  const bad = [];
  inline.forEach((m, i) => { try { new Function(m[2]); } catch (e) { bad.push(`inline script #${i + 1}: ${e.message}`); } });
  t.ok(`inline scripts parse (${inline.length})`, inline.length > 0 && bad.length === 0, list(bad));
  const dataPath = path.join(path.dirname(FILE), 'data.js');
  let dataErr = null;
  try { new Function(fs.readFileSync(dataPath, 'utf-8')); } catch (e) { dataErr = e.message; }
  t.ok('data.js parses and is loaded by its own script tag', !dataErr && src.includes('<script src="data.js"></script>'), dataErr || '<script src="data.js"></script> not found');
  const mainScript = inline.find((m) => m[2].includes(MARKER));
  t.ok('SCRIPT END marker present inside the main script', !!mainScript, `expected the comment ${MARKER}`);
}

t.finish();
