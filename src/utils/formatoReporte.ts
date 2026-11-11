
import type { Reporte } from '@/types';

export function formatearFechaReporte(fecha: string): string {
  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return 'Fecha no disponible';
  }

  return valor.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function obtenerTituloReporte(reporte: Reporte): string {
  return reporte.descripcion?.trim() || `Reporte ${reporte.codigo}`;
}
