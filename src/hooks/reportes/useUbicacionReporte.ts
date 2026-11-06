import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { Region } from 'react-native-maps';
import type { Coordenadas } from '@/types';

// Centro de Gualeguaychú: donde arranca el mapa si no hay GPS.
const CENTRO_CIUDAD: Region = {
  latitude: -33.0089,
  longitude: -58.5142,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function useUbicacionReporte() {
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
  const [direccion, setDireccionEstado] = useState('');
  const [ubicacionDenegada, setUbicacionDenegada] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(true);
  const [regionInicial, setRegionInicial] = useState<Region | null>(null);
  // Sin GPS (permiso denegado o GPS apagado) el vecino marca el punto a mano.
  const [modoManual, setModoManual] = useState(false);

  // Si el vecino escribió la dirección, mover el mapa no se la pisa.
  const direccionEditada = useRef(false);

  const setDireccion = useCallback((texto: string) => {
    direccionEditada.current = true;
    setDireccionEstado(texto);
  }, []);

  const buscarDireccion = useCallback(async (coords: Coordenadas) => {
    if (direccionEditada.current) return;

    try {
      const [lugar] = await Location.reverseGeocodeAsync({
        latitude: coords.latitud,
        longitude: coords.longitud,
      });

      if (lugar && !direccionEditada.current) {
        const calle = [lugar.street, lugar.streetNumber].filter(Boolean).join(' ');
        setDireccionEstado(calle || lugar.name || '');
      }
    } catch {
      // Sin señal el geocodificado no funciona: la dirección se escribe a mano.
    }
  }, []);

  /** El vecino elige el punto en el mapa (con GPS para corregirlo, sin GPS para marcarlo). */
  const elegirPunto = useCallback(
    (coords: Coordenadas) => {
      setCoordenadas(coords);
      void buscarDireccion(coords);
    },
    [buscarDireccion],
  );

  const obtenerUbicacion = useCallback(async () => {
    setCargandoUbicacion(true);

    try {
      const permiso = await Location.requestForegroundPermissionsAsync();

      if (permiso.status !== 'granted') {
        // Sin permiso igual se puede reportar: el vecino marca el punto en el mapa.
        setUbicacionDenegada(true);
        setModoManual(true);
        setCoordenadas(null);
        setRegionInicial(CENTRO_CIUDAD);
        return;
      }

      setUbicacionDenegada(false);
      setModoManual(false);

      const posicion = await Location.getCurrentPositionAsync({});
      const coords: Coordenadas = {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
      };

      setCoordenadas(coords);
      setRegionInicial({
        latitude: coords.latitud,
        longitude: coords.longitud,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      });
      void buscarDireccion(coords);
    } catch {
      // El GPS no respondió (apagado, sin cielo): se marca a mano igual.
      setModoManual(true);
      setCoordenadas(null);
      setRegionInicial((actual) => actual ?? CENTRO_CIUDAD);
    } finally {
      setCargandoUbicacion(false);
    }
  }, [buscarDireccion]);

  useEffect(() => {
    void obtenerUbicacion();
  }, [obtenerUbicacion]);

  return {
    coordenadas,
    direccion,
    setDireccion,
    ubicacionDenegada,
    cargandoUbicacion,
    regionInicial,
    modoManual,
    elegirPunto,
    obtenerUbicacion,
  };
}
