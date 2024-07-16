<template>
  <div id="app" class="d-flex flex-column" style="height: 100vh;">
    <nav class="navbar navbar-expand"
      style="background-color: #121212; padding: 0.5rem 1rem; border-bottom: 1px solid #1e1e1e;">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img :src="imageSrc" alt="Logo" class="navbar-logo">
          <form class="d-flex" role="search"
            style="background-color: #1e1e1e; border-radius: 0.25rem; padding: 0.25rem; margin-left: 2rem;">
            <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar"
              style="max-width: 200px; background-color: #1e1e1e; border: none; color: #e0e0e0;">
          </form>
        </div>
        <div class="navbar-brand mx-auto text-white"
          style="position: absolute; left: 50%; transform: translateX(-50%);">{{ currentTime }}</div>
        <div class="navbar-nav d-flex align-items-center">
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
        style="background-color: #1e1e1e; width: 230px; display: flex; flex-direction: column; padding: 1rem; border-right: 1px solid #1e1e1e; position: relative;">
        <div class="channel-section" v-for="section in channelSections" :key="section.name">
          <p class="section-title">{{ section.name }}</p>
          <div class="channel" v-for="channel in section.channels" :key="channel.id">
            <router-link :to="channel.link" class="channel-link">
              <i :class="channel.icon"></i> {{ channel.name }}
            </router-link>
          </div>
        </div>
        <router-link to="/dashboard" class="settings-icon" style="position: absolute; top: 10px; right: 10px;">
          <i class="fas fa-cog" style="color: #e0e0e0;"></i>
        </router-link>
      </div>
      <div class="flex-grow-1" style="background-color: #181818; padding: 1rem;">
        <router-view></router-view>
      </div>
      <div class="right-sidebar"
        style="background-color: #1e1e1e; width: 200px; display: flex; flex-direction: column; padding: 1rem; border-left: 1px solid #1e1e1e;">
        <h6 class="text-white small-text">En Línea</h6>
        <div v-for="user in users" :key="user.id" class="user-item d-flex flex-column mb-2 online-user"
          @click="showUserDetails(user)">
          <div class="d-flex align-items-center">
            <div class="profile-container">
              <img :src="user.profile_picture" alt="Profile" class="profile-pic" />
              <div class="online-indicator"></div>
            </div>
            <div class="d-flex flex-column ms-2">
              <span class="username text-white">{{ user.username }}</span>
              <span class="user-description" v-if="user.description">{{ user.description }}</span>
            </div>
          </div>
        </div>

        <h6 class="text-white mt-4 small-text">Desconectado</h6>
        <div v-for="user in offlineUsers" :key="user.id" class="user-item d-flex flex-column mb-2 offline-user"
          @click="showUserDetails(user)">
          <div class="d-flex align-items-center">
            <img :src="user.profile_picture" alt="Profile" class="profile-pic" />
            <span class="username offline-username ms-2">{{ user.username }}</span>
          </div>
        </div>
      </div>


    </div>
    <div v-if="selectedUser" class="user-details"
      style="position: absolute; top: 10%; right: 200px; background-color: #1e1e1e; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); width: 250px;">
      <button @click="closeUserDetails"
        style="background: none; border: none; color: #fff; font-size: 1.5rem; position: absolute; top: 0.5rem; right: 0.5rem;">&times;</button>
      <div style="text-align: center; margin-bottom: 1rem;">
        <img :src="selectedUser.profile_picture" alt="Profile" class="profile-pic"
          style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 0.5rem;" />
        <h4 class="text-white" style="margin: 0;">{{ selectedUser.username }}</h4>
      </div>
      <p class="user-description" v-if="selectedUser.description"
        style="font-size: 0.9rem; color: #bbb; text-align: center;">{{ selectedUser.description }}</p>
    </div>

  </div>
</template>



