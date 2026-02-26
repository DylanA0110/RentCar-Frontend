import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';
import { getVehiculoById } from '@/modules/vehiculos/actions/get-vehiculo-by-id';
import { createVehiculoImagen } from './create-vehiculo-imagen';
import { vehiculosImgApi } from '../api/vehicles.imagenes.api';

export interface UploadVehiculoImagenPayload {
  vehiculoId: string;
  file: File;
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

export const uploadVehiculoImagen = async (
  payload: UploadVehiculoImagenPayload,
): Promise<VechilesImagenes> => {
  try {
    const vehiculo = await getVehiculoById(payload.vehiculoId);
    const modeloId = vehiculo.modelo?.id;

    if (!modeloId) {
      throw new Error('El vehículo no tiene un modelo asociado');
    }

    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('imagen', payload.file);
    formData.append('modeloId', modeloId);
    formData.append('vehiculoId', payload.vehiculoId);

    const multipartAttempts = ['/', '/upload'];
    for (const path of multipartAttempts) {
      try {
        const { data } = await vehiculosImgApi.post<VechilesImagenes>(
          path,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return data;
      } catch {
        // intentar siguiente estrategia
      }
    }

    const dataUrl = await fileToDataUrl(payload.file);
    return await createVehiculoImagen({ modeloId, url: dataUrl });
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo crear la imagen del modelo',
    );
    throw new Error(`No se pudo crear la imagen del modelo: ${apiMessage}`);
  }
};
