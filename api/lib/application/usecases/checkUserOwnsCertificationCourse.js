import * as certificationCourseRepository from '../../infrastructure/repositories/certification-course-repository.js';

const execute = async function ({ userId, certificationCourseId }) {
  const certificationCourse = await certificationCourseRepository.get(certificationCourseId);
  return certificationCourse.doesBelongTo(userId);
};

export { execute };
