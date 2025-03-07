import { action } from '@ember/object';
import { service } from '@ember/service';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { schedule } from '@ember/runloop';
import isNumber from 'lodash/isNumber';

export default class CertificationDetailsController extends Controller {
  juryRate = false;
  juryScore = false;
  requestedId = '';

  @service('mark-store') _markStore;
  @service accessControl;
  @service router;

  @alias('details.percentageCorrectAnswers') rate;
  @alias('details.totalScore') score;
  @alias('model') details;

  get shouldDisplayJuryScore() {
    return isNumber(this.juryScore);
  }

  @action
  onUpdateRate() {
    const competences = this.details.competences;
    const { good, count, jury } = _getCertificationResultsAfterJuryUpdate(competences);

    /* eslint-disable ember/classic-decorator-no-classic-methods */
    if (jury) {
      this.set('juryRate', Math.round((good * 10000) / count) / 100);
    } else {
      this.set('juryRate', false);
    }
    /* eslint-enable ember/classic-decorator-no-classic-methods */

    // TODO: find a better way
    schedule('afterRender', this, () => {
      const score = this.score;
      const competences = this.details.competences;
      const newScore = competences.reduce((value, competence) => {
        const isJuryScoreCorrect = typeof competence.juryScore !== 'undefined' && competence.juryScore !== false;
        value += isJuryScoreCorrect ? competence.juryScore : competence.obtainedScore;
        return value;
      }, 0);
      /* eslint-disable ember/classic-decorator-no-classic-methods */
      if (newScore !== score) {
        this.set('juryScore', newScore);
      } else {
        this.set('juryScore', false);
      }
      /* eslint-enable ember/classic-decorator-no-classic-methods */
    });
  }

  @action
  onStoreMarks() {
    this._markStore.storeState({
      score: this.juryScore === false ? this.score : this.juryScore,
      marks: this.details.competences.reduce((marks, competence) => {
        marks[competence.index] = {
          level: competence.juryLevel === false ? competence.obtainedLevel : competence.juryLevel,
          score: competence.juryScore === false ? competence.obtainedScore : competence.juryScore,
          competenceId: competence.id,
        };
        return marks;
      }, {}),
    });
    this.router.transitionTo('authenticated.certifications.certification.informations', this.details.id);
  }
}

function _getCertificationResultsAfterJuryUpdate(competences) {
  return competences.reduce(
    (data, competence) => {
      if (competence.answers) {
        competence.answers.forEach((answer) => {
          if (answer.jury) {
            if (answer.jury === 'ok') {
              data.good++;
            }
            if (answer.jury !== 'skip') {
              data.count++;
            }
            data.jury = true;
          } else {
            data.count++;
            if (answer.result === 'ok') {
              data.good++;
            }
          }
        });
      }
      return data;
    },
    { count: 0, good: 0, jury: false },
  );
}
