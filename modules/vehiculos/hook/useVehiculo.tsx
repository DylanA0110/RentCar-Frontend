import { getVehiculos } from '../actions/get-vehiculo';
import { useQuery } from '@tanstack/react-query';

export const useVehiculo = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: ({ signal }) => getVehiculos({ signal }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    vehiculos: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
