import { assertNotNullOrUndefined } from '../../../shared/domain/models/asserts.js';

class QcuCorrectAnswer {
  constructor({ value }) {
    assertNotNullOrUndefined(value, 'La valeur est obligatoire pour une réponse correcte de QCU');

    this.value = value;
  }
}

export { QcuCorrectAnswer };
