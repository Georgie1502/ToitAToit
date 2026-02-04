import axios from 'axios';

const rawBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const baseURL = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
