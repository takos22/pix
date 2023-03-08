// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
const codemods = [require('./src/cjs-export-to-esm-export')];

const transformScripts = (fileInfo, api, options) => {
  return codemods.reduce((input, script) => {
    return script(
      {
        source: input,
      },
      api,
      options
    );
  }, fileInfo.source);
};

module.exports = transformScripts;
