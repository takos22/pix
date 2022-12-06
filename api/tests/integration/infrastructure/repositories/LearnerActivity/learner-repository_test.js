const { expect, databaseBuilder, catchErr } = require('../../../../test-helper');
const { NotFoundError } = require('../../../../../lib/domain/errors');
const learnerRepository = require('../../../../../lib/infrastructure/repositories/LearnerActivity/learner-repository');

describe('Integration | Infrastructure | Repository | learner-repository', function () {
  describe('#get', function () {
    it('returns the information about the learner', async function () {
      const { id, organizationId } = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'FirstName',
        lastName: 'LastName',
      });
      await databaseBuilder.commit();

      const learner = await learnerRepository.get(id, organizationId);

      expect(learner.firstName).to.equal('FirstName');
      expect(learner.lastName).to.equal('LastName');
    });

    it('returns the organization learner with the correct id', async function () {
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationLearner({ organizationId });
      const { id } = databaseBuilder.factory.buildOrganizationLearner({ organizationId });
      await databaseBuilder.commit();

      const learner = await learnerRepository.get(id, organizationId);

      expect(learner.id).to.equal(id);
    });

    it('throws an exception if the learner has a different organization id', async function () {
      const { id } = databaseBuilder.factory.buildOrganizationLearner();
      await databaseBuilder.commit();

      const error = await catchErr(learnerRepository.get)(id, 1);

      expect(error).to.be.an.instanceof(NotFoundError);
    });
  });
});
