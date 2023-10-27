import { expect } from '../../../../test-helper.js';
import { QcuCorrectAnswer } from '../../../../../src/devcomp/domain/models/QcuCorrectAnswer.js';

describe('Unit | Devcomp | Models | QcuCorrectAnswer', function () {
  describe('#constructor', function () {
    it('should create a correct answer for QCU with correct attribute', function () {
      // when
      const correctAnswer = new QcuCorrectAnswer({ value: 1 });

      // then
      expect(correctAnswer).not.to.be.undefined;
      expect(correctAnswer.value).to.equal(1);
    });
  });

  describe('If a Correct Answer does not have a value', function () {
    it('should throw an error', function () {
      expect(() => new QcuCorrectAnswer({})).to.throw('La valeur est obligatoire pour une réponse correcte de QCU');
    });
  });
});
