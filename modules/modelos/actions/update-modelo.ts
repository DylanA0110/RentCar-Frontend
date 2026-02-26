import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosApi } from '../api/modelos.api';
import type { Modelo, ModeloPayload } from '../types/modelo.interface';

export const updateModelo = async (
  id: string,
  payload: Partial<ModeloPayload>,
): Promise<Modelo> => {
  try {
    const { data } = await modelosApi.patch<Modelo>(`/${id}`, payload);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo actualizar el modelo',
    );
    throw new Error(`No se pudo actualizar el modelo: ${apiMessage}`);
  }
};
