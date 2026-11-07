import { guardarCatalogo, leerCatalogo } from './colaOffline';
import { listarTiposDeReporte } from './reportesCreacion';
import type { TipoDeReporte } from '@/types';

const CLAVE_TIPOS = 'tipos-de-reporte';

/**
 * Los tipos de problema. Se piden a la API y se guardan en el teléfono; si no
 * hay señal se usan los últimos que se guardaron. Así se puede crear un reporte
 * sin conexión, siempre que la app se haya abierto con internet alguna vez
 * (por ejemplo, al iniciar sesión).
 */
export async function cargarTiposConCache(): Promise<TipoDeReporte[]> {
  try {
    const respuesta = await listarTiposDeReporte();
    await guardarCatalogo(CLAVE_TIPOS, respuesta.datos).catch(() => undefined);
    return respuesta.datos;
  } catch (error) {
    const guardados = await leerCatalogo<TipoDeReporte[]>(CLAVE_TIPOS).catch(() => null);
    if (guardados && guardados.length > 0) return guardados;
    throw error;
  }
}