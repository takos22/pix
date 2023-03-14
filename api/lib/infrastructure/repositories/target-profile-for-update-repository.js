import { TargetProfileForUpdate } from '../../domain/models/TargetProfileForUpdate.js';
import { knex } from '../../../db/knex-database-connection.js';
import { NotFoundError } from '../../domain/errors.js';

const get = async function (id) {
  const row = await knex('target-profiles')
    .select('id', 'name', 'description', 'comment', 'category')
    .where({ id })
    .first();

  if (!row) {
    throw new NotFoundError(`Le profil cible avec l'id ${id} n'existe pas`);
  }

  return new TargetProfileForUpdate(row);
};

const update = async function (targetProfile) {
  return await knex('target-profiles').where({ id: targetProfile.id }).update(targetProfile);
};

export { get, update };
