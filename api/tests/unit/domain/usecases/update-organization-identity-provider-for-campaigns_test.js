import { catchErr, domainBuilder, expect, sinon } from '../../../test-helper.js';
import { updateOrganizationIdentityProviderForCampaigns } from '../../../../lib/domain/usecases/update-organization-identity-provider-for-campaigns.js';
import { OrganizationNotFoundError } from '../../../../lib/domain/errors.js';
import { OrganizationForAdmin } from '../../../../lib/domain/models/index.js';

describe('Unit | UseCase | Update organization identityProviderForCampaigns', function () {
  context('when organization exists', function () {
    context('when updating only "identityProviderForCampaigns" property', function () {
      it('updates only "identityProviderForCampaigns" property and returns updated organization domain object', async function () {
        // given
        const domainTransaction = Symbol('domainTransaction');
        const organization = domainBuilder.buildOrganization();
        const organizationForAdminRepository = {
          get: sinon.stub().resolves(new OrganizationForAdmin({ ...organization })),
          update: sinon.stub().resolves(),
        };

        // when
        organization.identityProviderForCampaigns = 'NEW_IDENTITY_PROVIDER';
        await updateOrganizationIdentityProviderForCampaigns({
          organizationId: organization.id,
          identityProviderForCampaigns: organization.identityProviderForCampaigns,
          organizationForAdminRepository,
          domainTransaction,
        });

        // then
        expect(organizationForAdminRepository.get).to.have.been.calledWithExactly(organization.id, domainTransaction);
        expect(organizationForAdminRepository.update).to.have.been.calledWithMatch(
          {
            identityProviderForCampaigns: organization.identityProviderForCampaigns,
          },
          domainTransaction,
        );
      });
    });
  });

  context('when organization does not exists', function () {
    it('throws an OrganizationNotFoundError', async function () {
      // given
      const domainTransaction = Symbol('domainTransaction');
      const organizationForAdminRepository = { get: sinon.stub().resolves(), update: sinon.stub().resolves() };
      const organization = domainBuilder.buildOrganization();

      // when
      const error = await catchErr(updateOrganizationIdentityProviderForCampaigns)({
        organizationId: organization.id,
        identityProviderForCampaigns: organization.identityProviderForCampaigns,
        organizationForAdminRepository,
        domainTransaction,
      });

      // then
      expect(organizationForAdminRepository.get).to.have.been.calledWithExactly(organization.id, domainTransaction);
      expect(organizationForAdminRepository.update).to.not.have.been.called;
      expect(error).to.be.an.instanceOf(OrganizationNotFoundError);
    });
  });
});
