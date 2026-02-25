import { useQuery } from '@tanstack/react-query';
import { getVehiculoImagenes } from '../actions/get-vehiculo-imagenes';

export const useVehiculoImagenes = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['vehiculos-imagenes'],
    queryFn: ({ signal }) => getVehiculoImagenes({ signal }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    vehiculoImagenes: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
