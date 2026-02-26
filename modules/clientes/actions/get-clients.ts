import { extractApiErrorMessage } from '@/shared/api/api-error';
import { Clientes } from '../types/clientes.interface';
import { clientesApi } from '../api/clientes.api';

interface GetClientesOptions {
  signal?: AbortSignal;
}

export const getClientes = async (
  options: GetClientesOptions = {},
): Promise<Clientes[]> => {
  try {
    const { data } = await clientesApi.get<Clientes[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener los clientes',
    );

    throw new Error(`No se pudieron obtener los clientes: ${apiMessage}`);
  }
};
