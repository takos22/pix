'use strict';

const path = require('node:path');
const fs = require('fs/promises');

async function _createdDate(path) {
  const { birthtime } = await fs.stat(path, (err, stats) => {
    if (err) {
      return;
    }

    return stats;
  });

  return birthtime;
}

async function _isFileCreatedToday(path) {
  const fileCreationDate = await _createdDate(path);
  const today = new Date();
  const format = 'Www, dd Mmm yyyy';
  return fileCreationDate.toUTCString().slice(0, format.length) === today.toUTCString().slice(0, format.length); // true
}

const meta = {
  type: 'problem',
  docs: {
    description: 'Do not add new file in lib',
  },
  messages: {
    noNewFileInLibError: 'Do not add new file in lib, use src instead',
  },
};

async function create(context) {
  const filenameWithExtension = context.physicalFilename;

  const nameSpacedPath = path.toNamespacedPath(filenameWithExtension);
  let report = {};
  if (nameSpacedPath.includes('lib') && (await _isFileCreatedToday(nameSpacedPath))) {
    report = context.report({
      loc: { column: 0, line: 1 },
      messageId: 'noNewFileInLibError',
    });
  }

  return { report };
}

module.exports = { create, meta };
