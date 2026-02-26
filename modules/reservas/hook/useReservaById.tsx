import { useQuery } from '@tanstack/react-query';
import { getReservaById } from '../actions/get-reserva-by-id';

export const useReservaById = (id?: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['reserva', id],
    queryFn: ({ signal }) => getReservaById(id as string, { signal }),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });

  return {
    reserva: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
