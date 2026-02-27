import { vehiculosImgApi } from '../api/vehicles.imagenes.api';
import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

interface UpdateVehiculoImagenPayload {
  file?: File;
  url?: string;
}

const fileToDataUrl = async (file: File): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('No se pudo convertir la imagen a URL'));
    };
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });
};

export const updateVehiculoImagen = async (
  imagenId: string,
  payload: UpdateVehiculoImagenPayload,
): Promise<VechilesImagenes> => {
  try {
    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('imagen', payload.file);

      const { data } = await vehiculosImgApi.patch<VechilesImagenes>(
        `/${imagenId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return data;
    }

    const body: { url?: string } = {};
    if (payload.url) body.url = payload.url;

    if (!body.url) {
      throw new Error('Debes indicar una imagen para actualizar');
    }

    const { data } = await vehiculosImgApi.patch<VechilesImagenes>(
      `/${imagenId}`,
      body,
    );

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo actualizar la imagen del vehículo',
    );
    throw new Error(
      `No se pudo actualizar la imagen del vehículo: ${apiMessage}`,
    );
  }
};
