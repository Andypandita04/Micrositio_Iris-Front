import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://micrositio-iris-backend.onrender.com', // 'http://localhost:3000',//
  headers: {
    'Content-Type': 'application/json',
  },
});
 
export default apiClient;