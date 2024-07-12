<template>
  <div id="app" class="d-flex flex-column" style="height: 100vh;">
    <nav class="navbar navbar-expand" style="background-color: #1d2126; padding: 0.5rem 1rem;">
      <div class="container-fluid">
        <form class="d-flex" role="search" style="background-color: #21252b; border-radius: 0.25rem; padding: 0.25rem;">
          <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" style="max-width: 200px; background-color: #21252b; border: none; color: white;">
        </form>
        <div class="navbar-nav ms-auto">
        </div>
      </div>
    </nav>
    <div class="d-flex flex-grow-1">
      <nav class="text-white" style="background-color: #1c2126; width: 80px; padding: 0.5rem;">
        <div class="nav flex-column">
          <!-- <router-link to="/" class="nav-link text-white">Inicio</router-link>
          <router-link to="/about" class="nav-link text-white">Acerca de</router-link> -->
        </div>
      </nav>
      <div style="background-color: #21252b; width: 230px;"></div> <!-- Div existente -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Estilos globales */
html, body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100vh; /* Asegura que ocupe toda la altura */
  background-color: #24282e; /* Color de fondo */
}

.navbar {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra para la navbar */
}

.form-control {
  border-radius: 0.25rem;
  color: white;
}

.form-control::placeholder {
  color: #adb5bd !important; /* Placeholder color */
}

.btn {
  margin-left: 0.5rem;
}
</style>
