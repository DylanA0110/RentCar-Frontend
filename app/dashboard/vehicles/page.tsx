'use client';

import { CRUDList } from '@/shared/components/admin/crud-list';
import { useState } from 'react';

export default function VehiclesPage() {
  //   const [vehicleList] = useState(vehicles)

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'category', label: 'Categoría' },
    { key: 'price', label: 'Precio/Día', width: 'w-24' },
    { key: 'rating', label: 'Rating' },
    {
      key: 'available',
      label: 'Disponible',
      width: 'w-24',
    },
  ];

  //   const formattedVehicles = vehicleList.map(v => ({
  //     ...v,
  //     price: `$${v.price}`,
  //     rating: `${v.rating}★`,
  //     available: (
  //       <span
  //         className={`px-3 py-1 rounded-full text-xs font-medium ${
  //           v.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
  //         }`}
  //       >
  //         {v.available ? 'Disponible' : 'Alquilado'}
  //       </span>
  //     ),
  //   }))

  const handleEdit = (id: string) => {
    console.log('Edit vehicle:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete vehicle:', id);
  };

  return (
    <CRUDList
      title="Gestión de Vehículos"
      description="Administra tu flota de vehículos"
      createHref="/dashboard/vehicles/new"
      columns={columns}
      rows={[]}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
