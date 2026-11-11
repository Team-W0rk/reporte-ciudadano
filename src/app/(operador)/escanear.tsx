import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import axios from 'axios';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { obtenerMensajeError } from '@/services/errores';
import { obtenerReportePorCodigo } from '@/services/reportes-operador';

// Número de seguimiento: GCHU-2026-00412. Se acepta también dentro de un texto más largo.
const FORMATO_CODIGO = /GCHU-\d{4}-\d{5}/i;

function extraerCodigo(texto: string): string | null {
  const coincidencia = texto.match(FORMATO_CODIGO);
  return coincidencia ? coincidencia[0].toUpperCase() : null;
}

/**
 * Mostrador: la persona de la ventanilla apunta la cámara al QR que le muestra el vecino
 * y se abre el reporte, sin tipear nada. Si el QR no se lee, se puede escribir el código.
 */
export default function EscanearReporteScreen() {
  const { token } = useAuth();
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [codigoManual, setCodigoManual] = useState('');

  // Evita que la cámara dispare la lectura muchas veces seguidas con el mismo QR.
  const ocupado = useRef(false);

  // Al volver desde el detalle, se puede leer otro QR.
  useFocusEffect(
    useCallback(() => {
      ocupado.current = false;
      setMensaje(null);
    }, []),
  );

  const buscar = useCallback(
    async (texto: string) => {
      if (ocupado.current) return;

      const codigo = extraerCodigo(texto);
      if (!codigo) {
        setMensaje('Ese código no es de un reporte. Probá de nuevo.');
        return;
      }

      ocupado.current = true;
      setBuscando(true);
      setMensaje(null);

      try {
        const respuesta = await obtenerReportePorCodigo(token ?? '', codigo);
        router.push({
          pathname: '/(operador)/reportes/[id]',
          params: { id: respuesta.datos.id },
        });
      } catch (error) {
        ocupado.current = false;
        setMensaje(
          axios.isAxiosError(error) && error.response?.status === 404
            ? `No encontramos ningún reporte con el código ${codigo}.`
            : obtenerMensajeError(error),
        );
      } finally {
        setBuscando(false);
      }
    },
    [token],
  );

  const buscarManual = () => {
    Keyboard.dismiss();
    void buscar(codigoManual);
  };

  const cabecera = (
    <Stack.Screen
      options={{ title: 'Escanear reporte', headerShown: true }}
    />
  );

  if (!permiso) {
    return (
      <View style={styles.centrado}>
        {cabecera}
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      {cabecera}

      {permiso.granted ? (
        <View style={styles.contenedorCamara}>
          <CameraView
            style={styles.camara}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={({ data }) => void buscar(data)}
          />
          <View pointerEvents="none" style={styles.marco} />
          <Text style={styles.indicacion}>
            Apuntá la cámara al código QR del vecino
          </Text>
        </View>
      ) : (
        <View style={styles.sinPermiso}>
          <Text style={styles.textoSinPermiso}>
            Necesitamos la cámara para leer el código QR. También podés
            escribir el código abajo.
          </Text>
          {permiso.canAskAgain ? (
            <Pressable
              accessibilityRole="button"
              style={styles.botonSecundario}
              onPress={() => void pedirPermiso()}
            >
              <Text style={styles.textoSecundario}>Permitir la cámara</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              style={styles.botonSecundario}
              onPress={() => void Linking.openSettings()}
            >
              <Text style={styles.textoSecundario}>Abrir los ajustes</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.panel}>
        {buscando && (
          <View style={styles.fila}>
            <ActivityIndicator />
            <Text style={styles.texto}>Buscando el reporte…</Text>
          </View>
        )}

        {mensaje && <Text style={styles.error}>{mensaje}</Text>}

        <Text style={styles.etiqueta}>¿No se lee? Escribí el código</Text>
        <TextInput
          style={styles.input}
          value={codigoManual}
          onChangeText={setCodigoManual}
          placeholder="GCHU-2026-00412"
          placeholderTextColor="#98A2B3"
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={buscarManual}
          accessibilityLabel="Código del reporte"
        />
        <Pressable
          accessibilityRole="button"
          disabled={buscando || codigoManual.trim().length === 0}
          onPress={buscarManual}
          style={({ pressed }) => [
            styles.boton,
            (buscando || codigoManual.trim().length === 0 || pressed) &&
              styles.botonApagado,
          ]}
        >
          <Text style={styles.textoBoton}>Buscar reporte</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#F8FAFC' },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contenedorCamara: { flex: 1, backgroundColor: '#000000' },
  camara: { flex: 1 },
  marco: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    width: 240,
    height: 240,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderRadius: 20,
  },
  indicacion: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  sinPermiso: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  textoSinPermiso: { fontSize: 18, lineHeight: 26, color: '#344054' },
  panel: { padding: 16, gap: 10, backgroundColor: '#FFFFFF' },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  texto: { fontSize: 16, color: '#344054' },
  error: { fontSize: 17, fontWeight: '600', color: '#B42318' },
  etiqueta: { fontSize: 16, fontWeight: '600', color: '#344054' },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 20,
    color: '#20252B',
    backgroundColor: '#FFFFFF',
  },
  boton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#0284C7',
  },
  botonApagado: { opacity: 0.5 },
  textoBoton: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
  botonSecundario: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  textoSecundario: { color: '#0284C7', fontSize: 18, fontWeight: '700' },
});