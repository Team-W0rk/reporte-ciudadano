import type { RegionMapa } from '@/types/mapa';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ColorBorde, ColorPrimario } from '@/constants/dominio';
import type { Coordenadas } from '@/types';
import SelectorPuntoMapa from './SelectorPuntoMapa';

interface UbicacionReporteProps {
  coordenadas: Coordenadas | null;
  direccion: string;
  ubicacionDenegada: boolean;
  cargandoUbicacion: boolean;
  regionInicial: RegionMapa | null;
  /** Sin GPS: el vecino marca el punto en el mapa. */
  modoManual: boolean;
  onCambiarDireccion: (direccion: string) => void;
  onElegirPunto: (coordenadas: Coordenadas) => void;
  onReintentar: () => void;
  onBloquearScroll?: (bloquear: boolean) => void;
}

export default function UbicacionReporte({
  coordenadas,
  direccion,
  ubicacionDenegada,
  cargandoUbicacion,
  regionInicial,
  modoManual,
  onCambiarDireccion,
  onElegirPunto,
  onReintentar,
  onBloquearScroll,
}: UbicacionReporteProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>¿Dónde está el problema? *</Text>

      <View style={styles.estado}>
        {cargandoUbicacion ? (
          <>
            <ActivityIndicator color={ColorPrimario} />
            <Text style={styles.textoEstado}>Buscando dónde estás…</Text>
          </>
        ) : coordenadas ? (
          <>
            <View style={styles.puntoVerde} />
            <Text style={styles.textoEstado}>
              {modoManual ? 'Punto marcado en el mapa' : 'Ubicación lista'}
            </Text>
          </>
        ) : (
          <>
            <View style={styles.puntoRojo} />
            <Text style={styles.textoEstado}>Falta marcar el punto en el mapa</Text>
          </>
        )}
      </View>

      {ubicacionDenegada && (
        <View style={styles.aviso}>
          <Text style={styles.textoAviso}>
            No usamos tu ubicación, y no hay problema: movés el mapa hasta
            donde está el problema y tocás “Marcar este punto”. Si preferís
            que lo ubiquemos solos, podés darnos el permiso.
          </Text>

          <Pressable style={styles.botonAviso} onPress={() => Linking.openSettings()}>
            <Text style={styles.enlace}>Dar permiso en los ajustes</Text>
          </Pressable>

          <Pressable style={styles.botonAviso} onPress={onReintentar}>
            <Text style={styles.enlace}>Volver a intentar</Text>
          </Pressable>
        </View>
      )}

      {regionInicial && (
        <SelectorPuntoMapa
          // Se recrea si cambia el modo o el punto de partida (por ejemplo, tras dar el permiso).
          key={`${regionInicial.latitude}-${regionInicial.longitude}-${modoManual}`}
          regionInicial={regionInicial}
          modoManual={modoManual}
          puntoMarcado={coordenadas !== null}
          onElegirPunto={onElegirPunto}
          onBloquearScroll={onBloquearScroll}
        />
      )}

      <Text style={styles.label}>Calle y altura</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej.: San Martín 123"
        placeholderTextColor="#667085"
        value={direccion}
        onChangeText={onCambiarDireccion}
        autoCapitalize="words"
        returnKeyType="done"
        accessibilityLabel="Dirección del problema"
      />

      <Text style={styles.ayuda}>
        Revisá que la dirección sea la correcta. La podés escribir vos si no
        aparece sola.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#20252B',
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 28,
  },
  textoEstado: {
    color: '#344054',
    fontSize: 16,
  },
  puntoVerde: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2E7D32',
  },
  puntoRojo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#B03A2E',
  },
  aviso: {
    backgroundColor: '#FFF4D6',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  textoAviso: {
    color: '#624A08',
    fontSize: 16,
    lineHeight: 23,
  },
  botonAviso: {
    minHeight: 44,
    justifyContent: 'center',
  },
  enlace: {
    color: ColorPrimario,
    fontWeight: '700',
    fontSize: 16,
  },
  label: {
    color: '#344054',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 6,
  },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: ColorBorde,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: '#20252B',
    backgroundColor: '#FFFFFF',
  },
  ayuda: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 22,
  },
});
