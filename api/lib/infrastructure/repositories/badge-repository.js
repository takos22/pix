import { knex } from '../../../db/knex-database-connection';
import bookshelfToDomainConverter from '../utils/bookshelf-to-domain-converter';
import BookshelfBadge from '../orm-models/Badge';
import Badge from '../../domain/models/Badge';
import omit from 'lodash/omit';
import bookshelfUtils from '../utils/knex-utils';
import { AlreadyExistingEntityError } from '../../domain/errors';
import DomainTransaction from '../../infrastructure/DomainTransaction';

const TABLE_NAME = 'badges';

export default {
  findByCampaignId(campaignId) {
    return BookshelfBadge.query((qb) => {
      qb.join('target-profiles', 'target-profiles.id', 'badges.targetProfileId');
      qb.join('campaigns', 'campaigns.targetProfileId', 'target-profiles.id');
    })
      .where('campaigns.id', campaignId)
      .fetchAll({
        require: false,
        withRelated: ['badgeCriteria', 'skillSets'],
      })
      .then((results) => bookshelfToDomainConverter.buildDomainObjects(BookshelfBadge, results));
  },

  async isAssociated(badgeId, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const associatedBadge = await (knexTransaction ?? knex)('badge-acquisitions').where({ badgeId }).first();
    return !!associatedBadge;
  },

  async isRelatedToCertification(badgeId, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const complementaryCertificationBadge = await (knexTransaction ?? knex)('complementary-certification-badges')
      .where({ badgeId })
      .first();
    return !!complementaryCertificationBadge;
  },

  async get(id) {
    const bookshelfBadge = await BookshelfBadge.where('id', id).fetch({
      withRelated: ['badgeCriteria', 'skillSets'],
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfBadge, bookshelfBadge);
  },

  async getByKey(key) {
    const bookshelfBadge = await BookshelfBadge.where({ key }).fetch({
      withRelated: ['badgeCriteria', 'skillSets'],
    });
    return bookshelfToDomainConverter.buildDomainObject(BookshelfBadge, bookshelfBadge);
  },

  async save(badge, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    try {
      const [savedBadge] = await (knexTransaction ?? knex)(TABLE_NAME).insert(_adaptModelToDb(badge)).returning('*');
      return new Badge(savedBadge);
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError(`The badge key ${badge.key} already exists`);
      }
      throw err;
    }
  },

  async update(badge) {
    const [updatedBadge] = await knex(TABLE_NAME).update(_adaptModelToDb(badge)).where({ id: badge.id }).returning('*');
    return new Badge({ ...badge, ...updatedBadge });
  },

  async isKeyAvailable(key, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const result = await (knexTransaction ?? knex)(TABLE_NAME).select('key').where('key', key);
    if (result.length) {
      throw new AlreadyExistingEntityError(`The badge key ${key} already exists`);
    }
    return true;
  },

  async delete(badgeId, { knexTransaction } = DomainTransaction.emptyTransaction()) {
    const knexConn = knexTransaction ?? knex;
    await knexConn('badge-criteria').where({ badgeId }).del();
    await knexConn('skill-sets').where({ badgeId }).del();
    await knexConn('badges').where({ id: badgeId }).del();

    return true;
  },
};

function _adaptModelToDb(badge) {
  return omit(badge, ['id', 'badgeCriteria', 'skillSets', 'complementaryCertificationBadge']);
}
