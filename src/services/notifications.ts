import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura cómo se muestran las notificaciones mientras la app está abierta.
// Se llama una sola vez, desde el _layout raíz.
export function configurarNotificaciones() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function pedirPermisoNotificaciones(): Promise<boolean> {
  const actual = await Notifications.getPermissionsAsync();
  if (actual.granted) return true;

  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
}

// Dispara una notificación local INMEDIATA (trigger: null).
// Se usa siempre atada a un hecho real de la app (se creó un reporte, un
// reporte cambió de estado), nunca desde un botón de "probar notificación".
export async function notificar(titulo: string, cuerpo: string): Promise<void> {
  const tienePermiso = await pedirPermisoNotificaciones();
  if (!tienePermiso) return;

  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo, sound: Platform.OS === 'ios' ? 'default' : undefined },
    trigger: null,
  });
}