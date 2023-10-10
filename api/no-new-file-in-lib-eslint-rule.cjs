'use strict';

const path = require('node:path');

const meta = {
  type: 'problem',
  docs: {
    description: 'Do not add new file in lib',
  },
  messages: {
    noNewFileInLibError: 'Do not add new file in lib, use src instead',
  },
};

function create(context) {
  const filenameWithExtension = context.physicalFilename;

  const nameSpacedPath = path.toNamespacedPath(filenameWithExtension);
  let report = {};
  if (nameSpacedPath.includes('lib')) {
    report = context.report({
      loc: { column: 0, line: 1 },
      messageId: 'noNewFileInLibError',
    });
  }

  return { report };
}

module.exports = { create, meta };
