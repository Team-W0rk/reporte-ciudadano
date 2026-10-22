import { EstadoReporte } from '@/types';

export const ColorEstado: Record<EstadoReporte, string> = {
  recibido: '#5D6D7E',
  en_revision: '#B7950B',
  asignado: '#1B6CA8',
  resuelto: '#2E7D32',
  rechazado: '#B03A2E',
};

export const EtiquetaEstado: Record<EstadoReporte, string> = {
  recibido: 'Recibido',
  en_revision: 'En revisión',
  asignado: 'Asignado a cuadrilla',
  resuelto: 'Resuelto',
  rechazado: 'Rechazado',
};

export const Radios = { sm: 8, md: 12, lg: 20 } as const;
export const TamanioFuente = { caption: 12, body: 15, subtitulo: 17, titulo: 22 } as const;
export const ColorPrimario = '#1B6CA8';
export const ColorPeligro = '#B03A2E';
export const ColorBorde = '#E0E1E6';
