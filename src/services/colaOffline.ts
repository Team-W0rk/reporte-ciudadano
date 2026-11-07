import axios from 'axios';
import * as SQLite from 'expo-sqlite';

import { borrarSiEsPersistente } from './archivosPersistentes';
import { obtenerMensajeError } from './errores';
import {
  crearReporte,
  type DatosNuevoReporte,
} from './reportesCreacion';

export type ReportePendiente = DatosNuevoReporte & {
  id: string;
  usuarioId: string;
};

let base: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Abre la base de datos y crea las tablas necesarias.
 * La conexión se reutiliza durante toda la ejecución de la aplicación.
 */
function abrir(): Promise<SQLite.SQLiteDatabase> {
  base ??= SQLite.openDatabaseAsync('reporte-ciudadano.db').then(
    async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS reportes_pendientes (
          id TEXT PRIMARY KEY NOT NULL,
          usuario_id TEXT NOT NULL,
          datos TEXT NOT NULL,
          creado_en TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS adhesiones_locales (
          usuario_id TEXT NOT NULL,
          reporte_id TEXT NOT NULL,
          creado_en TEXT NOT NULL,
          PRIMARY KEY (usuario_id, reporte_id)
        );

        -- Últimos catálogos descargados (por ejemplo, los tipos de problema),
        -- para poder reportar sin conexión.
        CREATE TABLE IF NOT EXISTS cache_catalogos (
          clave TEXT PRIMARY KEY NOT NULL,
          datos TEXT NOT NULL,
          actualizado_en TEXT NOT NULL
        );
      `);

      // Permite actualizar instalaciones que ya tenían
      // la tabla de reportes pendientes anterior.
      const columnas = await db.getAllAsync<{ name: string }>(
        'PRAGMA table_info(reportes_pendientes)',
      );

      if (!columnas.some((columna) => columna.name === 'usuario_id')) {
        await db.execAsync(`
          ALTER TABLE reportes_pendientes
          ADD COLUMN usuario_id TEXT;
        `);
      }

      return db;
    },
  );

  return base;
}

/**
 * Indica si Axios no recibió respuesta del servidor.
 */
export function esErrorDeRed(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

/**
 * Guarda un reporte para enviarlo cuando vuelva la conexión.
 */
export async function encolarReporte(
  reporte: ReportePendiente,
): Promise<void> {
  const db = await abrir();

  await db.runAsync(
    `INSERT OR REPLACE INTO reportes_pendientes
      (id, usuario_id, datos, creado_en)
     VALUES (?, ?, ?, ?)`,
    reporte.id,
    reporte.usuarioId,
    JSON.stringify(reporte),
    new Date().toISOString(),
  );
}

/**
 * Cuenta los reportes pendientes de sincronización.
 * Si no se indica usuario, cuenta todos.
 */
export async function contarPendientes(
  usuarioId?: string,
): Promise<number> {
  const db = await abrir();

  const fila = usuarioId
    ? await db.getFirstAsync<{ total: number }>(
        `SELECT COUNT(*) AS total
         FROM reportes_pendientes
         WHERE usuario_id = ?`,
        usuarioId,
      )
    : await db.getFirstAsync<{ total: number }>(
        'SELECT COUNT(*) AS total FROM reportes_pendientes',
      );

  return fila?.total ?? 0;
}

export interface ResultadoSincronizacion {
  enviados: number;
  descartados: {
    id: string;
    mensaje: string;
  }[];
  pendientes: number;
}

/**
 * Sincroniza los reportes pendientes de un usuario.
 */
export async function sincronizarPendientes(
  token: string,
  usuarioId: string,
): Promise<ResultadoSincronizacion> {
  const db = await abrir();

  const filas = await db.getAllAsync<{
    id: string;
    datos: string;
  }>(
    `SELECT id, datos
     FROM reportes_pendientes
     WHERE usuario_id = ?
     ORDER BY creado_en ASC`,
    usuarioId,
  );

  const resultado: ResultadoSincronizacion = {
    enviados: 0,
    descartados: [],
    pendientes: 0,
  };

  for (const fila of filas) {
    try {
      const reporte = JSON.parse(fila.datos) as ReportePendiente;

      // Protección adicional ante datos inconsistentes en SQLite.
      if (reporte.usuarioId !== usuarioId) {
        continue;
      }

      await crearReporte(reporte, token);

      await db.runAsync(
        'DELETE FROM reportes_pendientes WHERE id = ?',
        fila.id,
      );

      // Ya está en el servidor: se liberan las copias de la foto y el audio.
      await borrarSiEsPersistente(reporte.fotoUri);
      await borrarSiEsPersistente(reporte.audioUrl);

      resultado.enviados += 1;
    } catch (error) {
      if (esErrorDeRed(error)) {
        break;
      }

      const estado = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      // No eliminar reportes por errores transitorios.
      if (
        estado === 401 ||
        estado === 403 ||
        estado === 408 ||
        estado === 429 ||
        (estado !== undefined && estado >= 500)
      ) {
        continue;
      }

      // Se informa el rechazo sin borrar el reporte local.
      resultado.descartados.push({
        id: fila.id,
        mensaje: obtenerMensajeError(error),
      });
    }
  }

  resultado.pendientes = await contarPendientes(usuarioId);

  return resultado;
}

/**
 * Registra localmente una adhesión realizada correctamente en la API.
 */
export async function guardarAdhesionLocal(
  usuarioId: string,
  reporteId: string,
): Promise<void> {
  const db = await abrir();

  await db.runAsync(
    `INSERT OR REPLACE INTO adhesiones_locales
      (usuario_id, reporte_id, creado_en)
     VALUES (?, ?, ?)`,
    usuarioId,
    reporteId,
    new Date().toISOString(),
  );
}

/**
 * Obtiene los IDs de los reportes a los que se adhirió un usuario.
 */
export async function obtenerAdhesionesLocales(
  usuarioId: string,
): Promise<string[]> {
  const db = await abrir();

  const filas = await db.getAllAsync<{
    reporte_id: string;
  }>(
    `SELECT reporte_id
     FROM adhesiones_locales
     WHERE usuario_id = ?
     ORDER BY creado_en DESC`,
    usuarioId,
  );

  return filas.map((fila) => fila.reporte_id);
}

/**
 * Guarda un catálogo (por ejemplo, los tipos de problema) para usarlo sin conexión.
 */
export async function guardarCatalogo(
  clave: string,
  datos: unknown,
): Promise<void> {
  const db = await abrir();

  await db.runAsync(
    `INSERT OR REPLACE INTO cache_catalogos
      (clave, datos, actualizado_en)
     VALUES (?, ?, ?)`,
    clave,
    JSON.stringify(datos),
    new Date().toISOString(),
  );
}

/**
 * Devuelve el último catálogo guardado, o null si todavía no hay ninguno.
 */
export async function leerCatalogo<T>(clave: string): Promise<T | null> {
  const db = await abrir();

  const fila = await db.getFirstAsync<{ datos: string }>(
    'SELECT datos FROM cache_catalogos WHERE clave = ?',
    clave,
  );

  return fila ? (JSON.parse(fila.datos) as T) : null;
}
