import type { Cuadrilla, RespuestaExitosa } from '@/types';
import { api } from './api';

export async function obtenerCuadrillas(
  token: string,
  filtros: {
    zonaId?: string;
    activa?: boolean;
  } = {},
): Promise<RespuestaExitosa<Cuadrilla[]>> {
  const respuesta = await api.get<RespuestaExitosa<Cuadrilla[]>>(
    '/cuadrillas',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filtros,
    },
  );

  return respuesta.data;
}

