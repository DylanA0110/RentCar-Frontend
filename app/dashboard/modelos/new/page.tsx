'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { createModelo } from '@/modules/modelos/actions/create-modelo';
import { uploadVehiculoImagen } from '@/modules/vehiculos-imagenes/actions/upload-vehiculo-imagen';
import { useCategorias } from '@/modules/categorias/hook/useCategorias';
import type {
  EstadoGeneral,
  ModeloPayload,
} from '@/modules/modelos/types/modelo.interface';
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

const initialForm: ModeloFormState = {
  marca: '',
  nombre: '',
  anio: String(new Date().getFullYear()),
  tipoCombustible: '',
  capacidadPasajeros: '',
  estado: 'activo',
  precioBaseDiario: '',
  categoriaId: '',
};

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

export default function NewModeloPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { categorias } = useCategorias();

  const [form, setForm] = useState<ModeloFormState>(initialForm);
  const [images, setImages] = useState<VehicleImageDraft[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const payload = parsePayload(form);
      const modelo = await createModelo(payload);

      if (images.length > 0) {
        await Promise.all(
          images.map((image) => {
            if (!image.file) {
              throw new Error('Selecciona un archivo de imagen válido');
            }

            return uploadVehiculoImagen({
              modeloId: modelo.id,
              file: image.file,
            });
          }),
        );
      }

      await queryClient.invalidateQueries({ queryKey: ['modelos'] });
      await queryClient.invalidateQueries({ queryKey: ['modelos-imagenes'] });
      toast.success('Modelo creado correctamente');
      router.push('/dashboard/modelos');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo crear el modelo',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Nuevo Modelo
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa la información principal del modelo.
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="rounded-xl">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {isSubmitting ? 'Guardando...' : 'Crear modelo'}
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
          <ImageGallery images={images} onChange={setImages} />
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
