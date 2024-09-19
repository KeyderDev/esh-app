// axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.0.10:90',
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
