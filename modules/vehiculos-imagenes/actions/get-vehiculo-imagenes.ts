import { vehiculosImgApi } from '../api/vehicles.imagenes.api';
import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

interface GetVehiculoImagenesOptions {
  signal?: AbortSignal;
}

export const getVehiculoImagenes = async (
  options: GetVehiculoImagenesOptions = {},
): Promise<VechilesImagenes[]> => {
  try {
    const { data } = await vehiculosImgApi.get<VechilesImagenes[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener las imagenes',
    );
    throw new Error(`No se pudieron obtener las imagenes: ${apiMessage}`);
  }
};
