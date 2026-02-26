import { useQuery } from '@tanstack/react-query';
import { getReservas } from '../actions/get-reservas';

export const useReservas = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['reservas'],
    queryFn: ({ signal }) => getReservas({ signal }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    reservas: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
