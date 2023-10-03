import {
  AuthorizationContext,
  checkUserRoleForApplication,
} from '../../../../../src/access/authorization/application/authorization-api.js';
import { catchErrSync, expect } from '../../../../test-helper.js';

describe('Acceptance | Application | Authorization', function () {
  context('AuthorizationContext', function () {
    context('When there is no user role', function () {
      it('throws an Error with an error message "User Role is not defined"', function () {
        // given
        const params = { role: undefined };

        // when
        const error = catchErrSync(() => new AuthorizationContext(params))();

        // then
        expect(error).to.exist;
        expect(error.message).to.equals('User Role is not defined');
      });
    });

    context('When there is no userId', function () {
      it('throws an Error with an error message "User Id is not defined"', async function () {
        // given
        const params = { userId: undefined, role: 'MEMBER' };

        // when
        const error = catchErrSync(() => new AuthorizationContext(params))();

        // then
        expect(error).to.exist;
        expect(error.message).to.equals('User Id is not defined');
      });
    });

    context('When there is no applicationId', function () {
      it('throws an Error with an error message "Application Id is not defined"', async function () {
        // given
        const params = { applicationId: undefined, userId: 123456, role: 'MEMBER' };

        // when
        const error = catchErrSync(() => new AuthorizationContext(params))();

        // then
        expect(error).to.exist;
        expect(error.message).to.equals('Application Id is not defined');
      });
    });

    context('When params is defined', function () {
      context('When user has given role ', function () {
        it('returns true', async function () {
          // given
          const params = {
            role: 'MEMBER',
            userId: 1,
            applicationId: 'PIX_CERTIF',
          };

          // when
          const authorizationContext = new AuthorizationContext(params);

          // then
          expect(authorizationContext).exist;
        });
      });
    });
  });

  context('checkUserRoleForApplication', function () {
    context('When params are valid', function () {
      it('returns true', async function () {
        // Given
        const params = { role: 'MEMBER', userId: 1, applicationId: 'PIX_CERTIF' };

        // When
        const result = await checkUserRoleForApplication(params);

        // Then
        expect(result).to.be.true;
      });
    });
  });
});
