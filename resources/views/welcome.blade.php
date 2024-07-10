<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emprende Sin Humo</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: black;
      color: white;
    }
    .content-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .image-container {
      margin-right: 20px;
    }
    .btn-custom {
      background-color: #1a1a1a;
      color: white;
      border: 2px solid #555;
      padding: 10px 20px;
      font-size: 18px;
      border-radius: 30px;
      transition: background-color 0.3s, color 0.3s, border 0.3s;
    }
    .btn-custom:hover {
      background-color: white;
      color: black;
      border: 2px solid white;
    }
  </style>
</head>
<body>
  <div class="container content-wrapper">
    <div class="image-container">
      <img src="{{ asset('images/esh.jpg') }}" alt="Descripción de la imagen" class="img-fluid">
    </div>
    <div class="text-container">
      <h2>Emprende Sin Humo</h2>
      <p>El unico lugar en donde realmente encontraras todo lo que necesitas para convertirte en un emprendedor</p>
      <a href="{{ url('/app') }}"><button class="btn btn-custom">Acceder a la app</button></a>
    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
