'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ArrowLeft,
  CarFront,
  CalendarDays,
  UserRound,
  CreditCard,
} from 'lucide-react';
import { useReservaById } from '@/modules/reservas/hook/useReservaById';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

const toDate = (value: Date | string) => {
  if (value instanceof Date) return value;

  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value: Date | string) => {
  const date = toDate(value);
  if (!date) return 'N/A';
  return format(date, 'dd MMMM yyyy', { locale: es });
};

const formatCurrency = (value: number | string) => {
  const amount = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(amount)) return String(value);

  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStatusLabel = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === 'confirmada') return 'Confirmada';
  if (normalized === 'en_curso') return 'En curso';
  if (normalized === 'finalizada') return 'Finalizada';
  if (normalized === 'cancelada') return 'Cancelada';
  if (normalized === 'pendiente') return 'Pendiente';
  if (normalized === 'no_show') return 'No show';

  return status || 'Sin estado';
};

const getStatusClasses = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === 'confirmada') return 'bg-success/15 text-success';
  if (normalized === 'en_curso') return 'bg-accent/20 text-accent';
  if (normalized === 'finalizada')
    return 'bg-secondary text-secondary-foreground';
  if (normalized === 'cancelada' || normalized === 'no_show')
    return 'bg-destructive/15 text-destructive';
  if (normalized === 'pendiente') return 'bg-accent/15 text-accent';

  return 'bg-secondary text-secondary-foreground';
};

export default function ReservationDetailPage() {
  const params = useParams<{ id: string }>();
  const reservationId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { reserva, isLoading, isError, error } = useReservaById(reservationId);

  if (!reservationId) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
        No se pudo resolver el ID de la reserva.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="heading-2 text-foreground">Detalle de Reserva</h1>
          <p className="text-muted-foreground">
            Consulta completa en modo solo lectura.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/dashboard/reservations">
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          Cargando detalle de la reserva...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          {error instanceof Error
            ? error.message
            : 'No se pudo cargar el detalle de la reserva.'}
        </div>
      )}

      {!isLoading && !isError && reserva && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Estado</p>
              <span
                className={cn(
                  'mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium',
                  getStatusClasses(reserva.estado),
                )}
              >
                {getStatusLabel(reserva.estado)}
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {formatCurrency(reserva.precioTotal)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Duración</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {reserva.cantidadDias} día
                {reserva.cantidadDias === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Datos del cliente
              </h2>
              <div className="space-y-3 text-sm text-foreground">
                <p className="flex items-center gap-2">
                  <UserRound className="size-4 text-accent" />
                  <span>
                    {reserva.cliente?.nombres} {reserva.cliente?.apellidos}
                  </span>
                </p>
                <p>Email: {reserva.cliente?.email ?? 'N/A'}</p>
                <p>Teléfono: {reserva.cliente?.telefono ?? 'N/A'}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Datos del vehículo
              </h2>
              <div className="space-y-3 text-sm text-foreground">
                <p className="flex items-center gap-2">
                  <CarFront className="size-4 text-accent" />
                  <span>
                    {reserva.vehiculo?.modelo?.marca}{' '}
                    {reserva.vehiculo?.modelo?.nombre} (
                    {reserva.vehiculo?.modelo?.anio ?? 'N/A'})
                  </span>
                </p>
                <p>Placa: {reserva.vehiculo?.placa ?? 'N/A'}</p>
                <p>
                  Precio por día:{' '}
                  {formatCurrency(
                    reserva.vehiculo?.modelo?.precioBaseDiario ?? 0,
                  )}
                </p>
                <p>Estado del vehículo: {reserva.vehiculo?.estado ?? 'N/A'}</p>
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Periodo de reserva
            </h2>
            <div className="grid gap-3 text-sm text-foreground md:grid-cols-2">
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-accent" />
                Inicio: {formatDate(reserva.fechaInicio)}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-accent" />
                Fin: {formatDate(reserva.fechaFin)}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Pagos asociados
            </h2>

            {!reserva.pagos?.length && (
              <p className="text-sm text-muted-foreground">
                No hay pagos registrados para esta reserva.
              </p>
            )}

            <div className="space-y-3">
              {(reserva.pagos ?? []).map((pago) => (
                <article
                  key={pago.id}
                  className="rounded-xl border border-border bg-background p-4 text-sm"
                >
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <CreditCard className="size-4 text-accent" />
                    {formatCurrency(pago.monto)} · {pago.metodoPago}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Fecha: {formatDate(pago.fechaPago)} · Estado: {pago.estado}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Referencia: {pago.referencia || 'Sin referencia'}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
