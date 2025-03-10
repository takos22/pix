import { expect, sinon, hFake } from '../../../test-helper.js';
import { finalizedSessionController } from '../../../../lib/application/sessions/finalized-session-controller.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';

describe('Unit | Controller | finalized-session', function () {
  let request;
  const userId = 274939274;

  describe('#findFinalizedSessionsToPublish', function () {
    beforeEach(function () {
      sinon.stub(usecases, 'findFinalizedSessionsToPublish').resolves();

      request = {
        payload: {},
        auth: {
          credentials: {
            userId,
          },
        },
      };
    });

    context('When there are finalized publishable sessions', function () {
      it('should find finalized publishable sessions', async function () {
        // given
        const toBePublishedSessionSerializer = {
          serialize: sinon.stub(),
        };
        const foundFinalizedSessions = Symbol('foundSession');
        const serializedFinalizedSessions = Symbol('serializedSession');
        usecases.findFinalizedSessionsToPublish.resolves(foundFinalizedSessions);
        toBePublishedSessionSerializer.serialize.withArgs(foundFinalizedSessions).resolves(serializedFinalizedSessions);

        // when
        const response = await finalizedSessionController.findFinalizedSessionsToPublish(request, hFake, {
          toBePublishedSessionSerializer,
        });

        // then
        expect(response).to.deep.equal(serializedFinalizedSessions);
      });

      context('When filtering on publishable version number', function () {
        it('should find finalized publishable sessions', async function () {
          // given
          const version = 3;
          request = {
            payload: {},
            query: {
              'filter[version]': version,
            },
            auth: {
              credentials: {
                userId,
              },
            },
          };

          const foundFinalizedSessions = Symbol('foundSession');
          usecases.findFinalizedSessionsToPublish.withArgs({ version }).resolves(foundFinalizedSessions);

          const toBePublishedSessionSerializer = {
            serialize: sinon.stub(),
          };
          const serializedFinalizedSessions = Symbol('serializedSession');
          toBePublishedSessionSerializer.serialize
            .withArgs(foundFinalizedSessions)
            .resolves(serializedFinalizedSessions);

          // when
          const response = await finalizedSessionController.findFinalizedSessionsToPublish(request, hFake, {
            toBePublishedSessionSerializer,
          });

          // then
          expect(response).to.deep.equal(serializedFinalizedSessions);
        });
      });
    });
  });

  describe('#findFinalizedSessionsWithRequiredAction', function () {
    context('When there are finalized sessions with required action', function () {
      it('should find finalized sessions with required action', async function () {
        // given
        request = {
          payload: {},
          auth: {
            credentials: {
              userId,
            },
          },
        };

        const foundFinalizedSessions = Symbol('foundSession');
        sinon.stub(usecases, 'findFinalizedSessionsWithRequiredAction');
        usecases.findFinalizedSessionsWithRequiredAction.resolves(foundFinalizedSessions);

        const withRequiredActionSessionSerializer = {
          serialize: sinon.stub(),
        };
        const serializedFinalizedSessions = Symbol('serializedSession');
        withRequiredActionSessionSerializer.serialize
          .withArgs(foundFinalizedSessions)
          .resolves(serializedFinalizedSessions);

        // when
        const response = await finalizedSessionController.findFinalizedSessionsWithRequiredAction(request, hFake, {
          withRequiredActionSessionSerializer,
        });

        // then
        expect(response).to.deep.equal(serializedFinalizedSessions);
      });
      context('When filtering on version number', function () {
        it('should find finalized sessions with required action', async function () {
          // given
          const version = 3;
          request = {
            payload: {},
            query: {
              'filter[version]': version,
            },
            auth: {
              credentials: {
                userId,
              },
            },
          };

          const foundFinalizedSessions = Symbol('foundSession');
          sinon.stub(usecases, 'findFinalizedSessionsWithRequiredAction');
          usecases.findFinalizedSessionsWithRequiredAction.withArgs({ version }).resolves(foundFinalizedSessions);

          const withRequiredActionSessionSerializer = {
            serialize: sinon.stub(),
          };
          const serializedFinalizedSessions = Symbol('serializedSession');
          withRequiredActionSessionSerializer.serialize
            .withArgs(foundFinalizedSessions)
            .resolves(serializedFinalizedSessions);

          // when
          const response = await finalizedSessionController.findFinalizedSessionsWithRequiredAction(request, hFake, {
            withRequiredActionSessionSerializer,
          });

          // then
          expect(response).to.deep.equal(serializedFinalizedSessions);
        });
      });
    });
  });
});
