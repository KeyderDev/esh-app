<template>
    <div class="overlay">
      <div class="register-container">
        <form @submit.prevent="register">
          <h2 class="register-title">Registrarse</h2>
          <div class="input-group">
            <input v-model="username" placeholder="Usuario" required />
            <input v-model="password" placeholder="Contraseña" type="password" required />
            <input v-model="password_confirmation" placeholder="Confirmar Contraseña" type="password" required />
          </div>
          <button type="submit" class="register-button">Crear Cuenta</button>
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
        console.log('Register method called');
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
          console.log('Response received:', response);
          alert(response.data.message);
          // Redirigir a la página de inicio de sesión o otra página después del registro
          this.$router.push('/login');
        } catch (error) {
          if (error.response) {
            console.error('Error response:', error.response);
            alert(error.response.data.message || 'Error en el registro.');
          } else if (error.request) {
            console.error('Error request:', error.request);
            alert('No se recibió respuesta del servidor.');
          } else {
            console.error('Error', error.message);
            alert('Error en el proceso de registro.');
          }
          console.error('Error config:', error.config);
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
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .register-container {
    background: #1e1e1e;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
    width: 300px;
  }
  
  .register-title {
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
  
  .register-button {
    padding: 12px;
    background-color: #444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .register-button:hover {
    background-color: #555;
  }
  </style>
  