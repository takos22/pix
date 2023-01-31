<script setup>
defineProps({
  sessions: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <td>N° de session</td>
        <td>Nom du site</td>
        <td>Salle</td>
        <td>Date</td>
        <td>Heure</td>
        <td>Surveillant(s)</td>
        <td>Candidats inscrits</td>
        <td>Certifications passées</td>
        <td>Statut</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(session) in sessions">
        <td>{{ session.address }}</td>
        <td>{{ session.room }}</td>
        <td>{{ session.date }}</td>
        <td>{{ session.time }}</td>
        <td>{{ session.examiner }}</td>
        <td>{{ session['enrolled-candidates-count'] }}</td>
        <td>{{ session['effective-candidates-count'] }}</td>
        <td>{{ session.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
