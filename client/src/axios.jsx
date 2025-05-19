import axios from 'axios';

const baseURL = 'https://easylearn-6qg4.onrender.com' || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;
