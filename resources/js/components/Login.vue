<template>
  <div class="overlay">
    <div class="login-container">
      <form @submit.prevent="login">
        <h2 class="login-title">Iniciar sesión</h2>
        <p class="login-description">Introduce tus credenciales para continuar.</p>

        <div class="input-group">
          <label for="email"><i class="fa-regular fa-user"></i> USUARIO</label>
          <input v-model="username" id="email" placeholder="Usuario" required />
        </div>

        <div class="input-group">
          <label for="password"><i class="fa-solid fa-lock"></i> CONTRASEÑA</label>
          <input v-model="password" id="password" placeholder="Contraseña" type="password" required />
        </div>

        <div v-if="alertMessage" class="alert-box">
          {{ alertMessage }}
        </div>

        <div class="action-group">
          <button type="button" class="date-button"><i class="fa-solid fa-id-card"></i></button>
          <button type="submit" class="login-button">Iniciar</button>
        </div>
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
      alertMessage: '', 
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
          this.alertMessage = response.data.message;
          setTimeout(() => window.location.reload(), 1000); 
        } else {
          this.alertMessage = 'No se recibió un token.';
        }
      } catch (error) {
        if (error.response) {
          this.alertMessage = error.response.data.message || 'Error en el inicio de sesión.';
        } else {
          this.alertMessage = 'Error en el proceso de inicio de sesión.';
        }
      }
    },
  },
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background: #1e1e1e;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
  width: 370px;
}

.login-title {
  color: #e0e0e0;
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
}

.login-description {
  color: #9ea0a1;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

label {
  color: #9ea0a1;
  font-size: 0.9rem;
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2a2a2a;
  color: #e0e0e0;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ccc;
}

input::placeholder {
  color: #a0a0a0;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 42px;
  cursor: pointer;
}

.action-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.date-button {
  padding: 5px;
  background-color: #2a2a2a;
  border: none;
  border-radius: 6px;
  color: #9ea0a1;
  cursor: pointer;
}

.login-button {
  padding: 6px 20px;
  background-color: #3a57e8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button:hover {
  background-color: #304fcf;
}

.alert-box {
  color: red;
}

</style>
