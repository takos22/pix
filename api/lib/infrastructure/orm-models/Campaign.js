import { Bookshelf } from '../bookshelf.js';

import './Assessment.js';
import './CampaignParticipation.js';
import './Organization.js';
import './TargetProfile.js';
import './User.js';

const modelName = 'Campaign';

const BookshelfCampaign = Bookshelf.model(
  modelName,
  {
    tableName: 'campaigns',
    hasTimestamps: ['createdAt', null],

    organization() {
      return this.belongsTo('Organization', 'organizationId');
    },

    campaignParticipations() {
      return this.hasMany('CampaignParticipation', 'campaignId');
    },

    targetProfile() {
      return this.belongsTo('TargetProfile', 'targetProfileId');
    },

    creator() {
      return this.belongsTo('User', 'creatorId');
    },
  },
  {
    modelName,
  },
);

export { BookshelfCampaign };
