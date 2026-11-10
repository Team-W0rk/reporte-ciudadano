import { StyleSheet, Text, View } from 'react-native';
import type { EstadoReporte } from '@/types';

interface Props {
  estado: EstadoReporte;
}

const ESTADOS: Record<
  EstadoReporte,
  { etiqueta: string; color: string; fondo: string }
> = {
  recibido: {
    etiqueta: 'Recibido',
    color: '#0369A1',
    fondo: '#E0F2FE',
  },
  en_revision: {
    etiqueta: 'En revisión',
    color: '#92400E',
    fondo: '#FEF3C7',
  },
  asignado: {
    etiqueta: 'Asignado',
    color: '#6D28D9',
    fondo: '#EDE9FE',
  },
  resuelto: {
    etiqueta: 'Resuelto',
    color: '#166534',
    fondo: '#DCFCE7',
  },
  rechazado: {
    etiqueta: 'Rechazado',
    color: '#B91C1C',
    fondo: '#FEE2E2',
  },
};

export default function EstadoReporteBadge({ estado }: Props) {
  const configuracion = ESTADOS[estado] ?? ESTADOS.recibido;

  return (
    <View
      style={[
        styles.contenedor,
        { backgroundColor: configuracion.fondo },
      ]}
    >
      <Text style={[styles.texto, { color: configuracion.color }]}>
        {configuracion.etiqueta}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  texto: {
    fontSize: 12,
    fontWeight: '700',
  },
});
