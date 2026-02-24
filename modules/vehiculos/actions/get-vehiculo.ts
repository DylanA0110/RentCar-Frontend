import axios from 'axios';
import { vehiculosApi } from '../api/vehiculos.api';
import type { Vehiculo } from '../types/vehiculo.interface';

interface GetVehiculosOptions {
    signal?: AbortSignal;
}

export const getVehiculos = async (
    options: GetVehiculosOptions = {}
): Promise<Vehiculo[]> => {
    try {
        const { data } = await vehiculosApi.get<Vehiculo[]>('/', {
            signal: options.signal,
        });

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const apiMessage =
                typeof error.response?.data === 'object' &&
                error.response?.data !== null &&
                'message' in error.response.data
                    ? String((error.response.data as { message?: unknown }).message)
                    : error.message;

            throw new Error(`No se pudieron obtener los vehículos: ${apiMessage}`);
        }

        throw new Error('No se pudieron obtener los vehículos');
    }
};
