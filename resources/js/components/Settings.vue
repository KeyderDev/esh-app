<template>
  <div>
    <h1 class="text-white">Ajustes</h1>
    <div class="input-container">
      <input type="file" @change="onFileChange" accept="image/*" class="file-input" />
      <button @click="upload" :disabled="isUploading" class="upload-button">
        <span v-if="isUploading">Subiendo...</span>
        <span v-else>Subir Foto de Perfil</span>
      </button>
      <p v-if="uploadMessage" class="upload-message">{{ uploadMessage }}</p>
    </div>
    <button @click="logout" class="logout-button">Cerrar Sesión</button>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router'; // Asegúrate de tener vue-router instalado

export default {
  data() {
    return {
      profilePicture: null,
      isUploading: false,
      uploadMessage: '',
    };
  },
  methods: {
    onFileChange(event) {
      this.profilePicture = event.target.files[0];
      if (this.profilePicture && this.profilePicture.size > 2 * 1024 * 1024) { // Limit to 2MB
        alert('El archivo es demasiado grande. Debe ser menor a 2MB.');
        this.profilePicture = null; // Reset if too large
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
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
    async logout() {
      // Primero actualiza el estado a offline
      await this.updateOnlineStatus(false); // Espera la actualización

      // Luego elimina el token de autenticación
      localStorage.removeItem('auth_token'); 

      // Redirige a la página de inicio de sesión
      this.$router.push('/login'); 
    },
    updateOnlineStatus(isOnline) {
      const authToken = localStorage.getItem('auth_token');
      axios.post('/api/update-online-status', { is_online: isOnline }, {
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
      })
      .then(response => {
          console.log('Online status updated', response.data);
      })
      .catch(error => {
          console.error('Error updating online status', error.response ? error.response.data : error);
      });
    },
  },
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column; /* Cambia a 'row' si prefieres en línea */
  align-items: flex-start; /* Alinea al inicio, ajusta según necesites */
}

.file-input {
  margin-bottom: 10px;
  border: 2px solid #444;
  border-radius: 5px;
  padding: 10px;
  background-color: #222; /* Fondo oscuro */
  color: #fff; /* Texto blanco */
  font-size: 16px;
  transition: border-color 0.3s;
}

.file-input:focus {
  border-color: #666; /* Color al hacer foco */
}

.upload-button {
  padding: 10px 20px;
  background-color: #333; /* Fondo del botón */
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.upload-button:hover {
  background-color: #555; /* Color al pasar el mouse */
  transform: translateY(-2px); /* Sutil elevación al pasar el mouse */
}

.logout-button {
  margin-top: 10px; /* Espaciado superior */
  padding: 10px 20px;
  background-color: #c9302c; /* Rojo más intenso */
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.logout-button:hover {
  background-color: #a52a2a; /* Color más oscuro al pasar el mouse */
  transform: translateY(-2px); /* Sutil elevación al pasar el mouse */
}

.upload-message {
  margin-top: 10px;
  color: #fff; /* Texto blanco */
}
</style>
