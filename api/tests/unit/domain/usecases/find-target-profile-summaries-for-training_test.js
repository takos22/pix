import { sinon, expect } from '../../../test-helper.js';
import { findTargetProfileSummariesForTraining } from '../../../../lib/domain/usecases/find-target-profile-summaries-for-training.js';

describe('Unit | UseCase | find-target-profile-summaries-for-training', function () {
  it('should call the repository with the right arguments and return summaries', async function () {
    // given
    const trainingId = Symbol('trainingId');
    const targetProfileSummaryForAdminRepository = {
      findByTraining: sinon.stub(),
    };
    const targetProfileSummaries = Symbol('targetProfileSummaries');
    targetProfileSummaryForAdminRepository.findByTraining.resolves(targetProfileSummaries);

    // when
    const result = await findTargetProfileSummariesForTraining({
      trainingId,
      targetProfileSummaryForAdminRepository,
    });

    // then
    expect(targetProfileSummaryForAdminRepository.findByTraining).to.have.been.calledWithExactly({ trainingId });
    expect(result).to.equal(targetProfileSummaries);
  });
});
