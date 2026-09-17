/**
 * Constantes propias del dominio "Reporte Ciudadano".
 * No se toca `theme.ts` (viene de la plantilla de Expo) — acá va lo
 * específico de nuestra app, para que los 3 devs usen los mismos valores
 * y no cada uno invente su propio verde/rojo/gris para lo mismo.
 */
import { EstadoReporte } from '@/tipos';

// Color de cada estado del reporte — se usa en el mapa, en los chips de
// estado y en la línea de tiempo del detalle. Único lugar donde se define.
export const ColorEstado: Record<EstadoReporte, string> = {
  recibido: '#5D6D7E', // gris — recién llegó, todavía nadie lo miró
  en_revision: '#B7950B', // amarillo — se está verificando
  asignado: '#1B6CA8', // azul — ya tiene cuadrilla
  resuelto: '#2E7D32', // verde — cerrado
  rechazado: '#B03A2E', // rojo — no procede
};

export const EtiquetaEstado: Record<EstadoReporte, string> = {
  recibido: 'Recibido',
  en_revision: 'En revisión',
  asignado: 'Asignado a cuadrilla',
  resuelto: 'Resuelto',
  rechazado: 'Rechazado',
};

// Radios y tamaños de fuente compartidos, para no repetir números sueltos
// en cada pantalla (cards, chips, botones, títulos).
export const Radios = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

export const TamanioFuente = {
  caption: 12,
  body: 15,
  subtitulo: 17,
  titulo: 22,
} as const;

// Paleta institucional (más allá de los colores por estado).
export const ColorPrimario = '#1B6CA8';
export const ColorPeligro = '#B03A2E';
export const ColorBorde = '#E0E1E6';
