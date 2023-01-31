<script setup>
import { useSessionsStore } from '@/stores/sessions'
import { onMounted, reactive, ref } from "vue";
import SessionList from '../components/SessionList.vue'

const store = useSessionsStore()

onMounted(() => {
  store.fetchSummaries()
})
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
h1 {
  font-weight: 300;
  font-size: 2.25rem;
  color: #253858;
}

section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 78px;
  margin: 16px 0 20px;
}

button {
  padding: 12px 24px;
  border-radius: 4px;
  color: #fff;
  font-size: .875rem;
  white-space: nowrap;
  letter-spacing: .028rem;
  cursor: pointer;
  border: 1px solid transparent;
  outline: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  background-color: #3d68ff;
  font-weight: bold;
}
</style>
