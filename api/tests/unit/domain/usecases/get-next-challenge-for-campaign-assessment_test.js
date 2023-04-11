import { expect, sinon, domainBuilder } from '../../../test-helper.js';
import { getNextChallengeForCampaignAssessment } from '../../../../lib/domain/usecases/get-next-challenge-for-campaign-assessment.js';
import { smartRandom } from '../../../../lib/domain/services/algorithm-methods/smart-random.js';
import { flash } from '../../../../lib/domain/services/algorithm-methods/flash.js';
import { dataFetcher } from '../../../../lib/domain/services/algorithm-methods/data-fetcher.js';

describe('Unit | Domain | Use Cases | get-next-challenge-for-campaign-assessment', function () {
  describe('#get-next-challenge-for-campaign-assessment', function () {
    let challengeRepository;
    let answerRepository;
    let flashAssessmentResultRepository;
    let pickChallengeService;

    let assessment;
    let firstChallenge;
    let secondChallenge;

    beforeEach(function () {
      firstChallenge = domainBuilder.buildChallenge({ id: 'first_challenge' });
      secondChallenge = domainBuilder.buildChallenge({ id: 'second_challenge' });
      assessment = domainBuilder.buildAssessment({ id: 1165 });

      answerRepository = { findByAssessment: sinon.stub() };
      challengeRepository = { get: sinon.stub() };
      challengeRepository.get.withArgs('first_challenge').resolves(firstChallenge);
      challengeRepository.get.withArgs('second_challenge').resolves(secondChallenge);
      flashAssessmentResultRepository = Symbol('flashAssessmentResultRepository');
      pickChallengeService = { pickChallenge: sinon.stub() };
    });

    it('should use smart-random algorithm', async function () {
      // given
      sinon
        .stub(smartRandom, 'getPossibleSkillsForNextChallenge')
        .resolves({ possibleSkillsForNextChallenge: [], hasAssessmentEnded: true });
      sinon.stub(dataFetcher, 'fetchForCampaigns').resolves({});

      // when
      await getNextChallengeForCampaignAssessment({
        challengeRepository,
        answerRepository,
        flashAssessmentResultRepository,
        pickChallengeService,
        assessment,
      });

      // then
      expect(smartRandom.getPossibleSkillsForNextChallenge).to.have.been.called;
    });

    describe('when assessment method is flash', function () {
      it('should use flash algorithm', async function () {
        // given
        assessment.method = 'FLASH';
        sinon.stub(flash, 'getPossibleNextChallenges').returns({ possibleChallenges: [], hasAssessmentEnded: false });
        sinon.stub(dataFetcher, 'fetchForFlashCampaigns').resolves({});
        const locale = 'fr-fr';
        // when
        await getNextChallengeForCampaignAssessment({
          challengeRepository,
          answerRepository,
          flashAssessmentResultRepository,
          pickChallengeService,
          assessment,
          locale,
        });

        // then
        expect(flash.getPossibleNextChallenges).to.have.been.called;
        expect(dataFetcher.fetchForFlashCampaigns).to.have.been.calledWith({
          assessmentId: assessment.id,
          answerRepository,
          challengeRepository,
          flashAssessmentResultRepository,
          locale,
        });
      });
    });
  });
});
