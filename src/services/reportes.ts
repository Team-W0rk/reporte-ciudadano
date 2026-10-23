import type {
  CambioDeEstado,
  Reporte,
  RespuestaExitosa,
} from '@/types';

import { api } from './api';

/**
 * Obtiene los reportes del vecino autenticado.
 */
export async function obtenerMisReportes(
  token: string,
): Promise<RespuestaExitosa<Reporte[]>> {
  const respuesta = await api.get<RespuestaExitosa<Reporte[]>>(
    '/yo/reportes',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return respuesta.data;
}

/**
 * Obtiene el detalle de un reporte.
 */
export async function obtenerReportePorId(
  id: string,
): Promise<RespuestaExitosa<Reporte>> {
  const respuesta = await api.get<RespuestaExitosa<Reporte>>(
    `/reportes/${encodeURIComponent(id)}`,
  );

  return respuesta.data;
}

/**
 * Obtiene el historial de cambios de un reporte.
 */
export async function obtenerHistorialReporte(
  id: string,
): Promise<RespuestaExitosa<CambioDeEstado[]>> {
  const respuesta = await api.get<
    RespuestaExitosa<CambioDeEstado[]>
  >(`/reportes/${encodeURIComponent(id)}/cambios`);

  return respuesta.data;
}

