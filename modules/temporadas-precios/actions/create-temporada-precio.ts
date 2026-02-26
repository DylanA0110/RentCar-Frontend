import { extractApiErrorMessage } from '@/shared/api/api-error';
import { temporadasPreciosApi } from '../api/temporadas-precios.api';
import type {
  TemporadaPrecio,
  TemporadaPrecioPayload,
} from '../types/temporada-precio.interface';

export const createTemporadaPrecio = async (
  payload: TemporadaPrecioPayload,
): Promise<TemporadaPrecio> => {
  try {
    const { data } = await temporadasPreciosApi.post<TemporadaPrecio>(
      '/',
      payload,
    );
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo crear la temporada de precio',
    );
    throw new Error(`No se pudo crear la temporada de precio: ${apiMessage}`);
  }
};
