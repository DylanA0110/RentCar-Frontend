export interface TemporadaPrecio {
  id: string;
  descripcion: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  createdAt?: Date | string;
}

export interface TemporadaPrecioPayload {
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}
