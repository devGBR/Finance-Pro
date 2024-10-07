import axios from "axios";
import Cookies from 'universal-cookie';

const cookie = new Cookies();
const api = axios.create({
  baseURL: 'http://18.230.23.121/api'
});

api.interceptors.request.use((config) => {
  const api_token = cookie.get('api_token');
  if (api_token) {
    config.headers['Authorization'] = `Bearer ${api_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;