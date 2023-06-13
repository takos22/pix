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

  test.only('go to preference page', async function (assert) {
    const user = server.create('user', 'withEmail');
    server.create('userSetting', {color: 'red'});
    await authenticateByEmail(user);

    const screen = await visit('/preferences');

    assert.strictEqual(currentURL(), '/preferences');
    assert.dom(screen.getByRole('button', { name: 'Sauvegarder' }));
  });
});
