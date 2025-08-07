import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',//'https://micrositio-iris-backend.onrender.com', // URL base de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;