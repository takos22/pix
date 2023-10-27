import { QcuFeedback } from '../../../../../src/devcomp/domain/models/QcuFeedback.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Devcomp | Models | Feedback', function () {
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
});
