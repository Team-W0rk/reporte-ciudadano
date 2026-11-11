import { guardarAdhesionLocal } from '@/services/colaOffline';
import { sumarseAReporte } from '@/services/reportesCreacion';

/**
 * Registra una adhesión en el servidor y la conserva localmente.
 *
 * Devuelve true si la adhesión es nueva.
 * Devuelve false si el usuario ya estaba adherido.
 */
export async function adherirseAReporte(
  reporteId: string,
  usuarioId: string,
  token: string,
): Promise<boolean> {
  const nuevaAdhesion = await sumarseAReporte(reporteId, token);
  await guardarAdhesionLocal(usuarioId, reporteId);
  return nuevaAdhesion;
}
