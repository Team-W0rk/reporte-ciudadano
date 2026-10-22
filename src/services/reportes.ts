import type {
  CambioDeEstado,
  Reporte,
  RespuestaExitosa,
} from '@/tipos';
import { apiGet } from './api';

/** Obtiene los reportes del vecino autenticado. Requiere el token de sesión. */
export async function obtenerMisReportes(
  token: string,
): Promise<RespuestaExitosa<Reporte[]>> {
  return apiGet<RespuestaExitosa<Reporte[]>>(
    '/yo/reportes',
    token,
  );
}

/** Obtiene el detalle de un reporte por su ID. */
export async function obtenerReportePorId(
  id: string,
): Promise<RespuestaExitosa<Reporte>> {
  return apiGet<RespuestaExitosa<Reporte>>(
    `/reportes/${encodeURIComponent(id)}`,
  );
}

/** Obtiene el historial de cambios de estado de un reporte. */
export async function obtenerHistorialReporte(
  id: string,
): Promise<RespuestaExitosa<CambioDeEstado[]>> {
  return apiGet<RespuestaExitosa<CambioDeEstado[]>>(
    `/reportes/${encodeURIComponent(id)}/cambios`,
  );
}

