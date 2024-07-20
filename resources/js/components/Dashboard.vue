<template>
  <div class="app-container">
    <div class="sidebar">
      <h2>Manejo</h2>
      <ul>
        <li><a href="#roles"><i class="icon-roles"></i> Roles</a></li>
        <li><a href="#usuarios"><i class="icon-usuarios"></i> Usuarios</a></li>
        <!-- Agrega más enlaces o elementos según sea necesario -->
      </ul>
    </div>
    <div class="main-content">
      <div class="content-scroll">
        <div class="roles-permissions-container" id="roles">
          <h1>Roles y Permisos</h1>
          <div class="user-role-assignment">
            <select v-model="selectedUser">
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.username }}
              </option>
            </select>
            <select v-model="selectedRole">
              <option v-for="role in roles" :key="role.id" :value="role">
                {{ role.name }}
              </option>
            </select>
            <button @click="assignRole">Asignar Rol</button>
          </div>
          <div class="create-role">
            <input v-model="newRoleName" placeholder="Nombre del nuevo rol" />
            <button @click="createRole">Crear Rol</button>
          </div>
          <div class="roles-list">
            <h2>Roles</h2>
            <ul>
              <li v-for="role in roles" :key="role.id" class="role-item" @click="fetchPermissions(role.id)">
                {{ role.name }}
                <button @click.stop="deleteRole(role.id)" class="delete-role-button">X</button>
              </li>
            </ul>
          </div>
          <div v-if="selectedRole" class="permissions-list">
            <h2>Permisos para {{ selectedRole.name }}</h2>
            <ul>
              <li v-for="permission in permissions" :key="permission.id" class="permission-item">
                <label class="switch">
                  <input type="checkbox" :checked="permissionAssigned(permission.id)"
                    @change="togglePermission(permission.id)" />
                  <span class="slider"></span>
                </label>
                {{ permission.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="usuarios-container" id="usuarios">
          <h1>Usuarios</h1>
          <!-- Aquí puedes agregar el contenido relacionado con los usuarios -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      roles: [],
      permissions: [],
      users: [],
      selectedUser: null,
      selectedRole: null,
      newRoleName: '',
    };
  },
  created() {
    this.fetchRoles();
    this.fetchUsers();
  },
  watch: {
    async selectedRole(newRole) {
      if (newRole && newRole.id !== (this.selectedRole && this.selectedRole.id)) {
        // Llama a fetchPermissions solo si el nuevo rol es diferente
        await this.fetchPermissions(newRole.id);
      }
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
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
    }
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background-color: #242424;
  padding: 20px;
  color: #f0f0f0;
  font-family: 'Arial', sans-serif;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  border-right: 1px solid #1e1e1e;
}

.sidebar h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  color: #f0f0f0;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar ul li a i {
  margin-right: 10px;
  font-size: 1.2rem;
}

.sidebar ul li a:hover {
  background-color: #333;
  color: #fff;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #1e1e1e;
  color: #f0f0f0;
  font-family: 'Arial', sans-serif;
  overflow-y: auto;
}

.content-scroll {
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
}

.content-scroll::-webkit-scrollbar {
  width: 8px;
}

.content-scroll::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background-color: #333;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #444;
}

.roles-permissions-container,
.usuarios-container {
  margin-bottom: 2.5rem;
}

h1,
h2 {
  color: #f0f0f0;
}

.roles-list,
.permissions-list,
.create-role,
.user-role-assignment {
  margin-top: 1.5rem;
}

.user-role-assignment,
.create-role {
  margin-bottom: 20px;
}

.user-role-assignment select,
.create-role input {
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #333;
  color: #f0f0f0;
  font-size: 1rem;
}

.user-role-assignment button,
.create-role button {
  padding: 10px 15px;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.user-role-assignment button:hover,
.create-role button:hover {
  background-color: #0056b3;
}

.roles-list ul,
.permissions-list ul {
  list-style: none;
  padding: 0;
}

.role-item,
.permission-item {
  background-color: #333;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.role-item:hover,
.permission-item:hover {
  background-color: #444;
}

.delete-role-button {
  background-color: #e74c3c;
  border: none;
  border-radius: 3px;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.delete-role-button:hover {
  background-color: #c0392b;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #007bff;
}

input:checked + .slider:before {
  transform: translateX(20px);
}
</style>
