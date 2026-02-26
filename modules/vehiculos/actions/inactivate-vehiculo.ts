import { vehiculosApi } from '../api/vehiculos.api';
import type { Vehiculo } from '../types/vehiculo.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

export const inactivateVehiculo = async (id: string): Promise<Vehiculo> => {
  try {
    const { data } = await vehiculosApi.patch<Vehiculo>(`/${id}`, {
      estado: 'en reparacion',
    });
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo inactivar el vehículo',
    );
    throw new Error(`No se pudo inactivar el vehículo: ${apiMessage}`);
  }
};
