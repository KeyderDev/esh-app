// axios.js

import axios from 'axios';

const baseURL = window.appUrl || 'https://esh-app.ddns.net'; 

const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;
