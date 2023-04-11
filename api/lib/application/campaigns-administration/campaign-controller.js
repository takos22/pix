import { usecases } from '../../domain/usecases/index.js';
import { csvCampaingsIdsParser } from '../../infrastructure/serializers/csv/campaigns-administration/csv-campaigns-ids-parser.js';

const archiveCampaigns = async function (request, h) {
  const { userId } = request.auth.credentials;
  const campaignIds = await csvCampaingsIdsParser.extractCampaignsIds(request.payload.path);

  await usecases.campaignAdministrationArchiveCampaign({
    userId,
    campaignIds,
  });

  return h.response(null).code(204);
};

export { archiveCampaigns };
