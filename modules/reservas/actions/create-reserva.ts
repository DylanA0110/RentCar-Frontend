import { extractApiErrorMessage } from '@/shared/api/api-error';
import { reservasApi } from '../api/reservas.api';
import type { Reservas } from '../types/reservas.interface';
import { ReservaEstado } from '@/shared/types/types-reserva-estado';

export interface CreateReservaPayload {
  fechaInicio: string;
  fechaFin: string;
  cantidadDias: number;
  precioTotal: number;
  vehiculoId: string;
  clienteId: string;
  estado?: ReservaEstado;
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
