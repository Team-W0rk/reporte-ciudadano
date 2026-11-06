import type {
  CambioDeEstado,
  EstadoReporte,
  Reporte,
  RespuestaExitosa,
} from '@/types';

import { api } from './api';

interface DatosCambioEstado {
  estado: EstadoReporte;
  comentario?: string;
}

interface DatosAsignacionCuadrilla {
  cuadrillaId: string;
  comentario?: string;
}

interface DatosDuplicado {
  originalId: string;
}

interface DatosFotoArreglo {
  id?: string;
  url: string;
}

/**
 * Obtiene el detalle de un reporte.
 */
export async function obtenerDetalleOperador(
  token: string,
  id: string,
): Promise<RespuestaExitosa<Reporte>> {
  const respuesta = await api.get<RespuestaExitosa<Reporte>>(
    `/reportes/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return respuesta.data;
}

/**
 * Obtiene el historial de cambios de un reporte.
 */
export async function obtenerCambiosOperador(
  token: string,
  id: string,
): Promise<RespuestaExitosa<CambioDeEstado[]>> {
  const respuesta = await api.get<
    RespuestaExitosa<CambioDeEstado[]>
  >(`/reportes/${encodeURIComponent(id)}/cambios`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return respuesta.data;
}

/**
 * Cambia el estado de un reporte.
 * El estado "asignado" debe gestionarse mediante asignarCuadrilla.
 */
export async function cambiarEstadoReporte(
  token: string,
  id: string,
  datos: DatosCambioEstado,
): Promise<RespuestaExitosa<Reporte>> {
  if (datos.estado === 'asignado') {
    throw new Error(
      'Para asignar un reporte, utilizá la función asignarCuadrilla.',
    );
  }

  if (datos.estado === 'rechazado' && !datos.comentario?.trim()) {
    throw new Error('Para rechazar un reporte, ingresá un comentario.');
  }

  const respuesta = await api.patch<RespuestaExitosa<Reporte>>(
    `/reportes/${encodeURIComponent(id)}/estado`,
    datos,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return respuesta.data;
}

/**
 * Asigna o reasigna una cuadrilla municipal.
 */
export async function asignarCuadrilla(
  token: string,
  id: string,
  datos: DatosAsignacionCuadrilla,
): Promise<RespuestaExitosa<Reporte>> {
  const respuesta = await api.patch<RespuestaExitosa<Reporte>>(
    `/reportes/${encodeURIComponent(id)}/cuadrilla`,
    datos,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return respuesta.data;
}

/**
 * Marca un reporte como duplicado de otro.
 */
export async function marcarReporteDuplicado(
  token: string,
  id: string,
  datos: DatosDuplicado,
): Promise<RespuestaExitosa<Reporte>> {
  const respuesta = await api.post<RespuestaExitosa<Reporte>>(
    `/reportes/${encodeURIComponent(id)}/duplicado`,
    datos,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return respuesta.data;
}

/**
 * Agrega una foto del arreglo a un reporte.
 */
export async function agregarFotoArreglo(
  token: string,
  id: string,
  datos: DatosFotoArreglo,
): Promise<RespuestaExitosa<Reporte>> {
  const respuesta = await api.post<RespuestaExitosa<Reporte>>(
    `/reportes/${encodeURIComponent(id)}/fotos`,
    datos,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return respuesta.data;
}

/**
 * Busca un reporte por su número de seguimiento (lo que lee el QR del mostrador),
 * por ejemplo GCHU-2026-00412. Un código que no existe da 404.
 */
export async function obtenerReportePorCodigo(
  token: string,
  codigo: string,
): Promise<RespuestaExitosa<Reporte>> {
  const respuesta = await api.get<RespuestaExitosa<Reporte>>(
    `/reportes/codigo/${encodeURIComponent(codigo)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return respuesta.data;
}
