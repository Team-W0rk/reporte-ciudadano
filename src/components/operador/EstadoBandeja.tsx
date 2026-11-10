import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EstadoBandejaProps {
  error?: string | null;
  onReintentar?: () => void;
}

export function EstadoBandeja({
  error,
  onReintentar,
}: EstadoBandejaProps) {
  if (!error) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.texto}>
          No hay reportes para este filtro.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.vacio}>
      <Text style={styles.error}>{error}</Text>

      <Pressable style={styles.boton} onPress={onReintentar}>
        <Text style={styles.textoBoton}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  vacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  texto: {
    color: '#64748B',
    fontSize: 14,
  },
  error: {
    color: '#B91C1C',
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
