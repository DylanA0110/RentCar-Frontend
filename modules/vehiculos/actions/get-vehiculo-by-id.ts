import { vehiculosApi } from '../api/vehiculos.api';
import type { Vehiculo } from '../types/vehiculo.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';
import { getModeloById } from '@/modules/modelos/actions/get-modelo-by-id';

interface GetVehiculoByIdOptions {
  signal?: AbortSignal;
}

export const getVehiculoById = async (
  id: string,
  options: GetVehiculoByIdOptions = {},
): Promise<Vehiculo> => {
  try {
    const { data } = await vehiculosApi.get<Vehiculo>(`/${id}`, {
      signal: options.signal,
    });

    if (!data.modelo?.id) {
      return data;
    }

    const modelo = await getModeloById(data.modelo.id, {
      signal: options.signal,
    });

    const normalizedModelo = {
      ...modelo,
      imagenes: modelo.imagenes?.map((imagen) => ({
        ...imagen,
        createdAt:
          imagen.createdAt === undefined
            ? undefined
            : String(imagen.createdAt),
      })),
    };

    return {
      ...data,
      modelo: normalizedModelo,
      imagenes: normalizedModelo.imagenes ?? data.imagenes,
    };
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo obtener el vehículo',
    );
    throw new Error(`No se pudo obtener el vehículo: ${apiMessage}`);
  }
};
