import { expect, sinon } from '../../../test-helper.js';
import * as useCase from '../../../../lib/application/usecases/checkAdminMemberHasRoleSupport.js';
import * as tokenService from '../../../../lib/domain/services/token-service.js';
import * as adminMemberRepository from '../../../../lib/infrastructure/repositories/admin-member-repository.js';

describe('Unit | Application | Use Case | checkAdminMemberHasRoleSupport', function () {
  const userId = '1234';

  beforeEach(function () {
    sinon.stub(tokenService, 'extractUserId').resolves(userId);
    sinon.stub(adminMemberRepository, 'get');
  });

  it('should resolve true when the user has role support', async function () {
    // given
    adminMemberRepository.get.resolves({ isSupport: true });

    // when
    const result = await useCase.execute(userId);
    // then
    expect(result).to.be.true;
  });

  it('should resolve false when the user does not have role support', async function () {
    // given
    adminMemberRepository.get.resolves({ isSupport: false });

    // when
    const result = await useCase.execute(userId);
    // then
    expect(result).to.be.false;
  });
});
