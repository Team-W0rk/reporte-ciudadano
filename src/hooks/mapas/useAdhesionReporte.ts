import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/auth/useAuth';
import { obtenerAdhesionesLocales } from '@/services/colaOffline';
import { adherirseAReporte } from '@/services/adhesiones';
import { obtenerMensajeError } from '@/services/errores';
import type { Reporte } from '@/types';

export function useAdhesionReporte() {
  const { token, usuario } = useAuth();
  const [adheridos, setAdheridos] = useState<Set<string>>( new Set() );
  const [procesando, setProcesando] = useState<Set<string>>( new Set() );

  useEffect(() => {
    if (!usuario) {
      setAdheridos(new Set());
      return;
    }

    let activo = true;

    obtenerAdhesionesLocales(usuario.id)
      .then((ids) => {
        if (activo) {
          setAdheridos(new Set(ids));
        }
      })
      .catch((error) => {
        console.error('Error al cargar adhesiones:', error);
      });

    return () => {
      activo = false;
    };
  }, [usuario]);

  const adherirse = useCallback(
    async (reporte: Reporte): Promise<boolean> => {
      if (!token || !usuario) {
        Alert.alert(
          'Iniciá sesión',
          'Necesitás una sesión activa para sumarte a un reporte.',
        );
        return false;
      }

      if (reporte.autorId === usuario.id) {
        Alert.alert(
          'Reporte propio',
          'No podés sumarte a un reporte que creaste vos.',
        );
        return false;
      }

      if (adheridos.has(reporte.id)) {
        Alert.alert(
          'Ya estás sumado',
          'Ya te adheriste a este reporte.',
        );
        return false;
      }

      if (procesando.has(reporte.id)) {
        return false;
      }

      setProcesando((actuales) => {
        const nuevos = new Set(actuales);
        nuevos.add(reporte.id);
        return nuevos;
      });

      try {
        const nuevaAdhesion = await adherirseAReporte(
          reporte.id,
          usuario.id,
          token,
        );

        setAdheridos((actuales) => {
          const nuevos = new Set(actuales);
          nuevos.add(reporte.id);
          return nuevos;
        });

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );

        Alert.alert(
          nuevaAdhesion ? '¡Listo!' : 'Ya estabas sumado',
          nuevaAdhesion
            ? 'Te sumaste a este reporte. Vas a recibir avisos cuando cambie de estado.'
            : 'Tu adhesión ya estaba registrada.',
        );

        return nuevaAdhesion;
      } catch (error) {
        Alert.alert(
          'No pudimos sumarte',
          obtenerMensajeError(error),
        );

        return false;
      } finally {
        setProcesando((actuales) => {
          const nuevos = new Set(actuales);
          nuevos.delete(reporte.id);
          return nuevos;
        });
      }
    },
    [token, usuario, adheridos, procesando],
  );

  return {
    adheridos,
    procesando,
    adherirse,
  };
}
