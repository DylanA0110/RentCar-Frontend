import { extractApiErrorMessage } from '@/shared/api/api-error';
import { modelosApi } from '../api/modelos.api';
import type { ModeloPrecioPorFecha } from '../types/modelo.interface';

interface GetPrecioModeloPorFechaOptions {
  signal?: AbortSignal;
}

export const getPrecioModeloPorFecha = async (
  modeloId: string,
  fecha: string,
  options: GetPrecioModeloPorFechaOptions = {},
): Promise<ModeloPrecioPorFecha> => {
  try {
    const { data } = await modelosApi.get<ModeloPrecioPorFecha>(
      `/${modeloId}/precio`,
      {
        params: { fecha },
        signal: options.signal,
      },
    );

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo obtener el precio por fecha del modelo',
    );
    throw new Error(
      `No se pudo obtener el precio por fecha del modelo: ${apiMessage}`,
    );
  }
};
