import { createRouter, createWebHistory } from 'vue-router';
import SettingsComponent from './components/SettingsComponent.vue';

const routes = [
  { path: '/settings', component: SettingsComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
