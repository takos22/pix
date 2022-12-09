const { expect, databaseBuilder, knex, sinon } = require('../../../test-helper');
const {
  addLastAssessmentResultCertificationCourse,
} = require('../../../../scripts/certification/fill-last-assessment-result-certification-course-table');

const ASSOC_TABLE_NAME = 'certification-courses-last-assessment-results';

const OLD_UPDATED_AT = new Date('2020-01-01');
const NEW_UPDATED_AT = new Date('2022-02-02');

describe('Integration | Scripts | Certification | fill-latest-assessment-result-certification-course-table', function () {
  let clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers(NEW_UPDATED_AT);
  });

  afterEach(function () {
    clock.restore();
    return knex(ASSOC_TABLE_NAME).delete();
  });

  describe('#addLastAssessmentResultCertificationCourse', function () {
    it('do what expected', async function () {
      // given
      _buildPublishedCertification({
        id: 1,
      });
      _buildPublishedCertification({
        id: 2,
      });
      _buildNotPublishedCertification({
        id: 3,
      });
      _buildAssessmentResults({
        certificationCourseId: 1,
        latestAssessmentResultId: 10,
      });
      _buildAssessmentResults({ certificationCourseId: 2, latestAssessmentResultId: 20 });
      _buildAssessmentResults({ certificationCourseId: 3, latestAssessmentResultId: 30 });

      await databaseBuilder.commit();
      await knex(ASSOC_TABLE_NAME).insert({
        certificationCourseId: 1,
        lastAssessmentResultId: 10,
      });

      // when
      await addLastAssessmentResultCertificationCourse({ count: 10, concurrency: 1 });

      // then
      const certificationDTOs = await knex(ASSOC_TABLE_NAME).orderBy('certificationCourseId');
      expect(certificationDTOs[0]).to.deep.equal({
        certificationCourseId: 1,
        lastAssessmentResultId: 10,
      });

      expect(certificationDTOs[1]).to.deep.equal({ certificationCourseId: 2, lastAssessmentResultId: 20 });
    });
  });
});

function _buildPublishedCertification({ id }) {
  _buildCertification({
    id,
    isPublished: true,
  });
}

function _buildNotPublishedCertification({ id }) {
  _buildCertification({ id, isPublished: false });
}

function _buildCertification({ id, isPublished }) {
  databaseBuilder.factory.buildCertificationCourse({
    id,
    isPublished,
    updatedAt: OLD_UPDATED_AT,
  });
}

function _buildAssessmentResults({ certificationCourseId, latestAssessmentResultId }) {
  const assessmentId = databaseBuilder.factory.buildAssessment({ certificationCourseId }).id;
  // not the latest
  databaseBuilder.factory.buildAssessmentResult({
    assessmentId,
    createdAt: new Date('2020-01-01'),
  });
  // the latest
  databaseBuilder.factory.buildAssessmentResult({
    id: latestAssessmentResultId,
    assessmentId,
    createdAt: new Date('2021-01-01'),
  });
  return assessmentId;
}
