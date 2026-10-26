
import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function useAdjuntoFoto() {
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [abriendoCamara, setAbriendoCamara] = useState(false);

  const sacarFoto = useCallback(async () => {
    if (abriendoCamara) return;

    setAbriendoCamara(true);

    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync();

      if (!permiso.granted) {
        Alert.alert(
          'Falta el permiso de cámara',
          'Habilitalo en los ajustes para adjuntar una foto del problema.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir ajustes', onPress: () => void Linking.openSettings() },
          ],
        );
        return;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!resultado.canceled && resultado.assets[0]) {
        setFotoUri(resultado.assets[0].uri);
      }
    } catch {
      Alert.alert(
        'No pudimos abrir la cámara',
        'Intentá nuevamente o revisá los permisos del teléfono.',
      );
    } finally {
      setAbriendoCamara(false);
    }
  }, [abriendoCamara]);

  return {
    fotoUri,
    sacarFoto,
    abriendoCamara,
  };
}
