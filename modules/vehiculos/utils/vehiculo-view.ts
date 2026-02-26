import type { Vehiculo } from '../types/vehiculo.interface';

export const getVehiculoNombre = (vehiculo?: Vehiculo): string => {
  const marca = vehiculo?.modelo?.marca?.trim();
  const modelo = vehiculo?.modelo?.nombre?.trim();
  const composed = [marca, modelo].filter(Boolean).join(' ');

  if (composed) return composed;
  if (vehiculo?.placa) return `Vehículo ${vehiculo.placa}`;
  return 'Vehículo no disponible';
};

export const getVehiculoAnio = (vehiculo?: Vehiculo): number | null => {
  return vehiculo?.modelo?.anio ?? null;
};

export const getVehiculoCategoriaNombre = (vehiculo?: Vehiculo): string => {
  return vehiculo?.modelo?.categoria?.nombre ?? 'Sin categoría';
};

export const getVehiculoPrecioBaseDiario = (
  vehiculo?: Vehiculo,
): number | null => {
  const raw = vehiculo?.modelo?.precioBaseDiario;
  const parsed = typeof raw === 'string' ? Number(raw) : raw;
  if (!Number.isFinite(parsed)) return null;
  return Number(parsed);
};

export const isVehiculoDisponible = (vehiculo?: Vehiculo): boolean => {
  return vehiculo?.estado === 'disponible';
};
