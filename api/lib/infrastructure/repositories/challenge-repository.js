'use strict';
const _ = require('lodash');
const Challenge = require('../../domain/models/Challenge.js');

const { challengeDatasource } = require('../datasources/learning-content/challenge-datasource.js');
const { skillDatasource } = require('../datasources/learning-content/skill-datasource.js');
const skillAdapter = require('../adapters/skill-adapter.js');
const solutionAdapter = require('../adapters/solution-adapter.js');
const LearningContentResourceNotFound = require('../datasources/learning-content/LearningContentResourceNotFound.js');
const { NotFoundError } = require('../../domain/errors.js');
const config = require('../../config.js');

let challenges = null;

async function initChallenges() {
  if (challenges) return challenges;
  const challengeDataObjects = await challengeDatasource.list();
  const skills = await skillDatasource.list();
  challenges = _toDomainCollection({ challengeDataObjects, skills });
  return challenges;
}

module.exports = {
  async get(id) {
    try {
      await initChallenges();
      return challenges.find(({id: challengeId}) => challengeId === id);
    } catch (error) {
      if (error instanceof LearningContentResourceNotFound) {
        throw new NotFoundError();
      }
      throw error;
    }
  },

  async getMany(ids) {
    try {
      await initChallenges();
      const challengeDataObjects = await challengeDatasource.getMany(ids);
      const skills = await skillDatasource.getMany(challengeDataObjects.map(({ skillId }) => skillId));
      return _toDomainCollection({ challengeDataObjects, skills });
    } catch (error) {
      if (error instanceof LearningContentResourceNotFound) {
        throw new NotFoundError();
      }
      throw error;
    }
  },

  async list() {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.list();
    const skills = await skillDatasource.list();
    return _toDomainCollection({ challengeDataObjects, skills });
  },

  async findValidated() {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.findValidated();
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },

  async findOperative() {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.findOperative();
    const operativeSkills = await skillDatasource.findOperative();
    return _toDomainCollection({ challengeDataObjects, skills: operativeSkills });
  },

  async findOperativeHavingLocale(locale) {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.findOperativeHavingLocale(locale);
    const operativeSkills = await skillDatasource.findOperative();
    return _toDomainCollection({ challengeDataObjects, skills: operativeSkills });
  },

  async findValidatedByCompetenceId(competenceId) {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.findValidatedByCompetenceId(competenceId);
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },

  async findOperativeBySkills(skills) {
    await initChallenges();
    const skillIds = skills.map((skill) => skill.id);
    const challengeDataObjects = await challengeDatasource.findOperativeBySkillIds(skillIds);
    const operativeSkills = await skillDatasource.findOperative();
    return _toDomainCollection({ challengeDataObjects, skills: operativeSkills });
  },

  async findActiveFlashCompatible({
    locale,
    successProbabilityThreshold = config.features.successProbabilityThreshold,
  } = {}) {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.findActiveFlashCompatible(locale);
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills, successProbabilityThreshold });
  },

  async findOperativeFlashCompatible({
    locale,
    successProbabilityThreshold = config.features.successProbabilityThreshold,
  } = {}) {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.findOperativeFlashCompatible(locale);
    const skills = await skillDatasource.list();
    return _toDomainCollection({ challengeDataObjects, skills, successProbabilityThreshold });
  },

  async findValidatedBySkillId(skillId) {
    await initChallenges();
    const challengeDataObjects = await challengeDatasource.findValidatedBySkillId(skillId);
    const activeSkills = await skillDatasource.findActive();
    return _toDomainCollection({ challengeDataObjects, skills: activeSkills });
  },
};

function _toDomainCollection({ challengeDataObjects, skills, successProbabilityThreshold }) {
  const lookupSkill = (id) => _.find(skills, { id });
  const challenges = challengeDataObjects.map((challengeDataObject) => {
    const skillDataObject = lookupSkill(challengeDataObject.skillId);

    return _toDomain({
      challengeDataObject,
      skillDataObject,
      successProbabilityThreshold,
    });
  });

  return challenges;
}

function _toDomain({ challengeDataObject, skillDataObject, successProbabilityThreshold }) {
  const skill = skillDataObject ? skillAdapter.fromDatasourceObject(skillDataObject) : null;

  const solution = solutionAdapter.fromDatasourceObject(challengeDataObject);

  const validator = Challenge.createValidatorForChallengeType({
    challengeType: challengeDataObject.type,
    solution,
  });

  const challenge = new Challenge({
    id: challengeDataObject.id,
    type: challengeDataObject.type,
    status: challengeDataObject.status,
    instruction: challengeDataObject.instruction,
    alternativeInstruction: challengeDataObject.alternativeInstruction,
    proposals: challengeDataObject.proposals,
    timer: challengeDataObject.timer,
    illustrationUrl: challengeDataObject.illustrationUrl,
    attachments: challengeDataObject.attachments,
    embedUrl: challengeDataObject.embedUrl,
    embedTitle: challengeDataObject.embedTitle,
    embedHeight: challengeDataObject.embedHeight,
    skill,
    validator,
    competenceId: challengeDataObject.competenceId,
    illustrationAlt: challengeDataObject.illustrationAlt,
    format: challengeDataObject.format,
    locales: challengeDataObject.locales,
    autoReply: challengeDataObject.autoReply,
    focused: challengeDataObject.focusable,
    discriminant: challengeDataObject.alpha,
    difficulty: challengeDataObject.delta,
    responsive: challengeDataObject.responsive,
    successProbabilityThreshold,
  });

  Object.freeze(challenge);

  return challenge;
}
