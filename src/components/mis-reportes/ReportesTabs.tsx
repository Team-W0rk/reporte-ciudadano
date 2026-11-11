import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ColorPrimario } from '@/constants/dominio';
import type { TipoListaReportes } from '@/hooks/reportes/useMisReportes';

interface Props {
  seleccion: TipoListaReportes;
  cantidadCreados: number;
  cantidadAdheridos: number;
  onChange: (tipo: TipoListaReportes) => void;
}

export default function ReportesTabs({
  seleccion,
  cantidadCreados,
  cantidadAdheridos,
  onChange,
}: Props) {
  return (
    <View style={styles.contenedor}>
      <Tab
        titulo={`Creados (${cantidadCreados})`}
        icono="create-outline"
        activo={seleccion === 'creados'}
        onPress={() => onChange('creados')}
      />

      <Tab
        titulo={`Adheridos (${cantidadAdheridos})`}
        icono="people-outline"
        activo={seleccion === 'adheridos'}
        onPress={() => onChange('adheridos')}
      />
    </View>
  );
}

interface TabProps {
  titulo: string;
  icono: React.ComponentProps<typeof Ionicons>['name'];
  activo: boolean;
  onPress: () => void;
}

function Tab({ titulo, icono, activo, onPress }: TabProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: activo }}
      style={[styles.tab, activo && styles.tabActivo]}
      onPress={onPress}
    >
      <Ionicons
        name={icono}
        size={18}
        color={activo ? ColorPrimario : '#667085'}
      />
      <Text style={[styles.texto, activo && styles.textoActivo]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#E9EEF5',
  },
  tab: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 9,
    paddingHorizontal: 8,
  },
  tabActivo: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  texto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667085',
  },
  textoActivo: {
    color: ColorPrimario,
  },
});
