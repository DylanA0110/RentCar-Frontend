export interface Empleado {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  cargo: string;
  estado: 'activo' | 'inactivo';
  fechaIngreso: Date | string;
  user: EmpleadoUser;
}

export interface EmpleadoUser {
  id: string;
  email: string;
  isActive: boolean;
  loginAttempts: number;
  blockedUntil: Date | null;
  roles: string[];
}
