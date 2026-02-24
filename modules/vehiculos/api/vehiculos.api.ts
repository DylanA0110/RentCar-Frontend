import { rentCarApi } from '@/shared/api/RentCar.api';
import axios from 'axios';

const BASE_URL = rentCarApi.defaults.baseURL;

export const vehiculosApi = axios.create({
  baseURL: `${BASE_URL}/vehiculos`,
});
