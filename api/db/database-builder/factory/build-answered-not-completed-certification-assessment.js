import { buildCertificationCourse } from './build-certification-course.js';
import { buildAssessment } from './build-assessment.js';
import { Assessment } from '../../../src/shared/domain/models/Assessment.js';
import { buildCertificationChallenge } from './build-certification-challenge.js';
import { buildAnswer } from './build-answer.js';

const buildAnsweredNotCompletedCertificationAssessment = function ({
  certifiableUserId,
  competenceIdSkillIdPairs,
  limitDate,
  version = 2,
}) {
  const certificationCourseId = buildCertificationCourse({
    userId: certifiableUserId,
    createdAt: limitDate,
    version,
  }).id;
  const certificationAssessment = buildAssessment({
    certificationCourseId,
    userId: certifiableUserId,
    state: Assessment.states.STARTED,
    type: Assessment.types.CERTIFICATION,
    createdAt: limitDate,
  });
  competenceIdSkillIdPairs.forEach((element) => {
    const { challengeId, competenceId } = element;
    buildCertificationChallenge({ courseId: certificationCourseId, challengeId, competenceId });
    buildAnswer({ assessmentId: certificationAssessment.id, challengeId, result: 'ok' });
  });

  return certificationAssessment;
};

export { buildAnsweredNotCompletedCertificationAssessment };
