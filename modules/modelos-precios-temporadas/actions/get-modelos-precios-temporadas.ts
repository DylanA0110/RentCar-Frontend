import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosPreciosTemporadasApi } from '../api/modelos-precios-temporadas.api';
import type { ModeloPrecioTemporada } from '../types/modelo-precio-temporada.interface';

interface GetModelosPreciosTemporadasOptions {
  signal?: AbortSignal;
}

export const getModelosPreciosTemporadas = async (
  options: GetModelosPreciosTemporadasOptions = {},
): Promise<ModeloPrecioTemporada[]> => {
  try {
    const { data } = await modelosPreciosTemporadasApi.get<
      ModeloPrecioTemporada[]
    >('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener los precios por temporada de modelos',
    );
    throw new Error(
      `No se pudieron obtener los precios por temporada de modelos: ${apiMessage}`,
    );
  }
};
