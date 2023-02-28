import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSessionsStore = defineStore('sessions', () => {
  const sessionSummaries = ref({})

  const url = 'http://localhost:4203/api/certification-centers/5/session-summaries'
  function fetchSummaries() {
    // eslint-disable-next-line no-restricted-globals
    fetch(url, {
      headers: {
        Authorization: '',
      },
    })
      .then((data) => data.json())
      .then(({ data }) => {
        sessionSummaries.value = data
      });
  }

  return { sessionSummaries, fetchSummaries }
});
