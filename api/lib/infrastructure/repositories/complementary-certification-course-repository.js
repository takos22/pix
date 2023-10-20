import { knex } from '../../../db/knex-database-connection.js';
import { ComplementaryCertificationCourseWithResults } from '../../domain/models/ComplementaryCertificationCourseWithResults.js';

/**
 *
 *     this.id = id;
 *     this.hasExternalJury = hasExternalJury;
 *     this.results = results;
 */
const getByUserId = async function ({ userId }) {
  const results = await knex
    .select({
      hasEternalJury: 'complementary-certifications.hasExternalJury',
      results: knex.raw(
        `array_agg(json_build_object(
        'id', "complementary-certification-course-results".id,
        'acquired', "complementary-certification-course-results".acquired,
        'partnerKey', "complementary-certification-course-results"."partnerKey",
        'source', "complementary-certification-course-results".source))`,
      ),
    })
    .from('complementary-certification-courses')
    .leftJoin(
      'complementary-certification-course-results',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId',
    )
    .innerJoin(
      'complementary-certifications',
      'complementary-certifications.id',
      'complementary-certification-courses.complementaryCertificationId',
    )
    .innerJoin(
      'certification-courses',
      'certification-courses.id',
      'complementary-certification-courses.certificationCourseId',
    )
    .groupBy('hasEternalJury')
    .where({ userId });

  if (!results.length) return null;

  return results.map(ComplementaryCertificationCourseWithResults.from);
};

export { getByUserId };
