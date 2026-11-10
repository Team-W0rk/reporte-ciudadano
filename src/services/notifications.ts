import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Desde el SDK 53, Expo Go en Android no soporta las push remotas y, con solo importar
// expo-notifications, tira un ERROR rojo. Ahí directamente no se carga el módulo: la app
// anda igual, sin avisos. Con un development build (o en iPhone) sí se carga.
const sinNotificaciones =
  Platform.OS === 'android' &&
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type ModuloNotificaciones = typeof import('expo-notifications');

async function cargar(): Promise<ModuloNotificaciones | null> {
  if (sinNotificaciones) return null;
  return import('expo-notifications');
}

// Cómo se muestran las notificaciones con la app abierta. Se llama una vez al arrancar.
export async function configurarNotificaciones(): Promise<void> {
  try {
    const Notifications = await cargar();
    if (!Notifications) return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.warn('No se pudieron configurar las notificaciones:', error);
  }
}

// En Android 13+ el cartel de permiso NO aparece si antes no existe un canal.
export async function pedirPermisoNotificaciones(): Promise<boolean> {
  const Notifications = await cargar();
  if (!Notifications) return false;

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

// Notificación local inmediata (no pasa por la API).
export async function notificar(titulo: string, cuerpo: string): Promise<void> {
  const Notifications = await cargar();
  if (!Notifications) return;
  if (!(await pedirPermisoNotificaciones())) return;

  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo },
    trigger: null,
  });
}

/** Token de Expo de este teléfono, o null si no se puede (emulador, sin permiso, Expo Go en Android). */
export async function obtenerTokenPush(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const Notifications = await cargar();
  if (!Notifications) return null;
  if (!(await pedirPermisoNotificaciones())) return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  return token.data;
}
