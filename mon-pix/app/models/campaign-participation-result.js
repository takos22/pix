import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CampaignParticipationResult extends Model {
  // attributes
  @attr('number') masteryRate;
  @attr('number') totalSkillsCount;
  @attr('number') testedSkillsCount;
  @attr('number') validatedSkillsCount;
  @attr('boolean') canRetry;
  @attr('boolean') canReset;
  @attr('boolean') canImprove;
  @attr('boolean') isDisabled;
  @attr('boolean') isShared;
  @attr('string') participantExternalId;
  @attr('number') estimatedFlashLevel;
  @attr('number') flashPixScore;

  // includes
  @hasMany('campaignParticipationBadges') campaignParticipationBadges;
  @hasMany('competenceResult') competenceResults;
  @belongsTo('reachedStage', { async: false }) reachedStage;

  get hasReachedStage() {
    return this.reachedStage !== null;
  }
}
