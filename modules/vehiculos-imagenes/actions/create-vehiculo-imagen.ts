import { vehiculosImgApi } from '../api/vehicles.imagenes.api';
import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

export interface CreateVehiculoImagenPayload {
  vehiculoId: string;
  url: string;
  altText: string;
  esPrincipal: boolean;
}

export const createVehiculoImagen = async (
  payload: CreateVehiculoImagenPayload,
): Promise<VechilesImagenes> => {
  try {
    const { data } = await vehiculosImgApi.post<VechilesImagenes>('/', payload);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo crear la imagen del vehículo',
    );
    throw new Error(`No se pudo crear la imagen del vehículo: ${apiMessage}`);
  }
};
