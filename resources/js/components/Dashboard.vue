<template>
  <div class="content-scroll">
    <div class="roles-permissions-container">
      <h1 class="text-white">Roles y Permisos</h1>

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
    selectedRole(newRole) {
      if (newRole) {
        this.fetchPermissions(newRole.id);
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
      const response = await axios.get('/api/roles');
      this.roles = response.data;
    },
    async fetchPermissions(roleId) {
      try {
        const response = await axios.get(`/api/roles/${roleId}/permissions`);
        this.permissions = response.data.permissions;
        this.selectedRole = response.data.role; // Verifica que response.data.role sea el objeto correcto
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

      await axios.post('/api/roles', { name: this.newRoleName });
      alert('Rol creado correctamente');
      this.newRoleName = '';
      this.fetchRoles();
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
      return this.selectedRole.permissions && this.selectedRole.permissions.some(permission => permission.id === permissionId);
    },
    async togglePermission(permissionId) {
      const isAssigned = this.permissionAssigned(permissionId);
      const method = isAssigned ? 'delete' : 'post';
      const url = `/api/roles/${this.selectedRole.id}/permissions`;

      await axios({
        method,
        url,
        data: { permission_id: permissionId },
      });

      this.fetchPermissions(this.selectedRole.id);
    }
  },
};
</script>

<style scoped>
.roles-permissions-container {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

h1,
h2 {
  color: #f0f0f0;
}

.roles-list,
.permissions-list,
.create-role {
  margin-top: 20px;
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
  border-radius: 4px;
  background-color: #333;
  color: #d1d1d1;
}

.user-role-assignment button,
.create-role button {
  padding: 10px 15px;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-role-assignment button:hover,
.create-role button:hover {
  background-color: #45a049;
}

.role-item,
.permission-item {
  padding: 12px;
  margin: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #d1d1d1;
}

.role-item:hover {
  background-color: #333333;
}

.permission-item {
  display: flex;
  align-items: center;
}

.delete-role-button {
  background-color: transparent;
  border: none;
  color: #f44336;
  /* Rojo para indicar eliminación */
  cursor: pointer;
  margin-left: 10px;
  font-size: 16px;
}

.delete-role-button:hover {
  text-decoration: underline;
}

.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
  margin-right: 10px;
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
  background-color: #777;
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #4caf50;
}

input:checked+.slider:before {
  transform: translateX(14px);
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
</style>
