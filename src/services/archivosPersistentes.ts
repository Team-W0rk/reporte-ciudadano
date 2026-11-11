// La cámara y el micrófono dejan los archivos en la carpeta de caché, que el
// sistema puede vaciar en cualquier momento. Un reporte guardado sin señal
// puede tardar horas o días en subirse, así que antes de encolarlo se copian la
// foto y el audio a una carpeta que no se limpia sola.
import * as FileSystem from 'expo-file-system/legacy';

const CARPETA = `${FileSystem.documentDirectory ?? ''}pendientes/`;

/** Copia el archivo a una carpeta persistente. Si falla, devuelve el original. */
export async function copiarAPersistente(uri: string): Promise<string> {
  try {
    if (!FileSystem.documentDirectory || uri.startsWith(CARPETA)) return uri;

    await FileSystem.makeDirectoryAsync(CARPETA, { intermediates: true }).catch(() => undefined);

    const extension = uri.split('?')[0].split('.').pop() ?? 'bin';
    const destino = `${CARPETA}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    await FileSystem.copyAsync({ from: uri, to: destino });
    return destino;
  } catch {
    return uri;
  }
}

/** Borra la copia persistente una vez que el reporte se subió. No toca otros archivos. */
export async function borrarSiEsPersistente(uri: string | null | undefined): Promise<void> {
  if (!uri || !uri.startsWith(CARPETA)) return;
  await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined);
}