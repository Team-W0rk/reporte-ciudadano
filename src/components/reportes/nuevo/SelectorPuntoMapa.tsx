import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';

import { ColorPrimario } from '@/constants/dominio';
import type { Coordenadas } from '@/types';

interface Props {
  /** Dónde arranca el mapa: el GPS o, sin permiso, el centro de la ciudad. */
  regionInicial: Region;
  /**
   * Sin permiso de ubicación: el vecino mueve el mapa hasta el lugar del
   * problema y toca "Marcar este punto". Con GPS, el punto sigue al pin y se
   * corrige moviendo el mapa.
   */
  modoManual: boolean;
  /** En modo manual: ya eligió un punto. */
  puntoMarcado: boolean;
  onElegirPunto: (coordenadas: Coordenadas) => void;
  /** Evita que el scroll de la pantalla le gane al gesto de mover el mapa. */
  onBloquearScroll?: (bloquear: boolean) => void;
}

export default function SelectorPuntoMapa({
  regionInicial,
  modoManual,
  puntoMarcado,
  onElegirPunto,
  onBloquearScroll,
}: Props) {
  const centro = useRef<Coordenadas>({
    latitud: regionInicial.latitude,
    longitud: regionInicial.longitude,
  });
  const movidoPorElVecino = useRef(false);

  return (
    <View style={styles.contenedor}>
      <View
        style={styles.mapa}
        onTouchStart={() => onBloquearScroll?.(true)}
        onTouchEnd={() => onBloquearScroll?.(false)}
        onTouchCancel={() => onBloquearScroll?.(false)}
      >
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={regionInicial}
          showsUserLocation={!modoManual}
          onPanDrag={() => {
            movidoPorElVecino.current = true;
          }}
          onRegionChangeComplete={(region) => {
            centro.current = { latitud: region.latitude, longitud: region.longitude };
            // Con GPS, mover el mapa corrige el punto. Sin GPS espera al botón.
            if (!modoManual && movidoPorElVecino.current) onElegirPunto(centro.current);
            movidoPorElVecino.current = false;
          }}
        />

        {/* Pin fijo en el centro: apunta al punto que se va a reportar. */}
        <View pointerEvents="none" style={styles.pin}>
          <Ionicons name="location" size={44} color="#B03A2E" />
        </View>
      </View>

      {modoManual ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onElegirPunto(centro.current)}
          style={({ pressed }) => [styles.boton, pressed && { opacity: 0.8 }]}
        >
          <Ionicons
            name={puntoMarcado ? 'checkmark-circle-outline' : 'pin-outline'}
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.botonTexto}>
            {puntoMarcado ? 'Punto marcado. Tocá para cambiarlo' : 'Marcar este punto'}
          </Text>
        </Pressable>
      ) : (
        <Text style={styles.ayuda}>
          Si el punto no es el correcto, mové el mapa hasta que el pin quede sobre el problema.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 10 },
  mapa: {
    height: 240,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  // El ícono del pin tiene la punta abajo: se sube media altura para que la punta
  // quede exactamente en el centro del mapa.
  pin: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 44,
  },
  boton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: ColorPrimario,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  botonTexto: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', flexShrink: 1, textAlign: 'center' },
  ayuda: { fontSize: 15, lineHeight: 22, color: '#475467' },
});