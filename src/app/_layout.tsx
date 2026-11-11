import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar, useColorScheme } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectorNavegacion } from '@/components/auth/ProtectorNavegacion';
import useSincronizacionAutomatica from '@/hooks/reportes/useSincronizacionAutomatica';
import useRegistroPush from '@/hooks/notificaciones/useRegistroPush';

function NavegacionPrincipal() {
  useSincronizacionAutomatica();
  useRegistroPush();
  return (
    <>
    <StatusBar
        hidden={false}
        barStyle="dark-content"
        backgroundColor="#F4F7FB"
        translucent={false}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(operador)" />
        <Stack.Screen name="reportes" />
      </Stack>

      <ProtectorNavegacion />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <AuthProvider>
        <NavegacionPrincipal />
      </AuthProvider>
    </ThemeProvider>
  );
}
