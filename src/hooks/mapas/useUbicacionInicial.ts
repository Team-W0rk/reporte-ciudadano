import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';

const CENTRO_CIUDAD: Region = {
  latitude: -33.0089,
  longitude: -58.5142,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

interface EstadoUbicacion {
  regionInicial: Region | null;
  permisoDenegado: boolean;
}

export function useUbicacionInicial(): EstadoUbicacion {
  const [regionInicial, setRegionInicial] = useState<Region | null>(null);
  const [permisoDenegado, setPermisoDenegado] = useState(false);

  useEffect(() => {
    let activo = true;

    async function obtenerUbicacion() {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (!activo) return;

        if (status !== 'granted') {
          setPermisoDenegado(true);
          setRegionInicial(CENTRO_CIUDAD);
          return;
        }

        const posicion = await Location.getCurrentPositionAsync({});

        if (!activo) return;

        setRegionInicial({
          latitude: posicion.coords.latitude,
          longitude: posicion.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch {
        if (activo) {
          setRegionInicial(CENTRO_CIUDAD);
        }
      }
    }

    void obtenerUbicacion();

    return () => {
      activo = false;
    };
  }, []);

  return { regionInicial, permisoDenegado };
}