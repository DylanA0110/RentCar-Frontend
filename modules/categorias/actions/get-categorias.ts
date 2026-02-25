import { categoriasApi } from '../api/categorias.api';
import type { Categoria } from '../types/categoria.interface';
import { extractApiErrorMessage } from '@/shared/api/api-error';

interface GetCategoriasOptions {
  signal?: AbortSignal;
}

export const getCategorias = async (
  options: GetCategoriasOptions = {},
): Promise<Categoria[]> => {
  try {
    const { data } = await categoriasApi.get<Categoria[]>('/', {
      signal: options.signal,
    });

    return data;
  } catch (error) {
    const apiMessage = extractApiErrorMessage(
      error,
      'No se pudieron obtener las categorías',
    );
    throw new Error(`No se pudieron obtener las categorías: ${apiMessage}`);
  }
};
