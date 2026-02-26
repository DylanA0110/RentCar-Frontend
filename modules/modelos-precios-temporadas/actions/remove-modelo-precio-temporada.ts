import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosPreciosTemporadasApi } from '../api/modelos-precios-temporadas.api';

interface RemoveModeloPrecioTemporadaResponse {
  message: string;
}

export const removeModeloPrecioTemporada = async (
  id: string,
): Promise<RemoveModeloPrecioTemporadaResponse> => {
  try {
    const { data } =
      await modelosPreciosTemporadasApi.delete<RemoveModeloPrecioTemporadaResponse>(
        `/${id}`,
      );
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo eliminar el precio por temporada del modelo',
    );
    throw new Error(
      `No se pudo eliminar el precio por temporada del modelo: ${apiMessage}`,
    );
  }
};
