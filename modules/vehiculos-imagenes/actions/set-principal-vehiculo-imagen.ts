import type { VechilesImagenes } from '../types/vehicle-img.interface';

export const setPrincipalVehiculoImagen = async (
  imagenId: string,
): Promise<VechilesImagenes> => {
  throw new Error(
    `No se puede marcar imagen principal en la API actual (imagen ${imagenId})`,
  );
};
