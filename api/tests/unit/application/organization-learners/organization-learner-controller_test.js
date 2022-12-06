const { expect, sinon } = require('../../../test-helper');

const organizationLearnerController = require('../../../../lib/application/organization-learners/organization-learner-controller');
const usecases = require('../../../../lib/domain/usecases');
const Learner = require('../../../../lib/domain/models/LearnerActivity/Learner');

describe('Unit | Application | Organizations | organization-controller', function () {
  describe('#get', function () {
    it('returns the learner', async function () {
      // given
      const learnerId = 1234;
      const organizationId = 4321;
      const learner = new Learner({ id: learnerId, firstName: 'John', lastName: 'Shepard' });
      const request = { params: { id: organizationId, learnerId } };

      sinon.stub(usecases, 'getLearner').withArgs({ id: learnerId, organizationId }).resolves(learner);
      // when
      const learnerJsonApi = await organizationLearnerController.get(request);

      // then
      expect(learnerJsonApi).to.deep.equal({
        data: {
          type: 'organization-learners',
          id: '1234',
          attributes: {
            'first-name': 'John',
            'last-name': 'Shepard',
          },
        },
      });
    });
  });
});
