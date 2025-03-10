import { UserAnonymized } from '../../../../domain/events/UserAnonymized.js';
import { config } from '../../../../config.js';

export class UserAnonymizedEventLoggingJobScheduler {
  constructor({ userAnonymizedEventLoggingJob }) {
    this.userAnonymizedEventLoggingJob = userAnonymizedEventLoggingJob;
  }

  static event = UserAnonymized;

  get name() {
    return this.constructor.name;
  }

  async handle(event) {
    if (config.auditLogger.isEnabled) {
      await this.userAnonymizedEventLoggingJob.schedule(event);
    }
  }
}
