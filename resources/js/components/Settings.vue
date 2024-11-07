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
            <label class="input-label">Nombre de Usuario:</label>
            <input type="text" id="username" v-model="username" placeholder="Escribe tu nuevo nombre de usuario..."
              class="username-input" />
            <button @click="saveUsername" class="update-button">
              Actualizar
            </button>
          </div>

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
          <div class="profile-connection">
            <h2>Añadir cuentas a tu perfil</h2>
            <p>Esta información no se compartirá fuera de Emprende Sin Humo sin tu permiso y se utilizará de acuerdo con
              la <a href="#">Política de privacidad</a> de Emprende Sin Humo.</p>
            <div class="icons">
              <div @click="connectSpotify" class="icon spotify"></div>
              <div class="icon github"></div>
              <div class="icon buymeacoffee"></div>
              <div class="icon tiktok"></div>
              <div class="icon twitter"></div>
              <div class="icon ebay"></div>
              <div class="icon xbox"></div>
              <div class="icon amazon"></div>
              <div class="icon atom"></div>
              <div class="icon destiny"></div>
              <div class="icon arrow"></div>
            </div>
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

<style scoped src="../../css/Settings.css"></style>
