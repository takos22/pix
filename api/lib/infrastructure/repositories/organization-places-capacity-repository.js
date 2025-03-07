import { knex } from '../../../db/knex-database-connection.js';
import { OrganizationPlacesCapacity } from '../../domain/read-models/OrganizationPlacesCapacity.js';

async function findByOrganizationId(organizationId) {
  const now = new Date();
  const organizationPlacesLots = await knex('organization-places')
    .select('category', 'count')
    .where({ organizationId })
    .where('activationDate', '<', now)
    .whereNull('deletedAt')
    .where(function () {
      this.where('expirationDate', '>', now).orWhereNull('expirationDate');
    });

  return new OrganizationPlacesCapacity({ placesLots: organizationPlacesLots, organizationId });
}

export { findByOrganizationId };
