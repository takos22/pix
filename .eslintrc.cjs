"use strict";
const path = require("node:path");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:yml/standard",
    "plugin:eslint-comments/recommended",
    "plugin:i18n-json/recommended",
  ],
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "script",
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    "arrow-parens": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "computed-property-spacing": ["error", "never"],
    "eol-last": ["error"],
    "eslint-comments/no-unused-disable": ["error"],
    indent: [
      "error",
      2,
      {
        SwitchCase: 1,
      },
    ],
    "keyword-spacing": ["error"],
    "linebreak-style": ["error", "unix"],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "NewExpression[callee.name=Date][arguments.length=1][arguments.0.type=Literal]:not([arguments.0.value=/^[12][0-9]{3}-(0[0-9]|1[0-2])-([0-2][0-9]|3[01])(T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]Z)?$/])",
        message:
          "Use only ISO8601 UTC syntax ('2019-03-12T01:02:03Z') in Date constructor",
      },
      {
        selector:
          "CallExpression[callee.object.object.name='faker'][callee.object.property.name='internet'][callee.property.name='email']",
        message: "Use only faker.internet.exampleEmail()",
      },
    ],
    "no-restricted-globals": [
      "error",
      {
        name: "fetch",
        message: "Use import fetch from 'fetch'",
      },
    ],
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "_",
      },
    ],
    "no-var": ["error"],
    "object-curly-spacing": ["error", "always"],
    "prefer-const": ["error"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "space-before-blocks": ["error"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "ignore",
      },
    ],
    "space-in-parens": ["error"],
    "space-infix-ops": ["error"],
    "func-call-spacing": ["error"],
    "key-spacing": ["error"],
    "comma-spacing": ["error"],
    "no-trailing-spaces": ["error"],
    "no-multi-spaces": ["error"],
    "yml/quotes": [
      "error",
      {
        prefer: "single",
        avoidEscape: true,
      },
    ],
    "i18n-json/sorted-keys": [
      "error",
      {
        sortFunctionPath: path.resolve(
          "../config/linter-translation-order.cjs"
        ),
      },
    ],
  },
};
