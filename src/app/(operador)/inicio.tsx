import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { obtenerBandeja } from '@/services/bandeja';
import type { EstadoReporte, Reporte } from '@/types';
import { EncabezadoOperador } from '@/components/operador/EncabezadoOperador';
import { FiltrosReportes } from '@/components/operador/FiltrosReportes';
import { TarjetaReporte } from '@/components/operador/TarjetaReporte';
import { CargandoBandeja } from '@/components/operador/CargandoBandeja';
import { EstadoBandeja } from '@/components/operador/EstadoBandeja';

const FILTROS: {
  etiqueta: string;
  valor?: EstadoReporte[];
}[] = [
  { etiqueta: 'Todos' },
  { etiqueta: 'Recibidos', valor: ['recibido'] },
  { etiqueta: 'En revisión', valor: ['en_revision'] },
  { etiqueta: 'Asignados', valor: ['asignado'] },
  { etiqueta: 'Finalizados', valor: ['resuelto', 'rechazado'] },
];

export default function BandejaOperador() {
  const {
    token,
    usuario,
    cargando: cargandoSesion,
  } = useAuth();

  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [filtro, setFiltro] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarReportes = useCallback(
    async (refrescar = false) => {
      if (!token) {
        setCargando(false);
        setError('Necesitás iniciar sesión para ver la bandeja.');
        return;
      }

      try {
        if (refrescar) {
          setActualizando(true);
        } else {
          setCargando(true);
        }

        setError(null);

        const respuesta = await obtenerBandeja(token, {
          pagina: 1,
          porPagina: 20,
          estado: FILTROS[filtro].valor,
        });

        setReportes(respuesta.datos);
      } catch {
        setError('No se pudieron cargar los reportes. Intentá nuevamente.');
      } finally {
        setCargando(false);
        setActualizando(false);
      }
    },
    [token, filtro],
  );

  useFocusEffect(
    useCallback(() => {
      if (!cargandoSesion) {
        void cargarReportes();
      }
    }, [cargandoSesion, cargarReportes]),
  );

  function handleAbrirPerfil() {
    router.push('/(operador)/perfil');
  }

  function handleAbrirReporte(id: string) {
    router.push({
      pathname: '/(operador)/reportes/[id]',
      params: { id },
    });
  }

  function handleEscanear() {
    router.push('/(operador)/escanear');
  }

  if (cargandoSesion || cargando) {
    return <CargandoBandeja />;
  }

  return (
    <FlatList
      style={styles.contenedor}
      data={error ? [] : reportes}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <EncabezadoOperador
            nombre={usuario?.nombre ?? 'operador'}
            onPressPerfil={handleAbrirPerfil}
          />

          <Pressable
            accessibilityRole="button"
            onPress={handleEscanear}
            style={({ pressed }) => [
              styles.botonEscanear,
              pressed && styles.botonEscanearApretado,
            ]}
          >
            <Text style={styles.textoEscanear}>
              Escanear QR del vecino
            </Text>
          </Pressable>

          <FiltrosReportes
            filtros={FILTROS}
            seleccionado={filtro}
            onSeleccionar={setFiltro}
          />
        </>
      }
      renderItem={({ item }) => (
        <TarjetaReporte
          reporte={item}
          onPress={() => handleAbrirReporte(item.id)}
        />
      )}
      ListEmptyComponent={
        <EstadoBandeja
          error={error}
          onReintentar={() => void cargarReportes()}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={actualizando}
          onRefresh={() => void cargarReportes(true)}
          tintColor="#0EA5E9"
        />
      }
      contentContainerStyle={
        reportes.length === 0 || error
          ? styles.listaVacia
          : styles.lista
      }
    />
  );
}

const styles = StyleSheet.create({
  botonEscanear: {
    minHeight: 56,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#0284C7',
  },
  botonEscanearApretado: {
    opacity: 0.8,
  },
  textoEscanear: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  contenedor: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  lista: {
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  listaVacia: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 24,
  },
});
