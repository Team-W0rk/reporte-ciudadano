import type { Usuario } from '@/types';

import { api } from './api';

export interface CambiosPerfil {
  nombre?: string;
  telefono?: string;
  avisosActivos?: boolean;
}

/** PATCH /yo: solo cambia lo que se manda. El email y el rol no se pueden cambiar. Devuelve el usuario actualizado. */
export async function actualizarPerfil(
  token: string,
  cambios: CambiosPerfil,
): Promise<Usuario> {
  const respuesta = await api.patch<{ datos: Usuario }>('/yo', cambios, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return respuesta.data.datos;
}