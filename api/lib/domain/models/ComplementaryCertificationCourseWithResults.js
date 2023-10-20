class ComplementaryCertificationCourseWithResults {
  constructor({ hasExternalJury = false, results }) {
    this.hasExternalJury = hasExternalJury;
    this.results = results;
  }

  isAcquired() {
    if (this.hasExternalJury && this.results.length <= 1) {
      return false;
    }
    return this.results.every(({ isAcquired }) => isAcquired);
  }

  static from({ hasEternalJury, results }) {
    return new ComplementaryCertificationCourseWithResults({ hasEternalJury, results });
  }
}

export { ComplementaryCertificationCourseWithResults };
