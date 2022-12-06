const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');

const createServer = require('../../../../server');

describe('Acceptance | Application | GET api/organizations/{organizationId}/organization-learners/{id}', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  it('returns 200', async function () {
    const { id: organizationId } = databaseBuilder.factory.buildOrganization();
    const { id: userId } = databaseBuilder.factory.buildUser.withMembership({ organizationId });
    const { id: learnerId } = databaseBuilder.factory.buildOrganizationLearner({ organizationId });
    await databaseBuilder.commit();

    const options = {
      method: 'GET',
      url: `/api/organizations/${organizationId}/organization-learners/${learnerId}`,
      headers: {
        authorization: generateValidRequestAuthorizationHeader(userId),
      },
    };
    // when
    const response = await server.inject(options);

    // then
    expect(response.statusCode).to.equal(200);
  });
});
