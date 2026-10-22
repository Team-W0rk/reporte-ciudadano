import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura cómo se muestran las notificaciones mientras la app está abierta.
// Se llama una sola vez, desde el _layout raíz (ver src/app/_layout.tsx).
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

// CORREGIDO según U04.T03 (Notificaciones): en Android 13+ el cartel de
// permiso de notificaciones NO aparece si antes no existe un canal creado.
// El canal se crea una sola vez, siempre ANTES de pedir el permiso.
export async function pedirPermisoNotificaciones(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Avisos de reportes',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const actual = await Notifications.getPermissionsAsync();
  if (actual.granted) return true;

  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.granted;
}

// Dispara una notificación local INMEDIATA (trigger: null, la forma vigente
// según la diapo — la forma vieja sin "type" está deprecada).
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

// ---------------------------------------------------------------------------
// NOTA para cuando llegue la API real de la cátedra:
// Hoy esto notifica en el MISMO dispositivo donde ocurrió la acción, porque
// trabajamos con datos mockeados (el operador y el vecino son el mismo
// celular de prueba). Con la API real, el cambio de estado lo hace un
// operador desde SU dispositivo y el aviso le tiene que llegar al VECINO en
// el suyo — eso ya no alcanza con notificaciones locales, hace falta un
// token push por dispositivo (Notifications.getExpoPushTokenAsync) y que el
// backend se lo envíe a Expo. Dejar esta función como el punto de reemplazo.
// ---------------------------------------------------------------------------
