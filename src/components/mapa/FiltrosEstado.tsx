import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  ColorEstado,
  ColorPrimario,
} from '@/constants/dominio';
import type { EstadoReporte } from '@/types';

export type FiltroReporte = EstadoReporte | 'todos';

interface Props {
  seleccionado: FiltroReporte;
  onCambiar: (filtro: FiltroReporte) => void;
}

const FILTROS: { label: string; value: FiltroReporte }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Recibidos', value: 'recibido' },
  { label: 'En revisión', value: 'en_revision' },
  { label: 'Asignados', value: 'asignado' },
  { label: 'Resueltos', value: 'resuelto' },
  { label: 'Rechazados', value: 'rechazado' },
];

export function FiltrosEstado({ seleccionado, onCambiar }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contenedor}
    >
      {FILTROS.map((filtro) => {
        const activo = seleccionado === filtro.value;
        const color =
          filtro.value === 'todos'
            ? ColorPrimario
            : ColorEstado[filtro.value];

        return (
          <Pressable
            key={filtro.value}
            accessibilityRole="button"
            accessibilityState={{ selected: activo }}
            onPress={() => onCambiar(filtro.value)}
            style={[
              styles.chip,
              activo && { backgroundColor: color, borderColor: color },
            ]}
          >
            {filtro.value !== 'todos' && (
              <View
                style={[
                  styles.punto,
                  { backgroundColor: activo ? '#FFFFFF' : color },
                ]}
              />
            )}

            <Text style={[styles.texto, activo && styles.textoActivo]}>
              {filtro.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 7,
    paddingVertical: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#E0E1E6',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  texto: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  textoActivo: {
    color: '#FFFFFF',
  },
});