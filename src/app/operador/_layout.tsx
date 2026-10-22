import { Stack } from 'expo-router';

// TODO (Dev 1): verificar acá que el usuario logueado tenga rol "operador"
// antes de dejarlo entrar a este grupo (redirigir a /(tabs) si no lo tiene).
export default function OperadorLayout() {
  return (
    <Stack>
      <Stack.Screen name="bandeja" options={{ title: 'Bandeja municipal' }} />
      <Stack.Screen name="reportes/[id]" options={{ title: 'Gestionar reporte' }} />
    </Stack>
  );
}
