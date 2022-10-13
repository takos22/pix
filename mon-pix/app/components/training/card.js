import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class Card extends Component {
  @service intl;
  get durationFormatted() {
    const formattedHours = [];
    const { hours, minutes, seconds } = this.args.training.duration;
    if (hours) {
      formattedHours.push(hours + 'h');
    }
    if (minutes) {
      formattedHours.push(minutes + 'm');
    }
    if (seconds) {
      formattedHours.push(seconds + 's');
    }
    return formattedHours.join(' ');
  }

  get type() {
    return this.intl.t(`pages.training.type.${this.args.training.type}`);
  }

  get tagColor() {
    if (this.args.training.isAutoformation) {
      return 'blue-light';
    }
    return 'purple-light';
  }

  get imageSrc() {
    const randomNumber = this._getRandomImageNumber();
    if (this.args.training.isAutoformation) {
      return `/images/illustrations/trainings/Illu_Parcours_autoformation-${randomNumber}.jpg`;
    }
    return `/images/illustrations/trainings/Illu_Webinaire-${randomNumber}.jpg`;
  }

  _getRandomImageNumber() {
    return Math.floor(Math.random() * (3 - 1) + 1);
  }
}
