'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { useModelos } from '@/modules/modelos/hook/useModelos';
import { removeModelo } from '@/modules/modelos/actions/remove-modelo';
import { useVehiculoImagenes } from '@/modules/vehiculos-imagenes/hook/useVehiculoImagenes';
import type { Modelo } from '@/modules/modelos/types/modelo.interface';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

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

export default function ModelosPage() {
  const queryClient = useQueryClient();
  const { modelos, isLoading, isError, refetch } = useModelos();
  const { vehiculoImagenes } = useVehiculoImagenes();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeImage, setActiveImage] = useState<Record<string, number>>({});
  const [deletingById, setDeletingById] = useState<Record<string, boolean>>({});

  const modelosSeguros = useMemo(
    () => [...(modelos ?? [])].reverse(),
    [modelos],
  );

  const imagesByModelo = useMemo(() => {
    const grouped = new Map<string, string[]>();

    (vehiculoImagenes ?? []).forEach((image) => {
      const modeloId = image.modelo?.id;
      if (!modeloId || !image.url) return;
      const current = grouped.get(modeloId) ?? [];
      grouped.set(modeloId, [...current, image.url]);
    });

    return grouped;
  }, [vehiculoImagenes]);

  const filteredModelos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return modelosSeguros;

    return modelosSeguros.filter((modelo) => {
      const values = [
        modelo.marca,
        modelo.nombre,
        modelo.estado,
        modelo.tipoCombustible,
        modelo.categoria?.nombre,
      ];

      return values.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(term),
      );
    });
  }, [modelosSeguros, search]);

  const totalPages = Math.max(1, Math.ceil(filteredModelos.length / PAGE_SIZE));
  const pageModelos = filteredModelos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handlePrev = (modeloId: string, total: number) => {
    setActiveImage((prev) => {
      const current = prev[modeloId] ?? 0;
      return { ...prev, [modeloId]: (current - 1 + total) % total };
    });
  };

  const handleNext = (modeloId: string, total: number) => {
    setActiveImage((prev) => {
      const current = prev[modeloId] ?? 0;
      return { ...prev, [modeloId]: (current + 1) % total };
    });
  };

  const handleDelete = async (modelo: Modelo) => {
    const confirmed = window.confirm(
      `¿Eliminar el modelo ${modelo.marca} ${modelo.nombre}?`,
    );
    if (!confirmed) return;

    setDeletingById((prev) => ({ ...prev, [modelo.id]: true }));
    try {
      await removeModelo(modelo.id);
      await queryClient.invalidateQueries({ queryKey: ['modelos'] });
      await refetch();
      toast.success('Modelo eliminado correctamente');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el modelo',
      );
    } finally {
      setDeletingById((prev) => ({ ...prev, [modelo.id]: false }));
    }
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="heading-2 text-foreground">Gestión de Modelos</h1>
          <p className="text-muted-foreground">
            Vista premium de modelos con sus imágenes.
          </p>
        </div>
        {/* Botón de crear nuevo eliminado */}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar por marca, nombre, categoría o estado"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {filteredModelos.length} modelos · Página {page} de {totalPages}
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          Cargando modelos...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-10 text-center text-destructive">
          No se pudieron cargar los modelos.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {pageModelos.map((modelo) => {
            const images = imagesByModelo.get(modelo.id) ?? [];
            const hasImages = images.length > 0;
            const currentIndex = activeImage[modelo.id] ?? 0;
            const safeIndex = hasImages ? currentIndex % images.length : 0;
            const imageUrl = hasImages ? images[safeIndex] : null;

            return (
              <div
                key={modelo.id}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_-45px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                  {imageUrl ? (
                    <Image
                      key={imageUrl}
                      src={imageUrl}
                      alt={`${modelo.marca} ${modelo.nombre}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      Sin imagen
                    </div>
                  )}

                  {hasImages && images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => handlePrev(modelo.id, images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2 text-foreground shadow-sm transition hover:bg-white"
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNext(modelo.id, images.length)}
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
                        {modelo.marca} {modelo.nombre}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {modelo.categoria?.nombre ?? 'Sin categoría'} ·{' '}
                        {modelo.anio}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        Precio base
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {formatPrecio(modelo.precioBaseDiario)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {modelo.estado}
                    </span>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {images.length} imagen{images.length === 1 ? '' : 'es'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {modelo.tipoCombustible ?? 'Combustible N/A'} ·{' '}
                      {modelo.capacidadPasajeros ?? 'N/A'} pax
                    </span>
                    {/* Botones de editar y eliminar eliminados */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredModelos.length === 0 && !isLoading && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          No hay modelos que coincidan con tu búsqueda.
        </div>
      )}

      {filteredModelos.length > PAGE_SIZE && (
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
