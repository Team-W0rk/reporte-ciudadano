import { Stack } from 'expo-router';

export default function OperadorLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F8FAFC',
        },
        headerTintColor: '#0F172A',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#F8FAFC',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Bandeja de reportes',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
