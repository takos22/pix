const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Yar = require('@hapi/yar');
const config = require('../../config');

const plugins = [
  Inert,
  Vision,
  {
    plugin: Yar,
    options: {
      cookieOptions: {
        password: 'je-un-joli-mot-de-passe-qui-fait-32-caracteres',
        isSecure: false,
      },
    },
  },
  require('./i18n'),
  require('./pino'),
  ...(config.sentry.enabled ? [require('./sentry')] : []),
];

module.exports = plugins;
