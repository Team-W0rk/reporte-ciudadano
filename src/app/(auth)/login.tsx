import { Link } from 'expo-router';
import { Text, View } from 'react-native';

// TODO (Dev 1 - Auth y sesión):
// - Formulario de login (email + password).
// - Conectar contra un servicio de auth mockeado (src/servicios/, a crear).
// - Guardar el token en expo-secure-store.
// - Reingreso con expo-local-authentication si ya hay sesión guardada.
export default function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Login (Dev 1)</Text>
      <Link href="/(auth)/registro">Crear una cuenta</Link>
    </View>
  );
}
