#!/usr/bin/env node
'use strict';
// Phase 3, play feel (layout and flow), in jsdom. One section per piece:
//   1. phones: below 600px the two answers stack at full width without their
//      fixed height, and plinths drop to about 20px (the CSS rules; jsdom
//      cannot lay out, so the fit itself is checked in a browser)
// Usage: node tests/play.test.js [path/to/index.html]
const fs = require('fs');
const { bootPage, pageArgs, whenReady, INDEX_HTML } = require('./_lib/load');
const { run } = require('./_lib/report');

let nextSeed = 301;
async function page(opts = {}) {
  const p = bootPage({ ...pageArgs(), seed: nextSeed++, ...opts });
  await whenReady(p.win);
  return p;
}

// The stylesheet's rules, flattened one level into media rules.
function sheetRules(win) { return [...win.document.styleSheets].flatMap((sh) => [...sh.cssRules]); }
function mediaBlocks(win, re) { return sheetRules(win).filter((r) => r.media && re.test(r.media.mediaText)); }
function ruleFor(rules, selector) {
  return rules.find((r) => r.selectorText && r.selectorText.split(',').map((x) => x.trim()).includes(selector));
}

run('play', async (t) => {
  const { ok } = t;

  // ---------- 1: phones ----------
  {
    const { win } = await page();
    const phone = mediaBlocks(win, /max-width:\s*599px/);
    const rules = phone.flatMap((m) => [...m.cssRules]);
    const choices = ruleFor(rules, '.mc-choices');
    const card = ruleFor(rules, '#choices .mc-choice');
    const plinth = ruleFor(rules, '.mc-plinth');
    ok('P1a below 600px the answers stack in one full-width column',
      !!choices && choices.style.getPropertyValue('grid-template-columns').trim() === '1fr',
      choices ? choices.style.cssText : 'no .mc-choices rule in a max-width: 599px block');
    const marker = ruleFor(rules, 'body[data-mode="draft"] #choices .mc-choice__head');
    ok('P1b below 600px the answer cards lose their fixed tall height, and in Blind Draft the I / II marker floats in the corner',
      !!card && /^0(px)?$|^auto$/.test(card.style.getPropertyValue('min-height').trim())
        && !!marker && marker.style.getPropertyValue('position') === 'absolute',
      card ? card.style.cssText : 'no #choices .mc-choice rule');
    const pad = plinth ? plinth.style.getPropertyValue('padding').trim() : '';
    ok('P1c below 600px plinths drop to about 20px of padding, over their inline padding',
      !!plinth && /^(1[6-9]|2[0-4])px/.test(pad) && plinth.style.getPropertyPriority('padding') === 'important',
      plinth ? plinth.style.cssText : 'no .mc-plinth rule');
    // The block's anchor: after the responsive media queries, ahead of the
    // themes and the Phase 2 block that ends the stylesheet.
    const html = fs.readFileSync(pageArgs().htmlPath || INDEX_HTML, 'utf-8');
    const at = html.indexOf('PHASE 3 — PLAY FEEL');
    ok('P1d the phase 3 CSS follows the responsive media queries, ahead of the themes and the Phase 2 block',
      at > html.indexOf('/* High DPI displays */') && at < html.indexOf('THEMES — body[data-theme]') && at < html.indexOf('PHASE 2 — RESULTS')
        && html.indexOf('</style>') === html.lastIndexOf('</style>'), `at=${at}`);
    // A stray closing tag or a parse error would drop every rule after the block.
    const all = sheetRules(win);
    const styleText = [...win.document.querySelectorAll('style')].map((el) => el.textContent).join('\n');
    ok('P1e the stylesheet still parses past the block (the themes and the Phase 2 rules load)',
      !!ruleFor(all, 'body[data-theme="borderless"] .mc-choice') && !!ruleFor(all, '.mc-manabase')
        && styleText.includes('PHASE 3 — PLAY FEEL') && styleText.includes('PHASE 2 — RESULTS'),
      `borderless=${!!ruleFor(all, 'body[data-theme="borderless"] .mc-choice')} manabase=${!!ruleFor(all, '.mc-manabase')}`);
    win.close();
  }
});
