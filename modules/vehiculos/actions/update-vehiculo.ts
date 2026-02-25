import { vehiculosApi } from '../api/vehiculos.api';
import type { Vehiculo, VehiculoPayload } from '../types/vehiculo.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

export const updateVehiculo = async (
  id: string,
  payload: VehiculoPayload,
): Promise<Vehiculo> => {
  try {
    const { data } = await vehiculosApi.patch<Vehiculo>(`/${id}`, payload);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo actualizar el vehículo',
    );
    throw new Error(`No se pudo actualizar el vehículo: ${apiMessage}`);
  }
};
