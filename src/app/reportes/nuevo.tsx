import { Text, View } from 'react-native';

// TODO (Dev 2 - Mapa y creación de reportes):
// 1. Cámara obligatoria con expo-camera (o expo-image-picker de alternativa).
// 2. Ubicación con expo-location + corrección manual en el mapa.
// 3. Nota de voz con expo-audio.
// 4. Si no hay red (expo-network), guardar en expo-sqlite con sincronizado:false.
// 5. Vibración (expo-haptics) al confirmar el envío.
export default function NuevoReporteScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Nuevo reporte (Dev 2)</Text>
    </View>
  );
}
