import { TipoDeReporte } from '@/tipos';

export const tiposDeReporteMock: TipoDeReporte[] = [
  { id: 'tip-bache', nombre: 'Bache', icono: 'warning-outline', color: '#C1440E', areaResponsable: 'Obras Públicas' },
  { id: 'tip-luminaria', nombre: 'Luminaria', icono: 'bulb-outline', color: '#B7950B', areaResponsable: 'Alumbrado Público' },
  { id: 'tip-basura', nombre: 'Basura', icono: 'trash-outline', color: '#6B8E23', areaResponsable: 'Higiene Urbana' },
  { id: 'tip-rama', nombre: 'Rama o árbol', icono: 'leaf-outline', color: '#2E7D32', areaResponsable: 'Espacios Verdes' },
  { id: 'tip-agua', nombre: 'Agua o cloaca', icono: 'water-outline', color: '#1B6CA8', areaResponsable: 'Obras Sanitarias' },
  { id: 'tip-semaforo', nombre: 'Semáforo', icono: 'stop-circle-outline', color: '#B03A2E', areaResponsable: 'Tránsito' },
  { id: 'tip-vereda', nombre: 'Vereda', icono: 'walk-outline', color: '#8E5A4A', areaResponsable: 'Obras Públicas' },
  { id: 'tip-otro', nombre: 'Otro', icono: 'ellipsis-horizontal-outline', color: '#5D6D7E', areaResponsable: 'Centro de Atención al Vecino' },
];
