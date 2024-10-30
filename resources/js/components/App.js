import Settings from "../components/Settings.vue";
// import { ref, onMounted } from "vue";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
});

let inactivityTimeout;

export default {
    name: "App",
    components: { Settings },
    props: {
        badge: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            imageSrc: "/images/esh.jpg",
            username: localStorage.getItem("username") || "",
            profilePicture: "",
            users: [],
            channels: [],
            userBadges: [],
            offlineUsers: [],
            showReportModal: false,
            badges: [],
            selectedUser: null,
            currentTime: "",
            xp: 0,
            user: {
                username: localStorage.getItem("username") || "",
            }
        };
    },
    computed: {
        onlineUsersCount() {
            return this.users.filter(user => user.is_online).length;
        },
        offlineUsersCount() {
            return this.offlineUsers.length;
        },

        isKeyder() {
            const allowedUsers = ['keyder', 'anotherUser', 'thirdUser'];
            return this.user && allowedUsers.includes(this.user.username);
        }
    },

    mounted() {
        this.loadProfilePicture();
        this.updateTime();
        this.updateOnlineStatus(true);
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
        window.addEventListener("beforeunload", this.handleBeforeUnload);
        window.addEventListener("unload", () => this.updateOnlineStatus(false));
        window.addEventListener("mousemove", this.resetInactivityTimeout);
        window.addEventListener("keydown", this.resetInactivityTimeout);
        this.startInactivityTimeout();
        setInterval(this.updateTime, 1000);
        this.loadUsers();
        this.loadChannels();

        window.Echo.channel("user-status").listen("UserStatusChanged", (event) => {
            this.handleUserStatusChange(event);
        });
    },
    created() {
        this.loadChannels();
    },

    beforeDestroy() {
        clearTimeout(inactivityTimeout);
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
        window.removeEventListener("mousemove", this.resetInactivityTimeout);
        window.removeEventListener("keydown", this.resetInactivityTimeout);
    },
    methods: {
        async loadUsers() {
            try {
                const response = await axios.get("/api/users");
                console.log(response.data);

                this.users = response.data
                    .filter((user) => user.is_online)
                    .map((user) => ({
                        ...user,
                        xp: user.xp || 0,
                    }));
                this.offlineUsers = response.data
                    .filter((user) => !user.is_online)
                    .map((user) => ({
                        ...user,
                        xp: user.xp || 0,
                    }));

                const currentUser = response.data.find(user => user.username === this.username);
                if (currentUser) {
                    this.xp = currentUser.xp;
                }
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        },
        buildBadgeUrl(badgeIcon) {
            const url = `${window.appUrl}/storage/badges/${badgeIcon}`;
            console.log("Generated Badge URL:", url);
            return url;
        },
        reportUser() {
            this.showReportModal = true;
        },
        closeModal() {
            this.showReportModal = false;
        },
        submitReport() {
            // Lógica para manejar el reporte
            alert(`Usuario ${this.selectedUser.username} ha sido reportado.`);
            this.closeModal();
        },
        async loadChannels() {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch('/api/channels', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                const data = await response.json();
                console.log(data);
                this.channels = data.sort((a, b) => a.order - b.order);
            } catch (error) {
                console.error('Error loading channels:', error);
            }
        },


        formatDate(dateString) {
            if (!dateString) {
                return 'Fecha no disponible';
            }

            const cleanedDateString = dateString.trim();

            const date = new Date(cleanedDateString);


            if (isNaN(date.getTime())) {
                return 'Fecha no válida';
            }

            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('es-ES', options);
        },
        buildProfilePictureUrl(picture) {
            const url = picture ?
                `${window.appUrl}/storage/${picture}` :
                "/path/to/default/profile_picture.jpg";
            return url;
        },
        fetchUserBadges(userId) {
            axios.get(`/api/user/${userId}/badges`)
                .then(response => {
                    console.log("Badges fetched:", response.data);
                    if (response.data && response.data.badges) {
                        this.userBadges = response.data.badges.map(badge => {
                            return {
                                ...badge,
                                icon: badge.icon.trim()
                            };
                        });
                        console.log("User badges:", this.userBadges);
                    } else {
                        console.error("No badges found in the response");
                    }
                })
                .catch(error => {
                    console.error("Error fetching badges:", error);
                });
        },



        handleUserStatusChange(event) {
            if (!event ||
                typeof event.id === "undefined" ||
                typeof event.is_online === "undefined"
            ) {
                console.error("Invalid event data:", event);
                return;
            }

            const onlineUserIndex = this.users.findIndex((user) => user.id === event.id);
            const offlineUserIndex = this.offlineUsers.findIndex(
                (user) => user.id === event.id
            );

            if (event.is_online) {
                if (offlineUserIndex !== -1) {
                    this.offlineUsers.splice(offlineUserIndex, 1);
                }

                if (onlineUserIndex === -1) {
                    this.users.push(event);
                } else {
                    this.users[onlineUserIndex] = { ...this.users[onlineUserIndex], ...event };
                }
            } else {
                if (onlineUserIndex !== -1) {
                    this.users.splice(onlineUserIndex, 1);
                }

                if (offlineUserIndex === -1) {
                    this.offlineUsers.push(event);
                } else {
                    this.offlineUsers[offlineUserIndex] = {
                        ...this.offlineUsers[offlineUserIndex],
                        ...event,
                    };
                }
            }
        },

        showUserDetails(user) {
            console.log(user);
        },
        resetInactivityTimeout() {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                this.updateOnlineStatus(false);
            }, 300000);
        },
        startInactivityTimeout() {
            this.resetInactivityTimeout();
        },
        loadProfilePicture() {
            const picture = localStorage.getItem("profile_picture");
            this.profilePicture = this.buildProfilePictureUrl(picture);
        },
        updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            this.currentTime = `${hours}:${minutes}`;
        },
        handleVisibilityChange() {
            if (document.visibilityState === "visible") {
                this.updateOnlineStatus(true);
            } else {
                this.updateOnlineStatus(false);
            }
        },
        handleBeforeUnload(event) {
            this.updateOnlineStatus(false);
            event.returnValue = "";
        },
        updateOnlineStatus(isOnline) {
            const authToken = localStorage.getItem("auth_token");
            axios
                .post(
                    "/api/update-online-status", { is_online: isOnline }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
                )
                .catch((error) => {
                    console.error(
                        "Error updating online status",
                        error.response ? error.response.data : error
                    );
                });
        },
        async selectUser(userId) {
            try {
                const response = await axios.get(`/api/user/${userId}/badges`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });


                console.log("Fetched user badges:", response.data);

                this.selectedUser = response.data;
                this.userBadges = response.data.badges || [];
            } catch (error) {
                console.error("Error fetching user badges:", error);
            }
        },
        showUserDetails(user) {
            this.selectedUser = user;
            console.log("Selected User:", this.selectedUser);
        },
        closeUserDetails() {
            this.selectedUser = null;
        },
    },
    watch: {
        selectedUser(newUser) {
            if (newUser) {
                this.fetchUserBadges(newUser.id);
            }
        },
    },
};

const auth_token = localStorage.getItem("auth_token");
axios.defaults.headers.common["Authorization"] = `Bearer ${auth_token}`;