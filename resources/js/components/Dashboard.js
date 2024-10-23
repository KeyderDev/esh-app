
import axios from "axios";
import draggable from 'vuedraggable';
export default {
  components: {
    draggable,  
  },
  props: {
    desiredSymbols: Array,
  },
  data() {
    return {
      badge: {
        name: '',
        icon: null,
      },
      newChannelName: '',
      profilePicture: null,
      description: "",
      authToken: localStorage.getItem("auth_token"),
      activeTab: "usuarios", // Default tab
      activeMenu: null,
      authToken: '',
      spotifyToken: null,
      permissions: [],
      users: [],
      channels: [],
      badges: [],
      userBadges: [],
      forbiddenWords: [],
      selectedUser: null,
      selectedRole: null,
      newRoleName: '',
      badge: { name: '', icon: '' },
      selectedBadge: null,
      userBadges: [],
      newWord: '',
      newPermission: {
        name: '',
        description: ''
      }
    };
  },
  created() {
    // this.fetchRoles();
    // this.fetchUsers();
  },
  watch: {
    async selectedRole(newRole) {
      if (newRole && newRole.id !== (this.selectedRole && this.selectedRole.id)) {
        await this.fetchPermissions(newRole.id);
      }
    }
  },
  mounted() {
    this.authToken = localStorage.getItem('auth_token') || 'No disponible';
    this.fetchUsers();
    this.fetchChannels();
    this.fetchSpotifyToken();
    this.fetchBadges();
  },
  methods: {
    onFileChange(event) {
      this.badge.icon = event.target.files[0];
    },
    goToUserPermissions(userId) {
      this.$router.push({ name: 'UserPermissions', params: { id: userId } });
    },
    fetchPermissions() {
      axios.get('/api/permissions').then(response => {
        this.permissions = response.data;
      });
    },
    createPermission() {
      axios.post('/api/permissions', this.newPermission)
        .then(response => {
          this.permissions.push(response.data);
          this.newPermission.name = '';
          this.newPermission.description = '';
        })
        .catch(error => {
          console.error('Error creando permiso:', error);
        });
    },
    async fetchUsers() {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.users = await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchSpotifyToken() {
      try {
        const authToken = localStorage.getItem('auth_token');
        const response = await axios.get('/api/spotify/token', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        this.spotifyToken = response.data.token;
      } catch (error) {
        console.error('Error al obtener el token de Spotify:', error);
      }
    },
    // async fetchForbiddenWords() {
    //   try {
    //     const response = await axios.get('/api/forbidden-words');
    //     this.forbiddenWords = response.data;
    //   } catch (error) {
    //     console.error('Error al cargar las palabras prohibidas:', error);
    //   }
    // },
    // async addForbiddenWord() {
    //   if (this.newWord && !this.forbiddenWords.includes(this.newWord.toLowerCase())) {
    //     try {
    //       const response = await axios.post('/api/forbidden-words', { word: this.newWord.toLowerCase() });
    //       this.forbiddenWords.push(response.data.word); // Agregar la nueva palabra a la lista
    //       this.newWord = ''; // Limpiar el campo de entrada
    //     } catch (error) {
    //       console.error('Error al agregar la palabra prohibida:', error);
    //     }
    //   }
    // },
    // async removeForbiddenWord(word) {
    //   try {
    //     await axios.delete(`/api/forbidden-words/${word}`);
    //     this.forbiddenWords = this.forbiddenWords.filter(w => w !== word); // Remover la palabra de la lista
    //   } catch (error) {
    //     console.error('Error al eliminar la palabra prohibida:', error);
    //   }
    // },
    async fetchChannels() {
      try {
        const response = await axios.get('/api/channels');
        this.channels = response.data.sort((a, b) => a.order - b.order);
      } catch (error) {
        console.error('Error al cargar los canales:', error);
      }
    },

    async createChannel() {
      if (!this.newChannelName) return;
      try {
        const response = await axios.post('/api/channels', {
          name: this.newChannelName,
        });
        this.channels.push(response.data);
        this.newChannelName = '';
      } catch (error) {
        console.error('Error al crear el canal:', error);
      }
    },
    async onChannelReorder(event) {
      console.log('Reordenando canales:', this.channels); 
      try {
        const reorderedChannels = this.channels.map((channel, index) => {
          return { id: channel.id, order: index + 1 };
        });

        console.log('Canales reordenados:', reorderedChannels);

        await axios.post('/api/channels/reorder', { channels: reorderedChannels })
          .then(response => {
            console.log('Respuesta del servidor:', response.data); 
          })
          .catch(error => {
            console.error('Error al actualizar el orden de los canales:', error);
          });


        console.log('Orden de canales actualizado:', reorderedChannels);
      } catch (error) {
        console.error('Error al actualizar el orden de los canales:', error);
      }
    },

    async deleteChannel(channelId) {
      try {
        const response = await axios.delete(`/api/channels/${channelId}`);
        if (response.status === 200) {
          this.channels = this.channels.filter(channel => channel.id !== channelId);
          console.log('Canal eliminado con éxito:', response.data);
        } else {
          console.error('Error al eliminar el canal:', response.data.message);
        }
      } catch (error) {
        if (error.response) {
          console.error('Error al borrar el canal:', error.response.data.message);
        } else {
          console.error('Error al borrar el canal:', error.message);
        }
      }
    },
    async deleteUser(userId) {
      if (!confirm('Are you sure you want to delete this user?')) {
        return;
      }
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${window.appUrl}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this.users = this.users.filter(user => user.id !== userId);
        this.activeMenu = null;
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    async fetchBadges() {
      try {
        const response = await axios.get('/api/badges', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.badges = response.data;
        console.log('Insignias cargadas:', this.badges);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    },



    async fetchUserBadges(userId) {
      const response = await fetch(`/api/user/${userId}/badges`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      this.userBadges = await response.json();
    },

    async createBadge() {
      const formData = new FormData();
      formData.append('name', this.badge.name);
      formData.append('icon', this.badge.icon);

      try {
        const response = await axios.post(`${window.appUrl}/api/badges`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Insignia creada:', response.data);
      } catch (error) {
        console.error('Error al crear la insignia:', error.response ? error.response.data : error.message);
      }
    },


    async assignBadge() {
      const response = await fetch('/api/assign-badge', {
        method: 'POST',
        body: JSON.stringify({ user_id: this.selectedUser, badge_id: this.selectedBadge }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (response.ok) {
        alert('Insignia asignada');
        this.fetchUserBadges(this.selectedUser);
      } else {
        const error = await response.json();
        console.error(error);
      }
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    toggleMenu(userId) {
      this.activeMenu = this.activeMenu === userId ? null : userId;
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  }
};
