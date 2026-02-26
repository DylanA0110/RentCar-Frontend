import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosPreciosTemporadasApi } from '../api/modelos-precios-temporadas.api';
import type { ModeloPrecioTemporada } from '../types/modelo-precio-temporada.interface';

interface GetModeloPrecioTemporadaByIdOptions {
  signal?: AbortSignal;
}

export const getModeloPrecioTemporadaById = async (
  id: string,
  options: GetModeloPrecioTemporadaByIdOptions = {},
): Promise<ModeloPrecioTemporada> => {
  try {
    const { data } =
      await modelosPreciosTemporadasApi.get<ModeloPrecioTemporada>(`/${id}`, {
        signal: options.signal,
      });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo obtener el precio por temporada del modelo',
    );
    throw new Error(
      `No se pudo obtener el precio por temporada del modelo: ${apiMessage}`,
    );
  }
};
