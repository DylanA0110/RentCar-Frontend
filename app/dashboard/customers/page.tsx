'use client';

import { useMemo } from 'react';
import { useClientes } from '@/modules/clientes/hook/useClientes';
import { CRUDList } from '@/shared/components/admin/crud-list';

const formatFechaRegistro = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export default function CustomersPage() {
  const { clientes } = useClientes();

  const columns = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'fechaRegistro', label: 'Fecha de registro' },
    // columna de acciones eliminada
  ];

  const rows = useMemo(
    () =>
      (clientes ?? []).map((cliente) => ({
        id: cliente.id,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        email: cliente.email,
        telefono: cliente.telefono,
        fechaRegistro: formatFechaRegistro(cliente.fechaRegistro),
      })),
    [clientes],
  );

  const handleEdit = (id: string) => {
    console.log('Edit customer:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete customer:', id);
  };

  return (
    <CRUDList
      title="Gestión de Clientes"
      description="Administra tus clientes registrados"
      columns={columns}
      rows={rows}
      createHref={''}
    />
  );
}
