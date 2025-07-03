import axios from 'axios';

const ApiClient = axios.create({
  baseURL: 'http://localhost:3000', // 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ➡️ Interceptores opcionales si usas JWT:

// ApiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); // o desde AuthContext
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default ApiClient;
