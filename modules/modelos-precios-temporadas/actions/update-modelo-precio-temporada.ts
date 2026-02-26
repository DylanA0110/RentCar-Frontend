import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosPreciosTemporadasApi } from '../api/modelos-precios-temporadas.api';
import type {
  ModeloPrecioTemporada,
  ModeloPrecioTemporadaPayload,
} from '../types/modelo-precio-temporada.interface';

export const updateModeloPrecioTemporada = async (
  id: string,
  payload: Partial<ModeloPrecioTemporadaPayload>,
): Promise<ModeloPrecioTemporada> => {
  try {
    const { data } =
      await modelosPreciosTemporadasApi.patch<ModeloPrecioTemporada>(
        `/${id}`,
        payload,
      );
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo actualizar el precio por temporada del modelo',
    );
    throw new Error(
      `No se pudo actualizar el precio por temporada del modelo: ${apiMessage}`,
    );
  }
};
