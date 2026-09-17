import { Text, View } from 'react-native';

// TODO (Dev 3 - Seguimiento y bandeja del operador):
// - Lista de reportes del usuario logueado (filtrar por autorId).
// - Separar "los que vienen" de "los ya resueltos/rechazados".
export default function MisReportesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Mis reportes (Dev 3)</Text>
    </View>
  );
}
