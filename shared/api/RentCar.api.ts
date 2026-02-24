import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const rentCarApi = axios.create({
  baseURL: BASE_URL,
});
