const { expect, sinon } = require('../../../../test-helper');
const CampaignParticipationResultsShared = require('../../../../../lib/domain/events/CampaignParticipationResultsShared');
const ParticipationResultCalculationJobHandler = require('../../../../../lib/infrastructure/jobs/campaign-result/ParticipationResultCalculationJobHandler');

describe('Integration | Infrastructure | Jobs | CampaignResult | ParticipationResultCalculation', function () {
  describe('#handle', function () {
    it('compute results', async function () {
      // given
      const event = new CampaignParticipationResultsShared({ campaignParticipationId: 1 });
      const participationResultsShared = Symbol('participation results shared');
      const participantResultsSharedRepository = { get: sinon.stub() };
      const campaignParticipationRepository = { update: sinon.stub() };
      const handler = new ParticipationResultCalculationJobHandler({
        participantResultsSharedRepository,
        campaignParticipationRepository,
      });
      participantResultsSharedRepository.get.withArgs(1).resolves(participationResultsShared);

      // when
      await handler.handle(event);

      // then
      expect(campaignParticipationRepository.update).to.have.been.calledWith(participationResultsShared);
    });
  });
});
