<template>
  <div class="custom-settings-container">
    <!-- Sidebar -->
    <aside class="custom-sidebar">
      <ul class="custom-menu">
        <li :class="{ active: activeTab === 'usuarios' }" @click="setActiveTab('usuarios')">
          Usuarios
        </li>
        <li :class="{ active: activeTab === 'canales' }" @click="setActiveTab('canales')">
          Canales
        </li>
        <li :class="{ active: activeTab === 'seguridad' }" @click="setActiveTab('insignias')">
          Insignias
        </li>
        <li :class="{ active: activeTab === 'permisos' }" @click="setActiveTab('permisos')">
          Permisos
        </li>
        <li :class="{ active: activeTab === 'watchdog' }" @click="setActiveTab('watchdog')">
          WatchDog
        </li>
        <li :class="{ active: activeTab === 'debug' }" @click="setActiveTab('debug')">
          Debug
        </li>
        <li @click="logout" class="custom-logout custom-red">Cerrar Sesión</li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="custom-content">
      <div class="custom-notice">
        <p>Estas en el panel general de administración de la aplicación, estos ajustes son esenciales para el correcto
          funcionamiento.</p>
      </div>

      <h1 class="text-white">
        {{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }}
      </h1>

      <div class="custom-content-scroll">
        <template v-if="activeTab === 'usuarios'">
          <div class="custom-user-list">
            <div v-for="user in users" :key="user.id" class="custom-user-item" @click="goToUserPermissions(user.id)">
              <img :src="`/storage/${user.profile_picture}`" alt="Profile Picture" class="custom-profile-picture" />
              <div class="custom-user-details">
                <h3 class="custom-username">{{ user.username }}</h3>
                <p class="custom-description">{{ user.description || 'No description available' }}</p>
                <p class="custom-creation-date">Joined: {{ formatDate(user.created_at) }}</p>
                <div class="custom-badges">
                  <span v-for="badge in user.badges" :key="badge.id" class="custom-badge">
                    {{ badge.name }}
                  </span>
                </div>
              </div>
              <div class="custom-menu-container" @click.stop="toggleMenu(user.id)">
                <span class="custom-menu-icon">⋮</span>
                <div v-if="activeMenu === user.id" class="custom-menu-dropdown">
                  <button @click="deleteUser(user.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </template>


        <template v-if="activeTab === 'canales'">
          <div class="channel-container">
            <h2>Gestionar Canales</h2>
            <div class="create-channel">
              <input v-model="newChannelName" type="text" placeholder="Nombre del canal" class="channel-input" />
              <button @click="createChannel" class="btn-create-channel">Crear Canal</button>
            </div>

            <draggable v-model="channels" class="channel-list" @end="onChannelReorder">
              <template #item="{ element }">
                <li :key="element.id" class="channel-item">
                  <span>{{ element.name }}</span>
                  <button @click="deleteChannel(element.id)" class="btn-delete-channel">Borrar</button>
                </li>
              </template>
            </draggable>


          </div>
        </template>

        <template v-if="activeTab === 'debug'">
          <div class="debug-info">
            <p><strong>Token de autorización:</strong> {{ authToken }}</p>
            <p><strong>Token de autorización (Spotify):</strong> {{ spotifyToken }}</p>
            <p><strong>Estado de la sesión:</strong> {{ sessionStatus }}</p>
          </div>
        </template>

        <template v-if="activeTab === 'watchdog'">
          <div class="watchdog-container">
            <h3 class="title">Gestión de palabras prohibidas</h3>
            <form @submit.prevent="addForbiddenWord" class="watchdog-form">
              <input v-model="newWord" class="input-word" placeholder="Nueva palabra" required />
              <button type="submit" class="btn-add">Agregar</button>
            </form>
            <ul class="word-list">
              <li v-for="(word, index) in forbiddenWords" :key="index" class="word-item">
                {{ word }}
                <button @click="removeForbiddenWord(word)" class="btn-remove">
                  Eliminar
                </button>
              </li>
            </ul>
          </div>
        </template>

        <template v-if="activeTab === 'permisos'">
          <div>
            <h1>Gestión de Permisos</h1>

            <form @submit.prevent="createPermission">
              <div>
                <label for="permissionName">Nombre del Permiso:</label>
                <input type="text" id="permissionName" v-model="newPermission.name" required />
              </div>

              <div>
                <label for="permissionDescription">Descripción:</label>
                <textarea id="permissionDescription" v-model="newPermission.description" rows="3" required></textarea>
              </div>

              <button type="submit">Crear Permiso</button>
            </form>

            <div v-if="permissions.length">
              <h2>Lista de Permisos:</h2>
              <ul>
                <li v-for="permission in permissions" :key="permission.id">
                  <strong>{{ permission.name }}</strong> - {{ permission.description }}
                  <button @click="deletePermission(permission.id)">Eliminar</button>
                </li>
              </ul>
            </div>
          </div>
        </template>

        <template v-if="activeTab === 'insignias'">
          <div class="insignias-container">
            <form @submit.prevent="createBadge" class="insignias-form">
              <label for="badgeName">Nombre de la insignia</label>
              <input v-model="badge.name" id="badgeName" placeholder="Nombre de la insignia" required />
              <label for="badgeIcon">Icono de la insignia</label>
              <input type="file" @change="onFileChange" id="badgeIcon" required />
              <button type="submit">Crear Insignia</button>
            </form>

            <div class="insignias-assign">
              <label for="selectUser">Seleccionar Usuario</label>
              <select v-model="selectedUser" id="selectUser">
                <option v-for="user in users" :value="user.id" :key="user.id">{{ user.username }}</option>
              </select>
              <label for="selectBadge">Seleccionar Insignia</label>
              <select v-model="selectedBadge" id="selectBadge">
                <option v-for="badge in badges" :value="badge.id" :key="badge.id">{{ badge.name }}</option>
              </select>
              <button @click="assignBadge">Asignar Insignia</button>
            </div>
          </div>
        </template>


      </div>
    </div>
  </div>
