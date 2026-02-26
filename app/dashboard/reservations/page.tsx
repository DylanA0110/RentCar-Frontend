'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CarFront, RefreshCw, UserRound } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfToday,
} from 'date-fns';
import { useReservas } from '@/modules/reservas/hook/useReservas';
import { useVehiculo } from '@/modules/vehiculos/hook/useVehiculo';
import { getVehiculoNombre } from '@/modules/vehiculos/utils/vehiculo-view';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import 'react-day-picker/style.css';

const toDate = (value: Date | string) => {
  if (value instanceof Date) return value;

  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getVehiculoTitulo = (reserva: {
  vehiculo?: {
    placa?: string;
    modelo?: { marca?: string; nombre?: string };
  };
}) => {
  const marca = reserva.vehiculo?.modelo?.marca?.trim();
  const nombreModelo = reserva.vehiculo?.modelo?.nombre?.trim();
  const placa = reserva.vehiculo?.placa?.trim();

  const nombre = [marca, nombreModelo].filter(Boolean).join(' ');
  if (nombre) return nombre;
  if (placa) return `Vehículo ${placa}`;
  return 'Vehículo no disponible';
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

  if (normalized === 'confirmada') {
    return 'Confirmada';
  }

  if (normalized === 'en_curso') {
    return 'En curso';
  }

  if (normalized === 'finalizada') {
    return 'Finalizada';
  }

  if (normalized === 'cancelada') {
    return 'Cancelada';
  }

  if (normalized === 'pendiente') {
    return 'Pendiente';
  }

  if (normalized === 'no_show') {
    return 'No show';
  }

  return status || 'Sin estado';
};

const getStatusClasses = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === 'confirmada') {
    return 'bg-success/15 text-success';
  }

  if (normalized === 'en_curso') {
    return 'bg-accent/20 text-accent';
  }

  if (normalized === 'finalizada') {
    return 'bg-secondary text-secondary-foreground';
  }

  if (normalized === 'cancelada' || normalized === 'no_show') {
    return 'bg-destructive/15 text-destructive';
  }

  if (normalized === 'pendiente') {
    return 'bg-accent/15 text-accent';
  }

  return 'bg-secondary text-secondary-foreground';
};

const formatDate = (value: Date | string) => {
  const date = toDate(value);
  if (!date) return 'N/A';
  return format(date, 'dd MMM yyyy', { locale: es });
};

const isBlockingStatus = (status: string) => {
  const normalized = status.toLowerCase();
  return normalized === 'pendiente' || normalized === 'confirmada';
};

const isDateInsideReservation = (
  date: Date,
  startValue: Date | string,
  endValue: Date | string,
) => {
  const start = toDate(startValue);
  const end = toDate(endValue);

  if (!start || !end) return false;

  const from = isBefore(start, end) || isSameDay(start, end) ? start : end;
  const to = isAfter(start, end) ? start : end;

  return isWithinInterval(date, { start: from, end: to });
};

const getPaymentStatus = (
  total: number | string,
  pagos: Array<{ monto: number | string; estado: string }> = [],
) => {
  if (pagos.length === 0) {
    return {
      label: 'Sin pago',
      classes: 'bg-secondary text-secondary-foreground',
    };
  }

  const target = Number(total) || 0;
  const paidAmount = pagos
    .filter((pago) => pago.estado?.toLowerCase() === 'aprobado')
    .reduce((sum, pago) => sum + (Number(pago.monto) || 0), 0);

  const hasRejected = pagos.some(
    (pago) => pago.estado?.toLowerCase() === 'rechazado',
  );
  const hasPending = pagos.some(
    (pago) => pago.estado?.toLowerCase() === 'pendiente',
  );

  if (target > 0 && paidAmount >= target) {
    return { label: 'Pagada', classes: 'bg-success/15 text-success' };
  }

  if (paidAmount > 0 && target > 0 && paidAmount < target) {
    return { label: 'Pago parcial', classes: 'bg-accent/15 text-accent' };
  }

  if (hasPending) {
    return { label: 'Pago pendiente', classes: 'bg-accent/15 text-accent' };
  }

  if (hasRejected) {
    return {
      label: 'Pago rechazado',
      classes: 'bg-destructive/15 text-destructive',
    };
  }

  return {
    label: 'En revisión',
    classes: 'bg-secondary text-secondary-foreground',
  };
};

