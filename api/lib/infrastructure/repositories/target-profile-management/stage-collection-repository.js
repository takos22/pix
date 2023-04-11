import { knex } from '../../../../db/knex-database-connection.js';
import { StageCollection } from '../../../domain/models/target-profile-management/StageCollection.js';

const getByTargetProfileId = async function (targetProfileId) {
  const stages = await knex('stages').where({ targetProfileId }).orderBy('id', 'asc');
  const { max: maxLevel } = await knex('target-profile_tubes')
    .max('level')
    .where('targetProfileId', targetProfileId)
    .first();

  return new StageCollection({ id: targetProfileId, stages, maxLevel });
};

const save = async function (stageCollection) {
  const rawIds = await knex('stages').insert(stageCollection.stages).onConflict('id').merge().returning('id');
  return rawIds.map((rawId) => rawId.id);
};

const remove = function ({ id, targetProfileId }) {
  return knex('stages')
    .where({
      id,
      targetProfileId,
    })
    .delete();
};

export { getByTargetProfileId, save, remove };
