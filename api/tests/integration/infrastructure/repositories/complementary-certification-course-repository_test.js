import { knex } from '../../../../db/knex-database-connection.js';
import { databaseBuilder, expect } from '../../../test-helper.js';
import * as complementaryCertificationCourseRepository from '../../../../lib/infrastructure/repositories/complementary-certification-course-repository.js';
import { ComplementaryCertificationCourseResult } from '../../../../lib/domain/models/index.js';

describe('Integration | Repository | complementary-certification-courses-repository', function () {
  describe('#getByUserId', function () {
    afterEach(function () {
      return knex('complementary-certification-course-results').delete();
    });
    describe('when the ComplementaryCertificationCourseResult does not exist', function () {
      it('should return null', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          name: 'Pix+ Test',
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99, userId });
        databaseBuilder.factory.buildComplementaryCertificationCourse({
          id: 999,
          certificationCourseId: 99,
          complementaryCertificationId: 1,
        });

        await databaseBuilder.commit();

        // when
        const complementaryCertificationCoursesWithResults =
          await complementaryCertificationCourseRepository.getByUserId({ userId });

        console.log(complementaryCertificationCoursesWithResults[0].results);
        // then
        expect(complementaryCertificationCoursesWithResults[0].results).to.be.empty;
      });
    });
    describe('when the ComplementaryCertificationCourseResults already exist', function () {
      it('should return the ComplementaryCertificationCourseResults', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;

        databaseBuilder.factory.buildBadge({ key: 'PIX_TEST_1', id: 1 });
        databaseBuilder.factory.buildBadge({ key: 'PIX_TEST_2', id: 2 });

        databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          name: 'Pix+ Test',
          badgeId: 1,
        });
        databaseBuilder.factory.buildComplementaryCertification({
          id: 2,
          name: 'Pix+ Test2',
          badgeId: 2,
        });
        databaseBuilder.factory.buildCertificationCourse({ id: 99, userId });

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

        databaseBuilder.factory.buildComplementaryCertificationCourseResult({
          acquired: true,
          complementaryCertificationCourseId: 999,
          partnerKey: 'PIX_TEST_1',
          source: ComplementaryCertificationCourseResult.sources.PIX,
        });

        databaseBuilder.factory.buildComplementaryCertificationCourseResult({
          acquired: true,
          complementaryCertificationCourseId: 1000,
          partnerKey: 'PIX_TEST_2',
          source: ComplementaryCertificationCourseResult.sources.PIX,
        });

        await databaseBuilder.commit();

        // when
        const results = await complementaryCertificationCourseRepository.getByUserId({ userId });

        // then
        expect(results).to.have.lengthOf(2);
        expect(results).to.deep.equal([
          {
            acquired: true,
            complementaryCertificationCourseId: 999,
            partnerKey: 'PIX_TEST_1',
            source: ComplementaryCertificationCourseResult.sources.PIX,
            label: 'Certif Complementaire 1',
          },
          {
            acquired: true,
            complementaryCertificationCourseId: 1000,
            partnerKey: 'PIX_TEST_2',
            source: ComplementaryCertificationCourseResult.sources.PIX,
            label: 'Certif Complementaire 2',
          },
        ]);
      });
    });
  });
});
