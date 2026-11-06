
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function CargandoBandeja() {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="large" color="#0EA5E9" />
      <Text style={styles.texto}>Cargando bandeja...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  texto: {
    color: '#64748B',
    fontSize: 14,
  },
});
