export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precioPorDia: number;
  estado: string;
  imagenUrl: string;
  activo: boolean;
  categoria: Categoria;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}
