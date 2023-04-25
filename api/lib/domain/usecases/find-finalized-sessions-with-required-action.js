'use strict';
module.exports = function findFinalizedSessionsWithRequiredAction({ finalizedSessionRepository }) {
  return finalizedSessionRepository.findFinalizedSessionsWithRequiredAction();
};
