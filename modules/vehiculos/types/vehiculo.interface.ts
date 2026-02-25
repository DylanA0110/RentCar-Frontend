export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precioPorDia: string;
  estado: string;
  activo: boolean;
  categoria: Categoria;
  reservas?: unknown[];
  imagenes?: VehiculoImagen[];
}

export interface VehiculoImagen {
  id: string;
  url: string | null;
  altText: string | null;
  storagePath: string | null;
  esPrincipal: boolean;
}

export interface VehiculoPayload {
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precioPorDia: string;
  estado: string;
  activo: boolean;
  categoriaId: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}
