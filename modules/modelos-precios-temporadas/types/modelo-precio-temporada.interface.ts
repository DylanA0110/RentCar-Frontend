export interface ModeloPrecioTemporada {
  id: string;
  precioDiario: number | string;
  modelo?: {
    id: string;
    marca?: string;
    nombre?: string;
    anio?: number;
  };
  temporada?: {
    id: string;
    descripcion?: string;
    fechaInicio?: Date | string;
    fechaFin?: Date | string;
  };
}

export interface ModeloPrecioTemporadaPayload {
  modeloId: string;
  temporadaId: string;
  precioDiario: number;
}
