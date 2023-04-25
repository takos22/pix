'use strict';
const headers = {
  sessionId: 'Numéro de session préexistante',
  address: '* Nom du site',
  room: '* Nom de la salle',
  date: '* Date de début (format: JJ/MM/AAAA)',
  time: '* Heure de début (heure locale format: HH:MM)',
  examiner: '* Surveillant(s)',
  description: 'Observations (optionnel)',
  lastName: '* Nom de naissance',
  firstName: '* Prénom',
  birthdate: '* Date de naissance (format: JJ/MM/AAAA)',
  sex: '* Sexe (M ou F)',
  birthINSEECode: 'Code INSEE de la commune de naissance',
  birthPostalCode: 'Code postal de la commune de naissance',
  birthCity: 'Nom de la commune de naissance',
  birthCountry: '* Pays de naissance',
  resultRecipientEmail: 'E-mail du destinataire des résultats (formateur, enseignant…)',
  email: 'E-mail de convocation',
  externalId: 'Identifiant externe',
  extraTimePercentage: 'Temps majoré ? (exemple format: 33%)',
  billingMode: '* Tarification part Pix (Gratuite, Prépayée ou Payante)',
  prepaymentCode: 'Code de prépaiement (si Tarification part Pix Prépayée)',
};

const emptySession = {
  sessionId: '',
  address: '',
  room: '',
  date: '',
  time: '',
  examiner: '',
  description: '',
  lastName: '',
  firstName: '',
  birthdate: '',
  sex: '',
  birthINSEECode: '',
  birthPostalCode: '',
  birthCity: '',
  birthCountry: '',
  resultRecipientEmail: '',
  email: '',
  externalId: '',
  extraTimePercentage: '',
  billingMode: '',
  prepaymentCode: '',
  certificationCandidates: [],
};

const COMPLEMENTARY_CERTIFICATION_SUFFIX = "('oui' ou laisser vide)";

module.exports = {
  headers,
  emptySession,
  COMPLEMENTARY_CERTIFICATION_SUFFIX,
};
