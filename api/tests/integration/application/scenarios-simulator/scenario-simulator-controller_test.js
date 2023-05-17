import { expect, sinon, HttpTestServer, domainBuilder } from '../../../test-helper.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import * as moduleUnderTest from '../../../../lib/application/scenarios-simulator/index.js';
import { securityPreHandlers } from '../../../../lib/application/security-pre-handlers.js';

describe('Integration | Application | Scoring-simulator | scenario-simulator-controller', function () {
  let httpTestServer;
  let simulationResults;
  let reward1;
  let errorRate1;
  let challenge1;
  let estimatedLevel1;

  beforeEach(async function () {
    sinon.stub(usecases, 'simulateFlashDeterministicAssessmentScenario');
    sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin');

    challenge1 = domainBuilder.buildChallenge({ id: 'chall1', successProbabilityThreshold: 0.65 });
    reward1 = 0.2;
    errorRate1 = 0.3;
    estimatedLevel1 = 0.4;
    simulationResults = [
      {
        challenge: challenge1,
        reward: reward1,
        errorRate: errorRate1,
        estimatedLevel: estimatedLevel1,
      },
    ];

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  describe('/api/scenario-simulator', function () {
    describe('#post', function () {
      beforeEach(async function () {
        challenge1 = domainBuilder.buildChallenge({ id: 'chall1', successProbabilityThreshold: 0.65 });
        reward1 = 0.2;
        errorRate1 = 0.3;
        estimatedLevel1 = 0.4;
        simulationResults = [
          {
            challenge: challenge1,
            reward: reward1,
            errorRate: errorRate1,
            estimatedLevel: estimatedLevel1,
            answer: 'ok',
          },
        ];
      });

      context('When the route is called with correct arguments', function () {
        it('should call simulateFlashDeterministicAssessmentScenario usecase with correct arguments', async function () {
          // given
          const simulationAnswers = ['ok'];
          const assessmentId = '13802DK';
          usecases.simulateFlashDeterministicAssessmentScenario
            .withArgs({
              simulationAnswers,
              assessmentId,
              locale: 'en',
            })
            .resolves(simulationResults);
          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin.returns(() => true);

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/scenario-simulator',
            {
              assessmentId,
              simulationAnswers,
            },
            null,
            { 'accept-language': 'en' }
          );

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.deep.equal({
            data: [
              {
                attributes: {
                  'error-rate': errorRate1,
                  'estimated-level': estimatedLevel1,
                  'minimum-capability': 0.6190392084062237,
                  answer: 'ok',
                  reward: reward1,
                },
                id: 'chall1',
                type: 'scenario-simulator-challenges',
              },
            ],
          });
        });
      });
    });
  });

  describe('/api/scenario-simulator/csv-import', function () {
    describe('#post', function () {
      context('when the route is called with a csv file and correct headers', function () {
        it('should call the usecase to validate sessions', async function () {
          // given
          const csvToImport = 'ok;ok\nko;ok';
          const challenge2 = domainBuilder.buildChallenge({ id: 'chall2', successProbabilityThreshold: 0.5 });
          const reward1 = 0.2;
          const errorRate1 = 0.3;
          const estimatedLevel1 = 0.4;
          const reward2 = 0.6;
          const errorRate2 = 0.7;
          const estimatedLevel2 = 0.8;
          const simulationResults1 = [
            {
              challenge: challenge1,
              reward: reward1,
              errorRate: errorRate1,
              estimatedLevel: estimatedLevel1,
              answer: 'ok',
            },
            {
              challenge: challenge2,
              reward: reward2,
              errorRate: errorRate2,
              estimatedLevel: estimatedLevel2,
              answer: 'ok',
            },
          ];

          const simulationResults2 = [
            {
              challenge: challenge1,
              reward: reward1,
              errorRate: errorRate1,
              estimatedLevel: estimatedLevel1,
              answer: 'ko',
            },
            {
              challenge: challenge2,
              reward: reward2,
              errorRate: errorRate2,
              estimatedLevel: estimatedLevel2,
              answer: 'ok',
            },
          ];

          usecases.simulateFlashDeterministicAssessmentScenario
            .withArgs({
              simulationAnswers: ['ok', 'ok'],
              assessmentId: 0,
              locale: 'en',
            })
            .resolves(simulationResults1);

          usecases.simulateFlashDeterministicAssessmentScenario
            .withArgs({
              simulationAnswers: ['ko', 'ok'],
              assessmentId: 1,
              locale: 'en',
            })
            .resolves(simulationResults2);

          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin.returns(() => true);

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/scenario-simulator/csv-import',
            csvToImport,
            null,
            { 'accept-language': 'en', 'Content-Type': 'text/csv;charset=utf-8' }
          );

          // then
          expect(response.statusCode).to.equal(200);
          expect(response.result).to.deep.equal({
            data: [
              {
                type: 'scenario-simulator-batches',
                id: '0',
                attributes: {
                  'simulation-report': [
                    {
                      'minimum-capability': 0.6190392084062237,
                      reward: 0.2,
                      'error-rate': 0.3,
                      'estimated-level': 0.4,
                      answer: 'ok',
                    },
                    {
                      'minimum-capability': 0,
                      reward: 0.6,
                      'error-rate': 0.7,
                      'estimated-level': 0.8,
                      answer: 'ok',
                    },
                  ],
                },
              },
              {
                type: 'scenario-simulator-batches',
                id: '1',
                attributes: {
                  'simulation-report': [
                    {
                      'minimum-capability': 0.6190392084062237,
                      reward: 0.2,
                      'error-rate': 0.3,
                      'estimated-level': 0.4,
                      answer: 'ko',
                    },
                    {
                      'minimum-capability': 0,
                      reward: 0.6,
                      'error-rate': 0.7,
                      'estimated-level': 0.8,
                      answer: 'ok',
                    },
                  ],
                },
              },
            ],
          });
        });
      });

      context('when the route is called with a wrong csv file and correct headers', function () {
        it('should send an error message', async function () {
          // given
          const csvToImport = 'ok;error';

          securityPreHandlers.checkAdminMemberHasRoleSuperAdmin.returns(() => true);

          // when
          const response = await httpTestServer.request(
            'POST',
            '/api/scenario-simulator/csv-import',
            csvToImport,
            null,
            { 'accept-language': 'en', 'Content-Type': 'text/csv;charset=utf-8' }
          );

          // then
          expect(response.statusCode).to.equal(400);
        });
      });
    });
  });
});
