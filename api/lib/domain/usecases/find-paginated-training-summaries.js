const findPaginatedTrainingSummaries = async function ({ page, trainingRepository }) {
  const { trainings, pagination } = await trainingRepository.findPaginatedSummaries({ page });

  return {
    trainings,
    meta: { pagination },
  };
};

export { findPaginatedTrainingSummaries };
