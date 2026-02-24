'use client';

import { CRUDList } from '@/shared/components/admin/crud-list';
import { useState } from 'react';

export default function ReservationsPage() {
  //   const [reservationList] = useState(reservations);

  const columns = [
    { key: 'vehicleName', label: 'Vehículo' },
    { key: 'customerName', label: 'Cliente' },
    { key: 'startDate', label: 'Inicio' },
    { key: 'endDate', label: 'Fin' },
    { key: 'status', label: 'Estado' },
  ];

  //   const formattedReservations = reservationList.map((r) => ({
  //     ...r,
  //     totalPrice: `$${r.totalPrice}`,
  //     status: (
  //       <span
  //         className={`px-3 py-1 rounded-full text-xs font-medium ${
  //           r.status === 'active'
  //             ? 'bg-accent/10 text-accent'
  //             : r.status === 'confirmed'
  //               ? 'bg-green-100 text-green-700'
  //               : r.status === 'pending'
  //                 ? 'bg-yellow-100 text-yellow-700'
  //                 : 'bg-gray-100 text-gray-700'
  //         }`}
  //       >
  //         {r.status === 'active'
  //           ? 'Activa'
  //           : r.status === 'confirmed'
  //             ? 'Confirmada'
  //             : r.status === 'pending'
  //               ? 'Pendiente'
  //               : 'Completada'}
  //       </span>
  //     ),
  //   }));

  const handleEdit = (id: string) => {
    console.log('Edit reservation:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete reservation:', id);
  };

  return (
    <CRUDList
      title="Gestión de Reservas"
      description="Administra todas las reservas de vehículos"
      createHref="/dashboard/reservations/new"
      columns={columns}
      rows={[]}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
