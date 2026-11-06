
import type { EstadoReporte, Reporte, RespuestaExitosa } from '@/types';
import { api } from './api';

export interface FiltrosBandeja {
  pagina?: number;
  porPagina?: number;
  estado?: EstadoReporte[];
  tipoId?: string;
  zonaId?: string;
}

export async function obtenerBandeja(
  token: string,
  filtros: FiltrosBandeja = {},
): Promise<RespuestaExitosa<Reporte[]>> {
  const { estado, ...otrosFiltros } = filtros;

  const respuesta = await api.get<RespuestaExitosa<Reporte[]>>('/bandeja', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      ...otrosFiltros,
      ...(estado?.length ? { estado: estado.join(',') } : {}),
    },
  });

  return respuesta.data;
}


