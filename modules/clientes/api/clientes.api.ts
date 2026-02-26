import { rentCarApi } from '@/shared/api/RentCar.api';
import axios from 'axios';

const BASE_URL = rentCarApi.defaults.baseURL;

export const clientesApi = axios.create({
  baseURL: `${BASE_URL}/clientes`,
});
