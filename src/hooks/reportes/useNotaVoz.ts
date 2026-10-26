
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

export default function useNotaVoz() {
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [procesandoAudio, setProcesandoAudio] = useState(false);

  const grabador = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const estadoGrabador = useAudioRecorderState(grabador);
  const reproductor = useAudioPlayer(audioUri);

  const empezarGrabacion = useCallback(async () => {
    if (procesandoAudio || estadoGrabador.isRecording) return;

    setProcesandoAudio(true);

    try {
      const permiso = await requestRecordingPermissionsAsync();

      if (!permiso.granted) {
        Alert.alert(
          'Falta el permiso de micrófono',
          'Habilitalo en los ajustes para grabar una nota de voz.',
        );
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await grabador.prepareToRecordAsync();
      grabador.record();
    } catch {
      Alert.alert(
        'No pudimos iniciar la grabación',
        'Revisá el permiso del micrófono e intentá nuevamente.',
      );
    } finally {
      setProcesandoAudio(false);
    }
  }, [estadoGrabador.isRecording, grabador, procesandoAudio]);

  const detenerGrabacion = useCallback(async () => {
    if (!estadoGrabador.isRecording) return;

    try {
      await grabador.stop();
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      setAudioUri(grabador.uri ?? null);
    } catch {
      Alert.alert('No pudimos guardar la grabación', 'Intentá nuevamente.');
    }
  }, [estadoGrabador.isRecording, grabador]);

  const escucharAudio = useCallback(() => {
    try {
      reproductor.seekTo(0);
      reproductor.play();
    } catch {
      Alert.alert('No pudimos reproducir el audio', 'Probá grabarlo nuevamente.');
    }
  }, [reproductor]);

  return {
    audioUri,
    grabando: estadoGrabador.isRecording,
    procesandoAudio,
    empezarGrabacion,
    detenerGrabacion,
    escucharAudio,
  };
}
