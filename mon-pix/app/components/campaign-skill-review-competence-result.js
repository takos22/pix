import Component from '@glimmer/component';

export default class ActionChip extends Component {
  activeStarsCount(competence) {
    return Math.floor(competence.masteryPercentage / 20);
  }
}
