
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Reporte } from '@/types';

interface TarjetaReporteProps {
  reporte: Reporte;
  onPress: () => void;
}

export function TarjetaReporte({
  reporte,
  onPress,
}: TarjetaReporteProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.tarjeta}>
        <View style={styles.fila}>
          <Text style={styles.codigo}>{reporte.codigo}</Text>
          <Text style={styles.adhesiones}>
            ♥ {reporte.adhesiones}
          </Text>
        </View>

        <Text style={styles.direccion}>{reporte.direccion}</Text>

        <Text style={styles.descripcion}>
          {reporte.descripcion || 'Sin descripción'}
        </Text>

        <View style={styles.filaInferior}>
          <Text style={styles.estado}>
            {reporte.estado.replace('_', ' ')}
          </Text>
          <Text style={styles.zona}>{reporte.zonaId}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codigo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  adhesiones: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  direccion: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
  },
  filaInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  estado: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    textTransform: 'capitalize',
  },
  zona: {
    fontSize: 12,
    color: '#64748B',
  },
});
