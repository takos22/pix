const pino = require('pino');
const { logging: logSettings } = require('../config');
const { getCorrelationContext } = require('./monitoring-tools');
const { omit, get } = require('lodash');

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
    enabled: logSettings.enabled,
  },
  prettyPrint
);

const fatal = (data) => {
  logger.fatal(data);
};
const error = (data) => {
  const context = getCorrelationContext();
  logger.error(
    {
      ...context,
      ...omit(data, 'message'),
    },
    get(data, 'message', '-')
  );
};
const warn = (data) => {
  logger.warn(data);
};
const info = (data) => {
  logger.info(data);
};
const debug = (data) => {
  logger.debug(data);
};
const trace = (data) => {
  logger.trace(data);
};

logger.warn('WARN logs enabled');
logger.info('INFO logs enabled');
logger.debug('DEBUG logs enabled');
logger.trace('TRACE logs enabled');

module.exports = { fatal, error, warn, info, debug, trace };
