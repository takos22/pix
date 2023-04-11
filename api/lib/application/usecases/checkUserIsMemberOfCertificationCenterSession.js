import * as certificationCourseRepository from '../../infrastructure/repositories/certification-course-repository.js';
import * as sessionRepository from '../../infrastructure/repositories/sessions/session-repository.js';

const execute = async function ({ userId, certificationCourseId }) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  return sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
    userId,
    certificationCourse.getSessionId()
  );
};

export { execute };
