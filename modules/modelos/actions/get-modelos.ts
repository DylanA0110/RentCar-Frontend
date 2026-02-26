import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosApi } from '../api/modelos.api';
import type { Modelo } from '../types/modelo.interface';

interface GetModelosOptions {
  signal?: AbortSignal;
}

export const getModelos = async (
  options: GetModelosOptions = {},
): Promise<Modelo[]> => {
  try {
    const { data } = await modelosApi.get<Modelo[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener los modelos',
    );
    throw new Error(`No se pudieron obtener los modelos: ${apiMessage}`);
  }
};
