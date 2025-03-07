import { expect, sinon } from '../../../test-helper.js';
import { changeUserLang } from '../../../../lib/domain/usecases/change-user-lang.js';

describe('Unit | UseCase | change-user-lang', function () {
  let userRepository;
  beforeEach(function () {
    userRepository = {
      update: sinon.stub(),
      getFullById: sinon.stub(),
    };
  });

  it('should modify user attributes to change lang', async function () {
    // given
    const userId = Symbol('userId');
    const updatedUser = Symbol('updateduser');
    const lang = 'jp';
    userRepository.update.resolves();
    userRepository.getFullById.resolves(updatedUser);

    // when
    const actualUpdatedUser = await changeUserLang({ userId, lang, userRepository });

    // then
    expect(userRepository.update).to.have.been.calledWithExactly({ id: userId, lang });
    expect(userRepository.getFullById).to.have.been.calledWithExactly(userId);
    expect(actualUpdatedUser).to.equal(updatedUser);
  });
});
