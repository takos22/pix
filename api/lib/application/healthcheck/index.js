const healthcheckController = require('./healthcheck-controller');
const logger = require('../../infrastructure/logger');

exports.register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api',
      config: {
        auth: false,
        handler: healthcheckController.get,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/healthcheck/db',
      config: {
        auth: false,
        handler: () => {
          logger.error('bar');
          throw new Error('foo');
        },
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/healthcheck/redis',
      config: {
        auth: false,
        handler: healthcheckController.checkRedisStatus,
        tags: ['api'],
      },
    },
  ]);
};

exports.name = 'healthcheck-api';
