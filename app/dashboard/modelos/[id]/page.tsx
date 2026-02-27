'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { getModeloById } from '@/modules/modelos/actions/get-modelo-by-id';
import { updateModelo } from '@/modules/modelos/actions/update-modelo';
import { removeVehiculoImagen } from '@/modules/vehiculos-imagenes/actions/remove-vehiculo-imagen';
import { getVehiculoImagenesByModelo } from '@/modules/vehiculos-imagenes/actions/get-vehiculo-imagenes-by-modelo';
import { uploadVehiculoImagen } from '@/modules/vehiculos-imagenes/actions/upload-vehiculo-imagen';
import { updateVehiculoImagen } from '@/modules/vehiculos-imagenes/actions/update-vehiculo-imagen';
import { useCategorias } from '@/modules/categorias/hook/useCategorias';
import type {
  EstadoGeneral,
  Modelo,
  ModeloPayload,
} from '@/modules/modelos/types/modelo.interface';
import type { VehiculoImagen } from '@/modules/vehiculos/types/vehiculo.interface';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ImageGallery } from '@/shared/components/admin/image-gallery';
import type { VehicleImageDraft } from '@/shared/components/admin/image-gallery';

type ModeloFormState = {
  marca: string;
  nombre: string;
  anio: string;
  tipoCombustible: string;
  capacidadPasajeros: string;
  estado: EstadoGeneral;
  precioBaseDiario: string;
  categoriaId: string;
};

const mapModeloToForm = (modelo: Modelo): ModeloFormState => ({
  marca: modelo.marca,
  nombre: modelo.nombre,
  anio: String(modelo.anio ?? new Date().getFullYear()),
  tipoCombustible: modelo.tipoCombustible ?? '',
  capacidadPasajeros:
    modelo.capacidadPasajeros === undefined ||
    modelo.capacidadPasajeros === null
      ? ''
      : String(modelo.capacidadPasajeros),
  estado: modelo.estado ?? 'activo',
  precioBaseDiario: String(modelo.precioBaseDiario ?? ''),
  categoriaId: modelo.categoria?.id ?? '',
});

const parsePayload = (form: ModeloFormState): ModeloPayload => {
  const anio = Number(form.anio);
  const precioBaseDiario = Number(form.precioBaseDiario);

  if (!form.marca.trim()) throw new Error('La marca es obligatoria');
  if (!form.nombre.trim()) throw new Error('El nombre es obligatorio');
  if (!Number.isFinite(anio) || anio < 1990)
    throw new Error('El año no es válido');
  if (!Number.isFinite(precioBaseDiario) || precioBaseDiario <= 0)
    throw new Error('El precio base diario debe ser mayor a 0');
  if (!form.categoriaId) throw new Error('Debes seleccionar una categoría');

  return {
    marca: form.marca.trim(),
    nombre: form.nombre.trim(),
    anio,
    tipoCombustible: form.tipoCombustible.trim() || undefined,
    capacidadPasajeros: form.capacidadPasajeros
      ? Number(form.capacidadPasajeros)
      : undefined,
    estado: form.estado,
    precioBaseDiario,
    categoriaId: form.categoriaId,
  };
};

