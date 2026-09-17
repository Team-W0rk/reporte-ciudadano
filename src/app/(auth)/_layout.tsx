import { Stack } from 'expo-router';

// TODO (Dev 1 - Auth): acá va la lógica de "si ya hay token guardado en
// expo-secure-store, redirigir directo a (tabs) sin pasar por login".
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="registro" />
    </Stack>
  );
}
