export interface Clientes {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  estado: 'activo' | 'inactivo';
  fechaRegistro: Date | string;
  user: User;
  reservas: any[];
}

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  loginAttempts: number;
  blockedUntil: null;
  roles: string[];
}
