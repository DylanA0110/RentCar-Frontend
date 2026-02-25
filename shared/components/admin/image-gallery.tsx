'use client';

import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { VehiculoImagen } from '@/modules/vehiculos/types/vehiculo.interface';
import {
  compressImageFile,
  validateImageFile,
} from '@/shared/lib/image-compression';

export interface VehicleImageDraft {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
  esPrincipal: boolean;
}

interface ImageGalleryProps {
  images: VehicleImageDraft[];
  existingImages?: VehiculoImagen[];
  onChange: (images: VehicleImageDraft[]) => void;
  onDeleteExistingImage?: (imageId: string) => Promise<void>;
  onSetExistingPrimary?: (imageId: string) => Promise<void>;
  onReplaceExistingImage?: (
    imageId: string,
    file: File,
    options?: { altText?: string; esPrincipal?: boolean },
  ) => Promise<void>;
}

export function ImageGallery({
  images,
  existingImages = [],
  onChange,
  onDeleteExistingImage,
  onSetExistingPrimary,
  onReplaceExistingImage,
}: ImageGalleryProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [fileError, setFileError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [existingBusyId, setExistingBusyId] = useState<string | null>(null);

  const selectedPreviewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  const imageCounterText = useMemo(() => {
    if (images.length === 0) return 'No hay nuevas imágenes aún';
    if (images.length === 1) return '1 imagen lista para subir';
    return `${images.length} imágenes listas para subir`;
  }, [images.length]);

  useEffect(() => {
    return () => {
      images.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [images]);

  useEffect(() => {
    return () => {
      if (selectedPreviewUrl) {
        URL.revokeObjectURL(selectedPreviewUrl);
      }
    };
  }, [selectedPreviewUrl]);

  const handleAddImage = () => {
    if (!selectedFile) {
      setFileError('Selecciona una imagen para subir');
      return;
    }

    const validation = validateImageFile(selectedFile);
    if (!validation.success) {
      setFileError(validation.error.issues[0]?.message ?? 'Archivo inválido');
      return;
    }

    setIsCompressing(true);

    compressImageFile(selectedFile)
      .then((compressedFile) => {
        const previewUrl = URL.createObjectURL(compressedFile);
        const nextImages: VehicleImageDraft[] = [
          ...images,
          {
            id:
              typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${images.length}`,
            file: compressedFile,
            previewUrl,
            altText: altText.trim() || 'Imagen del vehículo',
            esPrincipal: images.length === 0,
          },
        ];

        onChange(nextImages);
        setSelectedFile(null);
        setAltText('');
        setFileError('');
      })
      .catch((error) => {
        setFileError(
          error instanceof Error
            ? error.message
            : 'No se pudo preparar la imagen',
        );
      })
      .finally(() => {
        setIsCompressing(false);
      });
  };

  const removeImage = (index: number) => {
    const removed = images[index];
    if (removed?.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }

    const nextImages = images.filter((_, itemIndex) => itemIndex !== index);
    if (nextImages.length > 0 && !nextImages.some((item) => item.esPrincipal)) {
      nextImages[0].esPrincipal = true;
    }
    onChange(nextImages);
  };

  const setPrimary = (index: number) => {
    onChange(
      images.map((item, itemIndex) => ({
        ...item,
        esPrincipal: itemIndex === index,
      })),
    );
  };

  const handleReplaceExisting = async (image: VehiculoImagen, file: File) => {
    if (!onReplaceExistingImage) return;

    const validation = validateImageFile(file);
    if (!validation.success) {
      setFileError(validation.error.issues[0]?.message ?? 'Archivo inválido');
      return;
    }

    try {
      setExistingBusyId(image.id);
      const compressed = await compressImageFile(file);
      await onReplaceExistingImage(image.id, compressed, {
        altText: image.altText ?? 'Imagen del vehículo',
        esPrincipal: image.esPrincipal,
      });
    } catch (error) {
      setFileError(
        error instanceof Error
          ? error.message
          : 'No se pudo reemplazar la imagen existente',
      );
    } finally {
      setExistingBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Imágenes</h3>

      {existingImages.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Imágenes actuales
          </p>
          <div className="grid grid-cols-2 gap-3">
            {existingImages.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-xl border border-border"
              >
                <div className="relative aspect-video w-full bg-muted">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.altText ?? 'Imagen del vehículo'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </div>
                {image.esPrincipal && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-[10px] font-medium text-accent-foreground">
                    Principal
                  </span>
                )}

                {(onDeleteExistingImage ||
                  onSetExistingPrimary ||
                  onReplaceExistingImage) && (
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/60 p-2">
                    {!image.esPrincipal && onSetExistingPrimary && (
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        disabled={existingBusyId === image.id}
                        onClick={() => onSetExistingPrimary(image.id)}
                        title="Marcar principal"
                      >
                        <Star size={14} />
                      </Button>
                    )}

                    {onReplaceExistingImage && (
                      <label className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                        <ImagePlus size={14} />
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          disabled={existingBusyId === image.id}
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            await handleReplaceExisting(image, file);
                            event.currentTarget.value = '';
                          }}
                        />
                      </label>
                    )}

                    {onDeleteExistingImage && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        disabled={existingBusyId === image.id}
                        onClick={() => onDeleteExistingImage(image.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-xl border border-border bg-secondary/40 p-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Archivo de imagen
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
              if (fileError) setFileError('');
            }}
            className="block w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Se comprime automáticamente antes de subir (máx. 5MB).
          </p>
          {fileError && (
            <p className="mt-1 text-xs text-destructive">{fileError}</p>
          )}
        </div>

        {selectedPreviewUrl && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <p className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
              Vista previa rápida
            </p>
            <img
              src={selectedPreviewUrl}
              alt="Vista previa de imagen seleccionada"
              className="h-36 w-full object-cover"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Texto alternativo
          </label>
          <Input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Descripción de la imagen"
          />
        </div>

        <Button
          type="button"
          className="w-full rounded-xl"
          disabled={isCompressing}
          onClick={handleAddImage}
        >
          <ImagePlus size={16} />
          {isCompressing ? 'Comprimiendo...' : 'Agregar imagen'}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Nuevas imágenes a guardar
        </p>
        <p className="mb-3 text-xs text-muted-foreground">{imageCounterText}</p>
        {images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aún no has agregado nuevas imágenes.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl border border-border"
              >
                <div className="relative aspect-video w-full bg-muted">
                  <img
                    src={image.previewUrl}
                    alt={image.altText}
                    className="h-full w-full object-cover"
                  />
                </div>

                {image.esPrincipal && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-[10px] font-medium text-accent-foreground">
                    Principal
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/60 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {!image.esPrincipal && (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => setPrimary(index)}
                    >
                      <Star size={14} />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
