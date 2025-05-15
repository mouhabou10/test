// axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // 👈 change this to match your backend
  withCredentials: true, // send cookies (for JWT auth if needed)
});

export default api;
