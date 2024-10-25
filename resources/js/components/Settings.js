import axios from "axios";
export default {
  data() {
    return {
      profilePicture: null,
      isUploading: false,
      uploadMessage: "",
      description: "",
      username: '', 
      authToken: localStorage.getItem("auth_token"),
      activeTab: "cuenta", // Default
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const response = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${this.authToken}` },
        });
        this.description = response.data.description || "";
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async saveUsername() {
      try {
        const response = await axios.post('/api/user/username', { username: this.username });
        console.log('Nombre de usuario actualizado:', response.data);
      } catch (error) {
        console.error('Error al actualizar el nombre de usuario:', error);
      }
      window.location.reload();
    },
    closeUserDetails() {
      this.selectedUser = null;
      this.currentSong = null;
    },
    async fetchCurrentSong() {
      try {
        const response = await fetch('/spotify/current-song');
        if (response.ok) {
          this.currentSong = await response.json();
        } else {
          console.error('Error al obtener la canción actual');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },
    async fetchUserDetails() {
      await this.fetchCurrentSong();
    },

    connectSpotify() {
      window.location.href = "/auth/spotify";
    },
    logout() {
      console.log("click");
      axios.post('/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
        .then(response => {
          console.log('Logout successful:', response.data);
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        })
        .catch(error => {
          console.error('Logout error:', error);
        });
    },

    updateSymbols() {
      const newSymbols = this.desiredSymbolsInput
        .split(",")
        .map((symbol) => symbol.trim());
      this.$emit("update-symbols", newSymbols);
    },
    onFileChange(event) {
      this.profilePicture = event.target.files[0];
      if (this.profilePicture && this.profilePicture.size > 2 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Debe ser menor a 2MB.");
        this.profilePicture = null;
      }
    },
    async upload() {
      if (!this.profilePicture) {
        alert("Por favor, selecciona una imagen.");
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", this.profilePicture);
      this.isUploading = true;
      this.uploadMessage = "";

      try {
        const response = await axios.post("/api/profile/picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.authToken}`,
          },
        });
        this.uploadMessage =
          response.data.success || "Foto de perfil subida correctamente.";
      } catch (error) {
        console.error(error);
        this.uploadMessage = error.response?.data?.error || "Error en la subida.";
      } finally {
        this.isUploading = false;
      }
      window.location.reload();
    },
    async saveDescription() {
      try {
        const response = await axios.post(
          `/api/users/description/${this.userId}`,
          { description: this.description },
          {
            headers: { Authorization: `Bearer ${this.authToken}` },
          }
        );
        this.description = response.data.description;
        alert(
          this.description
            ? "Descripción actualizada correctamente."
            : "Descripción agregada correctamente."
        );
      } catch (error) {
        console.error("Error al actualizar/agregar la descripción:", error);
        alert("Error al actualizar/agregar la descripción.");
      }
      window.location.reload();
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
  watch: {
    selectedUser: 'fetchUserDetails',
  },
};