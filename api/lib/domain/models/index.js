const path = require('path');

/* eslint-disable-next-line no-sync */
require('fs')
  .readdirSync(__dirname, { withFileTypes: true })
  .forEach(function (file) {
    if (file.name === 'index.js' || file.isDirectory()) return;

    module.exports[path.basename(file.name, '.js')] = require(path.join(__dirname, file.name));
  });
