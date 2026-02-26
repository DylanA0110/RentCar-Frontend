import { useQuery } from '@tanstack/react-query';
import { getClientes } from '../actions/get-clients';

export const useClientes = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clientes'],
    queryFn: ({ signal }) => getClientes({ signal }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    clientes: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