<script>
import axios from 'axios';
export default {
  name: 'App',
  data() {
    return {
      imageSrc: '/images/esh.jpg',
      username: localStorage.getItem('username') || '',
      profilePicture: '',
      users: [],
      offlineUsers: [],
      selectedUser: null,
      channelSections: [
        {
          name: 'Importante',
          channels: [
            { id: 1, name: 'Anuncios', link: '/channel/general', icon: 'fas fa-bullhorn' },
            { id: 2, name: 'Reglas', link: '/channel/memes', icon: 'fa-solid fa-scroll' },
            { id: 3, name: 'Directorio', link: '/channel/audio', icon: 'fas fa-newspaper' }
          ]
        },
        {
          name: 'Emprende Sin Humo',
          channels: [
            { id: 4, name: 'Chat', link: '/channel/dev-preview', icon: 'fas fa-comment' },
            { id: 5, name: 'Comandos', link: '/channel/sugerencias', icon: 'fas fa-wrench' },
            { id: 6, name: 'Presentate', link: '/channel/bugs', icon: 'fas fa-user' },
            { id: 7, name: 'Resultados', link: '/channel/github', icon: 'fas fa-chart-line' }
          ]
        },
        {
          name: 'Recreacion',
          channels: [
            { id: 8, name: 'Hoy Aprendi', link: '/channel/development', icon: 'fas fa-lightbulb' },
            { id: 9, name: 'Moderación', link: '/channel/moderacion', icon: 'fas fa-shield-alt' },
            { id: 10, name: 'Reunion Publica', link: '/channel/consola', icon: 'fas fa-volume-high' },
            { id: 11, name: 'Server Log', link: '/channel/server-log', icon: 'fas fa-server' }
          ]
        },
        {
          name: 'Hikari IA',
          channels: [
            { id: 12, name: 'General', link: '/channel/hikari-general', icon: 'fas fa-hashtag' }
          ]
        }
      ],
      currentTime: ''
    };
  },
  mounted() {
    this.loadProfilePicture();
    this.updateTime();
    this.updateOnlineStatus(true);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    this.fetchOnlineUsers();
    this.fetchOfflineUsers();
    setInterval(this.updateTime, 1000);
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  methods: {
    loadProfilePicture() {
      const picture = localStorage.getItem('profile_picture');
      this.profilePicture = picture ? `http://127.0.0.1:8000/storage/${picture}` : '/path/to/default/profile_picture.jpg';
    },
    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.currentTime = `${hours}:${minutes}`;
    },
    handleVisibilityChange() {
      console.log('Visibility changed:', document.visibilityState);
      if (document.visibilityState === 'visible') {
        this.updateOnlineStatus(true);
      } else {
        console.log('User going offline');
        this.updateOnlineStatus(false);
      }
    },
    handleBeforeUnload(event) {
      this.updateOnlineStatus(false);
      event.returnValue = '';
    },
    updateOnlineStatus(isOnline) {
      console.log('Updating online status to:', isOnline);
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
    fetchOnlineUsers() {
      const authToken = localStorage.getItem('auth_token');
      axios.get('/api/users/online', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(response => {
          if (Array.isArray(response.data)) {
            this.users = response.data.map(user => {
              console.log('User description:', user.description); // Verifica la descripción
              return {
                ...user,
                profile_picture: user.profile_picture ? `http://127.0.0.1:8000/storage/${user.profile_picture}` : '/path/to/default/profile_picture.jpg'
              };
            });
          }
        })
        .catch(error => {
          console.error('Error fetching online users', error.response ? error.response.data : error);
        });
    },

    fetchOfflineUsers() {
      const authToken = localStorage.getItem('auth_token');
      axios.get('/api/users/offline', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(response => {
          this.offlineUsers = response.data.map(user => ({
            ...user,
            profile_picture: user.profile_picture ? `http://127.0.0.1:8000/storage/${user.profile_picture}` : '/path/to/default/profile_picture.jpg'
          }));
        })
        .catch(error => {
          console.error('Error fetching offline users', error.response ? error.response.data : error);
        });

    },

    showUserDetails(user) {
      this.selectedUser = user;
    },
    closeUserDetails() {
      this.selectedUser = null;
    },

  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  background-color: #121212;
  overflow-y: hidden;
}

#app {
  height: 100vh;
  background-color: #181818;
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

.navbar-time {
  font-size: 1.25rem;
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
  transition: color 0.3s, background-color 0.3s;
}

.nav-link:hover {
  color: #ffffff;
  background-color: #2c2c2c;
  border-radius: 0.25rem;
}

.nav-link i {
  font-size: 1.5rem;
  color: #9e9e9e;
  transition: color 0.3s;
}

.nav-link:hover i {
  color: #ffffff;
}

.nav-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #e0e0e0;
  transition: color 0.3s;
}

.nav-link:hover .nav-text {
  color: #ffffff;
}

.channels {
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 0;
  margin: 0;
  scrollbar-width: thin;
  scrollbar-color: #2c2c2c #121212;
}

.channels::-webkit-scrollbar {
  width: 8px;
}

.channels::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 10px;
}

.channels::-webkit-scrollbar-thumb {
  background-color: #2c2c2c;
  border-radius: 10px;
}

.channels::-webkit-scrollbar-thumb:hover {
  background-color: #3a3a3a;
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

.settings-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1rem;
  color: #e0e0e0;
  text-decoration: none;
  transition: color 0.3s;
}

.settings-icon:hover {
  color: #ffffff;
}

.right-sidebar {
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 0;
  margin: 0;
  scrollbar-width: thin;
  scrollbar-color: #2c2c2c #121212;
}

.right-sidebar::-webkit-scrollbar {
  width: 8px;
}

.right-sidebar::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 10px;
}

.right-sidebar::-webkit-scrollbar-thumb {
  background-color: #2c2c2c;
  border-radius: 10px;
}

.right-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #3a3a3a;
}

.profile-pic {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.username {
  margin-right: 10px;
  color: #e0e0e0;
}

.user-item {
  padding: 0.10rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s;
}

.user-item:hover {
  background-color: #2c2c2c;
  cursor: pointer;
}

.small-text {
  font-size: 0.9rem;
}

.profile-container {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #23a55a;
  border-radius: 50%;
  border: 2px solid #181818;
}

.offline-user .profile-pic {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  filter: grayscale(100%);
}

.offline-username {
  color: #6c6c6c;
}

.user-details {
  position: absolute;
  top: 10%;
  right: 200px;
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 200px;
}

.user-description {
  font-size: 0.9rem;
  /* Ajusta el tamaño según sea necesario */
  color: #b0b0b0;
  /* O el color que prefieras */
}


.text-gray {
  color: #ffffff;
  /* Cambia a blanco para probar */
}
</style>
