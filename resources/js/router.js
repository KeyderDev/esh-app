import { createRouter, createWebHistory } from 'vue-router';
import SettingsComponent from './components/SettingsComponent.vue';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Libreria from './components/Libreria.vue'

// Suponiendo que tienes un método para verificar la autenticación
function isAuthenticated() {
  return !!localStorage.getItem('auth_token'); // Devuelve true si hay un token
}


const routes = [
  { path: '/settings', component: SettingsComponent },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/libreria', component: Libreria },
  // Otras rutas aquí
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const authRequired = to.path !== '/register' && to.path !== '/login'; // No requiere autenticación solo para /register y /login

  if (authRequired && !isAuthenticated()) {
    next('/login'); // Redirige a /login si no está autenticado
  } else {
    next(); // Permite la navegación
  }
});

export default router;
