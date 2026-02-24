'use client';

import { CRUDList } from '@/shared/components/admin/crud-list';
import { useState } from 'react';

export default function CustomersPage() {
  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'joinedDate', label: 'Fecha de Registro' },
    { key: 'totalRentals', label: 'Alquileres', width: 'w-20' },
  ];

  //   const formattedCustomers = customerList.map(c => ({
  //     ...c,
  //     totalRentals: `${c.totalRentals}`,
  //   }))

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
      createHref="/dashboard/customers/new"
      columns={columns}
      rows={[]}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
