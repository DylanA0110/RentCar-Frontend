import { vehiculosImgApi } from '../api/vehicles.imagenes.api';
import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

interface GetVehiculoImagenesByModeloOptions {
  signal?: AbortSignal;
}

export const getVehiculoImagenesByModelo = async (
  modeloId: string,
  options: GetVehiculoImagenesByModeloOptions = {},
): Promise<VechilesImagenes[]> => {
  try {
    const { data } = await vehiculosImgApi.get<VechilesImagenes[]>(
      `/modelo/${modeloId}`,
      {
        signal: options.signal,
      },
    );

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener las imagenes del modelo',
    );
    throw new Error(
      `No se pudieron obtener las imagenes del modelo: ${apiMessage}`,
    );
  }
};
