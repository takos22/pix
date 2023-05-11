const { expect, domainBuilder } = require('../../../test-helper');
const AssessmentAlgorithm = require('../../../../lib/domain/models/AssessmentAlgorithm');

describe('Unit | Domain | Models | AssessmentAlgorithm', function () {
  describe('#constuctor', function () {
    it('should init method when none is defined', function () {
      const assessment = new AssessmentAlgorithm();

      expect(assessment.method).to.equal('SMART_RANDOM');
    });
  });
});
