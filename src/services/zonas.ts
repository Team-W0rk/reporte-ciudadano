import type { Zona } from '@/types/zona';
import type { RespuestaExitosa } from '@/types';
import { api } from './api';

export async function obtenerZonas(): Promise<RespuestaExitosa<Zona[]>> {
  const respuesta = await api.get<RespuestaExitosa<Zona[]>>('/zonas');
  return respuesta.data;
}