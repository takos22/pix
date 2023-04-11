const findTargetProfileStages = async function ({ targetProfileId, targetProfileRepository }) {
  return targetProfileRepository.findStages({ targetProfileId });
};

export { findTargetProfileStages };
