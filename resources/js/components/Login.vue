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
import axios from '../axios';

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
    this.$router.push('/register'); 
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
}

.login-title {
  color: #ccc;
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
}

input::placeholder {
  color: #bbb;
}

button {
  padding: 12px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5px
}


button:hover {
  background-color: #555;
}

.register-button {
  background-color: #333;
}

.register-button:hover {
  background-color: #444;
}
</style>
