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
                    <span class="text-white ms-2 username">{{ username }}</span>
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
                <!-- <router-link to="/dashboard" class="settings-icon" style="position: absolute; top: 10px; right: 10px">
                    <i class="fas fa-cog" style="color: #e0e0e0"></i>
                </router-link> -->
            </div>

            <!-- Contenido principal -->
            <div class="flex-grow-1" style="background-color: #181818; padding: 1rem">
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
        </div>

    </div>
</template>


<script src="./components/App.js"></script>

<style>
html,
body {
    height: 100%;
    margin: 0;
    background-color: #121212;
    overflow-y: hidden;
}

#app {
    height: 100vh;
    background-color: #181818;
}

.navbar {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.navbar-logo {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    z-index: 10;
    margin-right: 1rem;
}

.navbar-time {
    font-size: 1.25rem;
}

.form-control {
    border-radius: 0.25rem;
    color: #e0e0e0;
}

.form-control::placeholder {
    color: #b0b0b0 !important;
}

.nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    color: #e0e0e0;
    text-decoration: none;
    margin-bottom: 1rem;
    transition: color 0.3s, background-color 0.3s;
}

.nav-link:hover {
    color: #ffffff;
    background-color: #2c2c2c;
    border-radius: 0.25rem;
}

.nav-link i {
    font-size: 1.5rem;
    color: #9e9e9e;
    transition: color 0.3s;
}

.nav-link:hover i {
    color: #ffffff;
}

.nav-text {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    color: #e0e0e0;
    transition: color 0.3s;
}

.nav-link:hover .nav-text {
    color: #ffffff;
}

.channels {
    height: calc(100vh - 60px);
    overflow-y: auto;
    padding: 0;
    margin: 0;
    scrollbar-width: thin;
    scrollbar-color: #2c2c2c #121212;
}

.channels::-webkit-scrollbar {
    width: 8px;
}

.channels::-webkit-scrollbar-track {
    background: #121212;
    border-radius: 10px;
}

.channels::-webkit-scrollbar-thumb {
    background-color: #2c2c2c;
    border-radius: 10px;
}

.channels::-webkit-scrollbar-thumb:hover {
    background-color: #3a3a3a;
}

.channel-section {
    margin-bottom: 1rem;
}

.section-title {
    color: #b0b0b0;
    font-size: 0.75rem;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.channel {
    margin-bottom: 0.5rem;
}

.channel-link {
    color: #e0e0e0;
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    border-radius: 0.25rem;
}

.channel-link:hover {
    background-color: #2c2c2c;
}

.channel-link i {
    margin-right: 0.5rem;
}

.settings-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1rem;
    color: #e0e0e0;
    text-decoration: none;
    transition: color 0.3s;
}

.settings-icon:hover {
    color: #ffffff;
}

.right-sidebar {
    height: calc(100vh - 60px);
    overflow-y: auto;
    padding: 0;
    margin: 0;
    scrollbar-width: thin;
    scrollbar-color: #2c2c2c #121212;
}

.right-sidebar::-webkit-scrollbar {
    width: 8px;
}

.right-sidebar::-webkit-scrollbar-track {
    background: #121212;
    border-radius: 10px;
}

.right-sidebar::-webkit-scrollbar-thumb {
    background-color: #2c2c2c;
    border-radius: 10px;
}

.right-sidebar::-webkit-scrollbar-thumb:hover {
    background-color: #3a3a3a;
}

.profile-pic {
    width: 35px;
    height: 35px;
    border-radius: 50%;
}

.username {
    margin-right: 10px;
    color: #e0e0e0;
}

.user-item {
    padding: 0.1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s;
}

.user-item:hover {
    background-color: #2c2c2c;
    cursor: pointer;
}

.small-text {
    font-size: 0.9rem;
}

.profile-container {
    position: relative;
}

.online-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background-color: #23a55a;
    border-radius: 50%;
    border: 2px solid #181818;
}

.offline-user .profile-pic {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    filter: grayscale(100%);
}

.offline-username {
    color: #6c6c6c;
}

.user-details {
    position: absolute;
    top: 10%;
    right: 200px;
    background-color: #1e1e1e;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    width: 250px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0.95;
}

.close-button {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    transition: color 0.3s ease;
}

.close-button:hover {
    color: #ff6b6b;
}

.profile-info {
    text-align: center;
    margin-bottom: 1rem;
}

.profile-pic-details {
    border-radius: 50%;
    width: 70px;
    height: 70px;
    object-fit: cover;
    border: 2px solid #fff;
}

.username-details {
    font-size: 1.25rem;
    color: #ffffff;
    margin: 0.5rem 0 0.25rem;
}

.description-details {
    color: #b3b3b3;
    font-size: 0.9rem;
    margin: 0;
}

.user-description {
    font-size: 0.9rem;
    color: #b0b0b0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
}

.text-gray {
    color: #ffffff;
}

.role-item {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    margin: 0.25rem;
    background-color: #333;
    border-radius: 0.25rem;
    color: #fff;
}

/* Ticker Tape Styles */

.ticker-tape-container {
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}

.ticker-tape {
    display: flex;
    flex-direction: row;
    animation: ticker 20s linear infinite;
}

.stock-item {
    display: flex;
    align-items: center;
    margin-right: 2rem;
}

.stock-symbol {
    font-weight: bold;
}

.stock-price {
    font-size: 1rem;
}

.stock-price.positive {
    color: #4caf50;
}

.stock-price.negative {
    color: #f44336;
}

.text-success {
    color: #00ff00;
}

.text-danger {
    color: #ff0000;
}

.text-neutral {
    color: #ffffff;
}

.badge-icon {
    margin-left: 5px;
    vertical-align: middle;
}

@keyframes ticker {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(-100%);
    }
}
</style>