export default function EditModeloPage() {
  const params = useParams<{ id: string }>();
  const modeloId = params?.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { categorias } = useCategorias();

  const [form, setForm] = useState<ModeloFormState | null>(null);
  const [images, setImages] = useState<VehicleImageDraft[]>([]);
  const [existingImages, setExistingImages] = useState<VehiculoImagen[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modeloQuery = useQuery({
    queryKey: ['modelo', modeloId],
    queryFn: ({ signal }) => getModeloById(modeloId!, { signal }),
    enabled: Boolean(modeloId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!modeloQuery.data) return;

    setForm(mapModeloToForm(modeloQuery.data));
  }, [modeloQuery.data]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const refreshModel = async () => {
    await queryClient.invalidateQueries({ queryKey: ['modelos'] });
    await queryClient.invalidateQueries({ queryKey: ['modelo', modeloId] });
    await modeloQuery.refetch();

    if (modeloId) {
      const imageData = await getVehiculoImagenesByModelo(modeloId);
      setExistingImages(
        imageData.map((image) => ({
          id: image.id,
          url: image.url,
          createdAt:
            image.createdAt instanceof Date
              ? image.createdAt.toISOString()
              : image.createdAt,
        })),
      );
    }
  };

  useEffect(() => {
    if (!modeloId) return;

    void getVehiculoImagenesByModelo(modeloId)
      .then((imageData) => {
        setExistingImages(
          imageData.map((image) => ({
            id: image.id,
            url: image.url,
            createdAt:
              image.createdAt instanceof Date
                ? image.createdAt.toISOString()
                : image.createdAt,
          })),
        );
      })
      .catch(() => {
        setExistingImages([]);
      });
  }, [modeloId]);

  const handleDeleteExistingImage = async (imageId: string) => {
    try {
      await removeVehiculoImagen(imageId);
      setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar la imagen',
      );
    }
  };

  const handleReplaceExistingImage = async (
    imageId: string,
    file: File,
    _options?: { altText?: string; esPrincipal?: boolean },
  ) => {
    try {
      const updated = await updateVehiculoImagen(imageId, { file });

      setExistingImages((prev) =>
        prev.map((image) =>
          image.id === imageId
            ? {
                ...image,
                url: updated.url,
                createdAt:
                  updated.createdAt instanceof Date
                    ? updated.createdAt.toISOString()
                    : updated.createdAt,
              }
            : image,
        ),
      );

      toast.success('Imagen actualizada correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la imagen',
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form || !modeloId) return;

    setIsSubmitting(true);
    try {
      const payload = parsePayload(form);
      await updateModelo(modeloId, payload);

      if (images.length > 0) {
        await Promise.all(
          images.map((image) => {
            if (!image.file) {
              throw new Error('Selecciona un archivo de imagen válido');
            }

            return uploadVehiculoImagen({
              modeloId,
              file: image.file,
            });
          }),
        );
      }

      setImages([]);
      await queryClient.invalidateQueries({ queryKey: ['modelos-imagenes'] });
      await refreshModel();
      toast.success('Modelo actualizado correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el modelo',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (modeloQuery.isLoading || !form) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-muted-foreground">
        Cargando modelo...
      </div>
    );
  }

  if (modeloQuery.isError) {
    return (
      <div className="space-y-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
        <p>No se pudo cargar el modelo para editar.</p>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/modelos')}
        >
          Volver a modelos
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/modelos"
            className="rounded-lg p-2 transition-colors duration-300 hover:bg-secondary"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Editar Modelo
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Actualiza la información del modelo y administra sus imágenes.
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="rounded-xl">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSubmitting ? 'Guardando...' : 'Guardar modelo'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Información del modelo
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Marca">
                <Input
                  name="marca"
                  value={form.marca}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Nombre">
                <Input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Año">
                <Input
                  name="anio"
                  type="number"
                  value={form.anio}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Precio base diario">
                <Input
                  name="precioBaseDiario"
                  type="number"
                  step="0.01"
                  value={form.precioBaseDiario}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Tipo de combustible">
                <Input
                  name="tipoCombustible"
                  value={form.tipoCombustible}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Capacidad de pasajeros">
                <Input
                  name="capacidadPasajeros"
                  type="number"
                  value={form.capacidadPasajeros}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Estado">
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </Field>

              <Field label="Categoría">
                <select
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecciona una categoría</option>
                  {(categorias ?? []).map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <ImageGallery
            images={images}
            existingImages={existingImages}
            onChange={setImages}
            onDeleteExistingImage={handleDeleteExistingImage}
            onReplaceExistingImage={handleReplaceExistingImage}
          />
        </div>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
