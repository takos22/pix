import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { render as renderScreen } from '@1024pix/ember-testing-library';
import sinon from 'sinon';
import dayjs from 'dayjs';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component |  certification-centers/membership-item', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  hooks.afterEach(function () {
    sinon.restore();
  });

  test('displays a certification center membership table row item', async function (assert) {
    // given
    const user = store.createRecord('user', {
      id: 1,
      firstName: 'Jojo',
      lastName: 'La Gringue',
      email: 'jojo@example.net',
    });
    const certificationCenterMembership = store.createRecord('certification-center-membership', {
      id: 1,
      user,
      role: 'MEMBER',
      createdAt: new Date('2023-09-13T10:47:07Z'),
    });

    this.set('certificationCenterMembership', certificationCenterMembership);
    this.set('disableCertificationCenterMembership', sinon.stub());

    //  when
    const screen = await renderScreen(
      hbs`<CertificationCenters::MembershipItem @certificationCenterMembership={{this.certificationCenterMembership}} @disableCertificationCenterMembership={{this.disableCertificationCenterMembership}} />`,
    );

    // then
    const expectedDate = dayjs(certificationCenterMembership.createdAt).format('DD-MM-YYYY - HH:mm:ss');

    assert
      .dom(screen.getByLabelText('Informations du membre Jojo La Gringue'))
      .containsText(certificationCenterMembership.id);
    assert.dom(screen.getByLabelText('Informations du membre Jojo La Gringue')).containsText(user.firstName);
    assert.dom(screen.getByLabelText('Informations du membre Jojo La Gringue')).containsText(user.lastName);
    assert.dom(screen.getByLabelText('Informations du membre Jojo La Gringue')).containsText(user.email);
    assert.dom(screen.getByLabelText('Informations du membre Jojo La Gringue')).containsText('Membre');
    assert.dom(screen.getByLabelText('Informations du membre Jojo La Gringue')).containsText(expectedDate);
    assert.dom(screen.getByRole('button', { name: 'Modifier le rôle' })).exists();
    assert.dom(screen.getByRole('button', { name: 'Désactiver' })).exists();
  });
});
