import { api } from './api';
import type {
  DatosIngreso,
  DatosRegistro,
  RespuestaAuth,
  Sesion,
} from '@/types/auth';

export async function registrarUsuario( datos: DatosRegistro ): Promise<Sesion> {
  const respuesta = await api.post<RespuestaAuth>(
    '/auth/registro',
    datos,
  );
  return respuesta.data.datos;
}

export async function ingresarUsuario( datos: DatosIngreso ): Promise<Sesion> {
  const respuesta = await api.post<RespuestaAuth>(
    '/auth/ingreso',
    datos,
  );
  return respuesta.data.datos;
}

export async function obtenerMiPerfil(token: string) {
  const respuesta = await api.get('/yo', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return respuesta.data;
}
