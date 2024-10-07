<template>
  <div class="overlay">
    <div class="login-container">
      <form @submit.prevent="login">
        <h2 class="login-title">Iniciar Sesion</h2>
        <div class="input-group">
          <input v-model="username" placeholder="Usuario" required />
          <input v-model="password" placeholder="Contraseña" type="password" required />
        </div>
        <button type="submit" class="login-button">Entrar</button>
        <button type="button" @click="goToRegister" class="register-button">Registrarse</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../axios'; // Importa tu configuración de axios aquí

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  mounted() {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Si ya hay un token en localStorage, redirige fuera de la página de login
    this.$router.push('/');
  }
  },
  methods: {
  async login() {
    try {
      const response = await axios.post('/api/login', {
        username: this.username,
        password: this.password,
      });

      const token = response.data.token;
      const userProfile = response.data.user;

      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('username', userProfile.username);
        localStorage.setItem('profile_picture', userProfile.profile_picture);
        alert(response.data.message);

        // Recargar la página solo si el token ha sido almacenado
        window.location.reload();
      } else {
        alert('No se recibió un token.');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Login failed.');
      } else {
        alert('Error en el proceso de inicio de sesión.');
      }
    }
  },
  goToRegister() {
    this.$router.push('/register'); // Redirige a la página de registro
  }
}

};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background: #1e1e1e;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
  width: 300px;
  /* Ancho fijo para el contenedor */
}

.login-title {
  color: #ccc;
  /* Color gris elegante para el título */
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2a2a2a;
  color: white;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ccc;
  /* Cambio de borde al enfocar */
}

input::placeholder {
  color: #bbb;
}

button {
  padding: 12px;
  background-color: #444;
  /* Color oscuro elegante para el botón */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5px
}


button:hover {
  background-color: #555;
  /* Color más claro al pasar el mouse */
}

.register-button {
  background-color: #333;
  /* Color oscuro elegante para el botón de registro */
}

.register-button:hover {
  background-color: #444;
  /* Color más claro al pasar el mouse */
}
</style>
