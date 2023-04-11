import * as areaRepository from './area-repository.js';
import { CompetenceTree } from '../../domain/models/CompetenceTree.js';

const get = async function ({ locale } = {}) {
  const areas = await areaRepository.listWithPixCompetencesOnly({ locale });
  return new CompetenceTree({ areas });
};

export { get };
