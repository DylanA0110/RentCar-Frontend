import { extractApiErrorMessage } from '@/shared/api/api-error';
import { reservasApi } from '../api/reservas.api';
import type { Reservas } from '../types/reservas.interface';

export interface CreateReservaPayload {
  fechaInicio: string;
  fechaFin: string;
  cantidadDias: number;
  precioTotal: number;
  vehiculoId: string;
  clienteId: string;
  estado?: 'PENDIENTE' | 'CONFIRMADA';
}

export const createReserva = async (
  payload: CreateReservaPayload,
): Promise<Reservas> => {
  try {
    const { data } = await reservasApi.post<Reservas>('/', payload);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo crear la reserva',
    );
    throw new Error(`No se pudo crear la reserva: ${apiMessage}`);
  }
};
