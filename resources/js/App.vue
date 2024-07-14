<template>
  <div id="app" class="d-flex flex-column" style="height: 100vh;">
    <nav class="navbar navbar-expand"
      style="background-color: #121212; padding: 0.5rem 1rem; border-bottom: 1px solid #1e1e1e;">
      <div class="container-fluid">
        <img :src="imageSrc" alt="Logo" class="navbar-logo">
        <form class="d-flex" role="search"
          style="background-color: #1e1e1e; border-radius: 0.25rem; padding: 0.25rem; margin-left: 2rem;">
          <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar"
            style="max-width: 200px; background-color: #1e1e1e; border: none; color: #e0e0e0;">
        </form>
        <div class="navbar-nav ms-auto d-flex align-items-center">
          <span class="text-white ms-2 username">{{ username }}</span>
          <img :src="profilePicture" alt="Profile" class="profile-pic" v-if="profilePicture" />
        </div>
      </div>
    </nav>
    <div class="d-flex flex-grow-1">
      <nav class="text-white d-flex flex-column"
        style="background-color: #121212; width: 60px; padding: 0.5rem; border-right: 1px solid #1e1e1e;">
        <div class="d-flex flex-column align-items-center flex-grow-1" style="margin-top: 1rem;">
          <router-link to="/" class="nav-link text-white d-flex flex-column align-items-center">
            <i class="fas fa-home"></i>
            <span class="nav-text">Inicio</span>
          </router-link>
          <router-link to="/libreria" class="nav-link text-white d-flex flex-column align-items-center">
            <i class="fas fa-book"></i>
            <span class="nav-text">Libreria</span>
          </router-link>
        </div>
        <div class="d-flex flex-column align-items-center">
          <router-link to="/settings" class="nav-link text-white d-flex flex-column align-items-center">
            <i class="fas fa-cog"></i>
            <span class="nav-text">Ajustes</span>
          </router-link>
        </div>
      </nav>
      <div class="channels"
        style="background-color: #1e1e1e; width: 230px; display: flex; flex-direction: column; padding: 1rem; border-right: 1px solid #1e1e1e;">
        <div class="channel-section" v-for="section in channelSections" :key="section.name">
          <p class="section-title">{{ section.name }}</p>
          <div class="channel" v-for="channel in section.channels" :key="channel.id">
            <router-link :to="channel.link" class="channel-link">
              <i :class="channel.icon"></i> {{ channel.name }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="flex-grow-1" style="background-color: #181818; padding: 1rem;">
        <router-view></router-view>
      </div>
      <!-- Nuevo div vertical a la derecha -->
      <div class="right-sidebar"
        style="background-color: #1e1e1e; width: 200px; display: flex; flex-direction: column; padding: 1rem; border-left: 1px solid #1e1e1e;">
        <!-- Contenido del div derecho -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      imageSrc: '/images/esh.jpg',
      username: localStorage.getItem('username') || '', // Obtén el nombre de usuario de localStorage
      profilePicture: localStorage.getItem('profile_picture') ? `http://127.0.0.1:8000/storage/${localStorage.getItem('profile_picture')}` : '',
      channelSections: [
        {
          name: 'Importante',
          channels: [
            { id: 1, name: 'Anuncios', link: '/channel/general', icon: 'fas fa-bullhorn' },
            { id: 2, name: 'Reglas', link: '/channel/memes', icon: 'fa-solid fa-scroll' },
            { id: 3, name: 'Directorio', link: '/channel/audio', icon: 'fa-solid fa-newspaper' }
          ]
        },
        {
          name: 'Emprende Sin Humo',
          channels: [
            { id: 4, name: 'Chat', link: '/channel/dev-preview', icon: 'fa-solid fa-comment' },
            { id: 5, name: 'Comandos', link: '/channel/sugerencias', icon: 'fa-solid fa-wrench' },
            { id: 6, name: 'Presentate', link: '/channel/bugs', icon: 'fa-solid fa-user' },
            { id: 7, name: 'Resultados', link: '/channel/github', icon: 'fa-solid fa-chart-line' }
          ]
        },
        {
          name: 'Recreacion',
          channels: [
            { id: 8, name: 'Hoy Aprendi', link: '/channel/development', icon: 'fa-solid fa-lightbulb' },
            { id: 9, name: 'Moderación', link: '/channel/moderacion', icon: 'fas fa-shield-alt' },
            { id: 10, name: 'Reunion Publica', link: '/channel/consola', icon: 'fa-solid fa-volume-high' },
            { id: 11, name: 'Server Log', link: '/channel/server-log', icon: 'fas fa-server' }
          ]
        },
        {
          name: 'Hikari IA',
          channels: [
            { id: 12, name: 'General', link: '/channel/hikari-general', icon: 'fas fa-hashtag' }
          ]
        }
      ]
    };
  },
  mounted() {
    console.log('Profile Picture URL:', this.profilePicture); // Verifica la URL de la imagen
  }
};
</script>

