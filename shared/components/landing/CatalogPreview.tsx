'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useVehiculo } from '@/modules/vehiculos/hook/useVehiculo';
import { Button } from '../ui/button';

const CatalogPreview = () => {
  const { vehiculos, isLoading, isError } = useVehiculo();

  const previewVehicles = useMemo(() => {
    return (vehiculos ?? []).slice(0, 3);
  }, [vehiculos]);

  const getVehicleImage = (vehiculo: (typeof previewVehicles)[number]) => {
    const principal = vehiculo.imagenes?.find(
      (img) => img.esPrincipal && img.url?.trim(),
    );
    if (principal?.url) return principal.url;

    const firstValid = vehiculo.imagenes?.find((img) => img.url?.trim());
    if (firstValid?.url) return firstValid.url;

    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="22"%3ESin imagen%3C/text%3E%3C/svg%3E';
  };

  const formatPrecio = (precio: string) => {
    const value = Number(precio);
    if (!Number.isFinite(value)) return precio;
    return `$${value.toFixed(2)}/día`;
  };

  return (
    <section id="catalogo" className="py-24 bg-section-alt">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Nuestra Flota
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Vehículos seleccionados para cada ocasión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`preview-skeleton-${index}`}
                className="overflow-hidden rounded-2xl border border-border/50 bg-card"
              >
                <div className="aspect-video bg-muted" />
                <div className="space-y-3 p-6">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-6 w-40 rounded bg-muted" />
                  <div className="h-5 w-28 rounded bg-muted" />
                </div>
              </div>
            ))}

          {!isLoading &&
            !isError &&
            previewVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={getVehicleImage(vehicle)}
                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <p className="mb-1 text-sm text-muted-foreground">
                    {vehicle.categoria?.nombre ?? 'Sin categoría'}
                  </p>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {vehicle.marca} {vehicle.modelo}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-medium text-foreground">
                      {formatPrecio(vehicle.precioPorDia)}
                    </span>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            ))}

          {!isLoading && (isError || previewVehicles.length === 0) && (
            <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No hay vehículos disponibles para mostrar en el preview.
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link href="/catalog">
            <Button variant="outline" size="lg" className="rounded-2xl px-8">
              Ver todo el catálogo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CatalogPreview;
