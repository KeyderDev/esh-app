<template>
  <div>
    <h1 class="text-white">Ajustes</h1>
    <div>
      <input type="file" @change="onFileChange" accept="image/*" />
      <button @click="upload">Subir Foto de Perfil</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      profilePicture: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.profilePicture = event.target.files[0];
    },
    async upload() {
      const formData = new FormData();
      formData.append('profile_picture', this.profilePicture);

      try {
        const response = await axios.post('/api/profile/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, // Incluye el token aquí
          },
        });
        alert(response.data.success || 'Foto de perfil subida correctamente.');
      } catch (error) {
        console.error(error);
        // Manejo de errores más seguro
        const message = error.response?.data?.error || 'Upload failed.';
        alert(message);
      }
    }

  },
};
</script>

<style scoped>
/* Estilos opcionales aquí */
</style>
