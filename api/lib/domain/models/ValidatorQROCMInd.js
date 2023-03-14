import * as solutionServiceQROCMInd from '../services/solution-service-qrocm-ind.js';
import { Validation } from './Validation.js';
import { Validator } from './Validator.js';

/**
 * Traduction: Vérificateur de réponse pour un QROCM Ind
 */
class ValidatorQROCMInd extends Validator {
  constructor({ solution } = {}) {
    super({ solution });
  }

  assess({ answer }) {
    const resultObject = solutionServiceQROCMInd.match({ answerValue: answer.value, solution: this.solution });

    return new Validation({
      result: resultObject.result,
      resultDetails: resultObject.resultDetails,
    });
  }
}

export { ValidatorQROCMInd };
