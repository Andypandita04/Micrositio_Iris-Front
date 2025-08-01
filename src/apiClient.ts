import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://micrositio-iris-backend.onrender.com', // URL base de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;