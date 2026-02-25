import { vehiculosImgApi } from '../api/vehicles.imagenes.api';
import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

export const setPrincipalVehiculoImagen = async (
  imagenId: string,
): Promise<VechilesImagenes> => {
  try {
    const { data } = await vehiculosImgApi.patch<VechilesImagenes>(
      `/${imagenId}/principal`,
    );
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo establecer la imagen principal',
    );
    throw new Error(`No se pudo establecer la imagen principal: ${apiMessage}`);
  }
};
