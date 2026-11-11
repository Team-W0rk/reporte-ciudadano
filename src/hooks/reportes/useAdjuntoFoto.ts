import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function useAdjuntoFoto() {
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoExtraUri, setFotoExtraUri] = useState<string | null>(null);
  const [abriendoCamara, setAbriendoCamara] = useState(false);
  const [abriendoGaleria, setAbriendoGaleria] = useState(false);

  const capturarFoto = useCallback(
    async (guardarFoto: (uri: string) => void) => {
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
              {
                text: 'Abrir ajustes',
                onPress: () => void Linking.openSettings(),
              },
            ],
          );
          return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.7,
        });

        if (!resultado.canceled && resultado.assets[0]) {
          guardarFoto(resultado.assets[0].uri);
        }
      } catch {
        Alert.alert(
          'No pudimos abrir la cámara',
          'Intentá nuevamente o revisá los permisos del teléfono.',
        );
      } finally {
        setAbriendoCamara(false);
      }
    },
    [abriendoCamara],
  );

  const seleccionarDeGaleria = useCallback(
    async (guardarFoto: (uri: string) => void) => {
      if (abriendoGaleria) return;

      setAbriendoGaleria(true);

      try {
        const permiso =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permiso.granted) {
          Alert.alert(
            'Falta el permiso de galería',
            'Necesitamos permiso para seleccionar una imagen de tu teléfono.',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Abrir ajustes',
                onPress: () => void Linking.openSettings(),
              },
            ],
          );
          return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.7,
        });

        if (!resultado.canceled && resultado.assets[0]) {
          guardarFoto(resultado.assets[0].uri);
        }
      } catch {
        Alert.alert(
          'No pudimos abrir la galería',
          'Intentá nuevamente.',
        );
      } finally {
        setAbriendoGaleria(false);
      }
    },
    [abriendoGaleria],
  );

  const elegirOrigen = useCallback(
    (guardarFoto: (uri: string) => void) => {
      Alert.alert(
        'Adjuntar fotografía',
        '¿Cómo querés agregar la imagen?',
        [
          {
            text: 'Tomar una foto',
            onPress: () => void capturarFoto(guardarFoto),
          },
          {
            text: 'Elegir de la galería',
            onPress: () => void seleccionarDeGaleria(guardarFoto),
          },
          { text: 'Cancelar', style: 'cancel' },
        ],
      );
    },
    [capturarFoto, seleccionarDeGaleria],
  );

  const sacarFoto = useCallback(
    () => elegirOrigen(setFotoUri),
    [elegirOrigen],
  );

  const sacarFotoExtra = useCallback(
    () => elegirOrigen(setFotoExtraUri),
    [elegirOrigen],
  );

  const quitarFotoExtra = useCallback(() => {
    setFotoExtraUri(null);
  }, []);

  return {
    fotoUri,
    fotoExtraUri,
    sacarFoto,
    sacarFotoExtra,
    quitarFotoExtra,
    abriendoCamara,
    abriendoGaleria,
  };
}
