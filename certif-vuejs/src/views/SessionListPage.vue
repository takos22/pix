<script setup>
import { useSessionsStore } from '@/stores/sessions'
import { onMounted, reactive, ref } from 'vue'
import SessionList from '../components/SessionList.vue'

const store = useSessionsStore()

onMounted(() => {
  store.fetchSummaries()
});
</script>

<template>
  <main>
    <section>
      <h1>Sessions de certification</h1>
      <button>Template d'import des sessions</button>
    </section>
    <session-list :session-summaries="store.sessionSummaries" />
  </main>
</template>

<style scoped>
@import "@/views/SessionListPage.css"
</style>
