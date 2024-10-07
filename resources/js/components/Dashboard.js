
import axios from "axios";
export default {
  props: {
    desiredSymbols: Array,
  },
  data() {
    return {
      badge: {
        name: '',
        icon: null, // Cambia el valor inicial a null
      },
      channels: [], // Lista de canales existentes
      newChannelName: '', // Nombre del nuevo canal a crear
      profilePicture: null,
      description: "",
      authToken: localStorage.getItem("auth_token"),
      activeTab: "usuarios", // Default tab
      users: [], // Define users array
      activeMenu: null, // Define activeMenu for the dropdown
      authToken: '', // Aquí se asignará el token de autorización
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
    this.fetchBadges();
  },
  methods: {
    onFileChange(event) {
      this.badge.icon = event.target.files[0]; // Guarda el archivo seleccionado
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
        this.activeMenu = null; // Close the menu after deleting
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    async fetchBadges() {
      try {
          const response = await axios.get('/api/badges', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('auth_token')}` // Asegúrate de incluir el token
              }
          });
          this.badges = response.data; // Asigna las insignias a la propiedad 'badges'
          console.log("Badges fetched:", this.badges);
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
            'Content-Type': 'multipart/form-data', // Asegúrate de que el tipo de contenido es el correcto
          },
        });
        console.log('Insignia creada:', response.data);
        // Resetea el formulario si es necesario
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
