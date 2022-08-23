const { expect, sinon, domainBuilder } = require('../../../test-helper');
const { deleteCampaignParticipationForAdmin } = require('../../../../lib/domain/usecases');
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');

describe('Unit | UseCase | delete-campaign-participation-for-admin', function () {
  //given
  let clock;
  const now = new Date('2021-09-25');

  beforeEach(function () {
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(function () {
    clock.restore();
  });

  it('should call repository method to delete a campaign participation', async function () {
    const campaignRepository = {
      getCampaignIdByCampaignParticipationId: sinon.stub(),
    };
    const campaignParticipationRepository = {
      getAllCampaignParticipationsInCampaignFromCampaignParticipationId: sinon.stub(),
      delete: sinon.stub(),
    };
    const campaignParticipationId = 1234;
    const domainTransaction = Symbol('domainTransaction');
    const campaignId = domainBuilder.buildCampaign().id;
    const ownerId = domainBuilder.buildUser().id;
    const organizationLearnerId = domainBuilder.buildOrganizationLearner().id;

    const campaignParticipation1 = new CampaignParticipation({
      id: campaignParticipationId,
      organizationLearnerId,
      deletedAt: null,
      deletedBy: null,
      campaignId,
    });

    const campaignParticipation2 = new CampaignParticipation({
      id: 1235,
      deletedAt: null,
      deletedBy: null,
    });

    const campaignParticipations = [campaignParticipation1, campaignParticipation2];

    campaignRepository.getCampaignIdByCampaignParticipationId.withArgs(campaignParticipationId).resolves(campaignId);
    campaignParticipationRepository.getAllCampaignParticipationsInCampaignFromCampaignParticipationId
      .withArgs({
        campaignId,
        campaignParticipationId,
        domainTransaction,
      })
      .resolves(campaignParticipations);

    //when
    const deletedCampaignParticipations = await deleteCampaignParticipationForAdmin({
      userId: ownerId,
      campaignParticipationId,
      domainTransaction,
      campaignRepository,
      campaignParticipationRepository,
    });

    //then
    expect(deletedCampaignParticipations).to.equal(campaignParticipations);
    expect(campaignParticipationRepository.delete).to.have.been.calledTwice;
    campaignParticipations.forEach((campaignParticipation) => {
      const deletedCampaignParticipation = new CampaignParticipation({
        ...campaignParticipation,
        deletedAt: now,
        deletedBy: ownerId,
      });
      expect(campaignParticipationRepository.delete).to.have.been.calledWithExactly({
        id: deletedCampaignParticipation.id,
        deletedAt: deletedCampaignParticipation.deletedAt,
        deletedBy: deletedCampaignParticipation.deletedBy,
        domainTransaction,
      });
    });
  });
});
