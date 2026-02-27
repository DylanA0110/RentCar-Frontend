'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useVehiculo } from '@/modules/vehiculos/hook/useVehiculo';
import { useReservas } from '@/modules/reservas/hook/useReservas';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import 'react-day-picker/style.css';
import { cn } from '@/shared/lib/utils';
import { isAfter, isBefore, isSameDay } from 'date-fns';

const priceRanges = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: '$30–$50', min: 30, max: 50 },
  { label: '$50–$70', min: 50, max: 70 },
  { label: '$70+', min: 70, max: Infinity },
];

const BLOCKING_STATUSES = new Set(['PENDIENTE', 'CONFIRMADA', 'EN_CURSO']);

const toDate = (value: Date | string) => {
  if (value instanceof Date) return value;
  // Si value es string, intentar convertir a Date
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// ...existing code...

const doesOverlap = (
  range: { from: Date; to: Date },
  reservation: { from: Date; to: Date },
) => {
  return !(
    isBefore(range.to, reservation.from) || isAfter(range.from, reservation.to)
  );
};

const CatalogClient = () => {
  const { vehiculos, isLoading, isError, error, refetch } = useVehiculo();
  const { reservas } = useReservas();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activePriceRange, setActivePriceRange] = useState(0);
  // ...existing code...
  // El filtro de fechas fue eliminado, así que definimos selectedNormalizedRange como null
  const selectedNormalizedRange = null;
  const [showFilters, setShowFilters] = useState(false);

  // ...existing code...

  const categories = useMemo(() => {
    const unique = new Set(
      (vehiculos ?? [])
        .map((vehiculo) => vehiculo.modelo?.categoria?.nombre)
        .filter(
          (nombre): nombre is string => typeof nombre === 'string' && !!nombre,
        ),
    );
    return ['Todos', ...Array.from(unique)];
  }, [vehiculos]);

  const availabilityByVehicle = useMemo(() => {
    const map = new Map<string, boolean>();

    (vehiculos ?? []).forEach((vehiculo) => {
      const hasRange = Boolean(selectedNormalizedRange);
      if (!hasRange || !selectedNormalizedRange) {
        map.set(vehiculo.id, true);
        return;
      }

      const blockedReservations = (reservas ?? [])
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
        .filter((item): item is { from: Date; to: Date } => Boolean(item));

      const overlaps = blockedReservations.some((interval) =>
        doesOverlap(selectedNormalizedRange, interval),
      );
      map.set(vehiculo.id, !overlaps);
    });

    return map;
  }, [vehiculos, reservas, selectedNormalizedRange]);

  const filtered = useMemo(() => {
    return (vehiculos ?? []).filter((v) => {
      const name = `${v.modelo?.marca ?? ''} ${v.modelo?.nombre ?? ''}`.trim();
      const category = v.modelo?.categoria?.nombre ?? 'Sin categoria';
      const precio = Number(v.modelo?.precioBaseDiario ?? 0);
      const matchSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase()) ||
        (v.placa ?? '').toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === 'Todos' || category === activeCategory;
      const range = priceRanges[activePriceRange];
      const matchPrice =
        Number.isFinite(precio) && precio >= range.min && precio <= range.max;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [vehiculos, search, activeCategory, activePriceRange]);

  const activeFiltersCount =
    (activeCategory !== 'Todos' ? 1 : 0) +
    (activePriceRange !== 0 ? 1 : 0) +
    (selectedNormalizedRange ? 1 : 0);

  function setSelectedRange(undefined: undefined) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-3">
            Catálogo
          </h1>
          <p className="text-muted-foreground">
            Elige fechas primero y mira qué carro está disponible antes de
            reservar.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por modelo, categoría o placa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border"
            />
          </div>

          <Button
            variant="outline"
            className="h-11 rounded-xl gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-2xl p-6 mb-6 border border-border/50 bg-card space-y-5">
            {/* Fechas de viaje (calendario) eliminado */}

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">
                Rango de precio
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setActiveCategory('Todos');
                    setActivePriceRange(0);
                    setSelectedRange(undefined);
                    setSearch('');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {priceRanges.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() => setActivePriceRange(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    activePriceRange === i
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            Cargando vehículos...
          </p>
        )}

        {isError && (
          <div className="mb-6">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : 'No se pudieron cargar los vehículos.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 rounded-xl"
              onClick={() => refetch()}
            >
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} vehículo{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => {
            const imagenPrincipal =
              v.imagenes?.find((img) => img.url)?.url ??
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"%3E%3Crect width="640" height="360" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="24"%3ESin imagen%3C/text%3E%3C/svg%3E';

            const isAvailable = availabilityByVehicle.get(v.id) ?? true;

            return (
              <article
                key={v.id}
                className={cn(
                  'group bg-card rounded-2xl shadow-sm transition-all duration-300 overflow-hidden border border-border/50',
                  isAvailable ? 'hover:shadow-lg' : 'opacity-85',
                )}
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={imagenPrincipal}
                    alt={
                      `${v.modelo?.marca ?? ''} ${v.modelo?.nombre ?? ''}`.trim() ||
                      'Vehículo'
                    }
                    className={cn(
                      'w-full h-full object-cover transition-transform duration-500',
                      isAvailable ? 'group-hover:scale-105' : 'grayscale',
                    )}
                    loading="lazy"
                  />
                  {selectedNormalizedRange && (
                    <span
                      className={cn(
                        'absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium',
                        isAvailable
                          ? 'bg-success/15 text-success'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {isAvailable ? 'Disponible' : 'Ocupado en ese rango'}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                      {v.modelo?.categoria?.nombre ?? 'Sin categoría'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {v.modelo?.anio ?? 'N/A'} · {v.placa}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {v.modelo?.marca} {v.modelo?.nombre}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-semibold text-foreground">
                        ${Number(v.modelo?.precioBaseDiario ?? 0).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /día
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="rounded-xl"
                      asChild
                      disabled={
                        Boolean(selectedNormalizedRange) && !isAvailable
                      }
                    >
                      <Link href={`/catalog/${v.id}`}>Reservar</Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No se encontraron vehículos con esos filtros.
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-xl"
              onClick={() => {
                setSearch('');
                setActiveCategory('Todos');
                setActivePriceRange(0);
                setSelectedRange(undefined);
              }}
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogClient;
