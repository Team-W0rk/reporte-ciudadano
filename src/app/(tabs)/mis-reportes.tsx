import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPrimario } from '@/constants/dominio';
import { useMisReportes } from '@/hooks/reportes/useMisReportes';
import type { Reporte } from '@/types';
import ReporteCard from '@/components/mis-reportes/ReporteCard';
import ReportesTabs from '@/components/mis-reportes/ReportesTabs';
import EstadoVacioReportes from '@/components/mis-reportes/EstadoVacioReportes';

export default function MisReportesScreen() {
  const insets = useSafeAreaInsets();

  const {
    reportesCreados,
    reportesAdheridos,
    reportesActuales,
    tipoLista,
    cargando,
    actualizando,
    error,
    cambiarTipoLista,
    cargarReportes,
  } = useMisReportes();

  useFocusEffect(
    useCallback(() => {
      void cargarReportes();
    }, [cargarReportes]),
  );

  const abrirDetalle = (reporte: Reporte) => {
    router.push({
      pathname: '/reportes/detalle/[id]',
      params: { id: reporte.id },
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Mis reportes' }} />
      <View style={[styles.pantalla, { paddingTop: insets.top }]}>
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Mis reportes</Text>
          <Text style={styles.descripcion}>
            Consultá tus reclamos y seguí el estado de cada uno.
          </Text>
        </View>
        <ReportesTabs
          seleccion={tipoLista}
          cantidadCreados={reportesCreados.length}
          cantidadAdheridos={reportesAdheridos.length}
          onChange={cambiarTipoLista}
        />
        {cargando ? (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color={ColorPrimario} />
            <Text style={styles.textoCarga}>
              Cargando tus reportes...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centrado}>
            <Ionicons
              name="cloud-offline-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text style={styles.tituloVacio}>
              No pudimos cargar los reportes
            </Text>
            <Text style={styles.descripcionVacia}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              style={styles.botonReintentar}
              onPress={() => void cargarReportes()}
            >
              <Text style={styles.textoBoton}>Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={reportesActuales}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReporteCard
                reporte={item}
                onPress={abrirDetalle}
              />
            )}
            contentContainerStyle={[
              styles.lista,
              reportesActuales.length === 0 && styles.listaVacia,
            ]}
            ItemSeparatorComponent={() => <View style={styles.separador} />}
            refreshControl={
              <RefreshControl
                refreshing={actualizando}
                onRefresh={() => void cargarReportes(true)}
                tintColor={ColorPrimario}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EstadoVacioReportes tipo={tipoLista} />
            }
          />
        )}
        <View
          style={[
            styles.pieAcciones,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botonCrear,
              pressed && styles.botonPresionado,
            ]}
            onPress={() => router.push('/reportes/nuevo')}
          >
            <Ionicons name="add-circle-outline" size={21} color="#FFFFFF" />
            <Text style={styles.textoBoton}>Crear un reporte</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  encabezado: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    gap: 6,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#20252B',
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 21,
    color: '#667085',
  },
  lista: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  listaVacia: {
    justifyContent: 'center',
  },
  separador: {
    height: 12,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  textoCarga: {
    marginTop: 12,
    color: '#667085',
    fontSize: 14,
  },
  tituloVacio: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    color: '#20252B',
  },
  descripcionVacia: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#667085',
  },
  botonReintentar: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: ColorPrimario,
  },
  pieAcciones: {
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F4F7FB',
  },
  botonCrear: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: ColorPrimario,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  botonPresionado: {
    opacity: 0.8,
  },
});

