<template>
  <div class="overlay">
    <div class="register-container">
      <form @submit.prevent="register">
        <h2 class="register-title">Iniciar sesión</h2>
        <p class="register-description">Introduce tus credenciales para continuar.</p>

        <div class="input-group">
          <label for="email"><i class="fa-solid fa-user"></i> USUARIO</label>
          <input v-model="username" id="email" placeholder="Usuario" required autocomplete="off" />
        </div>

        <div class="input-group">
          <label for="password"><i class="fa-solid fa-lock"></i> CONTRASEÑA</label>
          <input v-model="password" id="password" placeholder="Contraseña" type="password" required />
        </div>

        <div class="input-group">
          <label for="password_confirmation"><i class="fa-solid fa-lock"></i> CONFIRMAR CONTRASEÑA</label>
          <input v-model="password_confirmation" id="password_confirmation" placeholder="Confirmar Contraseña" type="password" required />
        </div>

        <button type="submit" style="display: none;"></button>

        <p class="register-link">¿Ya tienes cuenta? <a href="/login">Iniciar Sesión</a></p>
      </form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      password_confirmation: '',
    };
  },
  methods: {
    async register() {
      if (!this.username || !this.password || !this.password_confirmation) {
        alert('Todos los campos son obligatorios.');
        return;
      }

      if (this.password !== this.password_confirmation) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      try {
        const response = await axios.post('/api/register', {
          username: this.username,
          password: this.password,
          password_confirmation: this.password_confirmation,
        });

        alert(response.data.message);
        this.$router.push('/login'); 
      } catch (error) {
        alert(error.response?.data?.message || 'Error en el registro.');
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

.register-container {
  background: #1e1e1e;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
  width: 370px;
}

.register-title {
  color: #e0e0e0;
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
}

.register-description {
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

.register-button {
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

.register-link {
  font-size: 0.9rem;
  color: #cccccc;
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>