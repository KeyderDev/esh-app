import Settings from "../components/Settings.vue"; 
import { ref, onMounted } from "vue";
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
            desiredSymbols: ["AAPL", "GOOGL", "MSFT", "PLTR"],
            stockPrices: [],
            offlineUsers: [],
            badges: [],
            selectedUser: null,
            currentTime: "",
        };
    },
    computed: {
        onlineUsersCount() {
            return this.users.filter(user => user.is_online).length;
        },
        offlineUsersCount() {
            return this.offlineUsers.length;
        },
    },

    mounted() {
        this.loadProfilePicture();
        this.updateTime();
        this.updateOnlineStatus(true);
        this.fetchStockPrices();
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
        window.addEventListener("beforeunload", this.handleBeforeUnload);
        window.addEventListener("unload", () => this.updateOnlineStatus(false));
        window.addEventListener("mousemove", this.resetInactivityTimeout);
        window.addEventListener("keydown", this.resetInactivityTimeout);
        this.startInactivityTimeout();
        this.fetchOnlineUsers();
        this.fetchOfflineUsers();
        setInterval(this.updateTime, 1000);
        this.loadUsers();
        this.loadChannels();

        window.Echo.channel("user-status").listen("UserStatusChanged", (event) => {
            console.log("Event received:", event);
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
                this.users = response.data.filter((user) => user.is_online);
                this.offlineUsers = response.data.filter((user) => !user.is_online);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        },
        buildBadgeUrl(badgeIcon) {
            const url = `http://192.168.0.10:90/storage/badges/${badgeIcon}`;
            console.log("Generated Badge URL:", url); 
            return url;
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
              this.channels = data; 
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
        updateSymbols(newSymbols) {
            this.desiredSymbols = newSymbols;
            this.fetchStockPrices();
        },
        getStockChangeClass(changePercent) {
            if (changePercent > 0) {
                return "text-success"; 
            } else if (changePercent < 0) {
                return "text-danger"; 
            } else {
                return "text-neutral"; 
            }
        },
        async fetchStockPrices() {
            try {
                const response = await axios.get(
                    "https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2024-09-17", {
                    headers: {
                        Authorization: "Bearer lUB79pJEZzFhNeoeRpFnsssVuArIHZJV", 
                    },
                }
                );

                this.stockPrices = response.data.results
                    .filter((stock) => this.desiredSymbols.includes(stock.T))
                    .map((stock) => {
                        const changePercent = ((stock.c - stock.h) / stock.h) * 100;
                        return {
                            symbol: stock.T,
                            changePercent: changePercent.toFixed(2),
                        };
                    });
            } catch (error) {
                console.error("Error fetching stock prices:", error);
            }
        },
        buildProfilePictureUrl(picture) {
            const url = picture ?
                `http://192.168.0.10:90/storage/${picture}` :
                "/path/to/default/profile_picture.jpg";
            console.log("Profile picture URL:", url); 
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

            console.log("Event received in handleUserStatusChange:", event);

            const onlineUserIndex = this.users.findIndex((user) => user.id === event.id);
            const offlineUserIndex = this.offlineUsers.findIndex(
                (user) => user.id === event.id
            );

            if (event.is_online) {
                if (offlineUserIndex !== -1) {
                    console.log(
                        "Removing user from offlineUsers:",
                        this.offlineUsers[offlineUserIndex]
                    );
                    this.offlineUsers.splice(offlineUserIndex, 1);
                }

                if (onlineUserIndex === -1) {
                    console.log("Adding user to onlineUsers:", event);
                    this.users.push(event);
                } else {
                    console.log("Updating user in onlineUsers:", event);
                    this.users[onlineUserIndex] = { ...this.users[onlineUserIndex], ...event };
                }
            } else {
                if (onlineUserIndex !== -1) {
                    console.log("Removing user from onlineUsers:", this.users[onlineUserIndex]);
                    this.users.splice(onlineUserIndex, 1);
                }

                if (offlineUserIndex === -1) {
                    console.log("Adding user to offlineUsers:", event);
                    this.offlineUsers.push(event);
                } else {
                    console.log("Updating user in offlineUsers:", event);
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
            console.log("Visibility changed:", document.visibilityState);
            if (document.visibilityState === "visible") {
                this.updateOnlineStatus(true);
            } else {
                console.log("User going offline");
                this.updateOnlineStatus(false);
            }
        },
        handleBeforeUnload(event) {
            this.updateOnlineStatus(false);
            event.returnValue = "";
        },
        updateOnlineStatus(isOnline) {
            console.log("Updating online status to:", isOnline);
            const authToken = localStorage.getItem("auth_token");
            axios
                .post(
                    "/api/update-online-status", { is_online: isOnline }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
                )
                .then((response) => {
                    console.log("Online status updated", response.data);
                })
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
        
        fetchOnlineUsers() {
            const authToken = localStorage.getItem("auth_token");
            axios
                .get("/api/users/online", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        this.users = response.data.map((user) => {
                            console.log("User description:", user.description);
                            return {
                                ...user,
                                profile_picture: this.buildProfilePictureUrl(user.profile_picture),
                            };
                        });
                    }
                })
                .catch((error) => {
                    console.error(
                        "Error fetching online users",
                        error.response ? error.response.data : error
                    );
                });
        },
        fetchOfflineUsers() {
            const authToken = localStorage.getItem("auth_token");
            axios
                .get("/api/users/offline", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then((response) => {
                    this.offlineUsers = response.data.map((user) => ({
                        ...user,
                        profile_picture: this.buildProfilePictureUrl(user.profile_picture),
                    }));
                })
                .catch((error) => {
                    console.error(
                        "Error fetching offline users",
                        error.response ? error.response.data : error
                    );
                });
        },
        getStockPriceClass(price) {
            return price > 0 ? "text-success" : "text-danger";
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