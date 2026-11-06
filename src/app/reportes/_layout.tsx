import { Stack } from 'expo-router';

export default function ReportesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="nuevo" />
      <Stack.Screen name="detalle/[id]" />
    </Stack>
  );
}
