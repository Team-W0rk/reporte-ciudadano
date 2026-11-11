import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ColorPrimario } from '@/constants/dominio';

interface Props {
  onPress: () => void;
}

export function BotonNuevoReporte({ onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Crear nuevo reporte"
      onPress={onPress}
      style={styles.boton}
    >
      <Ionicons name="add-circle-outline" size={23} color="#FFFFFF" />
      <Text style={styles.texto}>Crear reporte</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ColorPrimario,
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 18,
    elevation: 6,
    shadowColor: '#16324F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});