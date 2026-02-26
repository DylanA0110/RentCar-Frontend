'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useVehiculo } from '@/modules/vehiculos/hook/useVehiculo';
import { inactivateVehiculo } from '@/modules/vehiculos/actions/inactivate-vehiculo';
import type {
  Vehiculo,
  VehiculoImagen,
} from '@/modules/vehiculos/types/vehiculo.interface';
import {
  getVehiculoAnio,
  getVehiculoCategoriaNombre,
  getVehiculoNombre,
  getVehiculoPrecioBaseDiario,
} from '@/modules/vehiculos/utils/vehiculo-view';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

const PAGE_SIZE = 6;

const formatPrecio = (precio: number | string) => {
  const value = typeof precio === 'string' ? Number(precio) : precio;
  if (Number.isNaN(value)) return String(precio);
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 0,
  }).format(value);
};

const sortImagenes = (imagenes: VehiculoImagen[]) => {
  return [...imagenes].sort((a, b) => {
    if (a.esPrincipal === b.esPrincipal) return 0;
    return a.esPrincipal ? -1 : 1;
  });
};

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeImage, setActiveImage] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [inactivatingById, setInactivatingById] = useState<
    Record<string, boolean>
  >({});

  const {
    vehiculos,
    isLoading: isVehiclesLoading,
    isError,
    refetch,
  } = useVehiculo();

  const imagesByVehicle = useMemo(() => {
    const grouped = new Map<string, VehiculoImagen[]>();
    (vehiculos ?? []).forEach((vehicle) => {
      const validImages = sortImagenes(
        (vehicle.imagenes ?? []).filter((img) => Boolean(img.url?.trim())),
      );
      grouped.set(vehicle.id, validImages);
    });
    return grouped;
  }, [vehiculos]);

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return vehiculos ?? [];
    return (vehiculos ?? []).filter((vehicle) => {
      const values = [
        getVehiculoNombre(vehicle),
        vehicle.placa,
        getVehiculoCategoriaNombre(vehicle),
        vehicle.estado,
        vehicle.color,
      ];
      return values.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(term),
      );
    });
  }, [vehiculos, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVehicles.length / PAGE_SIZE),
  );
  const pageVehicles = filteredVehicles.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handlePrev = (vehicleId: string, total: number) => {
    setActiveImage((prev) => {
      const current = prev[vehicleId] ?? 0;
      const nextIndex = (current - 1 + total) % total;
      return { ...prev, [vehicleId]: nextIndex };
    });
  };

  const handleNext = (vehicleId: string, total: number) => {
    setActiveImage((prev) => {
      const current = prev[vehicleId] ?? 0;
      const nextIndex = (current + 1) % total;
      return { ...prev, [vehicleId]: nextIndex };
    });
  };

  const toggleExpanded = (vehicleId: string) => {
    setExpanded((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInactivate = async (vehicle: Vehiculo) => {
    const vehicleName = getVehiculoNombre(vehicle);
    const confirmed = window.confirm(
      `¿Estás seguro de marcar en reparación este vehículo (${vehicleName})?`,
    );

    if (!confirmed) return;

    setInactivatingById((prev) => ({ ...prev, [vehicle.id]: true }));
    try {
      await inactivateVehiculo(vehicle.id);
      toast.success('Vehículo inactivado correctamente');
      await refetch();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo inactivar el vehículo',
      );
    } finally {
      setInactivatingById((prev) => ({ ...prev, [vehicle.id]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="heading-2 text-foreground">Gestion de Vehiculos</h1>
          <p className="text-muted-foreground">
            Vista premium de la flota con detalles e imagenes.
          </p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-accent-foreground transition-all duration-300 hover:opacity-90"
        >
          <Plus size={20} />
          Crear Nuevo
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por modelo, placa, categoría o estado"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {filteredVehicles.length} vehiculos · Pagina {page} de {totalPages}
          </span>
        </div>
      </div>

      {isVehiclesLoading && filteredVehicles.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          Cargando flota...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-10 text-center text-destructive">
          No se pudieron cargar los vehiculos.
        </div>
      )}

      {!isVehiclesLoading && !isError && (
        <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {pageVehicles.map((vehicle) => {
            const images = imagesByVehicle.get(vehicle.id) ?? [];
            const currentIndex = activeImage[vehicle.id] ?? 0;
            const isExpanded = expanded[vehicle.id] ?? false;

            return (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                images={images}
                currentIndex={currentIndex}
                isExpanded={isExpanded}
                onPrev={handlePrev}
                onNext={handleNext}
                onToggleDetails={toggleExpanded}
                onInactivate={handleInactivate}
                isInactivating={Boolean(inactivatingById[vehicle.id])}
              />
            );
          })}
        </div>
      )}

      {filteredVehicles.length === 0 && !isVehiclesLoading && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          No hay vehiculos que coincidan con tu busqueda.
        </div>
      )}

      {filteredVehicles.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

interface VehicleCardProps {
  vehicle: Vehiculo;
  images: VehiculoImagen[];
  currentIndex: number;
  isExpanded: boolean;
  onPrev: (vehicleId: string, total: number) => void;
  onNext: (vehicleId: string, total: number) => void;
  onToggleDetails: (vehicleId: string) => void;
  onInactivate: (vehicle: Vehiculo) => void;
  isInactivating: boolean;
}

const VehicleCard = ({
  vehicle,
  images,
  currentIndex,
  isExpanded,
  onPrev,
  onNext,
  onToggleDetails,
  onInactivate,
  isInactivating,
}: VehicleCardProps) => {
  const hasImages = images.length > 0;
  const safeIndex = hasImages ? currentIndex % images.length : 0;
  const currentImage = hasImages ? images[safeIndex] : undefined;
  const vehicleName = getVehiculoNombre(vehicle);
  const vehicleCategory = getVehiculoCategoriaNombre(vehicle);
  const vehicleYear = getVehiculoAnio(vehicle);
  const vehiclePrice = getVehiculoPrecioBaseDiario(vehicle);
  const isInRepair = vehicle.estado === 'en reparacion';

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_-45px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {hasImages ? (
          <Image
            key={currentImage?.id}
            src={currentImage?.url ?? ''}
            alt={vehicleName}
            fill
            sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-secondary text-muted-foreground">
            <Car size={40} />
          </div>
        )}

        {hasImages && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPrev(vehicle.id, images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2 text-foreground shadow-sm transition hover:bg-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => onNext(vehicle.id, images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2 text-foreground shadow-sm transition hover:bg-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {vehicleName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehicleCategory}
              {vehicleYear ? ` · ${vehicleYear}` : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Por dia
            </p>
            <p className="text-lg font-semibold text-foreground">
              {vehiclePrice === null ? 'N/A' : formatPrecio(vehiclePrice)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {vehicle.estado}
          </span>
          {hasImages && (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {images.length} imagen{images.length === 1 ? '' : 'es'}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleDetails(vehicle.id)}
            className="text-sm font-medium text-accent"
          >
            {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Placa {vehicle.placa}
            </span>
            <button
              type="button"
              onClick={() => onInactivate(vehicle)}
              disabled={isInRepair || isInactivating}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-lg border transition',
                isInRepair
                  ? 'cursor-not-allowed border-slate-200 text-slate-300'
                  : 'border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
              )}
              aria-label="Inactivar vehículo"
              title={
                isInRepair
                  ? 'El vehículo ya está en reparación'
                  : 'Marcar vehículo en reparación'
              }
            >
              <Trash2 size={14} />
            </button>
            <Link
              href={`/dashboard/vehicles/${vehicle.id}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Editar vehículo"
            >
              <Pencil size={14} />
            </Link>
          </div>
        </div>

        {isExpanded && (
          <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-foreground">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Marca"
                value={vehicle.modelo?.marca ?? 'N/A'}
              />
              <DetailItem
                label="Modelo"
                value={vehicle.modelo?.nombre ?? 'N/A'}
              />
              <DetailItem label="Categoria" value={vehicleCategory} />
              <DetailItem label="Estado" value={vehicle.estado} />
              <DetailItem
                label="Año"
                value={vehicleYear ? String(vehicleYear) : 'N/A'}
              />
              <DetailItem label="Placa" value={vehicle.placa} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div>
    <p className="text-xs uppercase tracking-widest text-muted-foreground">
      {label}
    </p>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);
