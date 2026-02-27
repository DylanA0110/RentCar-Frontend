import type { VechilesImagenes } from '../types/vehicle-img.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';
import { getVehiculoById } from '@/modules/vehiculos/actions/get-vehiculo-by-id';
import { createVehiculoImagen } from './create-vehiculo-imagen';
import { vehiculosImgApi } from '../api/vehicles.imagenes.api';

export interface UploadVehiculoImagenPayload {
  vehiculoId?: string;
  modeloId?: string;
  file?: File;
  imageUrl?: string;
}

export const uploadVehiculoImagen = async (
  payload: UploadVehiculoImagenPayload,
): Promise<VechilesImagenes> => {
  try {
    const modeloId = payload.modeloId
      ? payload.modeloId
      : payload.vehiculoId
        ? (await getVehiculoById(payload.vehiculoId)).modelo?.id
        : undefined;

    if (!modeloId) {
      throw new Error('No se pudo determinar el modelo asociado');
    }

    if (!payload.file && !payload.imageUrl) {
      throw new Error('Debes seleccionar una imagen para subir');
    }

    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('imagen', payload.file);
      formData.append('modeloId', modeloId);

      if (payload.vehiculoId) {
        formData.append('vehiculoId', payload.vehiculoId);
      }

      const { data } = await vehiculosImgApi.post<VechilesImagenes>(
        '/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return data;
    }

    if (!payload.imageUrl) {
      throw new Error('No se pudo obtener la URL de la imagen');
    }

    return await createVehiculoImagen({ modeloId, url: payload.imageUrl });
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo crear la imagen del modelo',
    );
    throw new Error(`No se pudo crear la imagen del modelo: ${apiMessage}`);
  }
};
