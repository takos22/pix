import { module, test } from 'qunit';
import { fillByLabel, clickByName, render } from '@1024pix/ember-testing-library';
import { triggerEvent } from '@ember/test-helpers';
import sinon from 'sinon';
import { hbs } from 'ember-cli-htmlbars';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

const EMPTY_FIRSTNAME_ERROR_MESSAGE = 'common.form-errors.firstname.mandatory';
const EMPTY_LASTNAME_ERROR_MESSAGE = 'common.form-errors.lastname.mandatory';
const EMPTY_EMAIL_ERROR_MESSAGE = 'common.form-errors.email.format';
const INCORRECT_PASSWORD_FORMAT_ERROR_MESSAGE = 'common.form-errors.password.format';
const CGU_ERROR_MESSAGE = 'pages.login-or-register.register-form.fields.cgu.error';

module('Integration | Component | Auth::RegisterForm', function (hooks) {
  setupIntlRenderingTest(hooks);

  let firstNameInputLabel;
  let lastNameInputLabel;
  let emailInputLabel;
  let passwordInputLabel;
  let cguAriaLabel;

  hooks.beforeEach(function () {
    firstNameInputLabel = this.intl.t('common.labels.candidate.firstname');
    lastNameInputLabel = this.intl.t('common.labels.candidate.lastname');
    emailInputLabel = this.intl.t('common.forms.login.email');
    passwordInputLabel = this.intl.t('common.forms.login.password');
    cguAriaLabel = this.intl.t('pages.login-or-register.register-form.fields.cgu.aria-label');
  });

  test('[a11y] it should display a message that all inputs are required', async function (assert) {
    // when
    const screen = await render(hbs`<Auth::RegisterForm/>`);

    // then
    assert.dom(screen.getByText('Tous les champs sont obligatoires.')).exists();
    assert.dom(screen.getByRole('textbox', { name: firstNameInputLabel })).hasAttribute('required');
    assert.dom(screen.getByRole('textbox', { name: lastNameInputLabel })).hasAttribute('required');
    assert.dom(screen.getByRole('textbox', { name: emailInputLabel })).hasAttribute('required');
    assert.dom(screen.getByRole('checkbox', { name: cguAriaLabel })).hasAttribute('required');
    assert.dom(screen.getByLabelText(passwordInputLabel)).hasAttribute('required');
  });

  test('it should display legal mentions with related links', async function (assert) {
    // given
    const service = this.owner.lookup('service:url');
    service.currentDomain = { getExtension: sinon.stub().returns('fr') };

    // when
    const screen = await render(hbs`<Auth::RegisterForm/>`);

    // then
    assert
      .dom(screen.getByText(this.intl.t('pages.login-or-register.register-form.fields.cgu.accept'), { exact: false }))
      .exists();
    assert
      .dom(screen.getByText(`${this.intl.t('pages.login-or-register.register-form.fields.cgu.terms-of-use')}`))
      .exists();
    assert
      .dom(screen.getByText(this.intl.t('pages.login-or-register.register-form.fields.cgu.and'), { exact: false }))
      .exists();
    assert
      .dom(
        screen.getByText(`${this.intl.t('pages.login-or-register.register-form.fields.cgu.data-protection-policy')}`),
      )
      .exists();
    assert
      .dom(screen.getByRole('link', { name: "conditions d'utilisation de Pix" }))
      .hasAttribute('href', 'https://pix.fr/conditions-generales-d-utilisation');
    assert
      .dom(screen.getByRole('link', { name: 'politique de confidentialité' }))
      .hasAttribute('href', 'https://pix.fr/politique-protection-donnees-personnelles-app');
  });

  module('errors management', function () {
    module('when first name is not valid', () => {
      test('it should display error message', async function (assert) {
        // given
        const screen = await render(hbs`<Auth::RegisterForm/>`);

        // when
        await fillByLabel(firstNameInputLabel, '');
        const firstNameInput = screen.getByRole('textbox', { name: firstNameInputLabel });
        await triggerEvent(firstNameInput, 'focusout');

        // then
        assert.dom(screen.getByText(this.intl.t(EMPTY_FIRSTNAME_ERROR_MESSAGE))).exists();
      });
    });

    module('when last name is not valid', () => {
      test('it should display error message', async function (assert) {
        // given
        const screen = await render(hbs`<Auth::RegisterForm/>`);

        // when
        await fillByLabel(lastNameInputLabel, '');
        const lastNameInput = screen.getByRole('textbox', { name: lastNameInputLabel });
        await triggerEvent(lastNameInput, 'focusout');

        // then
        assert.dom(screen.getByText(this.intl.t(EMPTY_LASTNAME_ERROR_MESSAGE))).exists();
      });
    });

    module('when email is not valid', () => {
      test('it should display error message', async function (assert) {
        // given
        const screen = await render(hbs`<Auth::RegisterForm/>`);

        // when
        await fillByLabel(emailInputLabel, 'incorrectEmailFormat');
        const emailInput = screen.getByRole('textbox', { name: emailInputLabel });
        await triggerEvent(emailInput, 'focusout');

        // then
        assert.dom(screen.getByText(this.intl.t(EMPTY_EMAIL_ERROR_MESSAGE))).exists();
      });
    });

    module('when password is not valid', () => {
      test('it should display error message', async function (assert) {
        // given
        const screen = await render(hbs`<Auth::RegisterForm/>`);

        // when
        await fillByLabel(passwordInputLabel, '');
        const passwordInput = screen.getByLabelText(passwordInputLabel);
        await triggerEvent(passwordInput, 'focusout');

        // then
        assert.dom(screen.getByText(this.intl.t(INCORRECT_PASSWORD_FORMAT_ERROR_MESSAGE))).exists();
      });
    });

    module('when cgu have not been accepted', () => {
      test('it should display error message', async function (assert) {
        // given
        const screen = await render(hbs`<Auth::RegisterForm/>`);

        // when
        await clickByName(cguAriaLabel);
        await clickByName(cguAriaLabel);
        const cguCheckbox = screen.getByRole('checkbox', { name: cguAriaLabel });
        await triggerEvent(cguCheckbox, 'focusout');

        // then
        assert.dom(screen.getByText(this.intl.t(CGU_ERROR_MESSAGE))).exists();
      });
    });
  });
});
