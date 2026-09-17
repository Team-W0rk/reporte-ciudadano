import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// TODO (Dev 3 - Seguimiento):
// - Traer el reporte y su historial (servicios/reportes.ts, ya armados).
// - Mostrar el código QR del reporte para el mostrador municipal.
export default function DetalleReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Detalle de {id} (Dev 3)</Text>
    </View>
  );
}
