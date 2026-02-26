import { extractApiErrorMessage } from '@/shared/api/api-error';
import { Reservas } from '../types/reservas.interface';
import { reservasApi } from '../api/reservas.api';

interface GetReservasOptions {
  signal?: AbortSignal;
}

export const getReservas = async (
  options: GetReservasOptions = {},
): Promise<Reservas[]> => {
  try {
    const { data } = await reservasApi.get<Reservas[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener las reservas',
    );

    throw new Error(`No se pudieron obtener las reservas: ${apiMessage}`);
  }
};
