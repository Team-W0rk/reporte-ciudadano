import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ColorPrimario } from '@/constants/dominio';

export function EncabezadoMapa() {
  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <View style={styles.icono}>
          <Ionicons name="map" size={24} color={ColorPrimario} />
        </View>

        <View style={styles.textos}>
          <Text style={styles.titulo}>Mapa Ciudad</Text>
          <Text style={styles.subtitulo}>
            Gualeguaychú · Reportes ciudadanos
          </Text>
        </View>
      </View>

      <View style={styles.descripcion}>
        <Ionicons
          name="information-circle-outline"
          size={19}
          color={ColorPrimario}
        />
        <Text style={styles.descripcionTexto}>
          Explorá los problemas de tu ciudad y conocé su estado.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    gap: 13,
    elevation: 5,
    shadowColor: '#16324F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  icono: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EAF4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#172B3A',
  },
  subtitulo: {
    fontSize: 12,
    color: '#687076',
    marginTop: 3,
  },
  descripcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F7FC',
    borderRadius: 12,
    padding: 10,
  },
  descripcionTexto: {
    flex: 1,
    color: '#40576B',
    fontSize: 12,
    lineHeight: 17,
  },
});