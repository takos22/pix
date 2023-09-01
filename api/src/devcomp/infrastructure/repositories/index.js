import { injectDependencies } from '../../../../src/shared/infrastructure/utils/dependency-injection.js';

import * as grainRepository from './grain-repository.js';

const repositoriesWithoutInjectedDependencies = {
  grainRepository,
};

const dependencies = {};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
