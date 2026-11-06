import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ColorPrimario } from '@/constants/dominio';

export function IndicadorCarga() {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="small" color={ColorPrimario} />
      <Text style={styles.texto}>Actualizando mapa...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    top: 210,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
    elevation: 3,
  },
  texto: {
    fontSize: 12,
    color: '#687076',
  },
});