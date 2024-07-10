<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página con Navbar Vertical en Bootstrap</title>
  
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
  
  <style>
    body {
      background-color: #000;
      color: #fff;
    }
    .navbar-dark .navbar-nav .nav-link {
      color: rgba(255,255,255,.5);
    }
    .navbar-dark .navbar-nav .nav-link:hover {
      color: #fff;
    }
    .navbar-nav {
      flex-direction: column;
    }
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 200px; /* Ancho fijo de la barra */
      padding-top: 56px; /* Ajuste para espacio de la barra */
      flex-direction: column;
      background-color: #343a40; /* Color de fondo de la barra */
    }
    .content {
      margin-left: 200px; /* Ajuste para espacio ocupado por la barra */
      padding: 20px;
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link active" href="#">Inicio</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Perfil</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Mensajes</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Configuración</a>
      </li>
    </ul>
  </nav>

  <div class="content">
    <!-- Contenido de la página -->
    <h1>Contenido Principal</h1>
    <p>Este es el contenido principal de la página.</p>
  </div>

  <!-- Bootstrap JS y Popper.js (opcional si necesitas componentes que lo requieran) -->
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js" integrity="sha384-R2mvRIJhi1wOKHNjSjHG4y2O4KmK/QwvcP/4ZBj3G9EWc5S+8oC1e/X5lGflj56J" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></script>
</body>
</html>
