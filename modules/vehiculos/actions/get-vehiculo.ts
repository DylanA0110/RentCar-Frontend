import { vehiculosApi } from '../api/vehiculos.api';
import type { Vehiculo } from '../types/vehiculo.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';
import { getModelos } from '@/modules/modelos/actions/get-modelos';

interface GetVehiculosOptions {
  signal?: AbortSignal;
}

export const getVehiculos = async (
  options: GetVehiculosOptions = {},
): Promise<Vehiculo[]> => {
  try {
    const { data } = await vehiculosApi.get<Vehiculo[]>('/', {
      signal: options.signal,
    });

    const modelos = await getModelos({ signal: options.signal });
    const modeloById = new Map(modelos.map((modelo) => [modelo.id, modelo]));

    const enriched = data.map((vehiculo) => {
      const modeloId = vehiculo.modelo?.id;
      const modelo = modeloId ? modeloById.get(modeloId) : undefined;
      return {
        ...vehiculo,
        modelo: modelo ?? vehiculo.modelo,
        imagenes: modelo?.imagenes ?? vehiculo.imagenes,
      };
    });

    return enriched;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener los vehículos',
    );

    throw new Error(`No se pudieron obtener los vehículos: ${apiMessage}`);
  }
};
