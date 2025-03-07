import _ from 'lodash';
import { expect, sinon, catchErr } from '../../../test-helper.js';
import { findCompetenceEvaluationsByAssessment } from '../../../../lib/domain/usecases/find-competence-evaluations-by-assessment.js';
import { UserNotAuthorizedToAccessEntityError } from '../../../../lib/domain/errors.js';

describe('Unit | UseCase | find-competence-evaluations-by-assessment', function () {
  const userId = 1;
  const assessmentId = 2;
  let assessmentRepository, competenceEvaluationRepository;

  beforeEach(function () {
    assessmentRepository = { ownedByUser: _.noop() };
    competenceEvaluationRepository = { findByAssessmentId: _.noop() };
    assessmentRepository.ownedByUser = sinon.stub();
    competenceEvaluationRepository.findByAssessmentId = sinon.stub();
  });

  it('should throw an UserNotAuthorizedToAccessEntityError error when user is not the owner of the assessment', async function () {
    // given
    assessmentRepository.ownedByUser.withArgs({ id: assessmentId, userId }).resolves(false);

    // when
    const error = await catchErr(findCompetenceEvaluationsByAssessment)({
      userId,
      assessmentId,
      competenceEvaluationRepository,
      assessmentRepository,
    });

    // then
    expect(error).to.be.instanceOf(UserNotAuthorizedToAccessEntityError);
  });

  it('should return the assessment competence-evaluations', async function () {
    // given
    const expectedCompetenceEvaluations = Symbol('competenceEvaluations');
    assessmentRepository.ownedByUser.withArgs({ id: assessmentId, userId }).resolves(true);
    competenceEvaluationRepository.findByAssessmentId.withArgs(assessmentId).resolves(expectedCompetenceEvaluations);

    // when
    const actualCompetenceEvaluations = await findCompetenceEvaluationsByAssessment({
      userId,
      assessmentId,
      competenceEvaluationRepository,
      assessmentRepository,
    });

    // then
    expect(actualCompetenceEvaluations).to.deep.equal(expectedCompetenceEvaluations);
  });
});
