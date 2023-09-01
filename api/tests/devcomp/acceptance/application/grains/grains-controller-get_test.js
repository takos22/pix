import { expect } from '../../../../test-helper.js';
import { createServer } from '../../../../../server.js';

describe('Acceptance | Controller | grains-controller-get', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/grains/:id', function () {
    context('when grain exists', function () {
      it('should return grain', async function () {
        const options = {
          method: 'GET',
          url: `/api/grains/1`,
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(200);
      });
    });

    context('when grain does not exist', function () {
      it('should return 404', async function () {
        const options = {
          method: 'GET',
          url: `/api/grains/999`,
        };

        const response = await server.inject(options);

        expect(response.statusCode).to.equal(404);
      });
    });
  });
});
