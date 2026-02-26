export type EstadoGeneral = 'activo' | 'inactivo';

export interface ModeloCategoria {
  id: string;
  nombre: string;
  descripcion?: string;
  estado?: EstadoGeneral;
}

export interface ModeloImagen {
  id: string;
  url: string;
  createdAt?: Date | string;
}

export interface ModeloPrecioTemporadaRef {
  id: string;
  precioDiario: number | string;
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
  categoria?: ModeloCategoria;
  imagenes?: ModeloImagen[];
  preciosTemporada?: ModeloPrecioTemporadaRef[];
}

export interface ModeloPayload {
  marca: string;
  nombre: string;
  anio: number;
  tipoCombustible?: string;
  capacidadPasajeros?: number;
  estado?: EstadoGeneral;
  precioBaseDiario: number;
  categoriaId: string;
}

export interface ModeloPrecioPorFecha {
  modeloId: string;
  fecha: string;
  precioDiario: number;
  fuente: 'temporada' | 'base';
}
