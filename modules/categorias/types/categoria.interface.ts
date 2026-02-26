export interface CategoriaModelo {
  id: string;
  marca: string;
  nombre: string;
  anio: number;
  precioBaseDiario: number | string;
  estado: 'activo' | 'inactivo';
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo';
  modelos?: CategoriaModelo[];
}
