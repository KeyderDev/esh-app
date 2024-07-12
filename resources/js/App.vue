<template>
  <div id="app" class="d-flex flex-column" style="height: 100vh;">
    <nav class="navbar navbar-expand" style="background-color: #1d2126; padding: 0.5rem 1rem;">
      <div class="container-fluid">
        <div class="navbar-nav">
          <router-link to="/" class="nav-link text-white">Inicio</router-link>
        </div>
      </div>
    </nav>
    <div class="d-flex flex-grow-1">
      <nav class="bg-dark text-white" style="background-color: #1d2129; width: 100px; padding: 0.5rem;">
        <div class="nav flex-column">
          <router-link to="/" class="nav-link text-white">Inicio</router-link>
          <router-link to="/about" class="nav-link text-white">Acerca de</router-link>
        </div>
      </nav>
      <div style="background-color: #21252b; width: 200px;"></div> <!-- Div agregado -->
      <main class="flex-grow-1 d-flex flex-column p-3">
        <router-view class="flex-grow-1"></router-view> <!-- Aquí se renderizan las rutas -->
      </main>
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
}

.navbar {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra para la navbar */
}
</style>
