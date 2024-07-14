<<template>
  <div class="overlay">
    <div class="login-container">
      <form @submit.prevent="login">
        <h2>Login</h2>
        <input v-model="username" placeholder="Username" required />
        <input v-model="password" placeholder="Password" type="password" required />
        <button type="submit">Login</button>
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
  methods: {
    async login() {
      try {
        const response = await axios.post('/api/login', {
          username: this.username,
          password: this.password,
        });

        const token = response.data.token;
        const userProfile = response.data.user; // Asegúrate de que tu backend devuelve el objeto del usuario

        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('username', userProfile.username); // Almacena el nombre de usuario
          localStorage.setItem('profile_picture', userProfile.profile_picture); // Almacena la URL de la foto de perfil
          alert(response.data.message);
          this.$router.push('/'); // Redirige a la raíz
        } else {
          alert('No se recibió un token.');
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message || 'Login failed.');
        } else {
          alert('Error in login process.');
        }
      }
    }
  },
};
</script>


<style scoped>
/* Tu estilo aquí */
</style>
>