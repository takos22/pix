import { assertNotNullOrUndefined } from '../../../shared/domain/models/asserts.js';

class QcuFeedback {
  constructor({ text, proposalPosition }) {
    assertNotNullOrUndefined(text, 'Le texte de feedback est obligatoire pour un feedback de QCU');
    assertNotNullOrUndefined(proposalPosition, 'La position de la proposition est obligatoire pour un feedback de QCU');

    this.text = text;
    this.proposalPosition = proposalPosition;
  }
}

export { QcuFeedback };
