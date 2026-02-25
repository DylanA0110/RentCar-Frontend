import { vehiculosApi } from '../api/vehiculos.api';
import type { Vehiculo, VehiculoPayload } from '../types/vehiculo.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

export const createVehiculo = async (
  payload: VehiculoPayload,
): Promise<Vehiculo> => {
  try {
    const { data } = await vehiculosApi.post<Vehiculo>('/', payload);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo crear el vehículo',
    );
    throw new Error(`No se pudo crear el vehículo: ${apiMessage}`);
  }
};
