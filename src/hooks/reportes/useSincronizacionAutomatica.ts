import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Network from 'expo-network';

import { useAuth } from '@/hooks/auth/useAuth';
import { sincronizarPendientes } from '@/services/colaOffline';
import { cargarTiposConCache } from '@/services/catalogos';

const CADA_CUANTO_MS = 60_000;

const hayInternet = (estado: { isConnected?: boolean; isInternetReachable?: boolean }) =>
  estado.isConnected === true && estado.isInternetReachable !== false;

/**
 * Sube sola los reportes guardados sin señal. Va montada una vez, en el layout
 * raíz, así que funciona en cualquier pantalla (no hace falta abrir "Nuevo
 * reporte"). Reintenta:
 *   - al abrir la app y al volver a ella desde segundo plano,
 *   - cuando el teléfono recupera la conexión,
 *   - cada minuto (con señal intermitente el aviso de red a veces no llega).
 * También deja guardadas las categorías para poder reportar sin conexión.
 */
export default function useSincronizacionAutomatica() {
  const { token, usuario } = useAuth();
  const ocupado = useRef(false);
  // Un reporte rechazado por la API se reintenta, pero se avisa una sola vez.
  const yaAvisados = useRef(new Set<string>());

  const intentar = useCallback(async () => {
    if (ocupado.current || !token || !usuario) return;
    ocupado.current = true;

    try {
      const estadoRed = await Network.getNetworkStateAsync();
      if (!hayInternet(estadoRed)) return;

      void cargarTiposConCache().catch(() => undefined);

      const resultado = await sincronizarPendientes(token, usuario.id);

      if (resultado.enviados > 0) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          resultado.enviados === 1 ? 'Reporte enviado' : 'Reportes enviados',
          resultado.enviados === 1
            ? 'Se envió el reporte que habías guardado en el teléfono.'
            : `Se enviaron ${resultado.enviados} reportes que habías guardado en el teléfono.`,
        );
      }

      const nuevos = resultado.descartados.filter((d) => !yaAvisados.current.has(d.id));
      if (nuevos.length > 0) {
        nuevos.forEach((d) => yaAvisados.current.add(d.id));
        Alert.alert('Un reporte guardado no se pudo enviar', nuevos[0].mensaje);
      }
    } catch {
      // Sin red o error transitorio: se reintenta en el próximo ciclo.
    } finally {
      ocupado.current = false;
    }
  }, [token, usuario]);

  useEffect(() => {
    if (!token || !usuario) return;

    void intentar();

    const redSub = Network.addNetworkStateListener((estado) => {
      if (hayInternet(estado)) void intentar();
    });
    const appSub = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') void intentar();
    });
    const temporizador = setInterval(() => void intentar(), CADA_CUANTO_MS);

    return () => {
      redSub.remove();
      appSub.remove();
      clearInterval(temporizador);
    };
  }, [token, usuario, intentar]);
}