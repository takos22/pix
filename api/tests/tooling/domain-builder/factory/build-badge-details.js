import { BadgeDetails, BadgeCriterion, CappedTube, SCOPES } from '../../../../lib/domain/models/BadgeDetails.js';

const buildBadgeDetails = function buildBadgeDetails({
  id = 123,
  altMessage = 'Alternative messager',
  imageUrl = 'glissage.png',
  message = 'Thomas a glissé',
  title = 'La glissade',
  key = 'THOMAS_GLISSADE',
  isCertifiable = false,
  isAlwaysVisible = false,
  criteria = [],
} = {}) {
  return new BadgeDetails({
    id,
    altMessage,
    imageUrl,
    message,
    title,
    key,
    isCertifiable,
    isAlwaysVisible,
    criteria,
  });
};

buildBadgeDetails.buildBadgeCriterion_CampaignParticipation = function ({ id = 456, threshold = 80 }) {
  return new BadgeCriterion({
    id,
    name: null,
    scope: SCOPES.CAMPAIGN_PARTICIPATION,
    threshold,
    cappedTubes: [],
  });
};

buildBadgeDetails.buildBadgeCriterion_CappedTubes = function ({
  id = 456,
  name = null,
  threshold = 80,
  cappedTubesDTO = [
    { tubeId: 'recTube1', level: 4 },
    { tubeId: 'recTube2', level: 2 },
  ],
}) {
  const cappedTubes = cappedTubesDTO.map(({ tubeId, level }) => {
    return new CappedTube({ tubeId, level });
  });
  return new BadgeCriterion({
    id,
    name,
    scope: SCOPES.CAPPED_TUBES,
    threshold,
    cappedTubes,
  });
};

export { buildBadgeDetails };
