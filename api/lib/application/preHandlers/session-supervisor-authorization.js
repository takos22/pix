import * as supervisorAccessRepository from '../../infrastructure/repositories/supervisor-access-repository.js';
import { extractUserIdFromRequest } from '../../infrastructure/utils/request-response-utils.js';

const verifyByCertificationCandidateId = async function (request, h) {
  const supervisorUserId = extractUserIdFromRequest(request);
  const candidateId = request.params.id;
  const isSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSessionCandidate({
    supervisorId: supervisorUserId,
    certificationCandidateId: candidateId,
  });

  if (!isSupervisorForSession) {
    return h.response().code(401).takeover();
  }

  return true;
};

const verifyBySessionId = async function (request, h) {
  const userId = extractUserIdFromRequest(request);
  const sessionId = request.params.id;

  const isSupervisorForSession = await supervisorAccessRepository.isUserSupervisorForSession({
    sessionId,
    userId,
  });

  if (!isSupervisorForSession) {
    return h.response().code(401).takeover();
  }
  return true;
};

export { verifyByCertificationCandidateId, verifyBySessionId };
