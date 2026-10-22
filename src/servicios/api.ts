
import type { RespuestaError } from '@/tipos';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function apiGet<T>(
  ruta: string,
  token?: string,
): Promise<T> {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const cuerpo: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const errorApi = cuerpo as RespuestaError;

    throw new Error(
      'error' in errorApi
        ? errorApi.error.mensaje
        : `Error HTTP ${respuesta.status}`,
    );
  }

  return cuerpo as T;
}
