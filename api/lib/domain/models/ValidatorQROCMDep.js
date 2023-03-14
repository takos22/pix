import * as solutionServiceQROCMDep from '../services/solution-service-qrocm-dep.js';
import { Validation } from './Validation.js';
import { Validator } from './Validator.js';

/**
 * Traduction: Vérificateur de réponse pour un QROCM Dep
 */
class ValidatorQROCMDep extends Validator {
  constructor({ solution } = {}) {
    super({ solution });
  }

  assess({ answer }) {
    const result = solutionServiceQROCMDep.match({
      answerValue: answer.value,
      solution: this.solution,
    });

    return new Validation({
      result,
      resultDetails: null,
    });
  }
}

export { ValidatorQROCMDep };
