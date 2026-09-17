import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

// TODO (Dev 3 - Bandeja del operador):
// - Cambiar estado con comentario obligatorio (un "rechazado" sin motivo
//   genera más enojo que no contestar, según el PRD).
// - Asignar cuadrilla (mocks/zonas.mock.ts tiene cuadrillasMock).
export default function GestionarReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Gestionar {id} (Dev 3)</Text>
    </View>
  );
}
