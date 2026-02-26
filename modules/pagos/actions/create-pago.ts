import { extractApiErrorMessage } from '@/shared/api/api-error';
import { pagosApi } from '../api/pagos.api';
import type { Pagos } from '../types/pagos.interface';

export interface CreatePagoPayload {
  monto: number;
  metodoPago: string;
  reservaId: string;
  estado?: 'APROBADO' | 'PENDIENTE';
  referencia?: string;
}

export const createPago = async (
  payload: CreatePagoPayload,
): Promise<Pagos> => {
  try {
    const { data } = await pagosApi.post<Pagos>('/', payload);
    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudo registrar el pago',
    );
    throw new Error(`No se pudo registrar el pago: ${apiMessage}`);
  }
};
