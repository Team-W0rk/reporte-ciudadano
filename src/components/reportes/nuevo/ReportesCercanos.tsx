
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  ColorPrimario,
  EtiquetaEstado,
} from '@/constants/dominio';
import type { Reporte } from '@/types';

interface ReportesCercanosProps {
  reportes: Reporte[];
  visible: boolean;
  onSumarse: (reporte: Reporte) => void;
  onIgnorar: () => void;
}

export default function ReportesCercanos({
  reportes,
  visible,
  onSumarse,
  onIgnorar,
}: ReportesCercanosProps) {
  if (!visible || reportes.length === 0) {
    return null;
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Encontramos reportes cercanos</Text>
      <Text style={styles.descripcion}>
        Hay reportes a menos de 50 metros. Si alguno describe el mismo
        problema, sumate para ayudar a darle prioridad.
      </Text>

      {reportes.map((reporte) => (
        <View key={reporte.id} style={styles.reporte}>
          <View style={styles.informacion}>
            <Text style={styles.direccion}>
              {reporte.direccion || 'Dirección no disponible'}
            </Text>
            <Text style={styles.detalle}>
              {EtiquetaEstado[reporte.estado]} · {reporte.adhesiones}{' '}
              {reporte.adhesiones === 1 ? 'adhesión' : 'adhesiones'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => onSumarse(reporte)}
            style={styles.botonSumarse}
          >
            <Text style={styles.textoBotonSumarse}>Sumarme</Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        accessibilityRole="button"
        onPress={onIgnorar}
        style={styles.botonIgnorar}
      >
        <Text style={styles.textoIgnorar}>
          Es otro problema, crear reporte nuevo
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FFF4D6',
    gap: 10,
    borderWidth: 1,
    borderColor: '#F2D58A',
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#624A08',
  },
  descripcion: {
    fontSize: 13,
    color: '#624A08',
    lineHeight: 19,
  },
  reporte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  informacion: {
    flex: 1,
    gap: 4,
  },
  direccion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#20252B',
  },
  detalle: {
    fontSize: 12,
    color: '#667085',
  },
  botonSumarse: {
    backgroundColor: ColorPrimario,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textoBotonSumarse: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  botonIgnorar: {
    paddingVertical: 6,
  },
  textoIgnorar: {
    color: ColorPrimario,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
