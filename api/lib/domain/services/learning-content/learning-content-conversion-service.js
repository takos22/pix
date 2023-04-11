import * as skillRepository from '../../../infrastructure/repositories/skill-repository.js';

async function findActiveSkillsForCappedTubes(cappedTubes) {
  const skills = [];
  for (const cappedTube of cappedTubes) {
    const skillsForTube = await skillRepository.findActiveByTubeId(cappedTube.id);
    const skillsCapped = skillsForTube.filter((skill) => skill.difficulty <= parseInt(cappedTube.level));
    skills.push(...skillsCapped);
  }
  return skills;
}

export { findActiveSkillsForCappedTubes };
