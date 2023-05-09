import { knex } from '../../../../db/knex-database-connection.js';
import { Campaign } from '../../../domain/models/CampaignForArchiving.js';
import { knexUtils } from '../../utils/knex-utils.js';
import { NotFoundError, UserNotFoundError } from '../../../domain/errors.js';

async function save(campaign) {
  try {
    await knex('campaigns').update(campaign).where({ code: campaign.code });
  } catch (error) {
    if (knexUtils.foreignKeyConstraintViolated(error)) {
      throw new UserNotFoundError('User Not Found');
    }
  }
}

async function getByCode(code) {
  const row = await knex('campaigns').select(['id', 'code', 'archivedAt', 'archivedBy']).where({ code }).first();
  if (!row) {
    throw new NotFoundError('Campaign Not Found');
  }
  return new Campaign(row);
}

async function get(id) {
  const row = await knex('campaigns').select(['id', 'code', 'archivedAt', 'archivedBy']).where({ id }).first();
  if (!row) {
    throw new NotFoundError();
  }
  return new Campaign(row);
}

export { save, getByCode, get };