<style>
/* Estilos globales */
html,
body {
  height: 100%;
  margin: 0;
  background-color: #121212;
  /* Fondo de página general */
  overflow-y: hidden;
}

#app {
  height: 100vh;
  background-color: #181818;
  /* Fondo principal de la aplicación */
}

.navbar {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.navbar-logo {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  z-index: 10;
  margin-right: 1rem;
}

.form-control {
  border-radius: 0.25rem;
  color: #e0e0e0;
}

.form-control::placeholder {
  color: #b0b0b0 !important;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #e0e0e0;
  text-decoration: none;
  margin-bottom: 1rem;
  /* Espacio entre iconos */
  transition: color 0.3s, background-color 0.3s;
  /* Animación de transición */
}

.nav-link:hover {
  color: #ffffff;
  /* Color de iconos y texto en hover */
  background-color: #2c2c2c;
  /* Fondo de fondo en hover */
  border-radius: 0.25rem;
  /* Bordes redondeados en hover */
}

.nav-link i {
  font-size: 1.5rem;
  color: #9e9e9e;
  /* Color de iconos ajustado para combinar mejor */
  transition: color 0.3s;
  /* Animación de transición para el color del icono */
}

.nav-link:hover i {
  color: #ffffff;
  /* Color del icono en hover */
}

.nav-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #e0e0e0;
  transition: color 0.3s;
  /* Animación de transición para el texto */
}

.nav-link:hover .nav-text {
  color: #ffffff;
  /* Color del texto en hover */
}

.channels {
  height: calc(100vh - 60px);
  /* Ajusta según la altura de tu navbar y otros elementos */
  overflow-y: auto;
  /* Habilita el scroll vertical */
  padding: 0;
  /* Elimina cualquier padding */
  margin: 0;
  /* Elimina cualquier margen */
  scrollbar-width: thin;
  /* Firefox: scrollbar delgado */
  scrollbar-color: #2c2c2c #121212;
  /* Firefox: color del scrollbar */
}

.channels::-webkit-scrollbar {
  width: 8px;
  /* Ancho del scrollbar */
}

.channels::-webkit-scrollbar-track {
  background: #121212;
  /* Color del track */
  border-radius: 10px;
  /* Bordes redondeados */
}

.channels::-webkit-scrollbar-thumb {
  background-color: #2c2c2c;
  /* Color del thumb */
  border-radius: 10px;
  /* Bordes redondeados */
}

.channels::-webkit-scrollbar-thumb:hover {
  background-color: #3a3a3a;
  /* Color del thumb en hover */
}

.channel-section {
  margin-bottom: 1rem;
}

.section-title {
  color: #b0b0b0;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.channel {
  margin-bottom: 0.5rem;
}

.channel-link {
  color: #e0e0e0;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
}

.channel-link:hover {
  background-color: #2c2c2c;
}

.channel-link i {
  margin-right: 0.5rem;
}

/* Estilo para el nuevo div vertical a la derecha */
.right-sidebar {
  height: calc(100vh - 60px);
  /* Ajusta según la altura de tu navbar y otros elementos */
  overflow-y: auto;
  /* Habilita el scroll vertical */
  padding: 0;
  /* Elimina cualquier padding */
  margin: 0;
  /* Elimina cualquier margen */
  scrollbar-width: thin;
  /* Firefox: scrollbar delgado */
  scrollbar-color: #2c2c2c #121212;
  /* Firefox: color del scrollbar */
}

.right-sidebar::-webkit-scrollbar {
  width: 8px;
  /* Ancho del scrollbar */
}

.right-sidebar::-webkit-scrollbar-track {
  background: #121212;
  /* Color del track */
  border-radius: 10px;
  /* Bordes redondeados */
}

.right-sidebar::-webkit-scrollbar-thumb {
  background-color: #2c2c2c;
  /* Color del thumb */
  border-radius: 10px;
  /* Bordes redondeados */
}

.right-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #3a3a3a;
  /* Color del thumb en hover
   */
}

.profile-pic {
  width: 40px;
  /* o cualquier tamaño que desees */
  height: 40px;
  /* o cualquier tamaño que desees */
  border-radius: 50%;
  /* para hacerla circular */
}

.username {
  margin-right: 10px; /* Ajusta el valor según sea necesario */
  color: #e0e0e0
}

</style>
