'use strict';
const Badge = require('./Badge.js');

class CampaignParticipationBadge extends Badge {
  constructor({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    title,
    isAcquired,
    isCertifiable = false,
    badgeCriteria = [],
    skillSets = [],
    skillSetResults = [],
    targetProfileId,
  } = {}) {
    super({
      id,
      key,
      altMessage,
      imageUrl,
      message,
      title,
      isCertifiable,
      badgeCriteria,
      skillSets,
      targetProfileId,
    });
    this.skillSetResults = skillSetResults;
    this.isAcquired = isAcquired;
  }

  static buildFrom({ badge, skillSetResults, isAcquired }) {
    return new CampaignParticipationBadge({
      ...badge,
      skillSetResults,
      isAcquired,
    });
  }
}

module.exports = CampaignParticipationBadge;
