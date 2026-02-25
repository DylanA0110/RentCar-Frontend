import { z } from 'zod';

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const ImageFileSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
        file.type,
      ),
    'Formato inválido. Usa JPG, PNG o WEBP.',
  )
  .refine(
    (file) => file.size <= MAX_UPLOAD_SIZE_BYTES,
    'La imagen no puede superar 5MB.',
  );

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetMaxBytes?: number;
}

const readImage = async (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo convertir la imagen.'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality,
    );
  });
};

export const validateImageFile = (file: File) => {
  return ImageFileSchema.safeParse(file);
};

export const compressImageFile = async (
  file: File,
  options: CompressOptions = {},
): Promise<File> => {
  const validation = validateImageFile(file);
  if (!validation.success) {
    throw new Error(validation.error.issues[0]?.message ?? 'Archivo inválido.');
  }

  const {
    maxWidth = 1800,
    maxHeight = 1800,
    quality = 0.82,
    targetMaxBytes = 1.8 * 1024 * 1024,
  } = options;

  const image = await readImage(file);

  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('No se pudo procesar la imagen.');
  }

  context.drawImage(image, 0, 0, width, height);

  let currentQuality = quality;
  let output = await canvasToBlob(canvas, currentQuality);

  while (output.size > targetMaxBytes && currentQuality > 0.45) {
    currentQuality -= 0.08;
    output = await canvasToBlob(canvas, currentQuality);
  }

  const fileName = file.name.replace(/\.[^.]+$/, '') || 'imagen';
  return new File([output], `${fileName}.webp`, { type: 'image/webp' });
};
