import axios from 'axios';

// Base URL configured to automatically use Vercel environment variable or fallback to localhost during development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API_BASE_URL;