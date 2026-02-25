export interface CategoriaVehiculo {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  precioPorDia: string;
  estado: string;
  activo: boolean;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  vehiculos: CategoriaVehiculo[];
}
