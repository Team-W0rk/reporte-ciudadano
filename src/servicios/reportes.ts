import { Reporte, CambioDeEstado, TipoDeReporte, RespuestaExitosa } from '@/tipos';
import { reportesMock } from '@/mocks/reportes.mock';
import { cambiosDeEstadoMock } from '@/mocks/cambiosDeEstado.mock';
import { tiposDeReporteMock } from '@/mocks/tiposDeReporte.mock';

// ---------------------------------------------------------------------------
// Esta es la ÚNICA puerta de entrada a los datos de reportes.
// Hoy devuelve los mocks. El día que llegue la API de la cátedra, este es
// el único archivo que cambia: se reemplazan los `Promise.resolve(...)` por
// `fetch(...)`. Ninguna pantalla debe importar los mocks directamente.
// ---------------------------------------------------------------------------

function demorar<T>(valor: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

function envolver<T>(datos: T[], pagina = 1, porPagina = 20): RespuestaExitosa<T[]> {
  return { datos, meta: { total: datos.length, pagina, porPagina } };
}

export async function listarReportes(filtros?: {
  estado?: Reporte['estado'];
  tipoId?: string;
  zonaId?: string;
}): Promise<RespuestaExitosa<Reporte[]>> {
  let resultado = reportesMock;

  if (filtros?.estado) resultado = resultado.filter((r) => r.estado === filtros.estado);
  if (filtros?.tipoId) resultado = resultado.filter((r) => r.tipoId === filtros.tipoId);
  if (filtros?.zonaId) resultado = resultado.filter((r) => r.zonaId === filtros.zonaId);

  return demorar(envolver(resultado));
}

export async function obtenerReportePorId(id: string): Promise<Reporte | null> {
  return demorar(reportesMock.find((r) => r.id === id) ?? null);
}

export async function obtenerHistorial(reporteId: string): Promise<CambioDeEstado[]> {
  return demorar(cambiosDeEstadoMock.filter((c) => c.reporteId === reporteId));
}

export async function listarTiposDeReporte(): Promise<TipoDeReporte[]> {
  return demorar(tiposDeReporteMock);
}

// Reportes existentes a menos de `radioMetros` de una coordenada dada.
// Se usa antes de crear un reporte nuevo, para preguntar "¿es el mismo?".
export async function buscarReportesCercanos(
  coordenadas: { latitud: number; longitud: number },
  radioMetros = 50,
): Promise<Reporte[]> {
  const cercanos = reportesMock.filter(
    (r) => distanciaEnMetros(coordenadas, r.coordenadas) <= radioMetros,
  );
  return demorar(cercanos);
}

function distanciaEnMetros(
  a: { latitud: number; longitud: number },
  b: { latitud: number; longitud: number },
): number {
  const R = 6371000;
  const rad = (grados: number) => (grados * Math.PI) / 180;
  const dLat = rad(b.latitud - a.latitud);
  const dLon = rad(b.longitud - a.longitud);
  const lat1 = rad(a.latitud);
  const lat2 = rad(b.latitud);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export interface DatosNuevoReporte {
  tipoId: string;
  descripcion: string | null;
  audioUrl: string | null;
  fotoUri: string;
  coordenadas: { latitud: number; longitud: number };
  direccion: string;
  autorId: string;
}

export async function crearReporte(datos: DatosNuevoReporte): Promise<Reporte> {
  const nuevo: Reporte = {
    id: `rep-local-${Date.now()}`,
    codigo: 'PENDIENTE-DE-SINCRONIZAR',
    tipoId: datos.tipoId,
    descripcion: datos.descripcion,
    audioUrl: datos.audioUrl,
    fotos: [{ id: `fot-local-${Date.now()}`, url: datos.fotoUri, momento: 'problema' }],
    coordenadas: datos.coordenadas,
    direccion: datos.direccion,
    zonaId: 'zon-norte', // TODO: calcular la zona real según el polígono (ver mocks/zonas.mock.ts)
    estado: 'recibido',
    autorId: datos.autorId,
    cuadrillaId: null,
    duplicadoDe: null,
    adhesiones: 0,
    creadoEn: new Date().toISOString(),
    sincronizado: false,
  };

  reportesMock.push(nuevo);
  return demorar(nuevo);
}

export async function sumarseAReporte(reporteId: string): Promise<Reporte | null> {
  const reporte = reportesMock.find((r) => r.id === reporteId);
  if (!reporte) return demorar(null);
  reporte.adhesiones += 1;
  return demorar(reporte);
}
