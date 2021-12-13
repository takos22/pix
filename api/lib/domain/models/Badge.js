class Badge {
  constructor({
    id,
    key,
    altMessage,
    imageUrl,
    message,
    title,
    isCertifiable,
    badgeCriteria = [],
    skillSets = [],
    targetProfileId,
    isAlwaysVisible = false,
  } = {}) {
    this.id = id;
    this.altMessage = altMessage;
    this.imageUrl = imageUrl;
    this.message = message;
    this.title = title;
    this.key = key;
    this.isCertifiable = isCertifiable;
    this.badgeCriteria = badgeCriteria;
    this.skillSets = skillSets;
    this.targetProfileId = targetProfileId;
    this.isAlwaysVisible = isAlwaysVisible;
  }
}

Badge.keys = {
  PIX_EMPLOI_CLEA: 'PIX_EMPLOI_CLEA',
  PIX_EMPLOI_CLEA_V2: 'PIX_EMPLOI_CLEA_V2',
  PIX_DROIT_MAITRE_CERTIF: 'PIX_DROIT_MAITRE_CERTIF',
  PIX_DROIT_EXPERT_CERTIF: 'PIX_DROIT_EXPERT_CERTIF',
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_ENTREE_METIER: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_ENTREE_METIER',
  PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE: 'PIX_EDU_FORMATION_INITIALE_1ER_DEGRE_INITIE',
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_INITIE: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_INITIE',
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_MAITRE: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_MAITRE',
  PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT: 'PIX_EDU_FORMATION_CONTINUE_1ER_DEGRE_EXPERT',
};

module.exports = Badge;
