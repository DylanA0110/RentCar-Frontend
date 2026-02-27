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
import { CRUDList } from '@/shared/components/admin/crud-list';

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

  const columns = [
    { key: 'vehiculo', label: 'Vehículo' },
    { key: 'placa', label: 'Placa' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'precio', label: 'Precio base' },
    { key: 'estado', label: 'Estado' },
  ];

  const rows = useMemo(
    () =>
      (vehiculos ?? []).map((vehicle) => ({
        id: vehicle.id,
        vehiculo: getVehiculoNombre(vehicle),
        placa: vehicle.placa,
        categoria: getVehiculoCategoriaNombre(vehicle),
        precio: formatPrecio(getVehiculoPrecioBaseDiario(vehicle)),
        estado: vehicle.estado,
      })),
    [vehiculos],
  );

  return (
    <CRUDList
      title="Gestión de Vehículos"
      description="Vista de vehículos registrados"
      columns={columns}
      rows={rows}
      createHref={''}
    />
  );
}
