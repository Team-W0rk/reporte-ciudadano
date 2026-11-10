import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorPrimario } from '@/constants/dominio';
import type { TipoDeReporte } from '@/types';

interface Props {
  tipos: TipoDeReporte[];
  seleccionado: string | null;
  onCambiar: (tipoId: string | null) => void;
}

export function FiltrosTipo({
  tipos,
  seleccionado,
  onCambiar,
}: Props) {
  if (tipos.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contenedor}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: seleccionado === null }}
        onPress={() => onCambiar(null)}
        style={[
          styles.chip,
          seleccionado === null && styles.chipActivo,
        ]}
      >
        <Text
          style={[
            styles.texto,
            seleccionado === null && styles.textoActivo,
          ]}
        >
          Todos los tipos
        </Text>
      </Pressable>

      {tipos.map((tipo) => {
        const activo = seleccionado === tipo.id;
        const color = tipo.color || ColorPrimario;

        return (
          <Pressable
            key={tipo.id}
            accessibilityRole="button"
            accessibilityState={{ selected: activo }}
            onPress={() => onCambiar(tipo.id)}
            style={[
              styles.chip,
              activo && {
                backgroundColor: color,
                borderColor: color,
              },
            ]}
          >
            <Ionicons
              name={tipo.icono as React.ComponentProps<typeof Ionicons>['name']}
              size={16}
              color={seleccionado === tipo.id ? '#FFFFFF' : tipo.color || ColorPrimario}
            />
            <Text
              style={[
                styles.texto,
                activo && styles.textoActivo,
              ]}
            >
              {tipo.nombre}
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
    paddingBottom: 8,
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
  chipActivo: {
    backgroundColor: ColorPrimario,
    borderColor: ColorPrimario,
  },
  icono: {
    fontSize: 13,
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