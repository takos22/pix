const usecases = require('../../domain/usecases');
const logger = require('../../infrastructure/logger');

module.exports = {
  async createRelease(request, h) {
    usecases
      .createLcmsRelease()
      .then(() => {
        // TODO: replace by monitoringTools.logInfo
        // eslint-disable-next-line no-restricted-syntax
        logger.info('Release created and cache reloaded');
      })
      .catch((e) => {
        // TODO: replace by monitoringTools.logError
        // eslint-disable-next-line no-restricted-syntax
        logger.error('Error while creating the release and reloading cache', e);
      });
    return h.response({}).code(204);
  },
};
