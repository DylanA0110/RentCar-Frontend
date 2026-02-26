import { extractApiErrorMessage } from '@/shared/api/api-error';
import { temporadasPreciosApi } from '../api/temporadas-precios.api';
import type {
  TemporadaPrecio,
  TemporadaPrecioPayload,
} from '../types/temporada-precio.interface';

export const updateTemporadaPrecio = async (
  id: string,
  payload: Partial<TemporadaPrecioPayload>,
): Promise<TemporadaPrecio> => {
  try {
    const { data } = await temporadasPreciosApi.patch<TemporadaPrecio>(
      `/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo actualizar la temporada de precio',
    );
    throw new Error(
      `No se pudo actualizar la temporada de precio: ${apiMessage}`,
    );
  }
};
