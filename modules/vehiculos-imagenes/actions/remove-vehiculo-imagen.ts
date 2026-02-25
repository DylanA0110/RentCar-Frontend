import { vehiculosImgApi } from '../api/vehicles.imagenes.api';
import { extractApiErrorMessage } from '@/shared/api/api-error';

interface RemoveVehiculoImagenResponse {
  message: string;
}

export const removeVehiculoImagen = async (
  imagenId: string,
): Promise<RemoveVehiculoImagenResponse> => {
  try {
    const { data } = await vehiculosImgApi.delete<RemoveVehiculoImagenResponse>(
      `/${imagenId}`,
    );
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo eliminar la imagen del vehículo',
    );
    throw new Error(
      `No se pudo eliminar la imagen del vehículo: ${apiMessage}`,
    );
  }
};
