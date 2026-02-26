export interface Pagos {
  id: string;
  monto: string;
  metodoPago: string;
  fechaPago: Date;
  estado: string;
  referencia: string;
  reserva: Reserva;
}

export interface Reserva {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  cantidadDias: number;
  precioTotal: string;
  estado: string;
}
