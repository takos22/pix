<script setup>
defineProps({
  sessionSummaries: {
    type: Array,
    required: true,
  },
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
      <tr v-for="(sessionSummary) in sessionSummaries">
        <td>{{ sessionSummary.id }}</td>
        <td>{{ sessionSummary.attributes.address }}</td>
        <td>{{ sessionSummary.attributes.room }}</td>
        <td>{{ sessionSummary.attributes.date }}</td>
        <td>{{ sessionSummary.attributes.time }}</td>
        <td>{{ sessionSummary.attributes.examiner }}</td>
        <td>{{ sessionSummary.attributes['enrolled-candidates-count'] }}</td>
        <td>{{ sessionSummary.attributes['effective-candidates-count'] }}</td>
        <td>{{ sessionSummary.attributes.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
@import "SessionList.css"
</style>
