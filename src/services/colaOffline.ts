import axios from 'axios';
import * as SQLite from 'expo-sqlite';

import { obtenerMensajeError } from './errores';
import { crearReporte, type DatosNuevoReporte } from './reportesCreacion';

// Cola de reportes que no se pudieron enviar por falta de red. Se guardan en
// SQLite con su id ya generado: al reintentar se usa el mismo id, y la API no
// duplica si el pedido llegó pero la respuesta se perdió.

export type ReportePendiente = DatosNuevoReporte & { id: string };

let base: Promise<SQLite.SQLiteDatabase> | null = null;

function abrir() {
  base ??= SQLite.openDatabaseAsync('reporte-ciudadano.db').then(async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reportes_pendientes (
        id TEXT PRIMARY KEY NOT NULL,
        datos TEXT NOT NULL,
        creado_en TEXT NOT NULL
      );
    `);
    return db;
  });
  return base;
}

/** True si el error es de red (no hubo respuesta del servidor), o sea, vale la pena reintentar. */
export function esErrorDeRed(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

export async function encolarReporte(reporte: ReportePendiente): Promise<void> {
  const db = await abrir();
  await db.runAsync(
    'INSERT OR REPLACE INTO reportes_pendientes (id, datos, creado_en) VALUES (?, ?, ?)',
    reporte.id,
    JSON.stringify(reporte),
    new Date().toISOString(),
  );
}

export async function contarPendientes(): Promise<number> {
  const db = await abrir();
  const fila = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM reportes_pendientes');
  return fila?.total ?? 0;
}

export interface ResultadoSincronizacion {
  enviados: number;
  /** Reportes que la API rechazó (datos inválidos): se sacan de la cola y se informan. */
  descartados: { id: string; mensaje: string }[];
  /** Cuántos quedan esperando red. */
  pendientes: number;
}

/**
 * Intenta enviar todos los pendientes, del más viejo al más nuevo.
 * Si no hay red corta y deja el resto en la cola. Llamarla cuando vuelve la
 * conexión o al abrir la app.
 */
export async function sincronizarPendientes(token: string): Promise<ResultadoSincronizacion> {
  const db = await abrir();
  const filas = await db.getAllAsync<{ id: string; datos: string }>(
    'SELECT id, datos FROM reportes_pendientes ORDER BY creado_en ASC',
  );

  const resultado: ResultadoSincronizacion = { enviados: 0, descartados: [], pendientes: 0 };

  for (const fila of filas) {
    try {
      await crearReporte(JSON.parse(fila.datos) as ReportePendiente, token);
      await db.runAsync('DELETE FROM reportes_pendientes WHERE id = ?', fila.id);
      resultado.enviados += 1;
    } catch (error) {
      if (esErrorDeRed(error)) break; // sin red: reintentar más tarde
      const estado = axios.isAxiosError(error) ? error.response?.status : undefined;
      // 401 (sesión vencida), 429 y 5xx son transitorios: se queda en la cola.
      if (estado === 401 || estado === 429 || (estado !== undefined && estado >= 500)) continue;
      // Cualquier otro rechazo (400/422/...) no se arregla reintentando.
      resultado.descartados.push({ id: fila.id, mensaje: obtenerMensajeError(error) });
      await db.runAsync('DELETE FROM reportes_pendientes WHERE id = ?', fila.id);
    }
  }

  resultado.pendientes = await contarPendientes();
  return resultado;
}