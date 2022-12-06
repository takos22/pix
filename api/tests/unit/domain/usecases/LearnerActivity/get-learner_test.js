const { expect, sinon } = require('../../../../test-helper');
const getLearner = require('../../../../../lib/domain/usecases/LearnerActivity/get-learner');
const Learner = require('../../../../../lib/domain/models/LearnerActivity/Learner');

describe('Unit | UseCase | get-learner', function () {
  it('return the learner', async function () {
    const id = 1;
    const organizationId = 1;
    const expectedLearner = new Learner({ id, lastName: 'Aran', firstName: 'Samus' });
    const learnerRepository = { get: sinon.stub() };
    learnerRepository.get.withArgs(id, organizationId).resolves(expectedLearner);

    const learner = await getLearner({ id, organizationId, learnerRepository });

    expect(learner).to.deep.equal(expectedLearner);
  });
});
