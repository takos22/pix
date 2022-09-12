const { knex } = require('../../../db/knex-database-connection');
const OrganizationForUserAdmin = require('../../domain/read-models/OrganizationForUserAdmin');

module.exports = {
  async findByUserId(userId, active_users_only = true) {
    const organizations = await knex('memberships')
      .select({
        id: 'memberships.id',
        updatedAt: 'memberships.updatedAt',
        role: 'memberships.organizationRole',
        disabledAt: 'memberships.disabledAt',
        organizationId: 'memberships.organizationId',
        organizationName: 'organizations.name',
        organizationType: 'organizations.type',
        organizationExternalId: 'organizations.externalId',
      })
      .innerJoin('organizations', 'organizations.id', 'memberships.organizationId')
      .where('memberships.userId', userId);

    return organizations.map((attributes) => new OrganizationForUserAdmin(attributes));
  },
};
