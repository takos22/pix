import { expect, sinon } from '../../../../test-helper.js';
import { getGrain } from '../../../../../src/devcomp/domain/usecases/get-grain.js';

describe('Devcomp | Unit | Usecases | Get Grain', function () {
  it('should call grain repository and return grain', async function () {
    const expectedGrain = Symbol('grain');
    const grainRepository = {
      getById: sinon.stub().resolves(expectedGrain),
    };

    const result = await getGrain({ id: 1, grainRepository });

    expect(grainRepository.getById).to.be.calledWithExactly({ id: 1 });
    expect(result).to.equal(expectedGrain);
  });
});
