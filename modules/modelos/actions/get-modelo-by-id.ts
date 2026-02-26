import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosApi } from '../api/modelos.api';
import type { Modelo } from '../types/modelo.interface';

interface GetModeloByIdOptions {
  signal?: AbortSignal;
}

export const getModeloById = async (
  id: string,
  options: GetModeloByIdOptions = {},
): Promise<Modelo> => {
  try {
    const { data } = await modelosApi.get<Modelo>(`/${id}`, {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo obtener el modelo',
    );
    throw new Error(`No se pudo obtener el modelo: ${apiMessage}`);
  }
};
