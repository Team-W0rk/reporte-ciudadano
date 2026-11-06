import type { EstadoReporte, Reporte, RespuestaExitosa, TipoDeReporte, Zona } from '@/types';

import { api } from './api';

// Servicios de Dev 2: mapa y creación de reportes. Mismo estilo que
// reportes.ts: devuelven el sobre completo ({ datos, meta }) y, si el
// endpoint pide sesión, reciben el token como parámetro.

const conToken = (token: string) => ({ Authorization: `Bearer ${token}` });

/** Las cuatro zonas de la ciudad, con su límite (polígono). */
export async function listarZonas(): Promise<RespuestaExitosa<Zona[]>> {
  const respuesta = await api.get<RespuestaExitosa<Zona[]>>('/zonas');
  return respuesta.data;
}

/** Los ocho tipos de problema, con ícono y color. */
export async function listarTiposDeReporte(): Promise<RespuestaExitosa<TipoDeReporte[]>> {
  const respuesta = await api.get<RespuestaExitosa<TipoDeReporte[]>>('/tipos-de-reporte');
  return respuesta.data;
}

/**
 * Reportes para los markers del mapa, dentro del área visible.
 * Sin `estado` la API no trae los rechazados.
 */
export async function listarReportesParaMapa(filtros?: {
  area?: { norte: number; sur: number; este: number; oeste: number };
  estado?: EstadoReporte[];
  tipoId?: string;
}): Promise<RespuestaExitosa<Reporte[]>> {
  const respuesta = await api.get<RespuestaExitosa<Reporte[]>>('/reportes', {
    params: {
      ...filtros?.area,
      estado: filtros?.estado?.join(','),
      tipoId: filtros?.tipoId,
      porPagina: 500,
    },
  });
  return respuesta.data;
}

/**
 * Reportes abiertos cerca de un punto, del más cercano al más lejano.
 * La API calcula la distancia: 50 m por defecto, hasta 200 con radioMetros.
 */
export async function buscarReportesCercanos(
  coordenadas: { latitud: number; longitud: number },
  radioMetros = 50,
): Promise<RespuestaExitosa<Reporte[]>> {
  const respuesta = await api.get<RespuestaExitosa<Reporte[]>>('/reportes/cercanos', {
    params: { ...coordenadas, radioMetros },
  });
  return respuesta.data;
}

/**
 * Sumarse a un reporte que no es tuyo (lo usa la detección de duplicados).
 * 201 la primera vez, 200 si ya estabas. Si el reporte es tuyo responde
 * ADHESION_A_REPORTE_PROPIO.
 */
export async function sumarseAReporte(reporteId: string, token: string): Promise<void> {
  await api.post(`/reportes/${encodeURIComponent(reporteId)}/adhesiones`, undefined, {
    headers: conToken(token),
  });
}

const MIME_POR_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  mp3: 'audio/mpeg',
};

/** POST /archivos: sube una foto o un audio y devuelve la url para el reporte. */
export async function subirArchivo(uriLocal: string, token: string): Promise<string> {
  const extension = uriLocal.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  const tipo = MIME_POR_EXTENSION[extension];
  if (!tipo) {
    throw new Error('Ese tipo de archivo no se puede subir. Mandá una foto o un audio.');
  }

  const formulario = new FormData();
  // React Native acepta { uri, name, type } como archivo de un formulario.
  formulario.append('archivo', { uri: uriLocal, name: `archivo.${extension}`, type: tipo } as unknown as Blob);

  const respuesta = await api.post<RespuestaExitosa<{ url: string }>>('/archivos', formulario, {
    // api.ts fija application/json por defecto: acá hay que pisarlo.
    headers: { ...conToken(token), 'Content-Type': 'multipart/form-data' },
  });
  return respuesta.data.datos.url;
}

export interface DatosNuevoReporte {
  /**
   * Para la cola offline: generalo UNA vez al guardar el reporte en SQLite y
   * reusalo en cada reintento; la API no duplica si el id se repite.
   */
  id?: string;
  tipoId: string;
  descripcion: string | null;
  /** Uri local del audio grabado, o una url ya subida. */
  audioUrl: string | null;
  fotoUri: string;
  /** Segunda foto, opcional (por ejemplo, tomada de lejos). */
  fotoExtraUri?: string | null;
  coordenadas: { latitud: number; longitud: number };
  direccion: string;
}

/**
 * Sube la foto (y el audio, si hay) y después crea el reporte.
 * La zona la calcula la API; fuera de la ciudad responde FUERA_DE_LA_CIUDAD
 * (el mensaje sale con obtenerMensajeError).
 */
export async function crearReporte(
  datos: DatosNuevoReporte,
  token: string,
): Promise<RespuestaExitosa<Reporte>> {
  const esRemota = (uri: string) => /^https?:\/\//.test(uri);

  const fotoUrl = esRemota(datos.fotoUri) ? datos.fotoUri : await subirArchivo(datos.fotoUri, token);
  const fotoExtraUrl = datos.fotoExtraUri
    ? esRemota(datos.fotoExtraUri)
      ? datos.fotoExtraUri
      : await subirArchivo(datos.fotoExtraUri, token)
    : null;
  const audioUrl =
    datos.audioUrl && !esRemota(datos.audioUrl)
      ? await subirArchivo(datos.audioUrl, token)
      : datos.audioUrl;

  const id = datos.id ?? `rep-app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const cuerpo = {
  id,
  tipoId: datos.tipoId,
  descripcion: datos.descripcion,
  audioUrl,
  fotos: fotoExtraUrl
    ? [
        {
          id: `fot-${id}-1`,
          url: fotoUrl,
        },
        {
          id: `fot-${id}-2`,
          url: fotoExtraUrl,
        },
      ]
    : [
        {
          id: `fot-${id}-1`,
          url: fotoUrl,
        },
      ],
  coordenadas: datos.coordenadas,
  direccion: datos.direccion,
  creadoEn: new Date().toISOString(),
};

const respuesta = await api.post<RespuestaExitosa<Reporte>>(
  '/reportes',
  cuerpo,
  { headers: conToken(token) },
);

return respuesta.data;
}