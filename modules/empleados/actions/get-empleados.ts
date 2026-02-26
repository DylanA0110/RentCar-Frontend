import { extractApiErrorMessage } from '@/shared/api/api-error';
import { empleadosApi } from '../api/empleados.api';
import type { Empleado } from '../types/empleado.interface';

interface GetEmpleadosOptions {
  signal?: AbortSignal;
}

export const getEmpleados = async (
  options: GetEmpleadosOptions = {},
): Promise<Empleado[]> => {
  try {
    const { data } = await empleadosApi.get<Empleado[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener los empleados',
    );

    throw new Error(`No se pudieron obtener los empleados: ${apiMessage}`);
  }
};
