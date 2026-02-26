import { useQuery } from '@tanstack/react-query';
import { getPagos } from '../actions/get-pagos';

export const usePagos = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pagos'],
    queryFn: ({ signal }) => getPagos({ signal }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    pagos: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
