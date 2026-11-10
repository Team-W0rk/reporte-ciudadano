import { api } from './api';

// Endpoints de gestión de dispositivos y notificaciones push.
// Requieren autenticación mediante el token de sesión.

export type Plataforma = 'ios' | 'android';

const conToken = (token: string) => ({ Authorization: `Bearer ${token}` });

/** Registra el token de Expo de este teléfono para la cuenta de la sesión. Se puede repetir (200). */
export async function registrarDispositivo(
  token: string,
  tokenExpo: string,
  plataforma: Plataforma,
): Promise<void> {
  await api.post(
    '/dispositivos',
    { tokenExpo, plataforma },
    { headers: conToken(token) },
  );
}

/** Da de baja el token de este teléfono. Llamarlo ANTES de cerrar sesión (después el token ya no sirve). */
export async function darDeBajaDispositivo(token: string, tokenExpo: string): Promise<void> {
  await api.delete(`/dispositivos/${encodeURIComponent(tokenExpo)}`, {
    headers: conToken(token),
  });
}

/** Manda una push de prueba a los teléfonos de la cuenta. Devuelve a cuántos se envió (0 con los avisos apagados). */
export async function enviarPushDePrueba(token: string): Promise<number> {
  const respuesta = await api.post<{ datos: { enviadas: number } }>(
    '/dispositivos/prueba',
    undefined,
    { headers: conToken(token) },
  );
  return respuesta.data.datos.enviadas;
}