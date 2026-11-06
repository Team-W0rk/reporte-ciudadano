import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TipoAviso = 'ubicacion' | 'error';

interface Props {
  tipo: TipoAviso;
  mensaje?: string;
  onAccion?: () => void;
}

export function AvisoMapa({ tipo, mensaje, onAccion }: Props) {
  const esError = tipo === 'error';

  return (
    <View
      style={[
        styles.contenedor,
        esError ? styles.fondoError : styles.fondoUbicacion,
      ]}
    >
      <Ionicons
        name={esError ? 'alert-circle-outline' : 'location-outline'}
        size={21}
        color={esError ? '#B03A2E' : '#8A5B00'}
      />

      <View style={styles.contenido}>
        <Text style={styles.titulo}>
          {esError ? 'No pudimos cargar los reportes' : 'Ubicación desactivada'}
        </Text>

        <Text style={styles.mensaje}>
          {mensaje ??
            (esError
              ? 'Comprobá tu conexión e intentá nuevamente.'
              : 'El mapa está centrado en la ciudad.')}
        </Text>

        {onAccion && (
          <Pressable onPress={onAccion} hitSlop={8}>
            <Text style={styles.accion}>
              {esError ? 'Reintentar' : 'Abrir ajustes'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    top: 190,
    left: 16,
    right: 16,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    elevation: 3,
  },
  fondoUbicacion: {
    backgroundColor: '#FFF4D6',
  },
  fondoError: {
    backgroundColor: '#FDECEB',
  },
  contenido: {
    flex: 1,
    gap: 3,
  },
  titulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#493919',
  },
  mensaje: {
    fontSize: 12,
    lineHeight: 17,
    color: '#66532F',
  },
  accion: {
    color: '#1B6CA8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});