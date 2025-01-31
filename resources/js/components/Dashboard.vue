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
        <li :class="{ active: activeTab === 'debug' }" @click="setActiveTab('debug')">
          Debug
        </li>
        <li @click="logout" class="custom-logout custom-red">Cerrar Sesión</li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="custom-content">
      <!-- <div class="custom-notice">
        <p>Estas en el panel general de administración de la aplicación, estos ajustes son esenciales para el correcto
          funcionamiento.</p>
      </div> -->

      <h1 class="text-white">
        {{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }}
      </h1>

      <div class="custom-content-scroll">
        <template v-if="activeTab === 'usuarios'">
          <div class="custom-user-container">
            <!-- Barra de búsqueda -->
            <div class="custom-search-bar">
              <input type="text" v-model="searchQuery" placeholder="Buscar usuarios..." class="custom-search-input" />
            </div>

            <div class="custom-user-list">
              <div v-for="user in filteredUsers" :key="user.id" class="custom-user-item"
                @click="goToUserDetails(user.id)">
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
          </div>
        </template>


        <template v-if="activeTab === 'canales'">
          <div class="channel-container">
            <h2 class="channel-title">Gestionar Canales</h2>

            <div class="create-channel">
              <input v-model="newChannelName" type="text" placeholder="Nombre del canal" class="channel-input" />
              <button @click="createChannel" class="btn-create-channel">
                <i class="fas fa-plus"></i> Crear
              </button>
            </div>

            <draggable v-model="channels" class="channel-list" @end="onChannelReorder">
              <template #item="{ element }">
                <li :key="element.id" class="channel-item">
                  <span class="channel-name">{{ element.name }}</span>
                  <button @click="deleteChannel(element.id)" class="btn-delete-channel">
                    <i class="fas fa-trash"></i>
                  </button>
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

<style scoped src="../../css/Dashboard.css"></style>