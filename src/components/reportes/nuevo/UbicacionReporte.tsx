
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ColorBorde,
  ColorPrimario,
} from '@/constants/dominio';
import type { Coordenadas } from '@/types';

interface UbicacionReporteProps {
  coordenadas: Coordenadas | null;
  direccion: string;
  ubicacionDenegada: boolean;
  cargandoUbicacion: boolean;
  onCambiarDireccion: (direccion: string) => void;
  onReintentar: () => void;
}

export default function UbicacionReporte({
  coordenadas,
  direccion,
  ubicacionDenegada,
  cargandoUbicacion,
  onCambiarDireccion,
  onReintentar,
}: UbicacionReporteProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>¿Dónde está el problema? *</Text>
      <Text style={styles.descripcion}>
        Usamos tu ubicación para localizar el reporte. Revisá la dirección
        antes de enviarlo.
      </Text>

      <View style={styles.estado}>
        {cargandoUbicacion ? (
          <>
            <ActivityIndicator color={ColorPrimario} />
            <Text style={styles.textoEstado}>Obteniendo ubicación…</Text>
          </>
        ) : coordenadas ? (
          <>
            <View style={styles.puntoVerde} />
            <Text style={styles.textoEstado}>Ubicación GPS obtenida</Text>
          </>
        ) : (
          <>
            <View style={styles.puntoRojo} />
            <Text style={styles.textoEstado}>Ubicación no disponible</Text>
          </>
        )}
      </View>

      {ubicacionDenegada && (
        <View style={styles.aviso}>
          <Text style={styles.textoAviso}>
            Necesitamos permiso de ubicación para localizar el problema.
          </Text>

          <Pressable onPress={() => Linking.openSettings()}>
            <Text style={styles.enlace}>Abrir ajustes del teléfono</Text>
          </Pressable>

          <Pressable onPress={onReintentar}>
            <Text style={styles.enlace}>Volver a intentar</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.label}>Calle y altura</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej.: San Martín 123"
        value={direccion}
        onChangeText={onCambiarDireccion}
        autoCapitalize="words"
        returnKeyType="done"
        accessibilityLabel="Dirección del problema"
      />

      <Text style={styles.ayuda}>
        Podés corregir la dirección si el GPS no la detectó correctamente.
      </Text>
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
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    minHeight: 24,
  },
  textoEstado: {
    color: '#475467',
    fontSize: 13,
  },
  puntoVerde: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
  },
  puntoRojo: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#B03A2E',
  },
  aviso: {
    backgroundColor: '#FFF4D6',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  textoAviso: {
    color: '#624A08',
    fontSize: 13,
    lineHeight: 19,
  },
  enlace: {
    color: ColorPrimario,
    fontWeight: '700',
    fontSize: 13,
  },
  label: {
    color: '#344054',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: ColorBorde,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#20252B',
    backgroundColor: '#FFFFFF',
  },
  ayuda: {
    fontSize: 12,
    color: '#667085',
    lineHeight: 18,
  },
});
