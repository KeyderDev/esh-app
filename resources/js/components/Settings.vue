<template>
  <div class="settings-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <ul class="menu">
        <li :class="{ active: activeTab === 'cuenta' }" @click="setActiveTab('cuenta')">Cuenta</li>
        <li :class="{ active: activeTab === 'conexiones' }" @click="setActiveTab('conexiones')">Conexiones</li>
        <li :class="{ active: activeTab === 'apariencia' }" @click="setActiveTab('apariencia')">Apariencia</li>
        <li :class="{ active: activeTab === 'accesibilidad' }" @click="setActiveTab('accesibilidad')">Accesibilidad</li>
        <li @click="logout" class="logout red">Cerrar Sesión</li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="content">
      <h1 class="text-white">
        {{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }}
      </h1>
      <div class="content-scroll">
        <template v-if="activeTab === 'cuenta'">
          <div class="input-container">
            <label for="profile-upload" class="input-label">Foto de perfil:</label>
            <input type="file" id="profile-upload" @change="onFileChange" accept="image/*" class="file-input" />
            <button @click="upload" :disabled="isUploading" class="upload-button">
              <span v-if="isUploading">Subiendo...</span>
              <span v-else>Subir Foto de Perfil</span>
            </button>
            <p v-if="uploadMessage" class="upload-message">{{ uploadMessage }}</p>
          </div>

          <div class="description-container">
            <label for="description" class="input-label">Descripción:</label>
            <textarea id="description" v-model="description" placeholder="Escribe tu descripción aquí..."
              class="description-input"></textarea>
            <button @click="saveDescription" class="update-button">
              {{ description ? "Actualizar Descripción" : "Agregar Descripción" }}
            </button>
          </div>
        </template>

        <template v-if="activeTab === 'conexiones'">
          <div class="connections-container">
            <button @click="connectSpotify" class="spotify-connect-button">Conectar Spotify</button>
          </div>
        </template>
        <template v-if="activeTab === 'apariencia'">
          <div class="option-container">
            <div class="option-header">
              <h3>Fondo ESH</h3>
              <div class="toggle-switch">
                <input type="checkbox" id="option-toggle">
                <label for="option-toggle" class="toggle-label"></label>
              </div>
            </div>
            <p>Esta opcion hace que la app tenga un estilo transparente, con el fondo de Emprende Sin Humo.</p>
          </div>
          <div class="option-container">
            <div class="option-header">
              <h3>Mostrar Hora</h3>
              <div class="toggle-switch">
                <input type="checkbox" id="option-toggle">
                <label for="option-toggle" class="toggle-label"></label>
              </div>
            </div>
            <p>Muestra la hora actual en la sidebar superior.</p>
          </div>
        </template>

        <template v-if="activeTab === 'accesibilidad'">
        </template>

      </div>
    </div>
  </div>
</template>

<script src="./Settings.js"></script>

<style scoped>
.settings-container {
  display: flex;
  min-height: 100vh;
  background-color: #23272a;
}

.sidebar {
  width: 250px;
  background-color: #121212;
  padding: 20px;
}

.menu {
  list-style-type: none;
  padding: 0;
}

.menu li {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #2f3136;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.menu li:hover,
.menu li.active {
  background-color: #3a3f47;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #1e1e1e;
}

.input-container,
.description-container {
  margin-bottom: 20px;
  width: 100%;
}

.input-label {
  margin-bottom: 5px;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}

.file-input,
.description-input {
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

.upload-button,
.update-button {
  padding: 10px 20px;
  background-color: #444;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.upload-button:hover,
.update-button:hover {
  background-color: #5a5a5a;
  transform: translateY(-2px);
}

.upload-message {
  margin-top: 10px;
  color: #fff;
}

.red {
  color: red;
}

.logout {
  cursor: pointer;
}

.logout.red:hover {
  text-decoration: underline;
}

.content-scroll {
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 5px;
  background-color: #2f3136;
  padding: 15px;
}

.content-scroll::-webkit-scrollbar {
  width: 8px;
}

.content-scroll::-webkit-scrollbar-track {
  background: #23272a;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background-color: #99aab5;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #7289da;
}

.option-container {
  background-color: #2b2d31;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  color: #e3e5e8;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

h3 {
  font-size: 1rem;
  margin: 0;
}

p {
  font-size: 0.875rem;
  margin: 0;
}

.toggle-switch {
  position: relative;
}

.toggle-switch input {
  display: none;
}

.toggle-label {
  width: 30px;
  height: 16px;
  background-color: #d3d3d3;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-label::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: #fff;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.3s ease;
}

input:checked+.toggle-label {
  background-color: #4caf50;
}

input:checked+.toggle-label::before {
  transform: translateX(14px);
}

a {
  color: #00b0f4;
  font-size: 0.875rem;
}

.spotify-connect-button {
  background-color: #1DB954;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.spotify-connect-button:hover {
  background-color: #1aa34a;
}
</style>
