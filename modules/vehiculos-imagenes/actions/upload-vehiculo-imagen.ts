import { vehiculosImgApi } from '../api/vehicles.imagenes.api';
import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

export interface UploadVehiculoImagenPayload {
  vehiculoId: string;
  file: File;
  altText?: string;
  esPrincipal?: boolean;
}

export const uploadVehiculoImagen = async (
  payload: UploadVehiculoImagenPayload,
): Promise<VechilesImagenes> => {
  try {
    const formData = new FormData();
    formData.append('file', payload.file);

    if (payload.altText?.trim()) {
      formData.append('altText', payload.altText.trim());
    }

    if (typeof payload.esPrincipal === 'boolean') {
      formData.append('esPrincipal', String(payload.esPrincipal));
    }

    const { data } = await vehiculosImgApi.post<VechilesImagenes>(
      `/upload/${payload.vehiculoId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo subir la imagen del vehículo',
    );
    throw new Error(`No se pudo subir la imagen del vehículo: ${apiMessage}`);
  }
};
