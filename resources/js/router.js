import { createRouter, createWebHistory } from 'vue-router';
import SettingsComponent from './components/Settings.vue';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Libreria from './components/Libreria.vue';
import Dashboard from './components/Dashboard.vue';
import Channel from './components/Channel.vue'; 
import UserPermissions from './components/UserPermissions.vue';


const routes = [
  { path: '/settings', component: SettingsComponent },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/libreria', component: Libreria },
  { path: '/dashboard', component: Dashboard },
  { path: '/channel/:id', component: Channel, name: 'channel' }, 
  { path: '/user-permissions/:id', name: 'UserPermissions', component: UserPermissions },

];

function isAuthenticated() {
  return !!localStorage.getItem('auth_token'); 
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequired = to.path !== '/register' && to.path !== '/login';

  if (authRequired && !isAuthenticated()) {
    next('/login'); 
  } else {
    next(); 
  }
});

export default router;