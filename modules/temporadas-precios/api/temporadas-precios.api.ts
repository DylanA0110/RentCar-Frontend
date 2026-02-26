import { rentCarApi } from '@/shared/api/RentCar.api';
import axios from 'axios';

const BASE_URL = rentCarApi.defaults.baseURL;

export const temporadasPreciosApi = axios.create({
  baseURL: `${BASE_URL}/temporadas-precios`,
});
