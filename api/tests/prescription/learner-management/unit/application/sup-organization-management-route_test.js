import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';
import { securityPreHandlers } from '../../../../../lib/application/security-pre-handlers.js';
import { supOrganizationManagementController } from '../../../../../src/prescription/learner-management/application/sup-organization-management-controller.js';
import * as moduleUnderTest from '../../../../../src/prescription/learner-management/application/sup-organization-management-route.js';

describe('Unit | Router | sup-organization-management-route', function () {
  describe('POST /api/organizations/{id}/sup-organization-learners/import-csv', function () {
    context('when the id not an integer', function () {
      it('responds 400', async function () {
        // given
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/qsdqsd/sup-organization-learners/import-csv';

        // when
        const response = await httpTestServer.request(method, url);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe('POST /api/organizations/{id}/sup-organization-learners/replace-csv', function () {
    beforeEach(function () {
      sinon.stub(supOrganizationManagementController, 'replaceSupOrganizationLearners');
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInSUPOrganizationManagingStudents');
      supOrganizationManagementController.replaceSupOrganizationLearners.resolves('ok');
    });

    context(
      'when the user is an admin for the organization and the organization is SUP and manages student',
      function () {
        it('responds 200', async function () {
          securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.resolves(true);
          const httpTestServer = new HttpTestServer();
          await httpTestServer.register(moduleUnderTest);

          const method = 'POST';
          const url = '/api/organizations/1/sup-organization-learners/replace-csv';

          const response = await httpTestServer.request(method, url);

          expect(response.statusCode).to.equal(200);
        });
      },
    );

    context('when the user is not admin for the organization', function () {
      it('responds 403', async function () {
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.callsFake((request, h) =>
          h.response().code(403).takeover(),
        );
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/1/sup-organization-learners/replace-csv';

        const response = await httpTestServer.request(method, url);

        expect(response.statusCode).to.equal(403);
      });
    });

    context('when the organization id is not an id', function () {
      it('responds 400', async function () {
        securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents.resolves(true);
        const httpTestServer = new HttpTestServer();
        await httpTestServer.register(moduleUnderTest);

        const method = 'POST';
        const url = '/api/organizations/asgfs/sup-organization-learners/replace-csv';

        const response = await httpTestServer.request(method, url);

        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
