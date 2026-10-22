import { Reporte } from '@/tipos';

export const reportesMock: Reporte[] = [
  {
    id: 'rep-00412', codigo: 'GCHU-2026-00412', tipoId: 'tip-bache',
    descripcion: 'Pozo grande en la mano hacia el centro, pasa el agua.',
    audioUrl: 'https://api.gchu.gob.ar/audio/rep-00412.m4a',
    fotos: [{ id: 'fot-901', url: 'https://api.gchu.gob.ar/f/901.jpg', momento: 'problema' }],
    coordenadas: { latitud: -33.0089, longitud: -58.5142 }, direccion: 'Rocamora 1240',
    zonaId: 'zon-norte', estado: 'asignado', autorId: 'usr-084', cuadrillaId: 'cua-02',
    duplicadoDe: null, adhesiones: 3, creadoEn: '2026-09-14T10:22:00-03:00', sincronizado: true,
  },
  {
    id: 'rep-00413', codigo: 'GCHU-2026-00413', tipoId: 'tip-luminaria',
    descripcion: 'Luminaria quemada hace una semana.', audioUrl: null,
    fotos: [{ id: 'fot-902', url: 'https://api.gchu.gob.ar/f/902.jpg', momento: 'problema' }],
    coordenadas: { latitud: -33.012, longitud: -58.505 }, direccion: 'San Martín 850',
    zonaId: 'zon-norte', estado: 'recibido', autorId: 'usr-084', cuadrillaId: null,
    duplicadoDe: null, adhesiones: 0, creadoEn: '2026-09-16T08:00:00-03:00', sincronizado: true,
  },
  {
    id: 'rep-00399', codigo: 'GCHU-2026-00399', tipoId: 'tip-vereda',
    descripcion: 'Vereda rota frente al número 220.', audioUrl: null,
    fotos: [{ id: 'fot-880', url: 'https://api.gchu.gob.ar/f/880.jpg', momento: 'problema' }],
    coordenadas: { latitud: -33.02, longitud: -58.52 }, direccion: 'Urquiza 220',
    zonaId: 'zon-sur', estado: 'rechazado', autorId: 'usr-084', cuadrillaId: null,
    duplicadoDe: null, adhesiones: 1, creadoEn: '2026-09-01T14:00:00-03:00', sincronizado: true,
  },
  {
    id: 'rep-00350', codigo: 'GCHU-2026-00350', tipoId: 'tip-agua',
    descripcion: 'Pérdida de agua en la vereda.', audioUrl: null,
    fotos: [
      { id: 'fot-800', url: 'https://api.gchu.gob.ar/f/800.jpg', momento: 'problema' },
      { id: 'fot-801', url: 'https://api.gchu.gob.ar/f/801.jpg', momento: 'arreglo' },
    ],
    coordenadas: { latitud: -33.03, longitud: -58.49 }, direccion: 'Bolívar 640',
    zonaId: 'zon-este', estado: 'resuelto', autorId: 'usr-084', cuadrillaId: 'cua-03',
    duplicadoDe: null, adhesiones: 5, creadoEn: '2026-08-20T11:00:00-03:00', sincronizado: true,
  },
  {
    id: 'rep-00415', codigo: 'GCHU-2026-00415', tipoId: 'tip-bache',
    descripcion: 'Mismo bache de Rocamora, lo reporto por las dudas.', audioUrl: null,
    fotos: [{ id: 'fot-905', url: 'https://api.gchu.gob.ar/f/905.jpg', momento: 'problema' }],
    coordenadas: { latitud: -33.009, longitud: -58.5145 }, direccion: 'Rocamora 1244',
    zonaId: 'zon-norte', estado: 'asignado', autorId: 'usr-084', cuadrillaId: 'cua-02',
    duplicadoDe: 'rep-00412', adhesiones: 0, creadoEn: '2026-09-15T09:00:00-03:00', sincronizado: true,
  },
  {
    id: 'rep-local-1', codigo: 'PENDIENTE-DE-SINCRONIZAR', tipoId: 'tip-rama',
    descripcion: 'Rama grande caída, corta el paso peatonal.', audioUrl: null,
    fotos: [{ id: 'fot-local-1', url: 'file:///cache/fotos/rep-local-1.jpg', momento: 'problema' }],
    coordenadas: { latitud: -33.0, longitud: -58.55 }, direccion: 'Ubicación tomada por GPS',
    zonaId: 'zon-oeste', estado: 'recibido', autorId: 'usr-084', cuadrillaId: null,
    duplicadoDe: null, adhesiones: 0, creadoEn: '2026-09-17T20:00:00-03:00', sincronizado: false,
  },
];

export const reportesVaciosMock: Reporte[] = [];