</template>

<script src="./Dashboard.js"></script>

<style scoped>
.custom-settings-container {
  display: flex;
  min-height: 100vh;
  background-color: #23272a;
}

.custom-sidebar {
  width: 250px;
  background-color: #121212;
  padding: 20px;
}

.custom-menu {
  list-style-type: none;
  padding: 0;
}

.custom-menu li {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #2f3136;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.custom-menu li:hover,
.custom-menu li.active {
  background-color: #3a3f47;
}

.custom-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #1e1e1e;
}

.custom-input-container,
.custom-description-container {
  margin-bottom: 20px;
  width: 100%;
}

.custom-input-label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

.custom-file-input,
.custom-description-input {
  margin-bottom: 10px;
  width: 100%;
  border: 2px solid #444;
  border-radius: 5px;
  padding: 10px;
  background-color: #222;
  color: #fff;
  font-size: 16px;
  transition: border-color 0.3s;
}

.custom-upload-button,
.custom-update-button {
  padding: 10px 20px;
  background-color: #444;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.custom-upload-button:hover,
.custom-update-button:hover {
  background-color: #5a5a5a;
  transform: translateY(-2px);
}

.custom-upload-message {
  margin-top: 10px;
  color: #fff;
}

.custom-red {
  color: red;
}

.custom-logout {
  cursor: pointer;
}

.custom-logout.custom-red:hover {
  text-decoration: underline;
}

.custom-content-scroll {
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 5px;
  background-color: #2f3136;
  padding: 15px;
}

.custom-content-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-content-scroll::-webkit-scrollbar-track {
  background: #23272a;
  border-radius: 10px;
}

.custom-content-scroll::-webkit-scrollbar-thumb {
  background-color: #99aab5;
  border-radius: 10px;
}

.custom-content-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #7289da;
}

.custom-user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.custom-user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #2c2c2c;
  color: #f0f0f0;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.custom-user-item:hover {
  background-color: #3c3c3c;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.custom-profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
  border: 2px solid #666;
  object-fit: cover;
}

.custom-user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.custom-username {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #e0e0e0;
}

.custom-description {
  margin: 0.5rem 0 0;
  color: #b0b0b0;
}

