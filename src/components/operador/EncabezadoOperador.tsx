
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EncabezadoOperadorProps {
  nombre: string;
  onPressPerfil: () => void;
}

export function EncabezadoOperador({
  nombre,
  onPressPerfil,
}: EncabezadoOperadorProps) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.informacion}>
        <Text style={styles.titulo}>Bandeja de reportes</Text>
        <Text style={styles.saludo}>Hola, {nombre} 👋</Text>
      </View>

      <Pressable
        onPress={onPressPerfil}
        style={({ pressed }) => [
          styles.botonPerfil,
          pressed && styles.botonPresionado,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Ir a mi perfil"
        hitSlop={10}
      >
        <Ionicons name="person-circle-outline" size={28} color="#0284C7" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  informacion: {
    flex: 1,
    gap: 5,
  },
  titulo: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '700',
  },
  saludo: {
    color: '#64748B',
    fontSize: 14,
  },
  botonPerfil: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  botonPresionado: {
    opacity: 0.65,
  },
});

