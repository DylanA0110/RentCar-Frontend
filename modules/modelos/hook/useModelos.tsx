import { useQuery } from '@tanstack/react-query';
import { getModelos } from '../actions/get-modelos';

export const useModelos = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['modelos'],
    queryFn: ({ signal }) => getModelos({ signal }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    modelos: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
