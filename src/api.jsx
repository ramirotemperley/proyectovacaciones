import axios from 'axios';

const API_URL = 'https://www.mkscctv.com/control/api.php'; // URL de la API

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
