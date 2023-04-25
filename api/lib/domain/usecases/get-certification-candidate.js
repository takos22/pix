'use strict';
async function getCertificationCandidate({ userId, sessionId, certificationCandidateRepository }) {
  return certificationCandidateRepository.getBySessionIdAndUserId({ userId, sessionId });
}

module.exports = getCertificationCandidate;
