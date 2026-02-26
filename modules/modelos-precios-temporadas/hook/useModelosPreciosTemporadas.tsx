import { useQuery } from '@tanstack/react-query';
import { getModelosPreciosTemporadas } from '../actions/get-modelos-precios-temporadas';

export const useModelosPreciosTemporadas = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['modelos-precios-temporadas'],
    queryFn: ({ signal }) => getModelosPreciosTemporadas({ signal }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    modelosPreciosTemporadas: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
