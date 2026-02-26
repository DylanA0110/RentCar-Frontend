'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useModelos } from '@/modules/modelos/hook/useModelos';
import { createModelo } from '@/modules/modelos/actions/create-modelo';
import { updateModelo } from '@/modules/modelos/actions/update-modelo';
import { removeModelo } from '@/modules/modelos/actions/remove-modelo';
import type {
  EstadoGeneral,
  Modelo,
  ModeloPayload,
} from '@/modules/modelos/types/modelo.interface';
import { useCategorias } from '@/modules/categorias/hook/useCategorias';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

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

export default function ModelosPage() {
  const queryClient = useQueryClient();
  const { modelos, isLoading, isError, error, refetch } = useModelos();
  const { categorias } = useCategorias();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ModeloFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isEditing = Boolean(editingId);
  const modelosSeguros = modelos ?? [];

  const sortedModelos = useMemo(
    () =>
      [...modelosSeguros].sort((a, b) => {
        const left = `${a.marca} ${a.nombre}`.toLowerCase();
        const right = `${b.marca} ${b.nombre}`.toLowerCase();
        return left.localeCompare(right);
      }),
    [modelosSeguros],
  );

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const invalidateModelos = async () => {
    await queryClient.invalidateQueries({ queryKey: ['modelos'] });
    await refetch();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const payload = parsePayload(form);

      if (editingId) {
        await updateModelo(editingId, payload);
        toast.success('Modelo actualizado correctamente');
      } else {
        await createModelo(payload);
        toast.success('Modelo creado correctamente');
      }

      await invalidateModelos();
      resetForm();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo guardar el modelo',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (modelo: Modelo) => {
    setEditingId(modelo.id);
    setForm(mapModeloToForm(modelo));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (modelo: Modelo) => {
    const confirmed = window.confirm(
      `¿Eliminar el modelo ${modelo.marca} ${modelo.nombre}?`,
    );
    if (!confirmed) return;

    setDeletingId(modelo.id);
    try {
      await removeModelo(modelo.id);
      toast.success('Modelo eliminado correctamente');
      await invalidateModelos();
      if (editingId === modelo.id) resetForm();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el modelo',
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-foreground">Gestión de Modelos</h1>
        <p className="text-muted-foreground">
          CRUD básico de modelos con categoría, estado y precio base diario.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? 'Editar modelo' : 'Crear modelo'}
          </h2>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetForm}
            >
              <X className="size-4" />
              Cancelar edición
            </Button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <Field label="Marca">
            <Input name="marca" value={form.marca} onChange={handleChange} />
          </Field>

          <Field label="Nombre">
            <Input name="nombre" value={form.nombre} onChange={handleChange} />
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

          <div className="md:col-span-2 xl:col-span-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                <>
                  <Pencil className="size-4" />
                  Actualizar modelo
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Crear modelo
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Listado de modelos
          </h2>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Recargar
          </Button>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            Cargando modelos...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : 'No se pudieron cargar los modelos'}
          </div>
        )}

        {!isLoading && !isError && sortedModelos.length === 0 && (
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
            No hay modelos registrados.
          </div>
        )}

        {!isLoading && !isError && sortedModelos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-215 text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-3 py-2">Modelo</th>
                  <th className="px-3 py-2">Categoría</th>
                  <th className="px-3 py-2">Precio base</th>
                  <th className="px-3 py-2">Combustible</th>
                  <th className="px-3 py-2">Pasajeros</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedModelos.map((modelo) => (
                  <tr key={modelo.id} className="border-b border-border/70">
                    <td className="px-3 py-3 font-medium text-foreground">
                      {modelo.marca} {modelo.nombre} ({modelo.anio})
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {modelo.categoria?.nombre ?? 'Sin categoría'}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {new Intl.NumberFormat('es-DO', {
                        style: 'currency',
                        currency: 'DOP',
                        maximumFractionDigits: 2,
                      }).format(Number(modelo.precioBaseDiario) || 0)}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {modelo.tipoCombustible ?? 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {modelo.capacidadPasajeros ?? 'N/A'}
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                        {modelo.estado}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(modelo)}
                        >
                          <Pencil className="size-4" />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === modelo.id}
                          onClick={() => handleDelete(modelo)}
                        >
                          {deletingId === modelo.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
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
