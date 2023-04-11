import { sinon, expect, hFake } from '../../../test-helper.js';
import { csvCampaingsIdsParser } from '../../../../lib/infrastructure/serializers/csv/campaigns-administration/csv-campaigns-ids-parser.js';
import * as campaignController from '../../../../lib/application/campaigns-administration/campaign-controller.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';

describe('Unit | Application | Controller | Campaign Administration', function () {
  describe('#archiveCampaigns', function () {
    beforeEach(function () {
      sinon.stub(usecases, 'campaignAdministrationArchiveCampaign');
      sinon.stub(csvCampaingsIdsParser, 'extractCampaignsIds');
    });

    it('should return a 204', async function () {
      // given
      const userId = 12;
      const path = Symbol('path');
      const ids = [1, 2];
      const request = { auth: { credentials: { userId } }, payload: path };

      csvCampaingsIdsParser.extractCampaignsIds.withArgs(path).returns(ids);
      usecases.campaignAdministrationArchiveCampaign.withArgs({ userId, ids });

      // when
      const response = await campaignController.archiveCampaigns(request, hFake);

      // then
      expect(response.statusCode).to.be.equal(204);
    });
  });
});
