import { useQuery } from '@tanstack/react-query';
import { getEmpleados } from '../actions/get-empleados';

export const useEmpleados = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['empleados'],
    queryFn: ({ signal }) => getEmpleados({ signal }),
    staleTime: 1000 * 60 * 5,
  });

  return {
    empleados: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
