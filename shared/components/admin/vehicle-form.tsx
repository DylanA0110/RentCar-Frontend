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
import { uploadVehiculoImagen } from '@/modules/vehiculos-imagenes/actions/upload-vehiculo-imagen';
import { removeVehiculoImagen } from '@/modules/vehiculos-imagenes/actions/remove-vehiculo-imagen';
import { setPrincipalVehiculoImagen } from '@/modules/vehiculos-imagenes/actions/set-principal-vehiculo-imagen';
import type {
  VehiculoImagen,
  VehiculoPayload,
} from '@/modules/vehiculos/types/vehiculo.interface';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ImageGallery } from './image-gallery';
import type { VehicleImageDraft } from './image-gallery';
import { CategorySelect } from './category-select';

const VehicleSchema = z.object({
  marca: z.string().trim().min(2, 'La marca debe tener al menos 2 caracteres'),
  modelo: z.string().trim().min(1, 'El modelo es obligatorio'),
  anio: z
    .number()
    .int('El año debe ser entero')
    .min(1990, 'El año debe ser mayor o igual a 1990')
    .max(new Date().getFullYear() + 1, 'El año no es válido'),
  placa: z.string().trim().min(3, 'La placa es obligatoria'),
  precioPorDia: z
    .string()
    .trim()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0;
    }, 'El precio por día debe ser mayor que 0'),
  estado: z.enum(['Disponible', 'Mantenimiento', 'Alquilado']),
  activo: z.boolean(),
  categoriaId: z.string().trim().min(1, 'Debes seleccionar una categoría'),
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
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    placa: '',
    precioPorDia: '',
    estado: 'Disponible',
    activo: true,
    categoriaId: '',
  });
  const [images, setImages] = useState<VehicleImageDraft[]>([]);
  const [existingImages, setExistingImages] = useState<VehiculoImagen[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehiculoQuery = useQuery({
    queryKey: ['vehiculo', vehicleId],
    queryFn: ({ signal }) => getVehiculoById(vehicleId!, { signal }),
    enabled: isEditing && Boolean(vehicleId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!vehiculoQuery.data) return;

    const vehiculo = vehiculoQuery.data;
    setFormData({
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      placa: vehiculo.placa,
      precioPorDia: vehiculo.precioPorDia,
      estado:
        vehiculo.estado === 'Mantenimiento' || vehiculo.estado === 'Alquilado'
          ? vehiculo.estado
          : 'Disponible',
      activo: vehiculo.activo,
      categoriaId: vehiculo.categoria?.id ?? '',
    });
    setExistingImages(vehiculo.imagenes ?? []);
  }, [vehiculoQuery.data]);

  const refreshCaches = async (id?: string) => {
    await queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
    if (id) {
      await queryClient.invalidateQueries({ queryKey: ['vehiculo', id] });
    }
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    try {
      await removeVehiculoImagen(imageId);
      setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
      await refreshCaches(vehicleId);
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar la imagen',
      );
    }
  };

  const handleSetExistingPrimary = async (imageId: string) => {
    try {
      await setPrincipalVehiculoImagen(imageId);
      setExistingImages((prev) =>
        prev.map((image) => ({ ...image, esPrincipal: image.id === imageId })),
      );
      await refreshCaches(vehicleId);
      toast.success('Imagen principal actualizada');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo establecer la imagen principal',
      );
    }
  };

  const handleReplaceExistingImage = async (
    imageId: string,
    file: File,
    options?: { altText?: string; esPrincipal?: boolean },
  ) => {
    if (!vehicleId) return;

    try {
      const existing = existingImages.find((image) => image.id === imageId);

      await removeVehiculoImagen(imageId);
      const uploaded = await uploadVehiculoImagen({
        vehiculoId: vehicleId,
        file,
        altText: options?.altText ?? existing?.altText ?? 'Imagen del vehículo',
        esPrincipal: options?.esPrincipal ?? existing?.esPrincipal,
      });

      const mappedImage: VehiculoImagen = {
        id: uploaded.id,
        url: uploaded.url,
        altText: uploaded.altText,
        storagePath: uploaded.storagePath,
        esPrincipal: uploaded.esPrincipal,
      };

      setExistingImages((prev) => {
        const withoutOld = prev.filter((image) => image.id !== imageId);
        if (mappedImage.esPrincipal) {
          return [
            ...withoutOld.map((image) => ({ ...image, esPrincipal: false })),
            mappedImage,
          ];
        }
        return [...withoutOld, mappedImage];
      });

      await refreshCaches(vehicleId);

      toast.success('Imagen reemplazada correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo reemplazar la imagen',
      );
    }
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    const nextValue =
      type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'anio' ? Number(nextValue) : nextValue,
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
        ...validation.data,
        precioPorDia: Number(validation.data.precioPorDia).toFixed(2),
      };

      const vehiculo =
        isEditing && vehicleId
          ? await updateVehiculo(vehicleId, payload)
          : await createVehiculo(payload);

      if (images.length > 0) {
        await Promise.all(
          images.map((image) =>
            uploadVehiculoImagen({
              vehiculoId: vehiculo.id,
              file: image.file,
              altText: image.altText,
              esPrincipal: image.esPrincipal,
            }),
          ),
        );
      }

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
      setErrors((prev) => ({ ...prev, submit: message }));
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
                ? 'Actualiza la información principal y agrega nuevas imágenes.'
                : 'Completa la ficha del vehículo con un diseño limpio y premium.'}
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="rounded-xl">
          <Save size={16} />
          {isSubmitting ? 'Guardando...' : 'Guardar vehículo'}
        </Button>
      </div>

      {errors.submit && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {errors.submit}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Información del vehículo
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Marca" error={errors.marca}>
                <Input
                  name="marca"
                  value={formData.marca}
                  onChange={handleTextChange}
                  placeholder="Toyota"
                />
              </Field>

              <Field label="Modelo" error={errors.modelo}>
                <Input
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleTextChange}
                  placeholder="RAV4"
                />
              </Field>

              <Field label="Año" error={errors.anio}>
                <Input
                  type="number"
                  name="anio"
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  value={formData.anio}
                  onChange={handleTextChange}
                />
              </Field>

              <Field label="Placa" error={errors.placa}>
                <Input
                  name="placa"
                  value={formData.placa}
                  onChange={handleTextChange}
                  placeholder="ABC-123"
                />
              </Field>

              <Field label="Precio por día" error={errors.precioPorDia}>
                <Input
                  name="precioPorDia"
                  value={formData.precioPorDia}
                  onChange={handleTextChange}
                  placeholder="149.90"
                />
              </Field>

              <Field label="Estado" error={errors.estado}>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleTextChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Alquilado">Alquilado</option>
                </select>
              </Field>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Categoría
              </label>
              <CategorySelect
                value={formData.categoriaId}
                onChange={(categoriaId) =>
                  setFormData((prev) => ({ ...prev, categoriaId }))
                }
                error={errors.categoriaId}
              />
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <ImageGallery
            images={images}
            existingImages={existingImages}
            onChange={setImages}
            onDeleteExistingImage={
              isEditing ? handleDeleteExistingImage : undefined
            }
            onSetExistingPrimary={
              isEditing ? handleSetExistingPrimary : undefined
            }
            onReplaceExistingImage={
              isEditing ? handleReplaceExistingImage : undefined
            }
          />
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
