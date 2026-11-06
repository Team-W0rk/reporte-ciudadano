
import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordenadas } from '@/types';

export default function useUbicacionReporte() {
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
  const [direccion, setDireccion] = useState('');
  const [ubicacionDenegada, setUbicacionDenegada] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(true);

  const obtenerUbicacion = useCallback(async () => {
    setCargandoUbicacion(true);

    try {
      const permiso = await Location.requestForegroundPermissionsAsync();

      if (permiso.status !== 'granted') {
        setUbicacionDenegada(true);
        setCoordenadas(null);
        return;
      }

      setUbicacionDenegada(false);

      const posicion = await Location.getCurrentPositionAsync({});
      const coords: Coordenadas = {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
      };

      setCoordenadas(coords);

      try {
        const lugares = await Location.reverseGeocodeAsync({
          latitude: coords.latitud,
          longitude: coords.longitud,
        });

        const lugar = lugares[0];

        if (lugar) {
          const calle = [lugar.street, lugar.streetNumber]
            .filter(Boolean)
            .join(' ');

          setDireccion(calle || lugar.name || '');
        }
      } catch {
        // La dirección se puede completar manualmente si falla el geocodificado.
      }
    } catch {
      setCoordenadas(null);
    } finally {
      setCargandoUbicacion(false);
    }
  }, []);

  useEffect(() => {
    void obtenerUbicacion();
  }, [obtenerUbicacion]);

  return {
    coordenadas,
    direccion,
    setDireccion,
    ubicacionDenegada,
    cargandoUbicacion,
    obtenerUbicacion,
  };
}
