'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPicker, type DateRange } from 'react-day-picker';
import {
  ArrowLeft,
  CalendarDays,
  CarFront,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { getVehiculoById } from '@/modules/vehiculos/actions/get-vehiculo-by-id';
import { useReservas } from '@/modules/reservas/hook/useReservas';
import { getPrecioModeloPorFecha } from '@/modules/modelos/actions/get-precio-modelo-por-fecha';
import { createReserva } from '@/modules/reservas/actions/create-reserva';
import { createPago } from '@/modules/pagos/actions/create-pago';
import { useClientes } from '@/modules/clientes/hook/useClientes';
import { getVehiculoNombre } from '@/modules/vehiculos/utils/vehiculo-view';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

import 'react-day-picker/style.css';

interface VehicleReservationClientProps {
  vehicleId: string;
}

type PricingDay = {
  fecha: string;
  precioDiario: number;
  fuente: 'temporada' | 'base';
};

const BLOCKING_STATUSES = new Set(['PENDIENTE', 'CONFIRMADA', 'EN_CURSO']);
const MIN_DAYS = 1;

const toDate = (value: Date | string) => {
  if (value instanceof Date) return value;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeRange = (range?: DateRange) => {
  if (!range?.from || !range?.to) return null;
  const from =
    isBefore(range.from, range.to) || isSameDay(range.from, range.to)
      ? range.from
      : range.to;
  const to = isAfter(range.from, range.to) ? range.from : range.to;
  return { from, to };
};

const getChargeableDates = (range?: DateRange) => {
  const normalized = normalizeRange(range);
  if (!normalized) return [] as Date[];

  const { from, to } = normalized;
  if (isSameDay(from, to)) return [from];

  const dates: Date[] = [];
  let cursor = from;
  while (isBefore(cursor, to)) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 2,
  }).format(value);
};

