import { rentCarApi } from '@/shared/api/RentCar.api';
import axios from 'axios';

const BASE_URL = rentCarApi.defaults.baseURL;

export const modelosApi = axios.create({
  baseURL: `${BASE_URL}/modelos`,
});
