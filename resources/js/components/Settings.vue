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
          <div class="profile-container">
        <div class="profile-header">
          <img v-if="user && user.profile_picture" :src="buildProfilePictureUrl(user.profile_picture)" alt="Profile" class="profile-pic" />
          <div class="profile-info">
                <h2 class="username">keyder</h2>
                <!-- <div class="profile-icons">
                    <span class="icon verified-icon"></span>
                    <span class="icon badge-icon"></span>
                    <span class="icon gear-icon"></span>
                </div> -->
            </div>
        </div>
        <div class="profile-details">
            <div class="detail-row">
                <span class="detail-title">NOMBRE DE USUARIO</span>
                <span class="detail-value">keyder</span>
                <button class="edit-button">Editar</button>
            </div>
            <div class="detail-row">
                <span class="detail-title">DESCRIPCION</span>
                <span class="detail-value">keyderr</span>
                <button class="edit-button">Editar</button>
            </div>
            <div class="detail-row">
                <span class="detail-title">CORREO ELECTRÓNICO</span>
                <span class="detail-value">**************@gmail.com</span>
                <button class="edit-button">Editar</button>
            </div>
            <div class="detail-row">
                <span class="detail-title">NÚMERO DE TELÉFONO</span>
                <span class="detail-value">*******9163</span>
                <button class="edit-button">Editar</button>
            </div>
        </div>
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
