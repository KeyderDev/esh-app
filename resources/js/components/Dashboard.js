
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
      roles: [],
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
    this.fetchRoles();
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
    async fetchRoles() {
      try {
        const response = await axios.get('/api/roles');
        this.roles = response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
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
    async fetchPermissions(roleId) {
      try {
        const response = await axios.get(`/api/roles/${roleId}/permissions`);
        this.permissions = response.data.permissions;
        this.selectedRole = response.data.role;
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    },
    async assignRole() {
      if (!this.selectedUser || !this.selectedRole) return;

      try {
        await axios.post(`/api/users/${this.selectedUser}/roles`, { role_id: this.selectedRole.id });
        alert('Rol asignado correctamente');
      } catch (error) {
        console.error('Error asignando rol:', error);
        alert('Error al asignar rol. Intenta de nuevo.');
      } finally {
        this.selectedUser = null;
        this.selectedRole = null;
      }
    },
    async createRole() {
      if (!this.newRoleName) return;

      try {
        await axios.post('/api/roles', { name: this.newRoleName });
        alert('Rol creado correctamente');
        this.newRoleName = '';
        this.fetchRoles();
      } catch (error) {
        console.error('Error creando rol:', error);
      }
    },
    async deleteRole(roleId) {
      const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este rol?');
      if (!confirmDelete) return;

      try {
        await axios.delete(`/api/roles/${roleId}`);
        alert('Rol eliminado correctamente');
        this.fetchRoles();
      } catch (error) {
        console.error('Error eliminando rol:', error);
      }
    },
    permissionAssigned(permissionId) {
      return this.selectedRole && this.selectedRole.permissions && this.selectedRole.permissions.some(permission => permission.id === permissionId);
    },
    async togglePermission(permissionId) {
      const isAssigned = this.permissionAssigned(permissionId);
      const method = isAssigned ? 'delete' : 'post';
      const url = `/api/roles/${this.selectedRole.id}/permissions`;

      try {
        await axios({
          method,
          url,
          data: { permission_id: permissionId },
        });
        this.fetchPermissions(this.selectedRole.id);
      } catch (error) {
        console.error('Error toggling permission:', error);
      }
    },
    fetchChannels() {
      axios.get('/api/channels')
        .then(response => {
          this.channels = response.data;
        })
        .catch(error => {
          console.error("Error al cargar los canales:", error);
        });
    },
    createChannel() {
      if (this.newChannelName === '') {
        alert('El nombre del canal no puede estar vacío');
        return;
      }

      axios.post('/api/channels', {
        name: this.newChannelName
      }).then(response => {
        this.channels.push(response.data);
        this.newChannelName = ''; // Limpiar el campo de texto
      }).catch(error => {
        console.error("Error al crear el canal:", error);
      });
    },
    deleteChannel(channelId) {
      axios.delete(`/api/channels/${channelId}`)
        .then(response => {
          this.channels = this.channels.filter(channel => channel.id !== channelId);
        })
        .catch(error => {
          console.error("Error al borrar el canal:", error);
        });
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
