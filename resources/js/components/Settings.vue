<template>
  <div>
    <h1 class="text-white">Ajustes</h1>
    <div class="content-scroll">
      <div class="input-container">
        <input type="file" @change="onFileChange" accept="image/*" class="file-input" />
        <button @click="upload" :disabled="isUploading" class="upload-button">
          <span v-if="isUploading">Subiendo...</span>
          <span v-else>Subir Foto de Perfil</span>
        </button>
        <p v-if="uploadMessage" class="upload-message">{{ uploadMessage }}</p>
      </div>

      <div class="description-container">
        <textarea v-model="description" placeholder="Escribe tu descripción aquí..." class="description-input"></textarea>
        <button @click="saveDescription" class="update-button">
          {{ description ? 'Actualizar Descripción' : 'Agregar Descripción' }}
        </button>
      </div>

      <div class="button-group">
        <button @click="logout" class="logout-button">Cerrar Sesión</button>
        <button @click="toggleDebugInfo" class="debug-button">
          {{ showDebugInfo ? 'Ocultar Información de Depuración' : 'Ver Información de Depuración' }}
        </button>
      </div>

      <div v-if="showDebugInfo" class="debug-info">
        <h2 class="debug-title">Información de Depuración</h2>
        <div class="debug-row">
          <strong>Token de autenticación:</strong> <span class="debug-value">{{ authToken }}</span>
        </div>
        <div class="debug-row">
          <strong>Descripción actual:</strong> <span class="debug-value">{{ description }}</span>
        </div>
        <div class="debug-row">
          <strong>Estado de subida:</strong> <span class="debug-value">{{ isUploading ? 'En progreso...' : 'No en progreso' }}</span>
        </div>
        <div class="debug-row">
          <strong>Mensaje de carga:</strong> <span class="debug-value">{{ uploadMessage }}</span>
        </div>
        <div class="debug-row">
          <strong>Imagen seleccionada:</strong> <span class="debug-value">{{ profilePicture ? profilePicture.name : 'Ninguna imagen seleccionada' }}</span>
        </div>
        <div class="debug-logos">
          <img src="/public/images/laravel.png" alt="Laravel Logo" class="debug-logo" />
          <span class="plus-sign">+</span>
          <img src="/public/images/vue.png" alt="Vue Logo" class="debug-logo" />
          <span class="plus-sign">+</span>
          <img src="/public/images/chatgpt.png" alt="ChatGPT Logo" class="debug-logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

let inactivityTimeout;

export default {
  data() {
    return {
      profilePicture: null,
      isUploading: false,
      uploadMessage: '',
      description: '',
      authToken: localStorage.getItem('auth_token'),
      showDebugInfo: false,
    };
  },
  mounted() {
    this.fetchUser();
    window.addEventListener('mousemove', this.resetInactivityTimeout);
    window.addEventListener('keydown', this.resetInactivityTimeout);
    this.startInactivityTimeout();
  },
  beforeDestroy() {
    clearTimeout(inactivityTimeout);
    window.removeEventListener('mousemove', this.resetInactivityTimeout);
    window.removeEventListener('keydown', this.resetInactivityTimeout);
  },
  methods: {
    async fetchUser() {
      try {
        const response = await axios.get('/api/users', {
          headers: { 'Authorization': `Bearer ${this.authToken}` }
        });
        this.description = response.data.description || '';
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

    resetInactivityTimeout() {
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        this.updateOnlineStatus(false);
      }, 300000); // 5 minutos de inactividad
    },

    startInactivityTimeout() {
      this.resetInactivityTimeout(); // Iniciar el temporizador
    },

    onFileChange(event) {
      this.profilePicture = event.target.files[0];
      if (this.profilePicture && this.profilePicture.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Debe ser menor a 2MB.');
        this.profilePicture = null;
      }
    },

    async upload() {
      if (!this.profilePicture) {
        alert('Por favor, selecciona una imagen.');
        return;
      }

      const formData = new FormData();
      formData.append('profile_picture', this.profilePicture);
      this.isUploading = true;
      this.uploadMessage = '';

      try {
        const response = await axios.post('/api/profile/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.authToken}`,
          },
        });
        this.uploadMessage = response.data.success || 'Foto de perfil subida correctamente.';
      } catch (error) {
        console.error(error);
        this.uploadMessage = error.response?.data?.error || 'Error en la subida.';
      } finally {
        this.isUploading = false;
      }
    },

    async saveDescription() {
      try {
        const response = await axios.post('/api/user', { description: this.description }, {
          headers: { 'Authorization': `Bearer ${this.authToken}` },
        });
        this.description = response.data.description;
        alert(this.description ? 'Descripción actualizada correctamente.' : 'Descripción agregada correctamente.');
      } catch (error) {
        console.error('Error al actualizar/agregar la descripción:', error);
        alert('Error al actualizar/agregar la descripción.');
      }
    },

    async logout() {
      await this.updateOnlineStatus(false);
      localStorage.removeItem('auth_token');
      this.$router.push('/login');
    },

    updateOnlineStatus(isOnline) {
      axios.post('/api/update-online-status', { is_online: isOnline }, {
        headers: { 'Authorization': `Bearer ${this.authToken}` }
      })
      .then(response => {
        console.log('Online status updated', response.data);
      })
      .catch(error => {
        console.error('Error updating online status', error.response ? error.response.data : error);
      });
    },

    toggleDebugInfo() {
      this.showDebugInfo = !this.showDebugInfo;
    },
  }
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.file-input {
  margin-bottom: 10px;
  border: 2px solid #444;
  border-radius: 5px;
  padding: 10px;
  background-color: #222;
  color: #fff;
  font-size: 16px;
  transition: border-color 0.3s;
}

.file-input:focus {
  border-color: #666;
}

.upload-button {
  padding: 10px 20px;
  background-color: #333;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.upload-button:hover {
  background-color: #555;
  transform: translateY(-2px);
}

.upload-message {
  margin-top: 10px;
  color: #fff;
}

.description-container {
  margin-top: 20px;
}

.description-input {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  border: 2px solid #444;
  border-radius: 5px;
  background-color: #222;
  color: #fff;
  font-size: 16px;
  padding: 10px;
}

.update-button,
.logout-button,
.debug-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.update-button {
  background-color: #555;
}

.logout-button {
  margin-top: 10px;
  background-color: #c9302c;
}

.debug-button {
  margin-top: 10px;
  background-color: #555;
}

.update-button:hover {
  background-color: #777;
  transform: translateY(-2px);
}

.logout-button:hover {
  background-color: #a52a2a;
  transform: translateY(-2px);
}

.debug-button:hover {
  background-color: #777;
  transform: translateY(-2px);
}

.debug-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #222;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.debug-title {
  margin-bottom: 10px;
  font-size: 20px;
  color: #23a55a;
}

.debug-row {
  margin-bottom: 5px;
}

.debug-value {
  color: #ddd;
  font-weight: 400;
}

.content-scroll {
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 5px;
  background-color: #1a1a1a;
  padding: 15px;
}

.content-scroll::-webkit-scrollbar {
  width: 8px;
}

.content-scroll::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background-color: #2c2c2c;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #3a3a3a;
}

.debug-logos {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.debug-logo {
  width: 30px;
  height: auto;
}

.plus-sign {
  color: #fff;
  font-size: 20px;
  margin: 0 5px;
}
</style>
