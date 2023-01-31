import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSessionsStore = defineStore('sessions', () => {
  const sessionSummaries = ref({})

  function fetchSummaries() {
    fetch('https://certif-pr5575.review.pix.fr/api/certification-centers/3/session-summaries', {
      headers: {
        Authorization: ''
      }
    })
      .then(data => data.json())
      .then(({ data }) => {
        sessionSummaries.value = data
      });
  }

  return { sessionSummaries, fetchSummaries }
})
