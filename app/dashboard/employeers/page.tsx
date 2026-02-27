'use client';

import { useMemo } from 'react';
import { useEmpleados } from '@/modules/empleados/hook/useEmpleados';
import { CRUDList } from '@/shared/components/admin/crud-list';

const formatFechaIngreso = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export default function EmployeersPage() {
  const { empleados } = useEmpleados();

  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'fechaIngreso', label: 'Fecha de ingreso' },
    { key: 'estado', label: 'Estado' },
  ];

  const rows = useMemo(
    () =>
      (empleados ?? []).map((empleado) => ({
        id: empleado.id,
        nombres: empleado.nombres,
        apellidos: empleado.apellidos,
        email: empleado.email,
        telefono: empleado.telefono,
        cargo: empleado.cargo,
        fechaIngreso: formatFechaIngreso(empleado.fechaIngreso),
        estado: (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              empleado.estado?.toLowerCase() === 'activo'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {empleado.estado?.toLowerCase() === 'activo'
              ? 'Activo'
              : 'Inactivo'}
          </span>
        ),
      })),
    [empleados],
  );

  const handleEdit = (id: string) => {
    console.log('View employee:', id);
  };

  const handleDelete = (id: string) => {
    console.log('No delete on GET-only mode:', id);
  };

  return (
    <CRUDList
      title="Gestión de Empleados"
      description="Administra tus empleados registrados"
      columns={columns}
      rows={rows}
    />
  );
}
