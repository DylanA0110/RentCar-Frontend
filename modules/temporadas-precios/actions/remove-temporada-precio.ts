import { extractApiErrorMessage } from '@/shared/api/api-error';
import { temporadasPreciosApi } from '../api/temporadas-precios.api';

interface RemoveTemporadaPrecioResponse {
  message: string;
}

export const removeTemporadaPrecio = async (
  id: string,
): Promise<RemoveTemporadaPrecioResponse> => {
  try {
    const { data } =
      await temporadasPreciosApi.delete<RemoveTemporadaPrecioResponse>(
        `/${id}`,
      );
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo eliminar la temporada de precio',
    );
    throw new Error(
      `No se pudo eliminar la temporada de precio: ${apiMessage}`,
    );
  }
};
