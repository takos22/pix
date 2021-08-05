import { describe } from 'mocha';
import { expect } from 'chai';
import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';
import visit from '../../helpers/visit';
import { currentURL } from '@ember/test-helpers';
import setupIntl from '../../helpers/setup-intl';
import { clickByLabel } from '../../helpers/click-by-label';
import { fillInByLabel } from '../../helpers/fill-in-by-label';
import { contains } from '../../helpers/contains';
import { Response } from 'ember-cli-mirage';

describe('Acceptance | account-recovery | UpdateScoRecordRoute', function() {

  setupApplicationTest();
  setupMirage();
  setupIntl();

  context('when account recovery is disabled by default', function() {

    it('should redirect to login page', async function() {
      // given / when
      await visit('/recuperer-mon-compte');

      // then
      expect(currentURL()).to.equal('/connexion');
    });
  });

  context('when account recovery is enabled', () => {

    context('and user clicks on email link', function() {

      it('should show reset password form', async function() {
        // given
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        //when
        await visit(`/recuperer-mon-compte/${temporaryKey}`);

        // then
        expect(currentURL()).to.equal(`/recuperer-mon-compte/${temporaryKey}`);
        expect(contains(this.intl.t('pages.account-recovery.update-sco-record.welcome-message', { firstName: 'George' }))).to.exist;
      });

      it('should display an error message when user has already left SCO', async function() {
        // given
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        const errorsApi = new Response(403, {}, {
          errors: [{
            status: '403',
          }],
        });
        server.get(`/account-recovery/${temporaryKey}`, () => errorsApi);

        //when
        await visit(`/recuperer-mon-compte/${temporaryKey}`);

        // then
        expect(contains(this.intl.t('pages.account-recovery.errors.title'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-used'))).to.exist;
        expect(contains(this.intl.t('navigation.back-to-homepage'))).to.exist;
      });

      it('should display an error message when temporary key not found', async function() {
        // given
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        const errorsApi = new Response(404, {}, {
          errors: [{
            status: '404',
          }],
        });
        server.get(`/account-recovery/${temporaryKey}`, () => errorsApi);

        //when
        await visit(`/recuperer-mon-compte/${temporaryKey}`);

        // then
        expect(contains(this.intl.t('pages.account-recovery.errors.title'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-invalid'))).to.exist;
        expect(contains(this.intl.t('navigation.back-to-homepage'))).to.exist;
      });

      it('should display an error message when temporary key has expired', async function() {
        // given
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        const errorsApi = new Response(401, {}, {
          errors: [{
            status: '401',
          }],
        });
        server.get(`/account-recovery/${temporaryKey}`, () => errorsApi);

        //when
        await visit(`/recuperer-mon-compte/${temporaryKey}`);

        // then
        expect(contains(this.intl.t('pages.account-recovery.errors.title'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-expired'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-expired-renew-demand-link'))).to.exist;
      });
    });

    context('and user chooses a new password and accepts cgu and data protection policy', function() {

      it('should redirect to login page after successful password change', async function() {
        // given
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        const newPassword = 'Pix1234*';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        await visit(`/recuperer-mon-compte/${temporaryKey}`);

        await fillInByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.password-label'), newPassword);
        await clickByLabel(this.intl.t('pages.sign-up.fields.cgu.accept'));

        // when
        await clickByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.login-button'));

        // then
        expect(currentURL()).to.equal('/connexion');
      });

      it('should display an error message when user has already left SCO', async function() {
        // given
        const newPassword = 'Pix1234*';
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        const errorsApi = new Response(403, {}, {
          errors: [{
            status: '403',
          }],
        });
        server.patch('/account-recovery', () => errorsApi);

        await visit(`/recuperer-mon-compte/${temporaryKey}`);
        await fillInByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.password-label'), newPassword);
        await clickByLabel(this.intl.t('pages.sign-up.fields.cgu.accept'));

        // when
        await clickByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.login-button'));

        // then
        expect(contains(this.intl.t('pages.account-recovery.errors.title'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-used'))).to.exist;
        expect(contains(this.intl.t('navigation.back-to-homepage'))).to.exist;
      });

      it('should display an error message when temporary key not found', async function() {
        // given
        const newPassword = 'Pix1234*';
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        const errorsApi = new Response(404, {}, {
          errors: [{
            status: '404',
          }],
        });
        server.patch('/account-recovery', () => errorsApi);

        await visit(`/recuperer-mon-compte/${temporaryKey}`);
        await fillInByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.password-label'), newPassword);
        await clickByLabel(this.intl.t('pages.sign-up.fields.cgu.accept'));

        // when
        await clickByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.login-button'));

        // then
        expect(contains(this.intl.t('pages.account-recovery.errors.title'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-invalid'))).to.exist;
        expect(contains(this.intl.t('navigation.back-to-homepage'))).to.exist;
      });

      it('should display an error message when temporary key has expired', async function() {
        // given
        const newPassword = 'Pix1234*';
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        const errorsApi = new Response(401, {}, {
          errors: [{
            status: '401',
          }],
        });
        server.patch('/account-recovery', () => errorsApi);

        await visit(`/recuperer-mon-compte/${temporaryKey}`);
        await fillInByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.password-label'), newPassword);
        await clickByLabel(this.intl.t('pages.sign-up.fields.cgu.accept'));

        // when
        await clickByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.login-button'));

        // then
        expect(contains(this.intl.t('pages.account-recovery.errors.title'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-expired'))).to.exist;
        expect(contains(this.intl.t('pages.account-recovery.errors.key-expired-renew-demand-link'))).to.exist;
      });

      it('should display an error message when internal server error returned', async function() {
        // given
        const newPassword = 'Pix1234*';
        const temporaryKey = '6fe76ea1bb34a1d17e7b2253ee0f7f4b2bc66ddde37d50ee661cbbf3c00cfdc9';
        server.create('feature-toggle', { id: 0, isScoAccountRecoveryEnabled: true });

        const errorsApi = new Response(500, {}, {
          errors: [{
            status: '500',
          }],
        });
        server.patch('/account-recovery', () => errorsApi);

        await visit(`/recuperer-mon-compte/${temporaryKey}`);
        await fillInByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.password-label'), newPassword);
        await clickByLabel(this.intl.t('pages.sign-up.fields.cgu.accept'));

        // when
        await clickByLabel(this.intl.t('pages.account-recovery.update-sco-record.form.login-button'));

        // then
        expect(contains(this.intl.t('pages.account-recovery.errors.title'))).to.exist;
        expect(contains(this.intl.t('api-error-messages.internal-server-error'))).to.exist;
        expect(contains(this.intl.t('navigation.back-to-homepage'))).to.exist;
      });
    });
  });
});
