import { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {
  useRouter,
  useSegments,
  type Href,
} from 'expo-router';

import { useAuth } from '@/hooks/auth/useAuth';

const RUTAS = {
  login: '/(auth)/login' as Href,
  vecino: '/(tabs)/mapa' as Href,
  operador: '/(operador)/inicio' as Href,
};

export function ProtectorNavegacion() {
  const router = useRouter();
  const segmentos = useSegments();

  const {
    usuario,
    autenticado,
    cargando,
    requiereBiometria,
  } = useAuth();

  useEffect(() => {
    if (cargando) return;

    const grupoActual = segmentos[0];

    // Si hay una sesión pendiente de desbloqueo biométrico,
    // mantener al usuario en la pantalla de ingreso.
    if (requiereBiometria) {
      if (grupoActual !== '(auth)') {
        router.replace(RUTAS.login);
      }
      return;
    }

    // Sin una sesión autenticada, permitir únicamente
    // las pantallas del grupo de autenticación.
    if (!autenticado) {
      if (grupoActual !== '(auth)') {
        router.replace(RUTAS.login);
      }
      return;
    }

    if (!usuario) return;

    // Una persona autenticada no necesita permanecer en login.
    if (grupoActual === '(auth)') {
      router.replace(
        usuario.rol === 'vecino'
          ? RUTAS.vecino
          : RUTAS.operador,
      );
      return;
    }

    // Los vecinos no pueden acceder a las pantallas de operador.
    if (
      usuario.rol === 'vecino' &&
      grupoActual === '(operador)'
    ) {
      router.replace(RUTAS.vecino);
      return;
    }

    // Los operadores y administradores no acceden a las
    // pantallas reservadas al vecino.
    if (
      usuario.rol !== 'vecino' &&
      (grupoActual === '(tabs)' ||
        grupoActual === 'reportes')
    ) {
      router.replace(RUTAS.operador);
    }
  }, [
    autenticado,
    cargando,
    requiereBiometria,
    segmentos,
    router,
    usuario,
  ]);

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
  },
});


