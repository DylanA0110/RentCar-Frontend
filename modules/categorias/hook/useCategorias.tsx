import { useQuery } from '@tanstack/react-query';
import { getCategorias } from '../actions/get-categorias';

export const useCategorias = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['categorias'],
    queryFn: ({ signal }) => getCategorias({ signal }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    categorias: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
