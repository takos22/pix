import './User.js';

import { Bookshelf } from '../bookshelf.js';

const modelName = 'ResetPasswordDemand';

const BookshelfResetPasswordDemand = Bookshelf.model(
  modelName,
  {
    tableName: 'reset-password-demands',
    hasTimestamps: ['createdAt', 'updatedAt'],

    user() {
      return this.belongsTo('User', 'email');
    },
  },
  {
    modelName,
  },
);

export { BookshelfResetPasswordDemand as ResetPasswordDemand };
