import { Zona, Cuadrilla } from '@/tipos';

export const zonasMock: Zona[] = [
  { id: 'zon-norte', nombre: 'Zona Norte', referente: 'Corralón Norte', limite: [{ latitud: -32.99, longitud: -58.53 }, { latitud: -32.99, longitud: -58.49 }, { latitud: -33.02, longitud: -58.49 }] },
  { id: 'zon-sur', nombre: 'Zona Sur', referente: 'Corralón Sur', limite: [{ latitud: -33.03, longitud: -58.53 }, { latitud: -33.03, longitud: -58.49 }, { latitud: -33.06, longitud: -58.49 }] },
  { id: 'zon-este', nombre: 'Zona Este', referente: 'Corralón Este', limite: [{ latitud: -33.0, longitud: -58.49 }, { latitud: -33.0, longitud: -58.45 }, { latitud: -33.03, longitud: -58.45 }] },
  { id: 'zon-oeste', nombre: 'Zona Oeste', referente: 'Corralón Oeste', limite: [{ latitud: -33.0, longitud: -58.53 }, { latitud: -33.0, longitud: -58.57 }, { latitud: -33.03, longitud: -58.57 }] },
];

export const cuadrillasMock: Cuadrilla[] = [
  { id: 'cua-01', nombre: 'Cuadrilla 1 — Bacheo', zonaId: 'zon-norte', especialidad: 'pavimento', activa: true },
  { id: 'cua-02', nombre: 'Cuadrilla 2 — Bacheo', zonaId: 'zon-norte', especialidad: 'pavimento', activa: true },
  { id: 'cua-03', nombre: 'Cuadrilla 3 — Alumbrado', zonaId: 'zon-sur', especialidad: 'electricidad', activa: true },
  { id: 'cua-04', nombre: 'Cuadrilla 4 — Espacios Verdes', zonaId: 'zon-este', especialidad: 'poda', activa: true },
  { id: 'cua-05', nombre: 'Cuadrilla 5 — Higiene Urbana', zonaId: 'zon-oeste', especialidad: 'limpieza', activa: false },
];
