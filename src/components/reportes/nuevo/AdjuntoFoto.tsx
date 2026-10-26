
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorBorde, ColorPrimario } from '@/constants/dominio';

interface AdjuntoFotoProps {
  fotoUri: string | null;
  onSacarFoto: () => void;
}

export default function AdjuntoFoto({
  fotoUri,
  onSacarFoto,
}: AdjuntoFotoProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Foto del problema *</Text>
      <Text style={styles.descripcion}>
        Una imagen ayuda a identificar mejor el inconveniente.
      </Text>

      {fotoUri ? (
        <Image
          source={{ uri: fotoUri }}
          style={styles.foto}
          resizeMode="cover"
          accessibilityLabel="Foto adjunta del problema"
        />
      ) : (
        <View style={styles.sinFoto}>
          <Text style={styles.icono}>📷</Text>
          <Text style={styles.textoSinFoto}>Todavía no adjuntaste una foto</Text>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={onSacarFoto}
        style={({ pressed }) => [
          styles.boton,
          pressed && styles.botonPresionado,
        ]}
      >
        <Text style={styles.botonTexto}>
          {fotoUri ? 'Sacar otra foto' : 'Abrir cámara'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#20252B',
  },
  descripcion: {
    fontSize: 14,
    color: '#667085',
    lineHeight: 20,
  },
  foto: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginTop: 6,
    backgroundColor: '#F2F4F7',
  },
  sinFoto: {
    height: 150,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: ColorBorde,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    backgroundColor: '#F9FAFB',
  },
  icono: {
    fontSize: 32,
  },
  textoSinFoto: {
    fontSize: 13,
    color: '#667085',
  },
  boton: {
    borderWidth: 1,
    borderColor: ColorPrimario,
    borderRadius: 12,
    padding: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonPresionado: {
    opacity: 0.7,
  },
  botonTexto: {
    color: ColorPrimario,
    fontSize: 14,
    fontWeight: '700',
  },
});
