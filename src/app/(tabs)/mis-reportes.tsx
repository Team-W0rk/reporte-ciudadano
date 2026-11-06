import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorPrimario } from '@/constants/dominio';

export default function MisReportesScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Mis reportes' }} />

      <View style={styles.contenedor}>
        <Ionicons
          name="clipboard-outline"
          size={56}
          color={ColorPrimario}
        />

        <Text style={styles.titulo}>Mis reportes</Text>

        <Text style={styles.descripcion}>
          Acá vas a poder consultar los problemas que reportaste y
          seguir el estado de cada uno.
        </Text>

        <Pressable
          style={styles.boton}
          onPress={() => router.push('/reportes/nuevo')}
        >
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.textoBoton}>Crear un reporte</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  descripcion: {
    marginTop: 12,
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ColorPrimario,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
