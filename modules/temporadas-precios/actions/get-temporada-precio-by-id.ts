import { extractApiErrorMessage } from '@/shared/api/api-error';
import { temporadasPreciosApi } from '../api/temporadas-precios.api';
import type { TemporadaPrecio } from '../types/temporada-precio.interface';

interface GetTemporadaPrecioByIdOptions {
  signal?: AbortSignal;
}

export const getTemporadaPrecioById = async (
  id: string,
  options: GetTemporadaPrecioByIdOptions = {},
): Promise<TemporadaPrecio> => {
  try {
    const { data } = await temporadasPreciosApi.get<TemporadaPrecio>(`/${id}`, {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo obtener la temporada de precio',
    );
    throw new Error(`No se pudo obtener la temporada de precio: ${apiMessage}`);
  }
};
