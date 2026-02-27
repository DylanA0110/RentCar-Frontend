'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useVehiculo } from '@/modules/vehiculos/hook/useVehiculo';
import { inactivateVehiculo } from '@/modules/vehiculos/actions/inactivate-vehiculo';
import type { Vehiculo } from '@/modules/vehiculos/types/vehiculo.interface';
import {
  getVehiculoCategoriaNombre,
  getVehiculoNombre,
  getVehiculoPrecioBaseDiario,
} from '@/modules/vehiculos/utils/vehiculo-view';
import { DataTable } from '@/shared/components/ui/data-table';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const formatPrecio = (precio: number | string | null) => {
  if (precio === null) return 'N/A';
  const value = typeof precio === 'string' ? Number(precio) : precio;
  if (Number.isNaN(value)) return String(precio);
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [inactivatingById, setInactivatingById] = useState<
    Record<string, boolean>
  >({});

  const { vehiculos, isLoading, isError, refetch } = useVehiculo();

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
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="heading-2 text-foreground">Gestión de Vehículos</h1>
          <p className="text-muted-foreground">
            Vista en tabla de toda la flota.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/vehicles/new">
            <Plus className="size-4" />
            Crear Nuevo
          </Link>
        </Button>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-md">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por modelo, placa, categoría o estado"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Recargar
          </Button>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            Cargando vehículos...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            No se pudieron cargar los vehículos.
          </div>
        )}

        {!isLoading && !isError && filteredVehicles.length === 0 && (
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            No hay vehículos para mostrar.
          </div>
        )}

        {!isLoading && !isError && filteredVehicles.length > 0 && (
          <DataTable
            columns={[
              { key: 'vehiculo', label: 'Vehículo' },
              { key: 'placa', label: 'Placa' },
              { key: 'categoria', label: 'Categoría' },
              { key: 'precio', label: 'Precio base' },
              { key: 'estado', label: 'Estado' },
            ]}
            rows={filteredVehicles.map((vehicle) => ({
              id: vehicle.id,
              vehiculo: getVehiculoNombre(vehicle),
              placa: vehicle.placa,
              categoria: getVehiculoCategoriaNombre(vehicle),
              precio: formatPrecio(getVehiculoPrecioBaseDiario(vehicle)),
              estado: vehicle.estado,
            }))}
            actions={(row) => {
              const vehicle = filteredVehicles.find(
                (item) => item.id === row.id,
              );
              if (!vehicle) return null;

              const isInactivating = Boolean(inactivatingById[vehicle.id]);

              return (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={
                      isInactivating || vehicle.estado === 'en reparacion'
                    }
                    onClick={() => void handleInactivate(vehicle)}
                  >
                    {isInactivating ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    Inactivar
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                      <Pencil className="size-4" />
                      Editar
                    </Link>
                  </Button>
                </div>
              );
            }}
          />
        )}
      </section>
    </div>
  );
}
