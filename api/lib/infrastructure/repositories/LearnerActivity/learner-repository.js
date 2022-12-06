const { knex } = require('../../../../db/knex-database-connection');
const Learner = require('../../../../lib/domain/models/LearnerActivity/Learner');
const { NotFoundError } = require('../../../../lib/domain/errors');

module.exports = {
  get: async function (id, organizationId) {
    const row = await knex('organization-learners').where({ id, organizationId }).first();
    if (row) {
      return new Learner(row);
    }
    throw new NotFoundError();
  },
};
