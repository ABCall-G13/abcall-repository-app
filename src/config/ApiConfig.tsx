import axios from 'axios';

const API_BASE_URL = 'https://api-345518488840.us-central1.run.app';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Opcional, define un tiempo de espera
});

export { API_BASE_URL };
export default axiosInstance;
