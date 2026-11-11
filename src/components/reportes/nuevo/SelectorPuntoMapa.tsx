import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ColorPrimario } from '@/constants/dominio';
import type { Coordenadas } from '@/types';
import type { RegionMapa } from '@/types/mapa';
import { MapaOpenStreetMap } from '@/components/mapa/MapaOpenStreetMap';

interface Props {
  regionInicial: RegionMapa;
  modoManual: boolean;
  puntoMarcado: boolean;
  onElegirPunto: (coordenadas: Coordenadas) => void;
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

  return (
    <View style={styles.contenedor}>
      <View
        style={styles.mapa}
        onTouchStart={() => onBloquearScroll?.(true)}
        onTouchEnd={() => onBloquearScroll?.(false)}
        onTouchCancel={() => onBloquearScroll?.(false)}
      >
        <MapaOpenStreetMap
          regionInicial={regionInicial}
          reportes={[]}
          onRegionChange={(region) => {
            centro.current = {
              latitud: region.latitude,
              longitud: region.longitude,
            };

            if (!modoManual) {
              onElegirPunto(centro.current);
            }
          }}
          onSeleccionar={() => {}}
        />

        <View pointerEvents="none" style={styles.pin}>
          <Ionicons name="location" size={44} color="#B03A2E" />
        </View>
      </View>

      {modoManual ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onElegirPunto(centro.current)}
          style={({ pressed }) => [
            styles.boton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons
            name={puntoMarcado ? 'checkmark-circle-outline' : 'pin-outline'}
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.botonTexto}>
            {puntoMarcado
              ? 'Punto marcado. Tocá para cambiarlo'
              : 'Marcar este punto'}
          </Text>
        </Pressable>
      ) : (
        <Text style={styles.ayuda}>
          Si el punto no es el correcto, mové el mapa hasta que el pin quede
          sobre el problema.
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
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
  },
  ayuda: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475467',
  },
});
