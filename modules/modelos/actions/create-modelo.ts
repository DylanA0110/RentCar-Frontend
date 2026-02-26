import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosApi } from '../api/modelos.api';
import type { Modelo, ModeloPayload } from '../types/modelo.interface';

export const createModelo = async (payload: ModeloPayload): Promise<Modelo> => {
  try {
    const { data } = await modelosApi.post<Modelo>('/', payload);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo crear el modelo',
    );
    throw new Error(`No se pudo crear el modelo: ${apiMessage}`);
  }
};
