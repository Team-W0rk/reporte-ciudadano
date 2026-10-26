import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reporte Ciudadano</Text>
      <Text style={styles.descripcion}>
        La aplicación está funcionando correctamente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  descripcion: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
});
