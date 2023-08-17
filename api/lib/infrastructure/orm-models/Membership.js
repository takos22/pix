import './Organization.js';
import './User.js';

import { Bookshelf } from '../bookshelf.js';

const modelName = 'Membership';

const BookshelfMembership = Bookshelf.model(
  modelName,
  {
    tableName: 'memberships',
    hasTimestamps: ['createdAt', 'updatedAt'],

    user() {
      return this.belongsTo('User', 'userId');
    },

    organization() {
      return this.belongsTo('Organization', 'organizationId');
    },
  },
  {
    modelName,
  },
);

export { BookshelfMembership };
