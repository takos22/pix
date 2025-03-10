import { module, test } from 'qunit';
import {
  authenticate,
  authenticateByGAR,
  authenticateByUsername,
  generateGarAuthenticationURLHash,
} from '../../helpers/authentication';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { triggerEvent, click, fillIn } from '@ember/test-helpers';
import { visit } from '@1024pix/ember-testing-library';
import setupIntl from '../../helpers/setup-intl';
import PixWindow from 'mon-pix/utils/pix-window';
import sinon from 'sinon';

module('Acceptance | user-account | connection-methods', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  module('connection method details', function () {
    test("should display user's email and username", async function (assert) {
      // given
      const userDetails = {
        email: 'john.doe@example.net',
        username: 'john.doe0101',
      };
      const user = server.create('user', 'withEmail', userDetails);
      server.create('authentication-method', 'withPixIdentityProvider', { user });
      await authenticate(user);

      // when
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.ok(screen.getByText(user.email));
      assert.ok(screen.getByText(user.username));
    });

    test("should display user's GAR authentication method", async function (assert) {
      // given
      const garUser = server.create('user', 'external');
      server.create('authentication-method', 'withGarIdentityProvider', { user: garUser });
      sinon.stub(PixWindow, 'getLocationHash').returns(generateGarAuthenticationURLHash(garUser));
      await authenticateByGAR(garUser);

      // when
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.ok(screen.getByText(this.intl.t('pages.user-account.connexion-methods.authentication-methods.label')));
      assert.ok(screen.getByText(this.intl.t('pages.user-account.connexion-methods.authentication-methods.gar')));
    });

    test("should display user's OIDC authentication methods", async function (assert) {
      // given
      const userDetails = {
        email: 'john.doe@example.net',
      };
      const user = server.create('user', 'withEmail', userDetails);
      server.create('authentication-method', 'withGenericOidcIdentityProvider', { user });

      // when
      await authenticate(user);
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.ok(screen.getByText(this.intl.t('pages.user-account.connexion-methods.authentication-methods.label')));
      assert.ok(screen.getByText('via Partenaire OIDC'));
    });
  });

  module('when user does not have an email', function () {
    test('should not display email', async function (assert) {
      // given
      const userDetails = {
        username: 'john.doe0101',
      };
      const user = server.create('user', 'withUsername', userDetails);
      await authenticateByUsername(user);

      // when
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.notOk(screen.queryByText(this.intl.t('pages.user-account.connexion-methods.email')));
    });
  });

  module('when user does not have a username', function () {
    test('should not display username', async function (assert) {
      // given
      const userDetails = {
        email: 'john.doe@example.net',
      };
      const user = server.create('user', 'withEmail', userDetails);
      await authenticate(user);

      // when
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.notOk(screen.queryByText(this.intl.t('pages.user-account.connexion-methods.username')));
    });
  });

  module('email editing', function () {
    test('should reset email editing process when changing page', async function (assert) {
      // given
      const user = server.create('user', 'withEmail');
      server.create('authentication-method', 'withPixIdentityProvider', { user });
      await authenticate(user);
      const screen = await visit('/mon-compte/methodes-de-connexion');
      await click(
        screen.getByRole('button', { name: this.intl.t('pages.user-account.connexion-methods.edit-button') }),
      );

      // when
      await visit('/mon-compte/informations-personnelles');
      await visit('/mon-compte/methodes-de-connexion');

      // then
      assert.ok(screen.getByText(this.intl.t('pages.user-account.connexion-methods.email')));
      assert.dom(screen.getByRole('button', { name: 'Modifier' })).exists();
    });

    test('should be able to edit the email, enter the code received, and be successfully redirected to account page', async function (assert) {
      // given
      const user = server.create('user', 'withEmail');
      server.create('authentication-method', 'withPixIdentityProvider', { user });
      await authenticate(user);
      const newEmail = 'new-email@example.net';
      const screen = await visit('/mon-compte/methodes-de-connexion');

      // when
      await click(screen.getByRole('button', { name: 'Modifier' }));
      await fillIn(screen.getByRole('textbox', { name: 'Nouvelle adresse e-mail' }), newEmail);
      await fillIn(screen.getByLabelText('Mot de passe'), user.password);
      await click(screen.getByRole('button', { name: 'Recevoir un code de vérification' }));
      await triggerEvent(screen.getByRole('spinbutton', { name: 'Champ 1' }), 'paste', {
        clipboardData: { getData: () => '123456' },
      });

      // then
      assert.ok(screen.getByText(this.intl.t('pages.user-account.connexion-methods.email')));
      assert.ok(screen.getByText(this.intl.t('pages.user-account.email-verification.update-successful')));
      assert.ok(screen.getByText(newEmail));
    });
  });
});
