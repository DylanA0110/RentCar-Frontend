'use client';

import { CRUDList } from '@/shared/components/admin/crud-list';
import { useState } from 'react';

// Mock payments data
const mockPayments = [
  {
    id: '1',
    reservationId: 'RES001',
    amount: 178,
    date: '2025-02-23',
    method: 'Tarjeta Crédito',
    status: 'completado',
  },
  {
    id: '2',
    reservationId: 'RES002',
    amount: 952,
    date: '2025-02-22',
    method: 'PayPal',
    status: 'completado',
  },
  {
    id: '3',
    reservationId: 'RES003',
    amount: 387,
    date: '2025-02-21',
    method: 'Transferencia',
    status: 'pendiente',
  },
  {
    id: '4',
    reservationId: 'RES004',
    amount: 177,
    date: '2025-02-20',
    method: 'Tarjeta Débito',
    status: 'completado',
  },
];

export default function PaymentsPage() {
  const [paymentList] = useState(mockPayments);

  const columns = [
    { key: 'reservationId', label: 'Reserva' },
    { key: 'amount', label: 'Monto', width: 'w-24' },
    { key: 'date', label: 'Fecha' },
    { key: 'method', label: 'Método' },
    { key: 'status', label: 'Estado' },
  ];

  const formattedPayments = paymentList.map((p) => ({
    ...p,
    amount: `$${p.amount}`,
    status: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          p.status === 'completado'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {p.status === 'completado' ? 'Completado' : 'Pendiente'}
      </span>
    ),
  }));

  const handleEdit = (id: string) => {
    console.log('Edit payment:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete payment:', id);
  };

  return (
    <CRUDList
      title="Gestión de Pagos"
      description="Administra los pagos de las reservas"
      createHref="/dashboard/payments/new"
      columns={columns}
      rows={formattedPayments}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
