
import axios from "axios";
export default {
  props: {
    desiredSymbols: Array,
  },
  data() {
    return {
      badge: {
        name: '',
        icon: null,
      },
      channels: [],
      newChannelName: '',
      profilePicture: null,
      description: "",
      authToken: localStorage.getItem("auth_token"),
      activeTab: "usuarios", // Default tab
      users: [],
      activeMenu: null,
      authToken: '',
      spotifyToken: null,
      permissions: [],
      users: [],
      selectedUser: null,
      selectedRole: null,
      newRoleName: '',
      badge: { name: '', icon: '' },
      selectedBadge: null,
      badges: [],
      userBadges: [],
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

    async fetchChannels() {
      try {
        const response = await axios.get('/api/channels');
        this.channels = response.data;
      } catch (error) {
        console.error('Error al obtener los canales:', error);
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
        const response = await fetch(`http://192.168.0.10:90/api/users/${userId}`, {
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
        const response = await axios.post('http://192.168.0.10:90/api/badges', formData, {
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
