import { knex } from '../../../db/knex-database-connection.js';
import * as bookshelfToDomainConverter from '../utils/bookshelf-to-domain-converter.js';
import { BookshelfBadge } from '../orm-models/Badge.js';
import { Badge } from '../../domain/models/Badge.js';
import omit from 'lodash/omit';
import * as knexUtils from '../utils/knex-utils.js';
import { AlreadyExistingEntityError } from '../../domain/errors.js';
import { DomainTransaction } from '../../infrastructure/DomainTransaction.js';

const TABLE_NAME = 'badges';

const findByCampaignId = function (campaignId) {
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
};

const isAssociated = async function (badgeId, { knexTransaction } = DomainTransaction.emptyTransaction()) {
  const associatedBadge = await (knexTransaction ?? knex)('badge-acquisitions').where({ badgeId }).first();
  return !!associatedBadge;
};

const isRelatedToCertification = async function (badgeId, { knexTransaction } = DomainTransaction.emptyTransaction()) {
  const complementaryCertificationBadge = await (knexTransaction ?? knex)('complementary-certification-badges')
    .where({ badgeId })
    .first();
  return !!complementaryCertificationBadge;
};

const get = async function (id) {
  const bookshelfBadge = await BookshelfBadge.where('id', id).fetch({
    withRelated: ['badgeCriteria', 'skillSets'],
  });
  return bookshelfToDomainConverter.buildDomainObject(BookshelfBadge, bookshelfBadge);
};

const getByKey = async function (key) {
  const bookshelfBadge = await BookshelfBadge.where({ key }).fetch({
    withRelated: ['badgeCriteria', 'skillSets'],
  });
  return bookshelfToDomainConverter.buildDomainObject(BookshelfBadge, bookshelfBadge);
};

const save = async function (badge, { knexTransaction } = DomainTransaction.emptyTransaction()) {
  try {
    const [savedBadge] = await (knexTransaction ?? knex)(TABLE_NAME).insert(_adaptModelToDb(badge)).returning('*');
    return new Badge(savedBadge);
  } catch (err) {
    if (knexUtils.isUniqConstraintViolated(err)) {
      throw new AlreadyExistingEntityError(`The badge key ${badge.key} already exists`);
    }
    throw err;
  }
};

const update = async function (badge) {
  const [updatedBadge] = await knex(TABLE_NAME).update(_adaptModelToDb(badge)).where({ id: badge.id }).returning('*');
  return new Badge({ ...badge, ...updatedBadge });
};

const isKeyAvailable = async function (key, { knexTransaction } = DomainTransaction.emptyTransaction()) {
  const result = await (knexTransaction ?? knex)(TABLE_NAME).select('key').where('key', key);
  if (result.length) {
    throw new AlreadyExistingEntityError(`The badge key ${key} already exists`);
  }
  return true;
};

const remove = async function (badgeId, { knexTransaction } = DomainTransaction.emptyTransaction()) {
  const knexConn = knexTransaction ?? knex;
  await knexConn('badge-criteria').where({ badgeId }).del();
  await knexConn('skill-sets').where({ badgeId }).del();
  await knexConn('badges').where({ id: badgeId }).del();

  return true;
};

export {
  findByCampaignId,
  isAssociated,
  isRelatedToCertification,
  get,
  getByKey,
  save,
  update,
  isKeyAvailable,
  remove,
};

function _adaptModelToDb(badge) {
  return omit(badge, ['id', 'badgeCriteria', 'skillSets', 'complementaryCertificationBadge']);
}
