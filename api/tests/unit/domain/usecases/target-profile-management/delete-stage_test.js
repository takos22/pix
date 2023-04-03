import { expect, domainBuilder, catchErrSync } from '../../../../test-helper.js';
import { usecases } from '../../../../../lib/domain/usecases/index.js';
import { DomainError } from '../../../../../lib/domain/errors.js';

describe('Unit | UseCases | delete-stage', function () {
  let stageCollection;

  beforeEach(function () {
    stageCollection = domainBuilder.buildStageCollectionForTargetProfileManagement({
      id: 100,
      stages: [
        {
          id: 51,
          level: 3,
          threshold: null,
          message: 'ancien message palier',
          title: 'ancien titre palier',
          prescriberDescription: 'ancienne description prescripteur palier',
          prescriberTitle: 'ancien titre prescripteur palier',
        },
      ],
      maxLevel: 5,
    });
  });

  it('should throw DomainError for an unexisting stage', function () {
    // given
    stageCollection = domainBuilder.buildStageCollectionForTargetProfileManagement({
      id: 100,
      stages: [
        {
          id: 51,
          level: 3,
          threshold: null,
          message: 'message palier',
          title: 'titre palier',
          prescriberDescription: 'description prescripteur palier',
          prescriberTitle: 'titre prescripteur palier',
        },
      ],
      maxLevel: 5,
    });

    // when
    const error = catchErrSync(usecases.deleteStage)({
      stageCollection,
      targetProfileId: stageCollection.id,
      stageId: 'unknownId',
    });

    // then
    expect(error).to.be.an.instanceof(DomainError);
    expect(error.message).to.equal("Ce palier n'est pas trouvé.");
  });

  it('should return valie stage', function () {
    // given
    stageCollection = domainBuilder.buildStageCollectionForTargetProfileManagement({
      id: 100,
      stages: [
        {
          id: 51,
          level: 1,
          threshold: null,
          message: 'message palier',
          title: 'titre palier',
          prescriberDescription: 'description prescripteur palier',
          prescriberTitle: 'titre prescripteur palier',
        },
      ],
      maxLevel: 5,
    });

    // when
    const stage = usecases.deleteStage({ stageCollection, stageId: 51, targetProfileId: 100 });

    // then
    expect(stage).to.deep.equal({
      id: 51,
      level: 1,
      targetProfileId: 100,
      threshold: null,
      message: 'message palier',
      title: 'titre palier',
      prescriberDescription: 'description prescripteur palier',
      prescriberTitle: 'titre prescripteur palier',
    });
  });
});
