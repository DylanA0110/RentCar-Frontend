import 'server-only';

import { unstable_cache } from 'next/cache';
import { getVehiculos } from './get-vehiculo';

const REVALIDATE_SECONDS = 60 * 60 * 24;

const getVehiculosPublicCached = unstable_cache(
  async () => getVehiculos({}),
  ['vehiculos-public-preview'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ['vehiculos-public-preview'],
  },
);

export const getVehiculosPublicISR = async () => getVehiculosPublicCached();
