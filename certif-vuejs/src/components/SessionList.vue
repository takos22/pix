<script setup>
defineProps({
  sessionSummaries: {
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
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(12,22,58,.1),0 2px 5px 0 rgba(0,0,0,.1);
  background-color: #fff;
}

table thead {
  color: #344563;
}

table tr {
  border-top: 2px solid #f4f5f7;
  height: 60px;
}

table td:first-child, table th:first-child {
  padding-left: 30px;
}

table td, table th {
  text-align: left;
  word-wrap: break-word;
  padding-left: 5px;
  padding-right: 5px;
}

table tbody {
  color: #6b778c;
}
</style>