const getApprovalStatus = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === 'pendiente') {
    return {
      label: 'Requiere aprobación',
      classes: 'bg-accent/15 text-accent',
    };
  }

  if (normalized === 'confirmada') {
    return {
      label: 'Aprobada',
      classes: 'bg-success/15 text-success',
    };
  }

  if (normalized === 'cancelada') {
    return {
      label: 'No aprobada',
      classes: 'bg-destructive/15 text-destructive',
    };
  }

  return {
    label: 'Cerrada',
    classes: 'bg-secondary text-secondary-foreground',
  };
};

export default function ReservationsPage() {
  const { reservas, isLoading, isError, error, refetch } = useReservas();
  const { vehiculos, isLoading: isVehiclesLoading } = useVehiculo();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');

  const reservasSeguras = useMemo(() => reservas ?? [], [reservas]);

  const vehicleOptions = useMemo(
    () =>
      (vehiculos ?? [])
        .map((vehiculo) => ({
          id: vehiculo.id,
          label: getVehiculoNombre(vehiculo),
          placa: vehiculo.placa?.trim() || 'Sin placa',
        }))
        .sort((left, right) => {
          const leftLabel = `${left.label} ${left.placa}`.toLowerCase();
          const rightLabel = `${right.label} ${right.placa}`.toLowerCase();
          return leftLabel.localeCompare(rightLabel);
        }),
    [vehiculos],
  );

  const filteredReservations = useMemo(
    () =>
      selectedVehicleId === 'all'
        ? reservasSeguras
        : reservasSeguras.filter(
            (reserva) => reserva.vehiculo?.id === selectedVehicleId,
          ),
    [reservasSeguras, selectedVehicleId],
  );

  const blockingReservations = useMemo(
    () =>
      filteredReservations.filter((reserva) =>
        isBlockingStatus(reserva.estado),
      ),
    [filteredReservations],
  );

  const reservationRanges = useMemo(
    () =>
      blockingReservations
        .map((reserva) => {
          const start = toDate(reserva.fechaInicio);
          const end = toDate(reserva.fechaFin);

          if (!start || !end) return null;

          return start <= end ? { start, end } : { start: end, end: start };
        })
        .filter((range): range is { start: Date; end: Date } => Boolean(range)),
    [blockingReservations],
  );

  const isOverlapMultiVehicleDay = (date: Date) => {
    if (selectedVehicleId !== 'all') return false;

    const uniqueVehicles = new Set<string>();

    for (const reserva of blockingReservations) {
      const vehicleId = reserva.vehiculo?.id;
      if (!vehicleId) continue;

      if (
        isDateInsideReservation(date, reserva.fechaInicio, reserva.fechaFin)
      ) {
        uniqueVehicles.add(vehicleId);
        if (uniqueVehicles.size > 1) return true;
      }
    }

    return false;
  };

  const reservationsOfSelectedDay = useMemo(
    () =>
      filteredReservations
        .filter((reserva) =>
          isDateInsideReservation(
            selectedDate,
            reserva.fechaInicio,
            reserva.fechaFin,
          ),
        )
        .sort((a, b) => {
          const left = toDate(a.fechaInicio)?.getTime() ?? 0;
          const right = toDate(b.fechaInicio)?.getTime() ?? 0;
          return left - right;
        }),
    [filteredReservations, selectedDate],
  );

  const reservationsInMonth = useMemo(
    () =>
      filteredReservations.filter((reserva) => {
        const startDate = toDate(reserva.fechaInicio);
        return startDate ? isSameMonth(startDate, currentMonth) : false;
      }).length,
    [filteredReservations, currentMonth],
  );

  const confirmedCount = useMemo(
    () =>
      filteredReservations.filter(
        (reserva) => reserva.estado.toLowerCase() === 'confirmada',
      ).length,
    [filteredReservations],
  );

  const totalRevenue = useMemo(
    () =>
      filteredReservations.reduce(
        (sum, reserva) => sum + (Number(reserva.precioTotal) || 0),
        0,
      ),
    [filteredReservations],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="heading-2 text-foreground">Sistema de Reservas</h1>
          <p className="text-muted-foreground">
            Selecciona una fecha para ver reservas y administrar el flujo
            diario.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn('size-4', isLoading && 'animate-spin')} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Reservas este mes</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {reservationsInMonth}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Confirmadas</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {confirmedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Ingresos estimados</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <CalendarDays className="size-5 text-accent" />
              <h2 className="text-lg font-semibold">Calendario de reservas</h2>
            </div>

            <select
              value={selectedVehicleId}
              onChange={(event) => setSelectedVehicleId(event.target.value)}
              className="w-full md:w-90 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">Todos los vehículos</option>
              {!isVehiclesLoading && vehicleOptions.length === 0 && (
                <option value="" disabled>
                  No hay vehículos disponibles
                </option>
              )}
              {vehicleOptions.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.label} · {vehicle.placa}
                </option>
              ))}
            </select>
          </div>

          <DayPicker
            mode="single"
            locale={es}
            showOutsideDays
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={selectedDate}
            onSelect={(date) => {
              if (date) setSelectedDate(date);
            }}
            modifiers={{
              hasReservations: (date) =>
                reservationRanges.some((range) =>
                  isWithinInterval(date, {
                    start: range.start,
                    end: range.end,
                  }),
                ),
              multiVehicleOverlap: (date) => isOverlapMultiVehicleDay(date),
            }}
            modifiersClassNames={{
              selected: 'ring-2 ring-accent rounded-full',
              today: 'ring-1 ring-accent rounded-full',
              hasReservations:
                '!bg-destructive/80 !text-destructive-foreground rounded-full font-semibold',
              multiVehicleOverlap:
                '!bg-destructive !text-destructive-foreground rounded-full ring-2 ring-destructive',
            }}
            className="rounded-xl border border-border bg-background p-3"
          />

          <p className="mt-3 text-xs text-muted-foreground">
            {selectedVehicleId === 'all'
              ? 'Rojo claro: día reservado. Rojo intenso: mismo día ocupado por varios vehículos.'
              : 'Los días en rojo tienen reservas bloqueantes (pendientes o confirmadas) para este vehículo.'}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Reservas del {format(selectedDate, 'dd/MM/yyyy')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {reservationsOfSelectedDay.length} reserva
            {reservationsOfSelectedDay.length === 1 ? '' : 's'}
          </p>

          {isError && (
            <div className="mt-4 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : 'No se pudieron cargar las reservas.'}
            </div>
          )}

          {isLoading && (
            <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              Cargando reservas...
            </div>
          )}

          {!isLoading && !isError && reservationsOfSelectedDay.length === 0 && (
            <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
              No hay reservas para este día.
            </div>
          )}

          <div className="mt-4 space-y-3">
            {reservationsOfSelectedDay.map((reserva) => {
              const cliente =
                `${reserva.cliente?.nombres ?? ''} ${reserva.cliente?.apellidos ?? ''}`.trim();
              const vehiculo = getVehiculoTitulo(reserva);

              return (
                <article
                  key={reserva.id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {cliente || 'Cliente no disponible'}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <CarFront className="size-4" />
                        <span>{vehiculo}</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        getStatusClasses(reserva.estado),
                      )}
                    >
                      {getStatusLabel(reserva.estado)}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4" />
                      <span>
                        {formatDate(reserva.fechaInicio)} →{' '}
                        {formatDate(reserva.fechaFin)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRound className="size-4" />
                      <span>
                        {reserva.cantidadDias} día
                        {reserva.cantidadDias === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        getApprovalStatus(reserva.estado).classes,
                      )}
                    >
                      {getApprovalStatus(reserva.estado).label}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        getPaymentStatus(reserva.precioTotal, reserva.pagos)
                          .classes,
                      )}
                    >
                      {
                        getPaymentStatus(reserva.precioTotal, reserva.pagos)
                          .label
                      }
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {reserva.vehiculo?.placa ?? 'Sin placa'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm font-medium text-foreground">
                      Total: {formatCurrency(reserva.precioTotal)}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/reservations/${reserva.id}`}>
                        Ver detalle
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
