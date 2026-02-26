'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePagos } from '@/modules/pagos/hook/usePagos';
import { CRUDList } from '@/shared/components/admin/crud-list';

const formatMonto = (monto: number | string) => {
  const value = typeof monto === 'string' ? Number(monto) : monto;
  if (Number.isNaN(value)) return String(monto);

  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 2,
  }).format(value);
};

const formatFecha = (fecha: Date | string) => {
  const value = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(value.getTime())) return String(fecha);

  return new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(value);
};

const formatReservaPeriodo = (inicio: Date | string, fin: Date | string) => {
  return `${formatFecha(inicio)} → ${formatFecha(fin)}`;
};

const formatMetodoPago = (metodo: string) => {
  const value = metodo.trim();
  if (!value) return 'No especificado';

  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getEstadoBadge = (estado: string) => {
  const normalized = estado.toLowerCase();
  const isApproved = normalized === 'aprobado';
  const isPending = normalized === 'pendiente';
  const isRejected = normalized === 'rechazado';
  const isRefunded = normalized === 'reembolsado';

  const classes = isApproved
    ? 'bg-green-100 text-green-700'
    : isPending
      ? 'bg-yellow-100 text-yellow-700'
      : isRejected
        ? 'bg-red-100 text-red-700'
        : isRefunded
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-700';

  const label = isApproved
    ? 'Aprobado'
    : isPending
      ? 'Pendiente'
      : isRejected
        ? 'Rechazado'
        : isRefunded
          ? 'Reembolsado'
          : estado || 'N/A';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
};

export default function PaymentsPage() {
  const { pagos } = usePagos();

  const columns = [
    { key: 'referencia', label: 'Referencia' },
    { key: 'reserva', label: 'Reserva asociada' },
    { key: 'metodoPago', label: 'Método' },
    { key: 'monto', label: 'Monto', width: 'w-28' },
    { key: 'fechaPago', label: 'Fecha de pago' },
    { key: 'estado', label: 'Estado' },
  ];

  const rows = useMemo(
    () =>
      (pagos ?? []).map((pago) => ({
        id: pago.id,
        referencia: pago.referencia || 'Sin referencia',
        reserva: pago.reserva?.id ? (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-muted-foreground">
              {formatReservaPeriodo(
                pago.reserva.fechaInicio,
                pago.reserva.fechaFin,
              )}
            </span>
            <Link
              href={`/dashboard/reservations/${pago.reserva.id}`}
              className="text-sm font-medium text-accent hover:underline"
            >
              Ver reserva
            </Link>
          </div>
        ) : (
          'Sin reserva asociada'
        ),
        metodoPago: formatMetodoPago(pago.metodoPago),
        monto: formatMonto(pago.monto),
        fechaPago: formatFecha(pago.fechaPago),
        estado: getEstadoBadge(pago.estado),
      })),
    [pagos],
  );

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
      rows={rows}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
