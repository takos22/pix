import { expect, HttpTestServer, sinon } from '../../../test-helper.js';

import * as ChallengeRepository from '../../../../lib/infrastructure/repositories/challenge-repository.js';
import * as ChallengeSerializer from '../../../../lib/infrastructure/serializers/jsonapi/challenge-serializer.js';

import * as moduleUnderTest from '../../../../lib/application/challenges/index.js';

describe('Unit | Controller | challenge-controller', function () {
  let httpTestServer;

  let ChallengeRepoStub;
  let ChallengeSerializerStub;

  beforeEach(async function () {
    ChallengeRepoStub = sinon.stub(ChallengeRepository, 'get');
    ChallengeSerializerStub = sinon.stub(ChallengeSerializer, 'serialize');

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  describe('#get', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const challenge = Symbol('someChallenge');

    it('should fetch and return the given challenge, serialized as JSONAPI', async function () {
      // given
      ChallengeRepoStub.resolves(challenge);
      ChallengeSerializerStub.resolves({ serialized: challenge });

      // when
      const response = await httpTestServer.request('GET', '/api/challenges/challenge_id');

      // then
      expect(response.result).to.deep.equal({ serialized: challenge });
    });
  });
});
