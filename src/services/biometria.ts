import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const CLAVE_BIOMETRIA = 'reporte-ciudadano-biometria';

export async function consultarBiometria() {
  const [compatible, configurada, tipos] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  return {
    disponible: compatible && configurada,
    huella: tipos.includes(
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    ),
    rostro: tipos.includes(
      LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
    ),
  };
}

export async function biometriaActivada(): Promise<boolean> {
  return (
    (await SecureStore.getItemAsync(CLAVE_BIOMETRIA)) === 'true'
  );
}

export async function guardarPreferenciaBiometrica(
  activa: boolean,
): Promise<void> {
  if (activa) {
    await SecureStore.setItemAsync(CLAVE_BIOMETRIA, 'true');
  } else {
    await SecureStore.deleteItemAsync(CLAVE_BIOMETRIA);
  }
}

export async function autenticarBiometria(): Promise<boolean> {
  const resultado = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Ingresá a Reporte Ciudadano',
    cancelLabel: 'Cancelar',
    disableDeviceFallback: true,
  });

  return resultado.success;
}