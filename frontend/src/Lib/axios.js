import axios from 'axios';

const BASE_URL = 'https://task-manager-mern-app-dj9e.onrender.com/api/notes';

export const api = axios.create({
  baseURL: BASE_URL,
   withCredentials: true, 
});
