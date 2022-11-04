const config = require('../../config');
const monitoringTools = require('../monitoring-tools');

const pino = require('pino');
const { logging: logSettings } = require('../../config');

let prettyPrint;
if (logSettings.logForHumans) {
  // eslint-disable-next-line node/no-unpublished-require
  const pretty = require('pino-pretty');
  const omitDay = 'HH:MM:ss';
  prettyPrint = pretty({
    sync: true,
    colorize: true,
    translateTime: omitDay,
    ignore: 'pid,hostname',
  });
}

const logger = pino(
  {
    level: logSettings.logLevel,
    redact: ['req.headers.authorization'],
    enabled: logSettings.enabled,
  },
  prettyPrint
);

function logObjectSerializer(req) {
  const enhancedReq = {
    ...req,
    version: config.version,
  };

  const context = monitoringTools.getContext();

  return {
    ...enhancedReq,
    user_id: monitoringTools.extractUserIdFromRequest(req),
    metrics: context?.metrics,
    route: context?.request?.route?.path,
  };
}

const availableEvents = ['onPostStart', 'onPostStop', 'response', 'request-error'];
const logEvents = availableEvents.filter((event) => event === 'response');

const configuration = {
  plugin: require('hapi-pino'),
  options: {
    serializers: {
      req: logObjectSerializer,
    },
    instance: logger,
    // Remove duplicated req property: https://github.com/pinojs/hapi-pino#optionsgetchildbindings-request---key-any-
    getChildBindings: () => ({}),
    logQueryParams: true,
    logEvents,
  },
};

module.exports = configuration;
