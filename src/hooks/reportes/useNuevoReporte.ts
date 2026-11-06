import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Network from 'expo-network';
import { router } from 'expo-router';
import {
  encolarReporte,
  esErrorDeRed,
  sincronizarPendientes,
} from '@/services/colaOffline';
import { obtenerMensajeError } from '@/services/errores';
import {
  buscarReportesCercanos,
  crearReporte,
  listarTiposDeReporte,
  sumarseAReporte,
} from '@/services/reportesCreacion';
import type { Coordenadas, Reporte, TipoDeReporte } from '@/types';

interface DatosFormulario {
  fotoUri: string | null;
  audioUri: string | null;
  direccion: string;
}

const obtenerToken = () => process.env.EXPO_PUBLIC_TOKEN_DEMO ?? '';

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
  const sincronizando = useRef(false);
  
  const idReporte = useRef(
    `rep-app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  );
  
  const intentarSincronizar = useCallback(async () => {
    if (sincronizando.current) return;
    const token = obtenerToken();
    if (!token) return;
    sincronizando.current = true;
    try {
      const estadoRed = await Network.getNetworkStateAsync();
      const hayInternet =
        estadoRed.isConnected === true &&
        estadoRed.isInternetReachable !== false;

      if (!hayInternet) return;
      await sincronizarPendientes(token);
    } catch (error) {
      console.warn('No se pudieron sincronizar los reportes pendientes.');
    } finally {
      sincronizando.current = false;
    }
  }, []);

  useEffect(() => {
    let activo = true;
    async function cargarTipos() {
      try {
        const respuesta = await listarTiposDeReporte();
        if (activo) setTipos(respuesta.datos);
      } catch (error) {
        if (activo) {
          Alert.alert(
            'No pudimos cargar los tipos',
            obtenerMensajeError(error),
          );
        }
      } finally {
        if (activo) setCargandoTipos(false);
      }
    }

    void cargarTipos();
    void intentarSincronizar();

    const suscripcion = Network.addNetworkStateListener((estado) => {
      const hayInternet =
        estado.isConnected === true &&
        estado.isInternetReachable !== false;
      if (hayInternet) {
        void intentarSincronizar();
      }
    });
    return () => {
      activo = false;
      suscripcion.remove();
    };
  }, [intentarSincronizar]);

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
        if (!activo) return;
        setCercanos(respuesta.datos);
        if (respuesta.datos.length > 0) {
          void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning,
          );
        }
      } catch {
        if (activo) setCercanos([]);
      }
    }

    void cargarCercanos();
    return () => {
      activo = false;
    };
  }, [coordenadas]);

  const sumarmeA = async (reporte: Reporte) => {
    try {
      const token = obtenerToken();
      if (!token) {
        Alert.alert(
          'Iniciá sesión',
          'Necesitás una sesión activa para sumarte a un reporte.',
        );
        return;
      }

      await sumarseAReporte(reporte.id, token);
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );

      Alert.alert(
        'Listo',
        'Te sumaste a ese reporte. Vas a recibir avisos cuando cambie de estado.',
      );

      router.back();
    } catch (error) {
      Alert.alert('No pudimos sumarte', obtenerMensajeError(error));
    }
  };

  const enviar = async ({
    fotoUri,
    audioUri,
    direccion,
  }: DatosFormulario) => {
    if (enviando) return;
    if (!tipoId) {
      Alert.alert('Falta el tipo', 'Elegí qué tipo de problema es.');
      return;
    }
    if (!fotoUri) {
      Alert.alert('Falta la foto', 'Sacá una foto del problema.');
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
      Alert.alert('Falta la dirección', 'Escribí la calle y la altura.');
      return;
    }

    const datos = {
      id: idReporte.current,
      tipoId,
      descripcion: descripcion.trim() || null,
      audioUrl: audioUri,
      fotoUri,
      coordenadas,
      direccion: direccion.trim(),
    };

    setEnviando(true);
    try {
      const token = obtenerToken();
      if (!token) {
        await encolarReporte(datos);
        Alert.alert(
          'Reporte guardado',
          'No hay una sesión disponible. El reporte quedó guardado en el teléfono y podrá enviarse cuando se integre la autenticación.',
        );
        router.back();
        return;
      }

      await crearReporte(datos, token);
      await Haptics.notificationAsync( Haptics.NotificationFeedbackType.Success );

      Alert.alert(
        'Reporte enviado',
        'Gracias. Te vamos a avisar cuando cambie de estado.',
      );

      router.back();
    } catch (error) {
      if (esErrorDeRed(error)) {
        try {
          await encolarReporte(datos);
          await Haptics.notificationAsync(  Haptics.NotificationFeedbackType.Success );

          Alert.alert(
            'Sin conexión',
            'Guardamos tu reporte en el teléfono. Se enviará cuando vuelva la red.',
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

  const hayDuplicados = cercanos.length > 0 && !ignorarDuplicados;

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
    sumarmeA,
    enviar,
  };
}


