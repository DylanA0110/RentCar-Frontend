import { extractApiErrorMessage } from '@/shared/api/api-error';
import { pagosApi } from '../api/pagos.api';
import { Pagos } from '../types/pagos.interface';

interface GetPagosOptions {
  signal?: AbortSignal;
}

export const getPagos = async (
  options: GetPagosOptions = {},
): Promise<Pagos[]> => {
  try {
    const { data } = await pagosApi.get<Pagos[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener los pagos',
    );
    throw new Error(`No se pudieron obtener los pagos: ${apiMessage}`);
  }
};
