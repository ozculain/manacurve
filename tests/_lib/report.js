'use strict';
// PASS/FAIL lines and the exit code for the test files.
//   const t = checklist('journey');
//   t.ok('A1 something holds', cond, 'detail shown on failure');
//   t.finish();   // prints the tally and exits 1 if anything failed
function checklist(label) {
  let passed = 0, failed = 0;
  const ok = (name, cond, detail) => {
    if (cond) { passed++; console.log('PASS ' + name); }
    else { failed++; console.log('FAIL ' + name + (detail ? '  -> ' + detail : '')); }
    return !!cond;
  };
  const note = (text) => console.log('     ' + text);
  const finish = () => {
    console.log(`${label}: ${passed}/${passed + failed} checks passed`);
    process.exit(failed ? 1 : 0);
  };
  return { ok, note, finish, get failed() { return failed; } };
}

// Run an async test body; any exception becomes a FAIL line and exit code 1.
function run(label, body) {
  const t = checklist(label);
  Promise.resolve()
    .then(() => body(t))
    .then(() => t.finish())
    .catch((e) => {
      t.ok(label + ' ran to completion', false, (e && e.stack) || String(e));
      t.finish();
    });
}

module.exports = { checklist, run };
