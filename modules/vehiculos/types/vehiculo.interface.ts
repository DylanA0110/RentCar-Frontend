export type EstadoGeneral = 'activo' | 'inactivo';

export type VehiculoEstado = 'disponible' | 'rentado' | 'en reparacion';

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  estado?: EstadoGeneral;
}

export interface VehiculoImagen {
  id: string;
  url: string;
  createdAt?: string;
}

export interface Modelo {
  id: string;
  marca: string;
  nombre: string;
  anio: number;
  tipoCombustible?: string;
  capacidadPasajeros?: number;
  estado: EstadoGeneral;
  precioBaseDiario: number | string;
  categoria?: Categoria;
  imagenes?: VehiculoImagen[];
}

export interface Vehiculo {
  id: string;
  placa: string;
  color?: string;
  estado: VehiculoEstado;
  kilometraje?: number | string;
  modelo?: Modelo;
  reservas?: unknown[];
  imagenes?: VehiculoImagen[];
}

export interface VehiculoPayload {
  placa: string;
  color?: string;
  estado: VehiculoEstado;
  kilometraje?: number;
  modeloId: string;
}
