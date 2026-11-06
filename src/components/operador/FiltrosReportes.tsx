
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { EstadoReporte } from '@/types';

interface Filtro {
  etiqueta: string;
  valor?: EstadoReporte[];
}

interface FiltrosReportesProps {
  filtros: Filtro[];
  seleccionado: number;
  onSeleccionar: (indice: number) => void;
}

export function FiltrosReportes({
  filtros,
  seleccionado,
  onSeleccionar,
}: FiltrosReportesProps) {
  return (
    <View style={styles.contenedor}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filtros}
        keyExtractor={(item) => item.etiqueta}
        contentContainerStyle={styles.lista}
        extraData={seleccionado}
        renderItem={({ item, index }) => {
          const activo = seleccionado === index;

          return (
            <Pressable
              onPress={() => onSeleccionar(index)}
              style={[
                styles.filtro,
                activo && styles.filtroActivo,
              ]}
            >
              <Text
                style={[
                  styles.texto,
                  activo && styles.textoActivo,
                ]}
              >
                {item.etiqueta}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    height: 64,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
  },
  lista: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 8,
  },
  filtro: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroActivo: {
    backgroundColor: '#0EA5E9',
  },
  texto: {
    color: '#334155',
    fontWeight: '600',
  },
  textoActivo: {
    color: '#FFFFFF',
  },
});
