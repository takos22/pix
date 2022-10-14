import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class Card extends Component {
  @service intl;
  get durationFormatted() {
    return this.args.training.duration.hours + 'h';
  }

  get type() {
    return this.intl.t(`pages.training.type.${this.args.training.type}`);
  }

  get imageSrc() {
    if (this.args.training.type === 'autoformation') {
      return '/images/illustrations/trainings/Illu_Parcours_autoformation-1.jpg';
    }
    return '/images/illustrations/trainings/Illu_Webinaire-1.jpg';
  }
}
