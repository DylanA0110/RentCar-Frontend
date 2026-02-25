const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const toBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const humanizeSlug = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const toVehicleRouteCode = (
  id: string,
  marca: string,
  modelo: string,
) => {
  const nameSlug = slugify(`${marca} ${modelo}`) || 'vehiculo';
  const base64 = toBase64(id);
  const token = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
  return `${nameSlug}--${token}`;
};

export const fromVehicleRouteCode = (code: string) => {
  try {
    const token = code.includes('--') ? code.split('--').pop() ?? '' : code;
    if (!token) return null;

    const normalized = token.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + '='.repeat(paddingLength);
    return fromBase64(padded);
  } catch {
    return null;
  }
};

export const getVehicleRouteLabel = (code: string) => {
  const slug = code.includes('--') ? code.split('--')[0] : '';
  if (!slug) return 'Editar vehículo';
  return `Editar ${humanizeSlug(slug)}`;
};
