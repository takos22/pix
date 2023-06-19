export async function findAnswerByChallengePreviewAndAssessment({
  challengePreviewId,
  assessmentId,
  userId,
  answerRepository,
  assessmentRepository,
  challengeRepository,
} = {}) {
  const integerAssessmentId = parseInt(assessmentId);
  if (!Number.isFinite(integerAssessmentId)) {
    return null;
  }

  const ownedByUser = await assessmentRepository.ownedByUser({ id: assessmentId, userId });
  if (!ownedByUser) {
    return null;
  }

  const { id: challengeId } = challengeRepository.getPreview(challengePreviewId);

  return answerRepository.findByChallengeAndAssessment({ challengeId, assessmentId: integerAssessmentId });
}
