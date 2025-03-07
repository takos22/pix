import { sinon, expect, hFake } from '../../../test-helper.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import { organizationLearnerController } from '../../../../lib/application/organization-learners/organization-learner-controller.js';

describe('Unit | Application | Organization-Learner | organization-learner-controller', function () {
  describe('#getOrganizationLearnerActivity', function () {
    it('should fetch and return the organization learner activity, serialized as JSONAPI', async function () {
      // given
      const organizationLearnerId = 123;
      const organizationLearnerActivity = Symbol('activity returned by use case');
      const serializedActivity = Symbol('serialized activity');

      const organizationLearnerActivitySerializer = {
        serialize: sinon.stub(),
      };
      sinon.stub(usecases, 'getOrganizationLearnerActivity');

      usecases.getOrganizationLearnerActivity.withArgs({ organizationLearnerId }).resolves(organizationLearnerActivity);

      organizationLearnerActivitySerializer.serialize.withArgs(organizationLearnerActivity).returns(serializedActivity);

      const request = {
        params: {
          id: organizationLearnerId,
        },
      };

      // when
      const response = await organizationLearnerController.getActivity(request, hFake, {
        organizationLearnerActivitySerializer,
      });

      // then
      expect(usecases.getOrganizationLearnerActivity).to.have.been.calledWithExactly({ organizationLearnerId });
      expect(organizationLearnerActivitySerializer.serialize).to.have.been.calledWithExactly(
        organizationLearnerActivity,
      );
      expect(response.statusCode).to.equal(200);
      expect(response.source).to.equal(serializedActivity);
    });
  });

  describe('#getOrganizationLearner', function () {
    it('should fetch and return the organization learner, serialized as JSONAPI', async function () {
      // given
      const organizationLearnerId = 123;
      const organizationLearner = Symbol('learner returned by use case');
      const serializedLearner = Symbol('serialized learner');

      const organizationLearnerSerializer = {
        serialize: sinon.stub(),
      };
      sinon.stub(usecases, 'getOrganizationLearner');

      usecases.getOrganizationLearner.withArgs({ organizationLearnerId }).resolves(organizationLearner);

      organizationLearnerSerializer.serialize.withArgs(organizationLearner).returns(serializedLearner);

      const request = {
        params: {
          id: organizationLearnerId,
        },
      };

      // when
      const response = await organizationLearnerController.getLearner(request, hFake, {
        organizationLearnerSerializer,
      });

      // then
      expect(usecases.getOrganizationLearner).to.have.been.calledWithExactly({ organizationLearnerId });
      expect(organizationLearnerSerializer.serialize).to.have.been.calledWithExactly(organizationLearner);
      expect(response.statusCode).to.equal(200);
      expect(response.source).to.equal(serializedLearner);
    });
  });
});
