import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ColorPrimario } from '@/constants/dominio';

interface Props {
  cantidad: number;
}

export function ContadorReportes({ cantidad }: Props) {
  return (
    <View style={styles.contenedor}>
      <Ionicons name="layers-outline" size={16} color={ColorPrimario} />
      <Text style={styles.texto}>
        {cantidad} {cantidad === 1 ? 'reporte' : 'reportes'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    bottom: 88,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 3,
  },
  texto: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
  },
});