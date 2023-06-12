import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';
import setupIntl from '../helpers/setup-intl';
import { visit } from '@1024pix/ember-testing-library';
import { authenticateByEmail } from '../helpers/authentication';
import { currentURL } from '@ember/test-helpers';

module('Acceptance | Preferences ', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test('Display the preferences', async function (assert) {
    // given
    const user = server.create('user', 'withEmail');
    server.create('userSetting', {
      color: 'blue',
    });
    await authenticateByEmail(user);

    // when
    const screen = await visit(`/preferences`);

    // then
    assert.strictEqual(currentURL(), '/preferences');
    assert.dom(screen.getByRole('heading', { name: 'Préférences' })).exists();
    assert.dom(screen.getByRole('button', { name: 'Sauvegarder' })).exists();
  });
});
