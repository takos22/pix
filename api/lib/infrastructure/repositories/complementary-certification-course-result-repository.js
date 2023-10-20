import { ComplementaryCertificationCourseResult } from '../../domain/models/ComplementaryCertificationCourseResult.js';
import { knex } from '../../../db/knex-database-connection.js';

const getPixSourceResultByComplementaryCertificationCourseId = async function ({ complementaryCertificationCourseId }) {
  const result = await knex
    .select('*')
    .from('complementary-certification-course-results')
    .where({ complementaryCertificationCourseId, source: ComplementaryCertificationCourseResult.sources.PIX })
    .first();

  if (!result) return null;

  return ComplementaryCertificationCourseResult.from(result);
};

const getByUserId = async function ({ userId }) {
  const results = await knex
    .select({
      acquired: 'complementary-certification-course-results.acquired',
      complementaryCertificationCourseId:
        'complementary-certification-course-results.complementaryCertificationCourseId',
      source: 'complementary-certification-course-results.source',
      partnerKey: 'complementary-certification-course-results.partnerKey',
      label: 'complementary-certification-badges.label',
    })
    .from('complementary-certification-course-results')
    .innerJoin(
      'complementary-certification-courses',
      'complementary-certification-courses.id',
      'complementary-certification-course-results.complementaryCertificationCourseId',
    )
    .innerJoin(
      'complementary-certification-badges',
      'complementary-certification-badges.complementaryCertificationId',
      'complementary-certification-courses.complementaryCertificationId',
    )
    .innerJoin('badges', 'complementary-certification-course-results.partnerKey', 'badges.key')
    .innerJoin(
      'certification-courses',
      'certification-courses.id',
      'complementary-certification-courses.certificationCourseId',
    )
    .where({ userId });

  if (!results.length) return null;

  return results.map(ComplementaryCertificationCourseResult.from);
};

const getAllowedJuryLevelByBadgeKey = async function ({ key }) {
  return knex('badges')
    .pluck('key')
    .where('targetProfileId', '=', knex('badges').select('targetProfileId').where({ key }));
};

const save = async function ({ complementaryCertificationCourseId, partnerKey, acquired, source }) {
  return knex('complementary-certification-course-results')
    .insert({ partnerKey, acquired, complementaryCertificationCourseId, source })
    .onConflict(['complementaryCertificationCourseId', 'source'])
    .merge();
};

export { getPixSourceResultByComplementaryCertificationCourseId, getAllowedJuryLevelByBadgeKey, save, getByUserId };
