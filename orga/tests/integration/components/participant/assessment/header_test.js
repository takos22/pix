import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | Participant::Assessment::Header', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.setupRouter();
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.organization = {};
  });

  test('it should display user information', async function (assert) {
    // given
    this.participation = {
      firstName: 'Jean',
      lastName: 'La fripouille',
    };
    this.campaign = {};

    // when
    const screen = await render(
      hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
    );

    // then
    assert.dom(screen.getByText('Jean La fripouille')).exists();
  });

  test('it displays campaign participation creation date', async function (assert) {
    this.participation = { createdAt: '2020-01-01' };
    this.campaign = {};

    const screen = await render(
      hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
    );

    assert.dom(screen.getByText('01 janv. 2020')).exists();
  });

  test('it displays campaign participation progression', async function (assert) {
    this.participation = { progression: 0.75 };
    this.campaign = {};

    const screen = await render(
      hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
    );

    assert.dom(screen.getByText(this.intl.t('pages.assessment-individual-results.progression'))).exists();
    assert.dom(screen.getByText('75 %')).exists();
  });

  module('is shared', function () {
    module('when participant has shared results', function () {
      test('it displays the sharing date', async function (assert) {
        this.participation = {
          isShared: true,
          sharedAt: '2020-01-02',
          masteryRate: 0.85,
        };
        this.campaign = {};

        const screen = await render(
          hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
        );

        assert.dom(screen.getByText(this.intl.t('pages.campaign-individual-results.shared-date'))).exists();
        assert.dom(screen.getByText('02 janv. 2020')).exists();
      });
    });

    module('when participant has not shared results', function () {
      test('it does not displays the sharing date', async function (assert) {
        this.participation = { isShared: false };
        this.campaign = {};

        const screen = await render(
          hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
        );

        assert.dom(screen.queryByText(this.intl.t('pages.campaign-individual-results.shared-date'))).doesNotExist();
      });
    });
  });

  module('identifiant', function () {
    module('when the external id is present', function () {
      test('it displays the external id', async function (assert) {
        this.participation = {
          participantExternalId: 'i12345',
          isShared: false,
        };
        this.campaign = { idPixLabel: 'identifiant de l’élève' };

        const screen = await render(
          hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
        );

        assert.dom(screen.getByText('identifiant de l’élève')).exists();
        assert.dom(screen.getByText('i12345')).exists();
      });
    });
    module('when the external id is not present', function () {
      test('it does not display the external id', async function (assert) {
        this.participation = {
          participantExternalId: null,
          isShared: false,
        };
        this.campaign = {};

        const screen = await render(
          hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
        );

        assert.dom(screen.queryByText('identifiant de l’élève')).doesNotExist();
      });
    });
  });

  module('results information', function () {
    module('when the participation is shared', function () {
      test('it should not display campaign progression', async function (assert) {
        this.participation = { progression: 1, isShared: true, masteryRate: 0.85 };
        this.campaign = {};

        const screen = await render(
          hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
        );

        assert.dom(screen.queryByText(this.intl.t('pages.assessment-individual-results.progression'))).doesNotExist();
        assert
          .dom(screen.queryByText(this.intl.t('common.result.percentage', { value: this.participation.progression })))
          .doesNotExist();
      });

      module('when the campaign has stages', function () {
        test('it displays stages acquired', async function (assert) {
          this.campaign = {
            hasStages: true,
            stages: [
              { id: 'stage1', threshold: 0 },
              { id: 'stage2', threshold: 70 },
              { id: 'stage3', threshold: 80 },
            ],
          };
          this.participation = {
            isShared: true,
            reachedStage: 2,
            totalStage: 3,
          };

          const screen = await render(
            hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
          );

          assert.dom(screen.queryByLabelText(this.intl.t('pages.assessment-individual-results.result'))).exists();
          assert.dom(screen.getByText(this.intl.t('common.result.stages', { count: 1, total: 2 }))).exists();
        });
      });

      module('when the campaign has no stages', function () {
        test('it displays campaign participation mastery percentage', async function (assert) {
          this.participation = { masteryRate: 0.65, isShared: true };
          this.campaign = {};

          const screen = await render(
            hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
          );

          assert.dom(screen.getAllByText('65%')[0]).exists();
        });
      });

      module('when the campaign has badges', function () {
        test('it displays badges acquired', async function (assert) {
          this.campaign = { hasBadges: true };
          this.participation = { isShared: true, masteryRate: 0.85, badges: [{ id: 1, title: 'Les bases' }] };

          const screen = await render(
            hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
          );

          assert
            .dom(screen.queryByLabelText(this.intl.t('pages.assessment-individual-results.badges')))
            .containsText('Les bases');
        });
      });

      module('when the campaign has no badges', function () {
        test('it does not display badges acquired', async function (assert) {
          this.campaign = { hasBadges: false };
          this.participation = { isShared: true, masteryRate: 0.85, badges: [{ id: 1, title: 'Les bases' }] };

          const screen = await render(
            hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
          );

          assert.dom(screen.queryByLabelText(this.intl.t('pages.assessment-individual-results.badges'))).doesNotExist();
        });
      });

      module('when the campaign has badges but the participant has not acquired one', function () {
        test('it does not display badges', async function (assert) {
          this.campaign = { hasBadges: true };
          this.participation = { isShared: true, masteryRate: 0.85, badges: [] };

          const screen = await render(
            hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
          );
          assert.dom(screen.queryByLabelText(this.intl.t('pages.assessment-individual-results.badges'))).doesNotExist();
        });
      });
    });

    module('when the participation is not shared', function () {
      test('it does not display results', async function (assert) {
        this.participation = { isShared: false };
        this.campaign = {};

        const screen = await render(
          hbs`<Participant::Assessment::Header @participation={{this.participation}} @campaign={{this.campaign}} />`,
        );

        assert.dom(screen.queryByLabelText(this.intl.t('pages.assessment-individual-results.result'))).doesNotExist();
      });
    });
  });
});
