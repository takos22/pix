import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Item extends Component {
  @service store;
  @service router;
  @tracked answerHasBeenValidated = false;
  @tracked answer = null;
  @tracked answerValue = null;
  @tracked showWarningModal = false;

  @action
  setAnswerValue(value) {
    this.answerValue = value;
  }

  _createActivityAnswer(challenge) {
    return this.store.createRecord('activity-answer', { challenge });
  }

  @action
  async validateAnswer() {
    if (this.answerValue) {
      this.answer = this._createActivityAnswer(this.args.challenge);
      this.answer.value = this.answerValue;
      try {
        await this.answer.save({ adapterOptions: { assessmentId: this.args.assessment.id } });
        this.answerHasBeenValidated = true;
      } catch (error) {
        this.answer.rollbackAttributes();
      }
    } else {
      this.showWarningModal = true;
    }
  }

  @action
  skipChallenge() {
    this.setAnswerValue('#ABAND#');
    return this.validateAnswer();
  }

  @action
  resume() {
    this.answerHasBeenValidated = false;
    this.answerValue = null;
    //TODO: Réinitiliser this.answer
    //On voulait réinitialiser this.answer à null pour repartir sur de bonnes bases,
    //mais on ne le fait pas car sinon on affiche une valeur non désirée dans la modale;
    this.router.transitionTo('assessment.resume');
  }

  @action
  onCloseWarningModal() {
    this.showWarningModal = false;
  }
}
