import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Fairness from '../views/FairnessView.vue';

const routes = [
  {
    path: '/',
    name: 'Raffles',
    component: Home
  },
  {
    path: '/fairness',
    name: 'Provably Fair',
    component: Fairness
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
