import { expect, sinon } from '../../../test-helper.js';
import * as useCase from '../../../../lib/application/usecases/checkAdminMemberHasRoleCertif.js';
import * as tokenService from '../../../../lib/domain/services/token-service.js';
import * as adminMemberRepository from '../../../../lib/infrastructure/repositories/admin-member-repository.js';

describe('Unit | Application | Use Case | checkAdminMemberHasRoleCertifUseCase', function () {
  const userId = '1234';

  beforeEach(function () {
    sinon.stub(tokenService, 'extractUserId').resolves(userId);
    sinon.stub(adminMemberRepository, 'get');
  });

  it('should resolve true when the admin member has role certif', async function () {
    // given
    adminMemberRepository.get.resolves({ isCertif: true });

    // when
    const result = await useCase.execute(userId);

    // then
    expect(result).to.be.true;
  });

  it('should resolve false when the admin member does not have role certif', async function () {
    // given
    adminMemberRepository.get.resolves({ isCertif: false });

    // when
    const result = await useCase.execute(userId);

    // then
    expect(result).to.be.false;
  });
});
