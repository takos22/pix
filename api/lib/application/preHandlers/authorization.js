import { NotFoundError } from '../http-errors.js';
import * as certificationCourseRepository from '../../infrastructure/repositories/certification-course-repository.js';
import * as sessionRepository from '../../infrastructure/repositories/sessions/session-repository.js';

const verifySessionAuthorization = async (request) => {
  const userId = request.auth.credentials.userId;
  const sessionId = request.params.id;

  return await _isAuthorizedToAccessSession({ userId, sessionId });
};
const verifyCertificationSessionAuthorization = async (request) => {
  const userId = request.auth.credentials.userId;
  const certificationCourseId = request.params.id;

  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);

  return await _isAuthorizedToAccessSession({ userId, sessionId: certificationCourse.getSessionId() });
};
export { verifySessionAuthorization, verifyCertificationSessionAuthorization };

async function _isAuthorizedToAccessSession({ userId, sessionId }) {
  const hasMembershipAccess = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
    userId,
    sessionId
  );

  if (!hasMembershipAccess) {
    throw new NotFoundError("La session n'existe pas ou son accès est restreint");
  }

  return hasMembershipAccess;
}
