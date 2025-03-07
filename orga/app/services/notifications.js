import NotificationsService from '@1024pix/ember-cli-notifications/services/notifications';
import config from 'pix-orga/config/environment';

const defaultAutoClear = config['ember-cli-notifications'].autoClear;

export default class Notifications extends NotificationsService {
  sendError(message, { onClick } = {}) {
    return this.error(message, {
      autoClear: false,
      htmlContent: true,
      cssClasses: 'notification notification--error',
      onClick,
    });
  }

  sendWarning(message) {
    return this.warning(message, {
      autoClear: false,
      htmlContent: true,
      cssClasses: 'notification notification--warning',
    });
  }

  sendSuccess(message) {
    return this.success(message, {
      autoClear: defaultAutoClear,
      htmlContent: true,
      cssClasses: 'notification notification--success',
    });
  }
}
