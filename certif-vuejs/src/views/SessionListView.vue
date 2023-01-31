<script setup>
import SessionList from '../components/SessionList.vue'

const sessions = [
  {
    address: "3 rue des églantines",
    room: "B315",
    date: "2020-01-31",
    time: "15:00:00",
    examiner: "Ginette",
    "enrolled-candidates-count": 5,
    "effective-candidates-count": 0,
    status: "created"
  }
]
</script>

<template>
    <main>
      <section>
        <h1>Sessions de certification</h1>
        <button>Template d'import des sessions</button>
      </section>
      <session-list :sessions="sessions" />
    </main>
</template>

<style scoped>
</style>
