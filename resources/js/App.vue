<template>
    <div id="app" class="d-flex flex-column" style="height: 100vh">
        <!-- Navbar -->
        <nav class="navbar navbar-expand"
            style="background-color: #121212;padding: 0.5rem 1rem;border-bottom: 1px solid #1e1e1e;">
            <div class="container-fluid d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img :src="imageSrc" alt="Logo" class="navbar-logo" />
                    <form class="d-flex" role="search"
                        style="background-color: #1e1e1e;border-radius: 0.25rem;padding: 0.25rem;margin-left: 2rem;">
                        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar"
                            style="max-width: 200px;background-color: #1e1e1e;border: none;color: #e0e0e0;" />
                    </form>
                </div>
                <div class="navbar-brand mx-auto text-white"
                    style="position: absolute; left: 50%; transform: translateX(-50%)">
                    {{ currentTime }}
                </div>
                <div class="navbar-nav d-flex align-items-center">
                    <!-- <span class="text-white ms-2 xp" style="margin-right: 1.5rem;">
                        {{ xp }} <span class="xp-label">XP</span>
                    </span> -->
                    <i style="color: #9e9e9e;margin-right:1.5rem;" class="fa-solid fa-bell"></i>
                    <span class="text-white username">{{ username }}</span>
                    <img :src="profilePicture" alt="Profile" class="profile-pic" v-if="profilePicture" />
                </div>
            </div>
        </nav>

        <div class="d-flex flex-grow-1">
            <!-- Sidebar -->
            <nav class="text-white d-flex flex-column"
                style="background-color: #121212;width: 60px;padding: 0.5rem;border-right: 1px solid #1e1e1e;">
                <div class="d-flex flex-column align-items-center flex-grow-1" style="margin-top: 1rem">
                    <router-link to="/" class="nav-link text-white d-flex flex-column align-items-center">
                        <i class="fas fa-home"></i>
                        <span class="nav-text">Inicio</span>
                    </router-link>
                    <router-link to="/libreria" class="nav-link text-white d-flex flex-column align-items-center">
                        <i class="fas fa-book"></i>
                        <span class="nav-text">Libreria</span>
                    </router-link>
                </div>
                <div class="d-flex flex-column align-items-center">
                    <router-link to="/settings" class="nav-link text-white d-flex flex-column align-items-center">
                        <i class="fas fa-cog"></i>
                        <span class="nav-text">Ajustes</span>
                    </router-link>
                </div>
            </nav>

            <!-- Sidebar de canales -->
            <div class="channels"
                style="background-color: #1e1e1e;width: 230px;display: flex;flex-direction: column;padding: 1rem;border-right: 1px solid #1e1e1e;position: relative;">
                <div class="channel" v-for="channel in channels" :key="channel.id">
                    <router-link :to="{ name: 'channel', params: { id: channel.id } }" class="channel-link">
                        <i class="fa-solid fa-hashtag"></i> {{ channel.name }}
                    </router-link>
                </div>
                <router-link v-if="isKeyder" to="/dashboard" class="settings-icon"
                    style="position: absolute; top: 10px; right: 10px">
                    <i class="fas fa-cog" style="color: #e0e0e0"></i>
                </router-link>

            </div>

            <!-- Contenido principal -->
            <div class="flex-grow-1" style="background-color: #181818; padding: 1rem">
                <div class="custom-notice">
                    <p>Esh-App se encuentra en fase beta. Algunas funcionalidades podrian no estar disponibles.
                    </p>
                </div>
                <div v-if="showReportModal" class="modal-overlay" @click.self="closeModal">
                    <div class="modal-content">
                        <h3>Reportar Usuario</h3>
                        <p>¿Estás seguro de que deseas reportar a {{ selectedUser.username }}?</p>
                        <button @click="submitReport" class="confirm-button">Confirmar</button>
                        <button @click="closeModal" class="cancel-button">Cancelar</button>
                    </div>
                </div>
                <router-view></router-view>
            </div>

            <div class="right-sidebar"
                style="background-color: #1e1e1e;width: 200px;display: flex;flex-direction: column;padding: 1rem;border-left: 1px solid #1e1e1e;">
                <h6 class="text-white small-text">En Línea - {{ onlineUsersCount }}</h6>
                <div v-for="user in users" :key="user.id" class="user-item d-flex flex-column mb-2 online-user"
                    @click="showUserDetails(user)">
                    <div class="d-flex align-items-center">
                        <div class="profile-container">
                            <img :src="buildProfilePictureUrl(user.profile_picture)" alt="Profile"
                                class="profile-pic" />
                            <div class="online-indicator"></div>
                        </div>
                        <div class="d-flex flex-column ms-2">
                            <span class="username text-white">{{ user.username }}</span>
                            <span class="user-description text-truncate" v-if="user.description">{{
                                user.description }}</span>
                        </div>
                    </div>
                </div>

                <h6 class="text-white mt-4 small-text">Desconectados - {{ offlineUsersCount }}</h6>
                <div v-for="user in offlineUsers" :key="user.id" class="user-item d-flex flex-column mb-2 offline-user"
                    @click="showUserDetails(user)">
                    <div class="d-flex align-items-center">
                        <img :src="buildProfilePictureUrl(user.profile_picture)" alt="Profile" class="profile-pic" />
                        <span class="username offline-username ms-2">{{ user.username }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="selectedUser" class="user-details">
            <button @click="closeUserDetails" class="close-button"
                aria-label="Cerrar detalles del usuario">&times;</button>
            <div class="profile-info-details">
                <img :src="buildProfilePictureUrl(selectedUser.profile_picture)" alt="Profile Picture"
                    class="profile-pic" />

                <h5 class="username">
                    {{ selectedUser.username }}
                    <span v-if="userBadges.length > 0">
                        <img v-for="badge in userBadges" :key="badge.id"
                            :src="`https://esh-app.ddns.net/storage/${badge.icon}`.trim()" :alt="badge.name" width="20"
                            height="20" class="badge-icon" @load="console.log(`Loaded badge icon: ${badge.icon}`)"
                            @error="console.error(`Error loading badge icon: ${badge.icon}`); console.log('Error loading URL:', `https://esh-app.ddns.net/storage/${badge.icon}`)" />
                    </span>
                </h5>

                <p class="account-created-date" style="font-size: 0.8rem; color: gray; margin-top: 5px;">
                    Miembro desde: {{ formatDate(selectedUser.created_at) }}
                </p>
                <p class="description-details" v-if="selectedUser.description">{{ selectedUser.description }}</p>

                <div v-if="selectedUser.currentSong" class="current-song">
                    <h6>Escuchando ahora:</h6>
                    <p><strong>Título:</strong> {{ selectedUser.currentSong.title }}</p>
                    <p><strong>Artista:</strong> {{ selectedUser.currentSong.artist }}</p>
                    <p><strong>Álbum:</strong> {{ selectedUser.currentSong.album }}</p>
                    <img :src="selectedUser.currentSong.albumArtUrl" alt="Album Art" />
                </div>
            </div>

            <button @click="reportUser" class="report-button" aria-label="Reportar usuario">
                <i class="fa-solid fa-flag"></i> Reportar
            </button>
        </div>

    </div>
</template>


<script src="./components/App.js"></script>
<style src="../css/App.css"></style>
