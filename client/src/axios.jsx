import axios from 'axios';

const api = axios.create({
  baseURL: 'https://easylearn-6qg4.onrender.com',
});

export default api;
