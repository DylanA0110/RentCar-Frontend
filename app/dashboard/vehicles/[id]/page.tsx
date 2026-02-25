'use client';

import { useParams } from 'next/navigation';
import { VehicleForm } from '@/shared/components/admin/vehicle-form';

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();
  const vehicleId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!vehicleId) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
          No se pudo resolver el ID del vehículo.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <VehicleForm vehicleId={vehicleId} />
    </div>
  );
}
