import { createRouter, createWebHistory } from 'vue-router'
import SessionListView from '../views/SessionListPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'SessionList',
      component: SessionListView,
    },
  ],
})

export default router
