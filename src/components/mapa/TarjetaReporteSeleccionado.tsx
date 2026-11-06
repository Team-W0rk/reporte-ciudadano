import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorEstado, EtiquetaEstado } from '@/constants/dominio';
import type { Reporte } from '@/types';

interface Props {
  reporte: Reporte;
  onVerDetalle: () => void;
  onCerrar: () => void;
}

export function TarjetaReporteSeleccionado({
  reporte,
  onVerDetalle,
  onCerrar,
}: Props) {
  const colorEstado = ColorEstado[reporte.estado];

  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <View
          style={[
            styles.icono,
            { backgroundColor: `${colorEstado}18` },
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={25}
            color={colorEstado}
          />
        </View>

        <View style={styles.detalle}>
          <Text style={styles.etiqueta}>REPORTE CIUDADANO</Text>
          <Text style={styles.direccion} numberOfLines={2}>
            {reporte.direccion}
          </Text>

          <View style={styles.filaEstado}>
            <View
              style={[styles.punto, { backgroundColor: colorEstado }]}
            />
            <Text style={[styles.estado, { color: colorEstado }]}>
              {EtiquetaEstado[reporte.estado]}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar detalle"
          hitSlop={10}
          onPress={onCerrar}
          style={styles.cerrar}
        >
          <Ionicons name="close" size={21} color="#64748B" />
        </Pressable>
      </View>

      <View style={styles.separador} />

      <View style={styles.pie}>
        <View style={styles.adhesiones}>
          <Ionicons name="people-outline" size={18} color="#1B6CA8" />
          <Text style={styles.textoAdhesiones}>
            {reporte.adhesiones}{' '}
            {reporte.adhesiones === 1 ? 'adhesión' : 'adhesiones'}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onVerDetalle}
          style={styles.boton}
        >
          <Text style={styles.textoBoton}>Ver detalle</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    position: 'absolute',
    bottom: 100,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 15,
    elevation: 8,
    shadowColor: '#16324F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  icono: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalle: {
    flex: 1,
    gap: 4,
  },
  etiqueta: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#687076',
  },
  direccion: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#172B3A',
  },
  filaEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  estado: {
    fontSize: 12,
    fontWeight: '700',
  },
  cerrar: {
    padding: 3,
    alignSelf: 'flex-start',
  },
  separador: {
    height: 1,
    backgroundColor: '#EDF0F3',
    marginVertical: 12,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  adhesiones: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  textoAdhesiones: {
    color: '#526477',
    fontSize: 12,
    fontWeight: '600',
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#1B6CA8',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});