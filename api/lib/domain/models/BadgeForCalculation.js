const _ = require('lodash');
const logger = require('../../infrastructure/logger');

class BadgeForCalculation {
  constructor({ id, badgeCriteria }) {
    this.id = id;
    this.badgeCriteria = badgeCriteria;
  }

  shouldBeObtained(knowledgeElements) {
    return this.badgeCriteria.every((badgeCriterion) => badgeCriterion.isFulfilled(knowledgeElements));
  }
}

class BadgeCriterion {
  constructor({ threshold, skillIds }) {
    this.threshold = threshold;
    this.skillIds = skillIds;
  }

  isFulfilled(knowledgeElements) {
    const knowledgeElementsInSkills = _removeKnowledgeElementsNotInSkills(knowledgeElements, this.skillIds);
    const validatedSkillsCount = knowledgeElementsInSkills.filter(
      (knowledgeElement) => knowledgeElement.isValidated
    ).length;
    const totalSkillsCount = this.skillIds.length;
    const masteryPercentage = _computeMasteryPercentage(validatedSkillsCount, totalSkillsCount);
    logger.trace({
      validatedSkillsCount,
      totalSkillsCount,
      masteryPercentage,
      threshold: this.threshold,
      isFulfilled: masteryPercentage >= this.threshold,
    });
    return masteryPercentage >= this.threshold;
  }
}

function _removeKnowledgeElementsNotInSkills(knowledgeElements, skillIds) {
  return _.filter(knowledgeElements, (knowledgeElement) => skillIds.some((id) => id === knowledgeElement.skillId));
}

function _computeMasteryPercentage(validatedSkillsCount, totalSkillsCount) {
  if (totalSkillsCount === 0) return 0;
  return Math.round((validatedSkillsCount * 100) / totalSkillsCount);
}

module.exports = {
  BadgeForCalculation,
  BadgeCriterion,
};
