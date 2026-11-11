import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MapaOpenStreetMap } from '@/components/mapa/MapaOpenStreetMap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AvisoMapa } from '@/components/mapa/AvisoMapa';
import { BotonNuevoReporte } from '@/components/mapa/BotonNuevoReporte';
import { ContadorReportes } from '@/components/mapa/ContadorReportes';
import { EncabezadoMapa } from '@/components/mapa/EncabezadoMapa';
import { FiltrosEstado, type FiltroReporte } from '@/components/mapa/FiltrosEstado';
import { IndicadorCarga } from '@/components/mapa/IndicadorCarga';
import { TarjetaReporteSeleccionado } from '@/components/mapa/TarjetaReporteSeleccionado';
import { ColorPrimario } from '@/constants/dominio';
import { useReportesMapa } from '@/hooks/mapas/useReportesMapa';
import { useUbicacionInicial } from '@/hooks/mapas/useUbicacionInicial';
import type { Reporte } from '@/types';
import { FiltrosTipo } from '@/components/mapa/FiltrosTipos';
import { cargarTiposConCache } from '@/services/catalogos';
import type { TipoDeReporte } from '@/types';
import { useAuth } from '@/hooks/auth/useAuth';
import { useAdhesionReporte } from '@/hooks/mapas/useAdhesionReporte';

export default function MapaScreen() {
  const { regionInicial, permisoDenegado } = useUbicacionInicial();
  const { reportes, cargando, error, cargarRegion, actualizarAdhesiones } = useReportesMapa();
  const [filtro, setFiltro] = useState<FiltroReporte>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [tipos, setTipos] = useState<TipoDeReporte[]>([]);  
  const [reporteSeleccionado, setReporteSeleccionado] = useState<Reporte | null>(null);
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const { adheridos, procesando, adherirse } = useAdhesionReporte();
  
  useEffect(() => {
    let activo = true;

    cargarTiposConCache()
      .then((datos) => {
        if (activo) setTipos(datos);
      })
      .catch((error) => {
        console.error('Error al cargar tipos de reporte:', error);
      });

    return () => {
      activo = false;
    };
  }, []);

  const reportesFiltrados = reportes.filter((reporte) => {
    const coincideEstado =
      filtro === 'todos' || reporte.estado === filtro;

    const coincideTipo =
      filtroTipo === null || reporte.tipoId === filtroTipo;

    return coincideEstado && coincideTipo;
  });

  if (!regionInicial) {
    return (
      <View style={styles.cargandoInicial}>
        <ActivityIndicator size="large" color={ColorPrimario} />
        <Text style={styles.textoInicial}>Preparando el mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <MapaOpenStreetMap
        regionInicial={regionInicial}
        reportes={reportesFiltrados}
        onSeleccionar={setReporteSeleccionado}
        onRegionChange={(region) => void cargarRegion(region)}
      />
      <View style={[ styles.panelSuperior, { top: insets.top }, ]}>
        <EncabezadoMapa />
        <FiltrosEstado
          seleccionado={filtro}
          onCambiar={(nuevoFiltro) => {
            setFiltro(nuevoFiltro);
            setReporteSeleccionado(null);
          }}
        />
        <FiltrosTipo
          tipos={tipos}
          seleccionado={filtroTipo}
          onCambiar={(nuevoTipo) => {
            setFiltroTipo(nuevoTipo);
            setReporteSeleccionado(null);
          }}
        />
      </View>
      {permisoDenegado && (
        <AvisoMapa
          tipo="ubicacion"
          onAccion={() => void Linking.openSettings()}
        />
      )}
      {error && (
        <AvisoMapa
          tipo="error"
          mensaje={error}
          onAccion={() => void cargarRegion(regionInicial)}
        />
      )}
      {cargando && <IndicadorCarga />}
      <ContadorReportes cantidad={reportesFiltrados.length} />
      {reporteSeleccionado && (
        <TarjetaReporteSeleccionado
          reporte={reporteSeleccionado}
          onCerrar={() => setReporteSeleccionado(null)}
          onVerDetalle={() =>
            router.push(`/reportes/detalle/${reporteSeleccionado.id}`)
          }
          onSumarme={async () => {
            const nuevaAdhesion = await adherirse(reporteSeleccionado);

            if (nuevaAdhesion) {
              actualizarAdhesiones(reporteSeleccionado.id);

              setReporteSeleccionado((actual) =>
                actual?.id === reporteSeleccionado.id
                  ? {
                      ...actual,
                      adhesiones: actual.adhesiones + 1,
                    }
                  : actual,
              );
            }
          }}
          yaAdherido={adheridos.has(reporteSeleccionado.id)}
          esPropio={reporteSeleccionado.autorId === usuario?.id}
          sumando={procesando.has(reporteSeleccionado.id)}
        />
      )}
      <BotonNuevoReporte
        onPress={() => router.push('/reportes/nuevo')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  panelSuperior: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 8,
    elevation: 5,
    shadowColor: '#16324F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  cargandoInicial: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F6F8',
  },
  textoInicial: {
    color: '#687076',
    fontSize: 14,
  },
});
