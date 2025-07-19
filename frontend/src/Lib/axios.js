import axios from 'axios';

const BASE_URL = 'http://localhost:3800/api/notes';

export const api = axios.create({
  baseURL: BASE_URL,
   withCredentials: true, 
});
