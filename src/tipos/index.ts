// Tipos del dominio "Reporte Ciudadano" — Municipalidad de Gualeguaychú.
// Se escriben una sola vez acá y no se tocan cuando llegue la API de la cátedra.

export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface Foto {
  id: string;
  url: string; // o ruta local mientras no se subió
  momento: 'problema' | 'arreglo';
}

export type EstadoReporte =
  | 'recibido'
  | 'en_revision'
  | 'asignado'
  | 'resuelto'
  | 'rechazado';

export interface Reporte {
  id: string;
  codigo: string; // "GCHU-2026-00412"
  tipoId: string;
  descripcion: string | null;
  audioUrl: string | null; // nota de voz
  fotos: Foto[];
  coordenadas: Coordenadas;
  direccion: string;
  zonaId: string;
  estado: EstadoReporte;
  autorId: string;
  cuadrillaId: string | null;
  duplicadoDe: string | null;
  adhesiones: number;
  creadoEn: string; // ISO 8601
  sincronizado: boolean; // false mientras está en la cola offline
}

export interface TipoDeReporte {
  id: string;
  nombre: string;
  icono: string; // nombre de ícono de Ionicons
  color: string;
  areaResponsable: string;
}

export interface CambioDeEstado {
  id: string;
  reporteId: string;
  estado: EstadoReporte;
  comentario: string | null;
  operadorId: string | null;
  fechaHora: string; // ISO 8601
}

export type Rol = 'vecino' | 'operador';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  rol: Rol;
  zonaId: string | null; // solo para operadores
  avisosActivos: boolean;
  creadoEn: string;
}

export interface Zona {
  id: string;
  nombre: string;
  limite: Coordenadas[]; // polígono
  referente: string;
}

export interface Cuadrilla {
  id: string;
  nombre: string;
  zonaId: string;
  especialidad: string;
  activa: boolean;
}

// Forma estándar de las respuestas, tal como las va a devolver la API de la cátedra.
export interface RespuestaExitosa<T> {
  datos: T;
  meta: { total: number; pagina: number; porPagina: number };
}

export interface RespuestaError {
  error: { codigo: string; mensaje: string };
}
