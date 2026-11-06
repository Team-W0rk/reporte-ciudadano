
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorPrimario } from '@/constants/dominio';

interface NotaVozProps {
  audioUri: string | null;
  grabando: boolean;
  onEmpezar: () => void;
  onDetener: () => void;
  onEscuchar: () => void;
}

export default function NotaVoz({
  audioUri,
  grabando,
  onEmpezar,
  onDetener,
  onEscuchar,
}: NotaVozProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Nota de voz (opcional)</Text>
      <Text style={styles.descripcion}>
        Si te resulta más fácil, podés explicar el problema con tu voz.
      </Text>

      {grabando && (
        <View style={styles.avisoGrabando}>
          <View style={styles.puntoGrabando} />
          <Text style={styles.textoGrabando}>Grabación en curso…</Text>
        </View>
      )}

      <View style={styles.botones}>
        {grabando ? (
          <Pressable
            accessibilityRole="button"
            onPress={onDetener}
            style={[styles.boton, styles.botonDetener]}
          >
            <Text style={styles.textoDetener}>Detener grabación</Text>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={onEmpezar}
            style={styles.boton}
          >
            <Text style={styles.textoBoton}>
              {audioUri ? 'Grabar de nuevo' : 'Grabar nota'}
            </Text>
          </Pressable>
        )}

        {audioUri && !grabando && (
          <Pressable
            accessibilityRole="button"
            onPress={onEscuchar}
            style={[styles.boton, styles.botonEscuchar]}
          >
            <Text style={styles.textoBoton}>Escuchar</Text>
          </Pressable>
        )}
      </View>

      {audioUri && !grabando && (
        <Text style={styles.confirmacion}>Nota de voz adjunta.</Text>
      )}
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
  botones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  boton: {
    borderWidth: 1,
    borderColor: ColorPrimario,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonEscuchar: {
    backgroundColor: '#EAF3FA',
  },
  textoBoton: {
    color: ColorPrimario,
    fontWeight: '700',
    fontSize: 14,
  },
  botonDetener: {
    borderColor: '#B03A2E',
    backgroundColor: '#FBE9E7',
  },
  textoDetener: {
    color: '#B03A2E',
    fontWeight: '700',
    fontSize: 14,
  },
  avisoGrabando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBE9E7',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  puntoGrabando: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#B03A2E',
  },
  textoGrabando: {
    color: '#B03A2E',
    fontWeight: '600',
    fontSize: 13,
  },
  confirmacion: {
    color: '#2E7D32',
    fontSize: 12,
  },
});