.custom-creation-date {
  margin: 0.5rem 0 0;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.custom-menu-container {
  position: relative;
  cursor: pointer;
}

.custom-menu-icon {
  font-size: 1.5rem;
  color: #e0e0e0;
}

.custom-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #3c3c3c;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}

.custom-menu-dropdown button {
  padding: 0.5rem 1rem;
  width: 100%;
  border: none;
  background: none;
  color: #fff;
  cursor: pointer;
  text-align: left;
}

.custom-menu-dropdown button:hover {
  background-color: #4c4c4c;
}

.custom-notice {
  background-color: #333;
  color: #ffffff;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 14px;
  border-left: 4px solid #2196f3;
}

.channel-container {
  padding: 20px;
  background-color: #2c2c2c;
  border-radius: 8px;
  width: 400px;
  margin: 0 auto;
  color: white;
}

h2 {
  color: #ffffff;
  text-align: center;
}

.create-channel {
  display: flex;
  margin-bottom: 20px;
}

.channel-input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 16px;
}

.btn-create-channel {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-create-channel:hover {
  background-color: #45a049;
}

.channel-list {
  list-style-type: none;
  padding: 0;
}

.channel-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #3e3e3e;
  border-radius: 4px;
  margin-bottom: 10px;
  align-items: center;
}

.btn-delete-channel {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete-channel:hover {
  background-color: #e53935;
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

input:checked+.slider {
  background-color: #007bff;
}

input:checked+.slider:before {
  transform: translateX(20px);
}

.insignias-container {
  background-color: #1f1f1f;
  color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  max-width: 600px;
  margin: 0 auto;
}

.insignias-header {
  margin-bottom: 20px;
}

.insignias-header h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  border-bottom: 2px solid #444;
  padding-bottom: 5px;
  color: #e5e5e5;
}

.insignias-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.insignias-form label {
  font-size: 1rem;
  color: #b5b5b5;
}

.insignias-form input {
  padding: 12px;
  background-color: #2d2d2d;
  border: 1px solid #3e3e3e;
  border-radius: 5px;
  color: #ffffff;
}

.insignias-form input::placeholder {
  color: #a5a5a5;
}

.insignias-form button {
  background-color: #3a8f47;
  color: #ffffff;
  padding: 12px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.insignias-form button:hover {
  background-color: #349140;
}

.insignias-assign {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.insignias-assign label {
  font-size: 1rem;
  color: #b5b5b5;
}

.insignias-assign select {
  padding: 12px;
  background-color: #2d2d2d;
  border: 1px solid #3e3e3e;
  border-radius: 5px;
  color: #ffffff;
}

.insignias-assign button {
  background-color: #1d78e2;
  color: #ffffff;
  padding: 12px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.insignias-assign button:hover {
  background-color: #1569c7;
}

.insignias-list {
  margin-top: 20px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #2a2a2a;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: transform 0.2s ease;
}

.badge-item:hover {
  transform: translateY(-3px);
}

.badge-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #4caf50;
}

.badge-item span {
  font-size: 1.2rem;
  color: #e0e0e0;
}

/* Responsividad */
@media (max-width: 768px) {
  .insignias-container {
    padding: 20px;
  }

  .insignias-header h2 {
    font-size: 1.5rem;
  }

  .insignias-form input,
  .insignias-assign select {
    font-size: 0.95rem;
  }

  .badge-item img {
    width: 40px;
    height: 40px;
  }

  .insignias-form button,
  .insignias-assign button {
    font-size: 1rem;
  }
}

.channel-container {
  padding: 20px;
}

.channel-input {
  margin-right: 10px;
}

.btn-create-channel,
.btn-delete-channel {
  cursor: pointer;
}

.channel-list {
  list-style: none;
  padding: 0;
}

.channel-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.debug-info {
  background-color: #282c34;
  color: #ffffff;
  padding: 20px;
  border-radius: 5px;
}

form {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.watchdog-container {
  background-color: #1e1e1e;
  padding: 1.5rem;
  border-radius: 8px;
  color: #fff;
  max-width: 500px;
  margin: 0 auto;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f5f5f5;
}

.watchdog-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.input-word {
  flex-grow: 1;
  padding: 0.5rem;
  background-color: #333;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 1rem;
}

.input-word::placeholder {
  color: #bbb;
}

.btn-add {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #45a049;
}

.word-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #292929;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.btn-remove {
  padding: 0.25rem 0.75rem;
  background-color: #e74c3c;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-remove:hover {
  background-color: #c0392b;
}
</style>