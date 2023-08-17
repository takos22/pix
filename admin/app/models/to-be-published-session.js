import Model, { attr } from '@ember-data/model';
import dayjs from 'dayjs';
import { memberAction } from 'ember-api-actions';

export default class ToBePublishedSession extends Model {
  @attr() certificationCenterName;
  @attr('date-only') sessionDate;
  @attr() sessionTime;
  @attr() finalizedAt;

  get printableDateAndTime() {
    const formattedSessionDate = this.sessionDate.split('-').reverse().join('/');
    return formattedSessionDate + ' à ' + this.sessionTime;
  }

  get printableFinalizationDate() {
    return dayjs(this.finalizedAt).format('DD/MM/YYYY');
  }

  publish = memberAction({
    path: 'publish',
    type: 'patch',
    urlType: 'updateRecord',
    after() {
      this.unloadRecord();
    },
  });
}
