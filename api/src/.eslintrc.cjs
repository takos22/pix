'use strict';

const path = require('node:path');

module.exports = {
  rules: {
    'n/no-restricted-import': ['warn', [path.resolve(__dirname, '../lib/**')]],
  },
};
