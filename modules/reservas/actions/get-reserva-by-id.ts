import { extractApiErrorMessage } from '@/shared/api/api-error';
import { reservasApi } from '../api/reservas.api';
import type { Reservas } from '../types/reservas.interface';

interface GetReservaByIdOptions {
  signal?: AbortSignal;
}

export const getReservaById = async (
  id: string,
  options: GetReservaByIdOptions = {},
): Promise<Reservas> => {
  try {
    const { data } = await reservasApi.get<Reservas>(`/${id}`, {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo obtener la reserva',
    );

    throw new Error(`No se pudo obtener la reserva: ${apiMessage}`);
  }
};