export default function VehicleReservationClient({
  vehicleId,
}: VehicleReservationClientProps) {
  const queryClient = useQueryClient();
  const { reservas, isLoading: isReservationsLoading } = useReservas();
  const { clientes, isLoading: isClientsLoading } = useClientes();
  const {
    data: vehiculo,
    isLoading: isVehicleLoading,
    isError: isVehicleError,
    error: vehicleError,
  } = useQuery({
    queryKey: ['vehiculo', vehicleId],
    queryFn: ({ signal }) => getVehiculoById(vehicleId, { signal }),
    enabled: Boolean(vehicleId),
    staleTime: 1000 * 60 * 5,
  });

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [pricingDays, setPricingDays] = useState<PricingDay[]>([]);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState<'summary' | 'payment'>(
    'summary',
  );

  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicleImages = useMemo(() => {
    const urls =
      vehiculo?.imagenes
        ?.map((img) => img.url?.trim())
        .filter((url): url is string => Boolean(url)) ?? [];

    if (urls.length > 0) {
      return urls;
    }

    return [
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"%3E%3Crect width="800" height="500" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="28"%3ESin imagen%3C/text%3E%3C/svg%3E',
    ];
  }, [vehiculo]);

  const activeVehicleImage =
    vehicleImages[activeImageIndex] ?? vehicleImages[0] ?? '';

  const disabledIntervals = useMemo(() => {
    if (!vehiculo?.id) return [] as Array<{ from: Date; to: Date }>;

    return (reservas ?? [])
      .filter(
        (reserva) =>
          reserva.vehiculo?.id === vehiculo.id &&
          BLOCKING_STATUSES.has(reserva.estado),
      )
      .map((reserva) => {
        const start = toDate(reserva.fechaInicio);
        const end = toDate(reserva.fechaFin);
        if (!start || !end) return null;

        const from =
          isBefore(start, end) || isSameDay(start, end) ? start : end;
        const to = isAfter(start, end) ? start : end;
        return { from, to };
      })
      .filter((interval): interval is { from: Date; to: Date } =>
        Boolean(interval),
      );
  }, [reservas, vehiculo?.id]);

  useEffect(() => {
    setSelectedRange(undefined);
    setPricingDays([]);
    setCheckoutStep('summary');
    setDraftRange(undefined);
    setActiveImageIndex(0);
  }, [vehiculo?.id]);

  useEffect(() => {
    const loadPricing = async () => {
      const modeloId = vehiculo?.modelo?.id;
      if (!modeloId) {
        setPricingDays([]);
        return;
      }

      const dates = getChargeableDates(selectedRange);
      if (dates.length === 0) {
        setPricingDays([]);
        return;
      }

      setIsPricingLoading(true);
      try {
        const results = await Promise.all(
          dates.map(async (date) => {
            const isoDate = format(date, 'yyyy-MM-dd');
            const price = await getPrecioModeloPorFecha(modeloId, isoDate);
            return {
              fecha: isoDate,
              precioDiario: Number(price.precioDiario) || 0,
              fuente: price.fuente,
            } satisfies PricingDay;
          }),
        );

        setPricingDays(results);
      } catch {
        const fallback = Number(vehiculo?.modelo?.precioBaseDiario) || 0;
        const fallbackDays = dates.map((date) => ({
          fecha: format(date, 'yyyy-MM-dd'),
          precioDiario: fallback,
          fuente: 'base' as const,
        }));
        setPricingDays(fallbackDays);
      } finally {
        setIsPricingLoading(false);
      }
    };

    loadPricing();
  }, [selectedRange, vehiculo?.modelo?.id, vehiculo?.modelo?.precioBaseDiario]);

  const totalAmount = useMemo(
    () => pricingDays.reduce((sum, day) => sum + day.precioDiario, 0),
    [pricingDays],
  );

  const selectedRangeLabel = useMemo(() => {
    const normalized = normalizeRange(selectedRange);
    if (!normalized?.from) return 'Selecciona tus fechas';
    if (!normalized.to)
      return `${format(normalized.from, 'dd/MM/yyyy')} · Falta salida`;
    return `${format(normalized.from, 'dd/MM/yyyy')} → ${format(
      normalized.to,
      'dd/MM/yyyy',
    )}`;
  }, [selectedRange]);

  const totalDays = pricingDays.length;
  const canContinueToPayment = totalDays >= MIN_DAYS;
  const defaultCliente = useMemo(
    () =>
      (clientes ?? []).find((cliente) => cliente.estado === 'activo') ??
      clientes?.[0],
    [clientes],
  );
  const draftNormalizedRange = normalizeRange(draftRange);
  const canApplyDraftDates = Boolean(
    draftNormalizedRange?.from && draftNormalizedRange?.to,
  );
  const draftSelectedDays = useMemo(
    () => getChargeableDates(draftRange).length,
    [draftRange],
  );

  const handleCheckout = async () => {
    if (!vehiculo) {
      toast.error('No se pudo cargar el vehículo');
      return;
    }

    if (!canContinueToPayment) {
      toast.error(`La reserva mínima es de ${MIN_DAYS} días`);
      return;
    }

    if (
      !cardHolder.trim() ||
      !cardNumber.trim() ||
      !expiry.trim() ||
      !cvc.trim()
    ) {
      toast.error('Completa los datos de la tarjeta');
      return;
    }

    if (!defaultCliente?.id) {
      toast.error('No hay cliente disponible para registrar la reserva.');
      return;
    }

    const normalizedRange = normalizeRange(selectedRange);
    if (!normalizedRange) {
      toast.error('Selecciona fecha de inicio y fin');
      return;
    }

    setIsSubmitting(true);
    try {
      const fechaInicio = format(normalizedRange.from, 'yyyy-MM-dd');
      const fechaFin = format(normalizedRange.to, 'yyyy-MM-dd');

      const reserva = await createReserva({
        fechaInicio,
        fechaFin,
        cantidadDias: totalDays,
        precioTotal: totalAmount,
        vehiculoId: vehiculo.id,
        clienteId: defaultCliente.id,
        estado: 'PENDIENTE',
      });

      const referencia = `CARD-${cardNumber.trim().slice(-4)}-${Date.now()}`;

      await createPago({
        reservaId: reserva.id,
        monto: totalAmount,
        metodoPago: 'TARJETA',
        estado: 'APROBADO',
        referencia,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['reservas'] }),
        queryClient.invalidateQueries({ queryKey: ['pagos'] }),
      ]);

      setCheckoutStep('summary');
      setCardHolder('');
      setCardNumber('');
      setExpiry('');
      setCvc('');

      toast.success(
        `Reserva creada y pagada por ${formatCurrency(totalAmount)} para ${getVehiculoNombre(vehiculo)}.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo completar la reserva y pago',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVehicleLoading) {
    return (
      <section className="pt-24 pb-16">
        <div className="container mx-auto rounded-2xl border border-border bg-card p-8 text-muted-foreground">
          Cargando detalle del vehículo...
        </div>
      </section>
    );
  }

  if (isVehicleError || !vehiculo) {
    return (
      <section className="pt-24 pb-16">
        <div className="container mx-auto rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
          {vehicleError instanceof Error
            ? vehicleError.message
            : 'No se pudo cargar el vehículo.'}
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-16">
      <div className="container mx-auto space-y-6">
        <Button variant="outline" asChild>
          <Link href="/catalog">
            <ArrowLeft className="size-4" />
            Volver al catálogo
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="space-y-4 p-4 md:p-5">
                <div className="overflow-hidden rounded-xl bg-muted">
                  <div className="h-64 w-full md:h-96">
                    <img
                      src={activeVehicleImage}
                      alt={getVehiculoNombre(vehiculo)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {vehicleImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {vehicleImages.map((imageUrl, index) => (
                      <button
                        type="button"
                        key={`${imageUrl}-${index}`}
                        onClick={() => setActiveImageIndex(index)}
                        className={cn(
                          'h-16 w-24 shrink-0 overflow-hidden rounded-md border',
                          activeImageIndex === index
                            ? 'border-accent ring-1 ring-accent'
                            : 'border-border',
                        )}
                        aria-label={`Ver imagen ${index + 1}`}
                      >
                        <img
                          src={imageUrl}
                          alt={`${getVehiculoNombre(vehiculo)} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {getVehiculoNombre(vehiculo)}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {vehiculo.modelo?.categoria?.nombre ?? 'Sin categoría'} ·
                    Placa {vehiculo.placa}
                  </p>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>Año: {vehiculo.modelo?.anio ?? 'N/A'}</p>
                    <p>Color: {vehiculo.color ?? 'N/A'}</p>
                    <p>
                      Combustible: {vehiculo.modelo?.tipoCombustible ?? 'N/A'}
                    </p>
                    <p>
                      Pasajeros: {vehiculo.modelo?.capacidadPasajeros ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-foreground">
                <CarFront className="size-4 text-accent" />
                <span className="font-medium">Resumen de reserva</span>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Días</span>
                  <span>{totalDays}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-muted-foreground">
                  <span>Precio diario base</span>
                  <span>
                    {formatCurrency(
                      Number(vehiculo.modelo?.precioBaseDiario) || 0,
                    )}
                  </span>
                </div>
                <div className="mt-3 border-t border-border pt-3 flex items-center justify-between text-foreground font-semibold">
                  <span>Total estimado</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {isPricingLoading && (
                <p className="text-xs text-muted-foreground">
                  Calculando precio por fecha...
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-accent" />
                <span>Primero revisas el total, luego pasas al pago.</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDraftRange(selectedRange);
                  setIsCalendarOpen(true);
                }}
                className="w-full rounded-2xl border border-border bg-background p-3 text-left hover:border-accent/50 transition-colors"
              >
                <div className="mb-2 flex items-center gap-2 text-foreground">
                  <CalendarDays className="size-4 text-accent" />
                  <span className="font-medium text-sm">Fechas de reserva</span>
                </div>

                <p className="text-sm text-foreground">{selectedRangeLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Toca para abrir el calendario.
                </p>
              </button>

              <Button
                className="w-full rounded-xl h-11"
                disabled={
                  !canContinueToPayment ||
                  isPricingLoading ||
                  isReservationsLoading ||
                  isClientsLoading
                }
                onClick={() => setCheckoutStep('payment')}
              >
                Continuar a pago
              </Button>
              {!canContinueToPayment && (
                <p className="text-xs text-muted-foreground">
                  Debes seleccionar al menos {MIN_DAYS} días para continuar.
                </p>
              )}
            </div>

            {checkoutStep === 'payment' && (
              <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2 text-foreground">
                  <CreditCard className="size-4 text-accent" />
                  <h2 className="text-lg font-semibold">
                    Pago con tarjeta (demo)
                  </h2>
                </div>

                <Input
                  value={cardHolder}
                  onChange={(event) => setCardHolder(event.target.value)}
                  placeholder="Nombre del titular"
                />
                <Input
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                  placeholder="Número de tarjeta"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={expiry}
                    onChange={(event) => setExpiry(event.target.value)}
                    placeholder="MM/AA"
                  />
                  <Input
                    value={cvc}
                    onChange={(event) => setCvc(event.target.value)}
                    placeholder="CVC"
                  />
                </div>

                <Button
                  className={cn(
                    'w-full rounded-xl h-11',
                    isSubmitting && 'opacity-80',
                  )}
                  onClick={handleCheckout}
                  disabled={
                    isSubmitting ||
                    isReservationsLoading ||
                    isPricingLoading ||
                    isClientsLoading
                  }
                >
                  {isSubmitting ? 'Procesando pago...' : 'Pagar reserva'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-4 md:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Selecciona fechas
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCalendarOpen(false)}
              >
                Cerrar
              </Button>
            </div>

            <DayPicker
              mode="range"
              locale={es}
              showOutsideDays
              numberOfMonths={2}
              pagedNavigation
              selected={draftRange}
              onSelect={setDraftRange}
              className="text-xs"
              classNames={{
                months: 'flex flex-col gap-4 md:flex-row md:gap-6',
                month: 'space-y-2',
                caption: 'flex justify-center py-1 relative items-center',
                caption_label: 'text-sm font-semibold',
                nav_button: 'h-8 w-8',
                table: 'w-full border-collapse',
                head_row: 'flex gap-1',
                head_cell:
                  'text-muted-foreground rounded-md w-9 font-normal text-[0.74rem]',
                row: 'flex w-full mt-1 gap-1',
                cell: 'h-9 w-9 text-center text-xs p-0 relative',
                day: 'h-9 w-9 p-0 font-normal rounded-md',
              }}
              disabled={[
                { before: new Date() },
                ...disabledIntervals.map((interval) => ({
                  from: interval.from,
                  to: interval.to,
                })),
              ]}
              modifiers={{
                booked: (date) =>
                  disabledIntervals.some(
                    (interval) =>
                      (isAfter(date, interval.from) ||
                        isSameDay(date, interval.from)) &&
                      (isBefore(date, interval.to) ||
                        isSameDay(date, interval.to)),
                  ),
              }}
              modifiersClassNames={{
                range_start: '!bg-accent !text-accent-foreground rounded-md',
                range_middle: '!bg-accent/20 !text-foreground rounded-none',
                range_end: '!bg-accent !text-accent-foreground rounded-md',
                selected: '!bg-accent !text-accent-foreground rounded-md',
                today: 'ring-1 ring-accent rounded-md',
                booked:
                  '!bg-muted !text-muted-foreground line-through rounded-md opacity-80 cursor-not-allowed',
              }}
            />

            <p className="mt-4 text-xs text-muted-foreground">
              Días en gris = ocupados. Selección mínima: {MIN_DAYS} día.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Días seleccionados: {draftSelectedDays}
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDraftRange(undefined)}
              >
                Limpiar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDraftRange(selectedRange);
                  setIsCalendarOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!canApplyDraftDates}
                onClick={() => {
                  if (!canApplyDraftDates) return;
                  setSelectedRange(draftRange);
                  setIsCalendarOpen(false);
                }}
              >
                Aplicar fechas
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
