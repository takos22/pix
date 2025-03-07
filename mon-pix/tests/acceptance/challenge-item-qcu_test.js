// eslint-disable-next-line no-restricted-imports
import { click, find, findAll, currentURL } from '@ember/test-helpers';
import { visit } from '@1024pix/ember-testing-library';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import setupIntl from '../helpers/setup-intl';

module('Acceptance | Displaying a QCU challenge', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);
  let assessment;
  let qcuChallenge;

  hooks.beforeEach(async function () {
    assessment = server.create('assessment', 'ofCompetenceEvaluationType');
    qcuChallenge = server.create('challenge', 'forCompetenceEvaluation', 'QCU');
  });

  module('When challenge is not already answered', function (hooks) {
    let screen;

    hooks.beforeEach(async function () {
      // when
      screen = await visit(`/assessments/${assessment.id}/challenges/0`);
    });

    test('should render challenge information and question', function (assert) {
      // then
      const expectedProposals = [
        '1ere <em>possibilite</em>',
        '2eme <a href="/test" rel="noopener noreferrer" target="_blank">possibilite</a>',
        '<img src="/images/pix-logo-blanc.svg" alt="3eme possibilite">',
        '4eme possibilite',
      ];

      assert.ok(screen.getByText(qcuChallenge.instruction));
      assert.strictEqual(screen.getAllByRole('radio', { name: /possibilite/ }).length, 4);
      assert.strictEqual(
        screen.getByRole('radio', { name: '1ere possibilite' }).nextElementSibling.innerHTML.trim(),
        expectedProposals[0],
      );
      assert.strictEqual(
        screen.getByRole('radio', { name: '2eme possibilite' }).nextElementSibling.innerHTML.trim(),
        expectedProposals[1],
      );
      assert.strictEqual(
        screen.getByRole('radio', { name: '3eme possibilite' }).nextElementSibling.innerHTML.trim(),
        expectedProposals[2],
      );
      assert.strictEqual(
        screen.getByRole('radio', { name: '4eme possibilite' }).nextElementSibling.innerHTML.trim(),
        expectedProposals[3],
      );
      assert.dom('.challenge-reponse__alert').doesNotExist();
    });

    test('should display the alert box if user validates without checking a radio button', async function (assert) {
      // when
      await click('.challenge-actions__action-validate');

      // then
      assert.dom('.challenge-response__alert[role="alert"]').exists();
      assert.strictEqual(
        find('.challenge-response__alert').textContent.trim(),
        'Pour valider, sélectionnez une réponse. Sinon, passez.',
      );
    });

    test('should hide the alert error after the user interact with radio button', async function (assert) {
      // given
      await click('.challenge-actions__action-validate');

      // when
      await click(screen.getByRole('radio', { name: '2eme possibilite' }));

      // then
      assert.dom('.challenge-response__alert').doesNotExist();
    });

    test('should go to checkpoint when user selects an answer and validates', async function (assert) {
      // when
      await click(screen.getByRole('radio', { name: '2eme possibilite' }));
      await click(screen.getByRole('button', { name: this.intl.t('pages.challenge.actions.validate-go-to-next') }));

      // then
      assert.ok(currentURL().includes(`/assessments/${assessment.id}/checkpoint`));
    });
  });

  module('When challenge is already answered', function (hooks) {
    hooks.beforeEach(async function () {
      // given
      server.create('answer', {
        value: '2',
        result: 'ko',
        assessment,
        challenge: qcuChallenge,
      });

      // when
      await visit(`/assessments/${assessment.id}/challenges/0`);
    });

    test('should mark radio button corresponding to the answer and propose to continue', async function (assert) {
      // then
      const radioButtons = findAll('input[type=radio][name="radio"]');
      assert.false(radioButtons[0].checked);
      assert.true(radioButtons[0].disabled);
      assert.true(radioButtons[1].checked);
      assert.true(radioButtons[1].disabled);
      assert.false(radioButtons[2].checked);
      assert.true(radioButtons[2].disabled);
      assert.false(radioButtons[3].checked);
      assert.true(radioButtons[3].disabled);

      assert.dom('.challenge-actions__action-continue').exists();
      assert.dom('.challenge-actions__action-validate').doesNotExist();
      assert.dom('.challenge-actions__action-skip-text').doesNotExist();
    });
  });

  module('When challenge is already answered and user wants to see answers', function (hooks) {
    let correction, tutorial, learningMoreTutorial;
    hooks.beforeEach(async function () {
      // given
      tutorial = server.create('tutorial');
      learningMoreTutorial = server.create('tutorial');
      correction = server.create('correction', {
        solution: '1',
        hint: 'Cliquer sur 1',
        tutorials: [tutorial],
        learningMoreTutorials: [learningMoreTutorial],
      });
      server.create('answer', {
        value: '2',
        result: 'ko',
        assessmentId: assessment.id,
        challengeId: qcuChallenge.id,
        correction,
      });

      // when
      await visit(`/assessments/${assessment.id}/checkpoint`);
    });

    test('should show the result of previous challenge in checkpoint', async function (assert) {
      // then
      assert.strictEqual(find('.result-item__icon').title, 'Réponse incorrecte');
      assert.strictEqual(find('.result-item__instruction').textContent.trim(), qcuChallenge.instruction);
      assert.strictEqual(find('.result-item__correction-button').textContent.trim(), 'Réponses et tutos');
    });

    test('should show details of challenge result in pop-in, with tutorials and feedbacks', async function (assert) {
      // when
      await click('.result-item__correction-button');

      // then
      assert.strictEqual(find('.challenge-statement-instruction__text').textContent.trim(), qcuChallenge.instruction);

      const goodAnswer = findAll('.qcu-solution-panel__proposition')[0];
      const badAnswerFromUserResult = findAll('.qcu-solution-panel__proposition')[1];

      assert.strictEqual(goodAnswer.getAttribute('data-goodness'), 'good');
      assert.strictEqual(goodAnswer.getAttribute('data-checked'), 'no');
      assert.strictEqual(badAnswerFromUserResult.getAttribute('data-goodness'), 'bad');
      assert.strictEqual(badAnswerFromUserResult.getAttribute('data-checked'), 'yes');

      assert.ok(find('.qcu-solution-answer-feedback__expected-answer').textContent.includes(1));
      assert.ok(find('.qcu-solution-answer-feedback__expected-answer').innerHTML.includes('1ere <em>possibilite</em>'));

      assert.ok(find('.tutorial-panel__hint-container').textContent.includes(correction.hint));

      const tutorialToSuccess = findAll('.tutorial-panel__tutorials-container .tutorial-card')[0];
      const tutorialToLearnMore = findAll('.learning-more-panel__list-container .tutorial-card')[0];

      assert.ok(tutorialToSuccess.textContent.includes(tutorial.title));
      assert.ok(tutorialToLearnMore.textContent.includes(learningMoreTutorial.title));

      assert.dom('.feedback-panel').exists();
    });
  });
});
