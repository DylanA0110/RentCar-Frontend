import { extractApiErrorMessage } from '@/shared/api/api-error';
import { temporadasPreciosApi } from '../api/temporadas-precios.api';
import type { TemporadaPrecio } from '../types/temporada-precio.interface';

interface GetTemporadasPreciosOptions {
  signal?: AbortSignal;
}

export const getTemporadasPrecios = async (
  options: GetTemporadasPreciosOptions = {},
): Promise<TemporadaPrecio[]> => {
  try {
    const { data } = await temporadasPreciosApi.get<TemporadaPrecio[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener las temporadas de precio',
    );
    throw new Error(
      `No se pudieron obtener las temporadas de precio: ${apiMessage}`,
    );
  }
};
