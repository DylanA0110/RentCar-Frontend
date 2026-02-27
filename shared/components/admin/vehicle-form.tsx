'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

import { createVehiculo } from '@/modules/vehiculos/actions/create-vehiculo';
import { updateVehiculo } from '@/modules/vehiculos/actions/update-vehiculo';
import { getVehiculoById } from '@/modules/vehiculos/actions/get-vehiculo-by-id';
import { useModelos } from '@/modules/modelos/hook/useModelos';
import type {
  VehiculoPayload,
  VehiculoEstado,
} from '@/modules/vehiculos/types/vehiculo.interface';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const VehicleSchema = z.object({
  modeloId: z.string().trim().min(1, 'Debes seleccionar un modelo'),
  placa: z.string().trim().min(3, 'La placa es obligatoria'),
  color: z.string().trim().optional(),
  kilometraje: z
    .string()
    .trim()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= 0;
    }, 'El kilometraje debe ser un número mayor o igual a 0'),
  estado: z.enum(['disponible', 'en reparacion', 'rentado']),
});

type VehicleFormData = z.infer<typeof VehicleSchema>;

interface VehicleFormProps {
  vehicleId?: string;
}

export function VehicleForm({ vehicleId }: VehicleFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = Boolean(vehicleId);

  const [formData, setFormData] = useState<VehicleFormData>({
    modeloId: '',
    placa: '',
    color: '',
    kilometraje: '',
    estado: 'disponible',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { modelos, isLoading: isLoadingModelos } = useModelos();

  const vehiculoQuery = useQuery({
    queryKey: ['vehiculo', vehicleId],
    queryFn: ({ signal }) => getVehiculoById(vehicleId!, { signal }),
    enabled: isEditing && Boolean(vehicleId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!vehiculoQuery.data) return;

    const vehiculo = vehiculoQuery.data;
    const estado: VehiculoEstado =
      vehiculo.estado === 'en reparacion' || vehiculo.estado === 'rentado'
        ? vehiculo.estado
        : 'disponible';

    setFormData({
      modeloId: vehiculo.modelo?.id ?? '',
      placa: vehiculo.placa,
      color: vehiculo.color ?? '',
      kilometraje:
        vehiculo.kilometraje === undefined || vehiculo.kilometraje === null
          ? ''
          : String(vehiculo.kilometraje),
      estado,
    });
  }, [vehiculoQuery.data]);

  const refreshCaches = async (id?: string) => {
    await queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
    if (id) {
      await queryClient.invalidateQueries({ queryKey: ['vehiculo', id] });
    }
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = VehicleSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string' && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error('Revisa los campos del formulario');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: VehiculoPayload = {
        modeloId: validation.data.modeloId,
        placa: validation.data.placa,
        color: validation.data.color || undefined,
        estado: validation.data.estado,
        kilometraje: validation.data.kilometraje
          ? Number(validation.data.kilometraje)
          : undefined,
      };

      const vehiculo =
        isEditing && vehicleId
          ? await updateVehiculo(vehicleId, payload)
          : await createVehiculo(payload);

      await refreshCaches(vehiculo.id);

      toast.success(
        isEditing
          ? 'Vehículo actualizado correctamente'
          : 'Vehículo creado correctamente',
      );
      router.push('/dashboard/vehicles');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al guardar el vehículo';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && vehiculoQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
        Cargando vehículo...
      </div>
    );
  }

  if (isEditing && vehiculoQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
        No se pudo cargar el vehículo para editar.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/vehicles"
            className="rounded-lg p-2 transition-colors duration-300 hover:bg-secondary"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing
                ? 'Actualiza la información principal del vehículo.'
                : 'Completa la ficha del vehículo con un diseño limpio y premium.'}
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="rounded-xl">
          <Save size={16} />
          {isSubmitting ? 'Guardando...' : 'Guardar vehículo'}
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          Información del vehículo
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Modelo" error={errors.modeloId}>
            <select
              name="modeloId"
              value={formData.modeloId}
              onChange={handleTextChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">
                {isLoadingModelos
                  ? 'Cargando modelos...'
                  : 'Selecciona un modelo'}
              </option>
              {(modelos ?? []).map((modelo) => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.marca} {modelo.nombre} ({modelo.anio})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Placa" error={errors.placa}>
            <Input
              name="placa"
              value={formData.placa}
              onChange={handleTextChange}
              placeholder="ABC-123"
            />
          </Field>

          <Field label="Color" error={errors.color}>
            <Input
              name="color"
              value={formData.color ?? ''}
              onChange={handleTextChange}
              placeholder="Rojo"
            />
          </Field>

          <Field label="Kilometraje" error={errors.kilometraje}>
            <Input
              name="kilometraje"
              value={formData.kilometraje ?? ''}
              onChange={handleTextChange}
              placeholder="35000"
            />
          </Field>

          <Field label="Estado" error={errors.estado}>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleTextChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="disponible">Disponible</option>
              <option value="en reparacion">En reparación</option>
              <option value="rentado">Rentado</option>
            </select>
          </Field>
        </div>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
