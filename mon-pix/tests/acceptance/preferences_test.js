import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';
import setupIntl from '../helpers/setup-intl';
import { visit } from '@1024pix/ember-testing-library';
import { currentURL } from '@ember/test-helpers';
import { authenticateByEmail } from '../helpers/authentication';

module.only('Acceptance | Preferences ', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test('Display the preferences', async function (assert) {
    const user = server.create('user', 'withEmail');
    await authenticateByEmail(user);

    // when
    const screen = await visit(`/preferences`);

    // then
    assert.strictEqual(currentURL(), '/preferences');
  });
});
