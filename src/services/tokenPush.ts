import * as SecureStore from 'expo-secure-store';

// Token de Expo guardado en el teléfono: hace falta para darlo de baja al cerrar sesión.
// Va en un archivo aparte para que AuthContext no cargue expo-notifications.
const CLAVE_TOKEN_PUSH = 'reporte-ciudadano-push-token';

export const guardarTokenPush = (token: string) => SecureStore.setItemAsync(CLAVE_TOKEN_PUSH, token);
export const leerTokenPush = () => SecureStore.getItemAsync(CLAVE_TOKEN_PUSH);
export const borrarTokenPush = () => SecureStore.deleteItemAsync(CLAVE_TOKEN_PUSH);
