import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/hooks/auth/useAuth';
import { registrarDispositivo } from '@/services/dispositivos';
import { configurarNotificaciones, obtenerTokenPush } from '@/services/notifications';
import { guardarTokenPush } from '@/services/tokenPush';

/**
 * Registra este teléfono en la API para recibir avisos push. Va una vez en el layout raíz.
 * Si algo falla (Expo Go en Android, sin permiso, API sin implementar) no rompe nada.
 */
export default function useRegistroPush() {
  const { token, usuario } = useAuth();

  useEffect(() => {
    void configurarNotificaciones();
  }, []);

  useEffect(() => {
    if (!token || !usuario) return;

    let activo = true;

    async function registrar(tokenSesion: string) {
      try {
        const tokenExpo = await obtenerTokenPush();
        if (!tokenExpo || !activo) return;

        await registrarDispositivo(tokenSesion, tokenExpo, Platform.OS === 'ios' ? 'ios' : 'android');
        await guardarTokenPush(tokenExpo);
      } catch (error) {
        console.warn('No se pudo registrar el teléfono para los avisos:', error);
      }
    }

    void registrar(token);

    return () => {
      activo = false;
    };
  }, [token, usuario?.id]);
}