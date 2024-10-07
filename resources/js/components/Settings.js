import axios from "axios";
export default {
  props: {
    desiredSymbols: Array,
  },
  data() {
    return {
      profilePicture: null,
      isUploading: false,
      uploadMessage: "",
      description: "",
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
    logout() {
    console.log("click");
    axios.post('/api/logout', {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
    })
    .then(response => {
        console.log('Logout successful:', response.data);
        // Limpiar el token del localStorage
        localStorage.removeItem('auth_token');
        
        // Redirigir a la página de inicio de sesión
        this.$router.push({ name: 'login' });
    })
    .catch(error => {
        console.error('Logout error:', error);
    });
},
    updateSymbols() {
      const newSymbols = this.desiredSymbolsInput
        .split(",")
        .map((symbol) => symbol.trim());
      this.$emit("update-symbols", newSymbols); // Emite el evento con los nuevos símbolos
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
    },
    async saveDescription() {
      try {
        const response = await axios.post(
          `/api/users/description/${this.userId}`,  // Add the user ID to the URL
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
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
};