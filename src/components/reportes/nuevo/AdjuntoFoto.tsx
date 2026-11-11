import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ColorBorde, ColorPrimario } from '@/constants/dominio';

interface AdjuntoFotoProps {
  fotoUri: string | null;
  fotoExtraUri: string | null;
  onSacarFoto: () => void;
  onSacarFotoExtra: () => void;
  onQuitarFotoExtra: () => void;
}

export default function AdjuntoFoto({
  fotoUri,
  fotoExtraUri,
  onSacarFoto,
  onSacarFotoExtra,
  onQuitarFotoExtra,
}: AdjuntoFotoProps) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.seccion}>
        <Text style={styles.titulo}>Foto del problema *</Text>
        <Text style={styles.descripcion}>
          Una imagen ayuda a identificar mejor el inconveniente.
        </Text>

        {fotoUri ? (
          <Image
            source={{ uri: fotoUri }}
            style={styles.foto}
            resizeMode="cover"
            accessibilityLabel="Foto principal del problema"
          />
        ) : (
          <View style={styles.sinFoto}>
            <Text style={styles.icono}>📷</Text>
            <Text style={styles.textoSinFoto}>
              Todavía no adjuntaste una foto
            </Text>
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
            {fotoUri ? 'Sacar otra foto principal' : 'Abrir cámara'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.separador} />

      <View style={styles.seccion}>
        <View style={styles.encabezadoExtra}>
          <View style={styles.textosExtra}>
            <Text style={styles.titulo}>Segunda foto</Text>
            <Text style={styles.descripcion}>
              Opcional. Podés mostrar otro ángulo o más detalles.
            </Text>
          </View>
          <Text style={styles.etiquetaOpcional}>Opcional</Text>
        </View>

        {fotoExtraUri ? (
          <>
            <Image
              source={{ uri: fotoExtraUri }}
              style={styles.foto}
              resizeMode="cover"
              accessibilityLabel="Segunda foto del problema"
            />

            <View style={styles.accionesExtra}>
              <Pressable
                accessibilityRole="button"
                onPress={onSacarFotoExtra}
                style={({ pressed }) => [
                  styles.boton,
                  styles.botonAccionExtra,
                  pressed && styles.botonPresionado,
                ]}
              >
                <Text style={styles.botonTexto}>Cambiar foto</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={onQuitarFotoExtra}
                style={({ pressed }) => [
                  styles.botonQuitar,
                  pressed && styles.botonPresionado,
                ]}
              >
                <Text style={styles.textoQuitar}>Quitar</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={onSacarFotoExtra}
            style={({ pressed }) => [
              styles.sinFoto,
              styles.segundaFotoVacia,
              pressed && styles.botonPresionado,
            ]}
          >
            <Text style={styles.icono}>＋</Text>
            <Text style={styles.botonTexto}>
              Agregar segunda foto
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 20,
  },
  seccion: {
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
    color: ColorPrimario,
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
  separador: {
    height: 1,
    backgroundColor: ColorBorde,
  },
  encabezadoExtra: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  textosExtra: {
    flex: 1,
    gap: 4,
  },
  etiquetaOpcional: {
    fontSize: 11,
    fontWeight: '600',
    color: '#667085',
    backgroundColor: '#F2F4F7',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  segundaFotoVacia: {
    height: 120,
    borderColor: ColorPrimario,
  },
  accionesExtra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botonAccionExtra: {
    flex: 1,
  },
  botonQuitar: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  textoQuitar: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
