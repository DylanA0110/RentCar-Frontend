export interface VechilesImagenes {
  id: string;
  url: string;
  createdAt?: Date | string;
  modelo?: Modelo;
}

export interface Modelo {
  id: string;
  marca: string;
  nombre: string;
  anio: number;
  estado: 'activo' | 'inactivo';
}
