<template>
  <div id="app" class="d-flex flex-column" style="height: 100vh;">
    <nav class="navbar navbar-expand"
      style="background-color: #121212; padding: 0.5rem 1rem; position: relative; border-bottom: 1px solid #1e1e1e;">
      <div class="container-fluid">
        <img :src="imageSrc" alt="Logo" class="navbar-logo">
        <form class="d-flex" role="search"
          style="background-color: #1e1e1e; border-radius: 0.25rem; padding: 0.25rem; margin-left: 2rem;">
          <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar"
            style="max-width: 200px; background-color: #1e1e1e; border: none; color: #e0e0e0;">
        </form>

        <div class="navbar-nav ms-auto">
        </div>
      </div>
    </nav>
    <div class="d-flex flex-grow-1">
      <nav class="text-white d-flex flex-column"
        style="background-color: #121212; width: 60px; padding: 0.5rem; border-right: 1px solid #1e1e1e;">
        <div class="d-flex flex-column align-items-center" style="margin-top: 1rem;">
          <router-link to="/" class="nav-link text-white d-flex flex-column align-items-center">
            <i class="fas fa-home"></i> <!-- Icono de inicio -->
            <span class="nav-text">Inicio</span>
          </router-link>
          <router-link to="/books" class="nav-link text-white d-flex flex-column align-items-center">
            <i class="fas fa-book"></i> <!-- Icono de libros -->
            <span class="nav-text">Libros</span>
          </router-link>
        </div>
      </nav>
      <div
        style="background-color: #1e1e1e; width: 230px; display: flex; flex-direction: column; padding: 1rem; border-right: 1px solid #1e1e1e;">
        <p class="text-white">Título Principal</p>
      </div>
      <div class="flex-grow-1" style="background-color: #181818; padding: 1rem;">
        <!-- MAIN -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      imageSrc: '/images/esh.jpg'
    };
  }
};
</script>

<style>
/* Estilos globales */
html,
body {
  height: 100%;
  margin: 0;
  background-color: #121212; /* Fondo de página general */
}

#app {
  height: 100vh;
  background-color: #181818; /* Fondo principal de la aplicación */
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

.form-control {
  border-radius: 0.25rem;
  color: #e0e0e0;
}

.form-control::placeholder {
  color: #b0b0b0 !important;
}

.btn {
  margin-left: 0.5rem;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #e0e0e0;
  text-decoration: none;
  margin-bottom: 1rem; /* Espacio entre iconos */
}

.nav-link i {
  font-size: 1.5rem;
  color: #9e9e9e; /* Color de iconos ajustado para combinar mejor */
}

.nav-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #e0e0e0;
}
</style>
