import * as SecureStore from 'expo-secure-store';
import type { Sesion } from '@/types/auth';

const CLAVE_SESION = 'reporte-ciudadano-sesion';
const CLAVE_SESION_BIOMETRICA = 'reporte-ciudadano-sesion-biometrica';

const OPCIONES_BIOMETRICAS: SecureStore.SecureStoreOptions = {
  requireAuthentication: true,
  authenticationPrompt: 'Desbloqueá tu sesión de Reporte Ciudadano',
};

function convertirSesion(contenido: string): Sesion | null {
  try {
    return JSON.parse(contenido) as Sesion;
  } catch {
    return null;
  }
}

/**
Guarda una sesión normal, sin exigir biometría al recuperarla.
*/
export async function guardarSesion(sesion: Sesion): Promise<void> {
  await SecureStore.setItemAsync(
    CLAVE_SESION,
    JSON.stringify(sesion),
  );
}

/**
 Recupera la sesión normal.
*/
export async function recuperarSesion(): Promise<Sesion | null> {
  const contenido = await SecureStore.getItemAsync(CLAVE_SESION);
  if (!contenido) return null;
  const sesion = convertirSesion(contenido);
  if (!sesion) {
    await SecureStore.deleteItemAsync(CLAVE_SESION);
  }
  return sesion;
}

/**
Guarda la sesión protegida por la autenticación del dispositivo.
*/
export async function guardarSesionBiometrica(
  sesion: Sesion,
): Promise<void> {
  await SecureStore.setItemAsync(
    CLAVE_SESION_BIOMETRICA,
    JSON.stringify(sesion),
    OPCIONES_BIOMETRICAS,
  );
  // Solo quitamos la sesión normal después de guardar la protegida.
  await SecureStore.deleteItemAsync(CLAVE_SESION);
}

/**
 Recuperar esta sesión puede mostrar el diálogo biométrico del sistema.
*/
export async function recuperarSesionBiometrica(): Promise<Sesion | null> {
  const contenido = await SecureStore.getItemAsync(
    CLAVE_SESION_BIOMETRICA,
    OPCIONES_BIOMETRICAS,
  );
  if (!contenido) return null;
  const sesion = convertirSesion(contenido);
  if (!sesion) {
    await SecureStore.deleteItemAsync(
      CLAVE_SESION_BIOMETRICA,
      OPCIONES_BIOMETRICAS,
    );
  }
  return sesion;
}

/**
 Desactiva la protección biométrica y conserva la sesión actual si se proporciona.
*/
export async function quitarProteccionBiometrica(
  sesionActual?: Sesion,
): Promise<void> {
  if (sesionActual) {
    await guardarSesion(sesionActual);
  }
  await SecureStore.deleteItemAsync(
    CLAVE_SESION_BIOMETRICA,
    OPCIONES_BIOMETRICAS,
  );
}

/**
Elimina ambas versiones de la sesión.
*/
export async function eliminarSesion(): Promise<void> {
  await SecureStore.deleteItemAsync(CLAVE_SESION);
  await SecureStore.deleteItemAsync(
    CLAVE_SESION_BIOMETRICA,
    OPCIONES_BIOMETRICAS,
  );
}
