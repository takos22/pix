import Component from '@glimmer/component';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class CompetencesAnalysis extends Component {
  @service intl;

  get campaignCollectiveResultLabel() {
    const competenceCollectiveResultsCount = this.args.campaignCollectiveResult.get(
      'campaignCompetenceCollectiveResults',
    ).length;
    return htmlSafe(
      this.intl.t('pages.campaign-review.table.competences.column.competences', {
        count: competenceCollectiveResultsCount ? competenceCollectiveResultsCount : '-',
      }),
    );
  }
}
