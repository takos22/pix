import { PoleEmploiPayload } from '../../infrastructure/externals/pole-emploi/PoleEmploiPayload.js';
import * as httpErrorsHelper from '../../infrastructure/http/errors-helper.js';
import { httpAgent } from '../../infrastructure/http/http-agent.js';
import * as monitoringTools from '../../infrastructure/monitoring-tools.js';
import { PoleEmploiSending } from '../models/PoleEmploiSending.js';
import { CampaignParticipationStarted } from './CampaignParticipationStarted.js';
import { checkEventTypes } from './check-event-types.js';

const eventTypes = [CampaignParticipationStarted];

async function handlePoleEmploiParticipationStarted({
  event,
  authenticationMethodRepository,
  campaignRepository,
  campaignParticipationRepository,
  organizationRepository,
  poleEmploiSendingRepository,
  targetProfileRepository,
  userRepository,
  poleEmploiNotifier,
}) {
  checkEventTypes(event, eventTypes);

  const { campaignParticipationId } = event;

  const participation = await campaignParticipationRepository.get(campaignParticipationId);
  const campaign = await campaignRepository.get(participation.campaignId);
  const organization = await organizationRepository.get(campaign.organizationId);

  if (campaign.isAssessment() && organization.isPoleEmploi) {
    const user = await userRepository.get(participation.userId);
    const targetProfile = await targetProfileRepository.get(campaign.targetProfileId);

    const payload = PoleEmploiPayload.buildForParticipationStarted({
      user,
      campaign,
      targetProfile,
      participation,
    });

    const response = await poleEmploiNotifier.notify(user.id, payload, {
      authenticationMethodRepository,
      httpAgent,
      httpErrorsHelper,
      monitoringTools,
    });

    const poleEmploiSending = PoleEmploiSending.buildForParticipationStarted({
      campaignParticipationId,
      payload: payload.toString(),
      isSuccessful: response.isSuccessful,
      responseCode: response.code,
    });

    return poleEmploiSendingRepository.create({ poleEmploiSending });
  }
}

handlePoleEmploiParticipationStarted.eventTypes = eventTypes;
export { handlePoleEmploiParticipationStarted };
