<template>
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h1 class="error-message">Oops! Page Not Found</h1>
      <p class="error-description">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <router-link to="/" class="home-link">Go back to Homepage</router-link>
    </div>
  </template>
  
  <style scoped>
  .not-found-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #1e1e1e;
    color: #ffffff;
    text-align: center;
  }
  
  .error-code {
    font-size: 8rem;
    font-weight: bold;
    color: #ff4757;
    margin-bottom: 1rem;
  }
  
  .error-message {
    font-size: 2rem;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 1rem;
  }
  
  .error-description {
    font-size: 1rem;
    color: #d3d3d3;
    margin-bottom: 2rem;
    max-width: 400px;
  }
  
  .home-link {
    padding: 0.75rem 1.5rem;
    background-color: #2f3542;
    color: #ffffff;
    border-radius: 5px;
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .home-link:hover {
    background-color: #57606f;
  }
  </style>
  