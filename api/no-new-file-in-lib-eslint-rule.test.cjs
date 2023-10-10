'use strict';

const { RuleTester } = require('eslint');
const noNewFileInLibRule = require('./no-new-file-in-lib-eslint-rule.cjs');

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  'no-new-file-in-lib', // rule name
  noNewFileInLibRule, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        code: 'foo()',
        filename: "'api/lib/context/domain/toto.js'",
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: 'foo()',
        filename: "'api/lib/domain/toto.js'",
        errors: [{ messageId: 'noNewFileInLibError' }],
      },
    ],
  },
);

// eslint-disable-next-line no-console
console.log('All tests passed!');
