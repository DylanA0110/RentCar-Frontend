import { useQuery } from '@tanstack/react-query';
import { getTemporadasPrecios } from '../actions/get-temporadas-precios';

export const useTemporadasPrecios = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['temporadas-precios'],
    queryFn: ({ signal }) => getTemporadasPrecios({ signal }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    temporadasPrecios: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
