
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorBorde, ColorPrimario } from '@/constants/dominio';
import type { TipoDeReporte } from '@/types';

interface SelectorTipoReporteProps {
  tipos: TipoDeReporte[];
  tipoSeleccionado: string | null;
  onSeleccionar: (tipoId: string) => void;
}

export default function SelectorTipoReporte({
  tipos,
  tipoSeleccionado,
  onSeleccionar,
}: SelectorTipoReporteProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>¿Qué problema encontraste?</Text>
      <Text style={styles.descripcion}>
        Elegí la categoría que mejor describa lo que sucede.
      </Text>

      <View style={styles.lista}>
        {tipos.map((tipo) => {
          const seleccionado = tipoSeleccionado === tipo.id;
          const color = tipo.color || ColorPrimario;

          return (
            <Pressable
              key={tipo.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: seleccionado }}
              onPress={() => onSeleccionar(tipo.id)}
              style={[
                styles.opcion,
                seleccionado && {
                  borderColor: color,
                  backgroundColor: `${color}15`,
                },
              ]}
            >
              <View
                style={[
                  styles.indicador,
                  { borderColor: seleccionado ? color : ColorBorde },
                ]}
              >
                {seleccionado && (
                  <View
                    style={[
                      styles.indicadorSeleccionado,
                      { backgroundColor: color },
                    ]}
                  />
                )}
              </View>

              <Text
                style={[
                  styles.nombre,
                  seleccionado && { color, fontWeight: '700' },
                ]}
              >
                {tipo.nombre}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tipos.length === 0 && (
        <Text style={styles.vacio}>
          No hay categorías disponibles en este momento.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#20252B',
  },
  descripcion: {
    fontSize: 14,
    color: '#667085',
    lineHeight: 20,
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: ColorBorde,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 46,
  },
  indicador: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicadorSeleccionado: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nombre: {
    fontSize: 14,
    color: '#344054',
  },
  vacio: {
    fontSize: 13,
    color: '#667085',
    marginTop: 8,
  },
});

