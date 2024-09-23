<template>
  <div class="settings-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <ul class="menu">
        <li :class="{ active: activeTab === 'cuenta' }" @click="setActiveTab('cuenta')">
          Cuenta
        </li>
        <li
          :class="{ active: activeTab === 'apariencia' }"
          @click="setActiveTab('apariencia')"
        >
          Apariencia
        </li>
        <li
          :class="{ active: activeTab === 'privacidad' }"
          @click="setActiveTab('privacidad')"
        >
          Privacidad
        </li>
        <li
          :class="{ active: activeTab === 'seguridad' }"
          @click="setActiveTab('seguridad')"
        >
          Seguridad
        </li>
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
            <input
              type="file"
              id="profile-upload"
              @change="onFileChange"
              accept="image/*"
              class="file-input"
            />
            <button @click="upload" :disabled="isUploading" class="upload-button">
              <span v-if="isUploading">Subiendo...</span>
              <span v-else>Subir Foto de Perfil</span>
            </button>
            <p v-if="uploadMessage" class="upload-message">{{ uploadMessage }}</p>
          </div>

          <div class="description-container">
            <label for="description" class="input-label">Descripción:</label>
            <textarea
              id="description"
              v-model="description"
              placeholder="Escribe tu descripción aquí..."
              class="description-input"
            ></textarea>
            <button @click="saveDescription" class="update-button">
              {{ description ? "Actualizar Descripción" : "Agregar Descripción" }}
            </button>
          </div>
        </template>

        <template v-if="activeTab === 'apariencia'">
        </template>
      </div>
    </div>
  </div>
</template>

<script>
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
      activeTab: "cuenta", // Default tab
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
      // Eliminar el token de localStorage
      localStorage.removeItem("auth_token");

      // Redirigir al usuario a la página de inicio o login
      this.$router.push("/login");
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
          "/api/users",
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
</script>

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
  color: red; /* Cambia a tu tono de rojo preferido */
}

.logout {
  cursor: pointer; /* Cambia el cursor a pointer para indicar que es clicable */
}

.logout.red:hover {
  text-decoration: underline; /* O cualquier otro efecto que prefieras */
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
</style>
