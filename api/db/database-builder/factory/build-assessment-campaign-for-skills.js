import { buildCampaign } from './build-campaign.js';
import { buildTargetProfile } from './build-target-profile.js';
import { buildTargetProfileSkill } from './build-target-profile-skill.js';
import { CampaignTypes } from '../../../lib/domain/models/CampaignTypes.js';

const buildAssessmentCampaignForSkills = function (attributes, skillSet) {
  const targetProfileId = buildTargetProfile().id;
  skillSet.forEach((skill) => buildTargetProfileSkill({ targetProfileId, skillId: skill.id }));

  attributes.type = CampaignTypes.ASSESSMENT;
  attributes.targetProfileId = targetProfileId;

  return buildCampaign(attributes);
};

export { buildAssessmentCampaignForSkills };
