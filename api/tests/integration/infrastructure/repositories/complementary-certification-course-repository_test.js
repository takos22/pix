import { knex } from '../../../../db/knex-database-connection.js';
import { databaseBuilder, expect } from '../../../test-helper.js';
import * as complementaryCertificationCourseRepository from '../../../../lib/infrastructure/repositories/complementary-certification-course-repository.js';
import { ComplementaryCertificationCourseResult } from '../../../../lib/domain/models/index.js';

describe('Integration | Repository | complementary-certification-courses-repository', function () {
  describe('#getByUserId', function () {
    afterEach(function () {
      return knex('complementary-certification-course-results').delete();
    });
    describe('when the user has no certificationCourse taken', function () {
      it('should return null', async function () {
        // given a user
        const userId = databaseBuilder.factory.buildUser().id;
        const certificationCourseId = databaseBuilder.factory.buildCertificationCourse().id;
        databaseBuilder.factory.buildComplementaryCertificationCourse({ certificationCourseId });

        await databaseBuilder.commit();

        // when
        const complementaryCertificationCoursesWithResults =
          await complementaryCertificationCourseRepository.getByUserId({ userId });

        // then
        expect(complementaryCertificationCoursesWithResults).to.be.empty;
      });
    });

    describe('when the user has taken and passed certificationCourses', function () {
      it('should return the ComplementaryCertificationCourses', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;

        databaseBuilder.factory.buildBadge({ key: 'PIX_TEST_1', id: 1 });
        databaseBuilder.factory.buildBadge({ key: 'PIX_TEST_2', id: 2 });

        databaseBuilder.factory.buildComplementaryCertification({ id: 1 });
        databaseBuilder.factory.buildComplementaryCertification.pixEdu1erDegre({ id: 2 });

        databaseBuilder.factory.buildComplementaryCertificationBadge({
          id: 123,
          complementaryCertificationId: 1,
          badgeId: 1,
          label: 'Certif Complementaire 1',
        });
        databaseBuilder.factory.buildComplementaryCertificationBadge({
          id: 456,
          complementaryCertificationId: 2,
          badgeId: 2,
          label: 'Certif Complementaire 2',
        });

        databaseBuilder.factory.buildCertificationCourse({ id: 99, userId });
        databaseBuilder.factory.buildCertificationCourse({ id: 100, userId });

        databaseBuilder.factory.buildComplementaryCertificationCourse({
          complementaryCertificationBadgeId: 123,
          id: 999,
          certificationCourseId: 99,
          complementaryCertificationId: 1,
        });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          complementaryCertificationBadgeId: 456,
          id: 1000,
          certificationCourseId: 100,
          complementaryCertificationId: 2,
        });

        const complementaryCertificationCourseResultId1 =
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            acquired: true,
            complementaryCertificationCourseId: 999,
            partnerKey: 'PIX_TEST_1',
            source: ComplementaryCertificationCourseResult.sources.PIX,
          }).id;
        const complementaryCertificationCourseResultId2 =
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            acquired: true,
            complementaryCertificationCourseId: 1000,
            partnerKey: 'PIX_TEST_2',
            source: ComplementaryCertificationCourseResult.sources.PIX,
          }).id;
        const complementaryCertificationCourseResultId3 =
          databaseBuilder.factory.buildComplementaryCertificationCourseResult({
            acquired: true,
            complementaryCertificationCourseId: 1000,
            partnerKey: 'PIX_TEST_2',
            source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
          }).id;

        await databaseBuilder.commit();

        // when
        const complementaryCertificationCoursesWithResults =
          await complementaryCertificationCourseRepository.getByUserId({ userId });

        // then
        expect(complementaryCertificationCoursesWithResults).to.have.lengthOf(2);
        expect(complementaryCertificationCoursesWithResults).to.exactlyContain([
          {
            hasExternalJury: false,
            id: 999,
            complementaryCertificationBadgeId: 123,
            results: [
              {
                id: complementaryCertificationCourseResultId1,
                acquired: true,
                partnerKey: 'PIX_TEST_1',
                source: ComplementaryCertificationCourseResult.sources.PIX,
              },
            ],
          },
          {
            id: 1000,
            hasExternalJury: true,
            complementaryCertificationBadgeId: 456,
            results: [
              {
                id: complementaryCertificationCourseResultId3,
                acquired: true,
                partnerKey: 'PIX_TEST_2',
                source: ComplementaryCertificationCourseResult.sources.EXTERNAL,
              },
              {
                id: complementaryCertificationCourseResultId2,
                acquired: true,
                partnerKey: 'PIX_TEST_2',
                source: ComplementaryCertificationCourseResult.sources.PIX,
              },
            ],
          },
        ]);
      });
    });
  });
});
