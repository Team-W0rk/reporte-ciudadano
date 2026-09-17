import { Text, View } from 'react-native';

// TODO (Dev 3 - Bandeja del operador):
// - Lista de reportes con filtros por estado/tipo/zona (listarReportes ya los soporta).
// - Acciones: cambiar estado, asignar cuadrilla, marcar duplicado.
export default function BandejaOperadorScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Bandeja del operador (Dev 3)</Text>
    </View>
  );
}
