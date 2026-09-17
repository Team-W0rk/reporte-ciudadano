import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

// Layout raíz: define los 3 grupos de navegación de la app.
// - (auth): login y registro, sin sesión — Dev 1
// - (tabs): mapa / mis-reportes / perfil, para el vecino ya logueado
// - operador: bandeja municipal, solo para usuarios con rol "operador" — Dev 3
export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="operador" />
        <Stack.Screen
          name="reportes/nuevo"
          options={{ headerShown: true, title: 'Nuevo reporte', presentation: 'modal' }}
        />
        <Stack.Screen
          name="reportes/[id]"
          options={{ headerShown: true, title: 'Detalle del reporte' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
