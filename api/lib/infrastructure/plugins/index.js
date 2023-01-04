const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const { runWithConnection } = require('../../../db/knex-database-connection');
const config = require('../../config');

const plugins = [
  Inert,
  Vision,
  require('./i18n'),
  require('./pino'),
  ...(config.sentry.enabled ? [require('./sentry')] : []),
  {
    name: 'test',
    register(server) {
      server.events.on('route', (route) => {
        const { handler } = route.settings;
        route.settings.handler = (...args) => runWithConnection(handler, args);
      });
    },
  },
];

module.exports = plugins;
