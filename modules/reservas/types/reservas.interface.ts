export interface Reservas {
  id: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  cantidadDias: number;
  precioTotal: number | string;
  estado:
    | 'PENDIENTE'
    | 'CONFIRMADA'
    | 'EN_CURSO'
    | 'FINALIZADA'
    | 'CANCELADA'
    | 'NO_SHOW';
  cliente: Cliente;
  vehiculo: Vehiculo;
  pagos: Pago[];
}

export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  estado?: 'activo' | 'inactivo';
  fechaRegistro: Date | string;
}

export interface Pago {
  id: string;
  monto: number | string;
  metodoPago: string;
  fechaPago: Date | string;
  estado: string;
  referencia?: string;
}

export interface Vehiculo {
  id: string;
  placa: string;
  color?: string;
  kilometraje?: number | string;
  estado: string;
  modelo?: VehiculoModelo;
}

export interface VehiculoModelo {
  id: string;
  marca: string;
  nombre: string;
  anio: number;
  precioBaseDiario: number | string;
}
