import { QcuFeedback } from '../../../../../src/devcomp/domain/models/QcuFeedback.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Devcomp | Models | QcuFeedback', function () {
  describe('#constructor', function () {
    it('should create a feedback with correct attributes', function () {
      // given
      const feedbackText = 'bravo';
      const position = 1;

      // when
      const feedback = new QcuFeedback({ text: feedbackText, proposalPosition: position });

      // then
      expect(feedback).not.to.be.undefined;
      expect(feedback.text).to.equal(feedbackText);
      expect(feedback.proposalPosition).to.equal(position);
    });
  });

  describe('If a QCU Feedback does not have a text', function () {
    it('should throw an error', function () {
      expect(() => new QcuFeedback({})).to.throw('Le texte de feedback est obligatoire pour un feedback de QCU');
    });
  });

  describe('If a QCU Feedback does not have a proposal position', function () {
    it('should throw an error', function () {
      expect(() => new QcuFeedback({ text: '' })).to.throw(
        'La position de la proposition est obligatoire pour un feedback de QCU',
      );
    });
  });
});
