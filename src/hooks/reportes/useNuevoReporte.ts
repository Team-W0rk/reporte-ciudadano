import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Network from 'expo-network';
import { router } from 'expo-router';
import { copiarAPersistente } from '@/services/archivosPersistentes';
import { cargarTiposConCache } from '@/services/catalogos';
import {
  encolarReporte,
  esErrorDeRed,
  guardarAdhesionLocal,
} from '@/services/colaOffline';
import { obtenerMensajeError } from '@/services/errores';
import {
  buscarReportesCercanos,
  crearReporte,
  sumarseAReporte,
} from '@/services/reportesCreacion';
import { useAuth } from '@/hooks/auth/useAuth';
import type { Coordenadas, Reporte, TipoDeReporte } from '@/types';

interface DatosFormulario {
  fotoUri: string | null;
  audioUri: string | null;
  direccion: string;
}

export default function useNuevoReporte(
  coordenadas: Coordenadas | null,
) {
  const [tipos, setTipos] = useState<TipoDeReporte[]>([]);
  const [tipoId, setTipoId] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [cercanos, setCercanos] = useState<Reporte[]>([]);
  const [ignorarDuplicados, setIgnorarDuplicados] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cargandoTipos, setCargandoTipos] = useState(true);

  const { token, usuario } = useAuth();
  const [errorTipos, setErrorTipos] = useState(false);

  // El ID se genera una sola vez para conservarlo durante los reintentos.
  const idReporte = useRef(
    `rep-app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  );

  // Los tipos de problema se guardan en el teléfono: sin señal se usan los
  // últimos descargados. Solo falla si la app nunca se abrió con internet.
  const cargarTipos = useCallback(async () => {
    setCargandoTipos(true);
    setErrorTipos(false);

    try {
      setTipos(await cargarTiposConCache());
    } catch {
      setErrorTipos(true);
    } finally {
      setCargandoTipos(false);
    }
  }, []);

  useEffect(() => {
    void cargarTipos();

    // Si arrancó sin conexión y no había categorías guardadas, se cargan
    // solas apenas vuelve la red.
    const suscripcion = Network.addNetworkStateListener((estado) => {
      if (estado.isConnected === true && estado.isInternetReachable !== false) {
        void cargarTipos();
      }
    });

    return () => suscripcion.remove();
  }, [cargarTipos]);

  // La subida de los reportes guardados sin señal la hace, en cualquier
  // pantalla, useSincronizacionAutomatica (montado en el layout raíz).

  useEffect(() => {
    if (!coordenadas) {
      setCercanos([]);
      return;
    }

    let activo = true;
    const ubicacion = coordenadas;

    async function cargarCercanos() {
      try {
        const respuesta = await buscarReportesCercanos(ubicacion);

        if (!activo) {
          return;
        }

        setCercanos(respuesta.datos);

        if (respuesta.datos.length > 0) {
          void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
          );
        }
      } catch {
        if (activo) {
          setCercanos([]);
        }
      }
    }

    void cargarCercanos();

    return () => {
      activo = false;
    };
  }, [coordenadas]);

  /**
   * Permite al usuario adherirse a un reporte existente.
   */
  const sumarmeA = async (reporte: Reporte) => {
    if (!token || !usuario) {
      Alert.alert(
        'Iniciá sesión',
        'Necesitás una sesión activa para sumarte a un reporte.',
      );
      return;
    }

    try {
      // Primero registramos la adhesión en la API.
      await sumarseAReporte(reporte.id, token);

      // Si la API responde correctamente, guardamos la adhesión local.
      await guardarAdhesionLocal(usuario.id, reporte.id);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );

      Alert.alert(
        'Listo',
        'Te sumaste a ese reporte. Vas a recibir avisos cuando cambie de estado.',
      );

      router.back();
    } catch (error) {
      Alert.alert(
        'No pudimos sumarte',
        obtenerMensajeError(error),
      );
    }
  };

  /**
   * Crea un reporte nuevo o lo guarda localmente si no hay conexión.
   */
  const enviar = async ({
    fotoUri,
    audioUri,
    direccion,
  }: DatosFormulario) => {
    if (enviando) {
      return;
    }

    if (!token || !usuario) {
      Alert.alert(
        'Iniciá sesión',
        'Necesitás una sesión activa para enviar un reporte.',
      );
      return;
    }

    if (!tipoId) {
      Alert.alert(
        'Falta el tipo',
        'Elegí qué tipo de problema es.',
      );
      return;
    }

    if (!fotoUri) {
      Alert.alert(
        'Falta la foto',
        'Sacá una foto del problema.',
      );
      return;
    }

    if (!coordenadas) {
      Alert.alert(
        'Falta la ubicación',
        'Necesitamos saber dónde está el problema. Revisá los permisos del GPS.',
      );
      return;
    }

    if (!direccion.trim()) {
      Alert.alert(
        'Falta la dirección',
        'Escribí la calle y la altura.',
      );
      return;
    }

    const datos = {
      id: idReporte.current,
      usuarioId: usuario.id,
      tipoId,
      descripcion: descripcion.trim() || null,
      audioUrl: audioUri,
      fotoUri,
      coordenadas,
      direccion: direccion.trim(),
    };

    // Guarda el reporte en el teléfono para subirlo solo cuando haya señal.
    // La foto y el audio se copian antes a una carpeta que el sistema no limpia.
    const guardarParaDespues = async () => {
      try {
        await encolarReporte({
          ...datos,
          fotoUri: await copiarAPersistente(datos.fotoUri),
          audioUrl: datos.audioUrl ? await copiarAPersistente(datos.audioUrl) : null,
        });

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );

        Alert.alert(
          'Reporte guardado',
          'No hay señal ahora. Lo guardamos en tu teléfono y se envía solo apenas vuelva la conexión.',
        );

        router.back();
      } catch (errorCola) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error,
        );

        Alert.alert(
          'No pudimos guardar el reporte',
          obtenerMensajeError(errorCola),
        );
      }
    };

    setEnviando(true);

    try {
      // Sin conexión no se espera el tiempo de espera de la red: va directo a la cola.
      const estadoRed = await Network.getNetworkStateAsync();

      if (estadoRed.isConnected === false) {
        await guardarParaDespues();
        return;
      }

      await crearReporte(datos, token);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );

      Alert.alert(
        'Reporte enviado',
        'Gracias. Te vamos a avisar cuando cambie de estado.',
      );

      router.back();
    } catch (error) {
      if (esErrorDeRed(error)) {
        // Señal intermitente: el envío falló a mitad de camino, se guarda igual.
        await guardarParaDespues();
      } else {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error,
        );

        Alert.alert(
          'No pudimos enviar el reporte',
          obtenerMensajeError(error),
        );
      }
    } finally {
      setEnviando(false);
    }
  };

  const hayDuplicados =
    cercanos.length > 0 && !ignorarDuplicados;

  return {
    tipos,
    tipoId,
    setTipoId,
    descripcion,
    setDescripcion,
    cercanos,
    ignorarDuplicados,
    setIgnorarDuplicados,
    hayDuplicados,
    enviando,
    cargandoTipos,
    errorTipos,
    recargarTipos: cargarTipos,
    sumarmeA,
    enviar,
  };
}