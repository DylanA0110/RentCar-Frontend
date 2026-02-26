import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosApi } from '../api/modelos.api';

interface RemoveModeloResponse {
  message: string;
}

export const removeModelo = async (
  id: string,
): Promise<RemoveModeloResponse> => {
  try {
    const { data } = await modelosApi.delete<RemoveModeloResponse>(`/${id}`);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo eliminar el modelo',
    );
    throw new Error(`No se pudo eliminar el modelo: ${apiMessage}`);
  }
};
