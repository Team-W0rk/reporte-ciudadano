import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { ColorPrimario } from '@/constants/dominio';
import type { TipoListaReportes } from '@/hooks/reportes/useMisReportes';

interface Props {
  tipo: TipoListaReportes;
}

const MENSAJES = {
  creados: {
    titulo: 'Todavía no creaste reportes',
    descripcion:
      'Cuando informes un problema, vas a poder consultar acá su estado y seguimiento.',
  },
  adheridos: {
    titulo: 'Todavía no te sumaste a reportes',
    descripcion:
      'Cuando te sumes a un reporte de otro vecino, aparecerá acá para que puedas seguirlo.',
  },
};

export default function EstadoVacioReportes({ tipo }: Props) {
  const mensaje = MENSAJES[tipo];

  return (
    <View style={styles.contenedor}>
      <Ionicons
        name="clipboard-outline"
        size={56}
        color={ColorPrimario}
      />

      <Text style={styles.titulo}>{mensaje.titulo}</Text>
      <Text style={styles.descripcion}>{mensaje.descripcion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    color: '#20252B',
  },
  descripcion: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#667085',
  },
});
