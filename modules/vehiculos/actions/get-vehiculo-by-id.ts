import { vehiculosApi } from '../api/vehiculos.api';
import type { Vehiculo } from '../types/vehiculo.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

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

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo obtener el vehículo',
    );
    throw new Error(`No se pudo obtener el vehículo: ${apiMessage}`);
  }
};
