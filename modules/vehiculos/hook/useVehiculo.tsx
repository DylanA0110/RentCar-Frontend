import { getVehiculos } from '../actions/get-vehiculo';
import { useQuery } from '@tanstack/react-query';

export const useVehiculo = (scope: 'public' | 'admin') => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['vehiculos', scope],
    queryFn: ({ signal }) => getVehiculos({ signal }),
    staleTime: scope === 'public' ? 1000 * 60 * 5 : 0, // 5 minutos
  });

  return {
    vehiculos: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
