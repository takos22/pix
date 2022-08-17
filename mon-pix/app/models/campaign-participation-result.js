import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CampaignParticipationResult extends Model {
  // attributes
  @attr('number') masteryRate;
  @attr('number') totalSkillsCount;
  @attr('number') testedSkillsCount;
  @attr('number') validatedSkillsCount;
  @attr('number') stageCount;
  @attr('boolean') canRetry;
  @attr('boolean') canImprove;
  @attr('boolean') isDisabled;
  @attr('boolean') isShared;
  @attr('string') participantExternalId;
  @attr('number') estimatedFlashLevel;

  // includes
  @hasMany('campaignParticipationBadges') campaignParticipationBadges;
  @hasMany('competenceResult') competenceResults;
  @belongsTo('reachedStage') reachedStage;

  get cleaBadge() {
    // TODO: Ne fonctionne plus depuis PIX_EMPLOI_CLEA_V2, que doit on afficher ? Les compétences PIX ou CléA ?
    // Si on affiche les compétences CléA sans afficher le badge, n'est ce pas étrange ?
    const badgeCleaKey = 'PIX_EMPLOI_CLEA';
    return this.campaignParticipationBadges.find((badge) => badge.key === badgeCleaKey);
  }
}
