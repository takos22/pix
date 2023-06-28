import { expect, sinon } from '../../../../test-helper.js';
import { CampaignParticipationResultsShared } from '../../../../../lib/shared/domain/events/CampaignParticipationResultsShared.js';
import { SendSharedParticipationResultsToPoleEmploiHandler } from '../../../../../lib/shared/infrastructure/jobs/campaign-result/SendSharedParticipationResultsToPoleEmploiHandler.js';
import { usecases } from '../../../../../lib/shared/domain/usecases/index.js';

describe('Unit | Infrastructure | Jobs | SendSharedParticipationResultsToPoleEmploiHandler', function () {
  let event;

  context('#handle', function () {
    let campaignParticipationId;

    beforeEach(function () {
      campaignParticipationId = 55667788;
      event = new CampaignParticipationResultsShared({ campaignParticipationId });
    });

    it('should call the usecases', async function () {
      // given
      sinon.stub(usecases, 'sendSharedParticipationResultsToPoleEmploi');

      const sendSharedParticipationResultsToPoleEmploiHandler = new SendSharedParticipationResultsToPoleEmploiHandler();

      // when
      await sendSharedParticipationResultsToPoleEmploiHandler.handle(event);

      // then
      expect(usecases.sendSharedParticipationResultsToPoleEmploi).to.have.been.calledWith({ campaignParticipationId });
    });
  });
});
