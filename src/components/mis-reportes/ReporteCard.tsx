import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ColorPrimario } from '@/constants/dominio';
import type { Reporte } from '@/types';
import EstadoReporteBadge from './EstadoReporteBadge';
import { formatearFechaReporte, obtenerTituloReporte } from '@/utils/formatoReporte';

interface Props {
  reporte: Reporte;
  onPress: (reporte: Reporte) => void;
}

export default function ReporteCard({ reporte, onPress }: Props) {
  const tieneFoto = reporte.fotos?.some(
    (foto) => foto.momento === 'problema',
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle del reporte ${reporte.codigo}`}
      style={({ pressed }) => [
        styles.tarjeta,
        pressed && styles.presionada,
      ]}
      onPress={() => onPress(reporte)}
    >
      <View style={styles.icono}>
        <Ionicons
          name="document-text-outline"
          size={25}
          color={ColorPrimario}
        />
      </View>
      <View style={styles.contenido}>
        <View style={styles.filaSuperior}>
          <Text style={styles.codigo}>{reporte.codigo}</Text>
          <EstadoReporteBadge estado={reporte.estado} />
        </View>
        <Text style={styles.titulo} numberOfLines={2}>
          {obtenerTituloReporte(reporte)}
        </Text>
        <View style={styles.dato}>
          <Ionicons name="location-outline" size={15} color="#6B7280" />
          <Text style={styles.secundario} numberOfLines={2}>
            {reporte.direccion || 'Ubicación no disponible'}
          </Text>
        </View>
        <View style={styles.dato}>
          <Ionicons name="calendar-outline" size={15} color="#6B7280" />
          <Text style={styles.secundario}>
            {formatearFechaReporte(reporte.creadoEn)}
          </Text>
        </View>
        {tieneFoto && (
          <View style={styles.dato}>
            <Ionicons name="image-outline" size={15} color="#6B7280" />
            <Text style={styles.secundario}>Tiene foto adjunta</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  presionada: {
    opacity: 0.75,
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E5F1FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenido: {
    flex: 1,
    gap: 8,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  codigo: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '600',
  },
  titulo: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#20252B',
  },
  dato: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  secundario: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#667085',
  },
});
