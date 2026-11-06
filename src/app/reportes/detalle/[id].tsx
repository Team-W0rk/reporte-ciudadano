import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorPrimario } from '@/constants/dominio';
import {
  obtenerHistorialReporte,
  obtenerReportePorId,
} from '@/services/reportes';
import type {
  CambioDeEstado,
  EstadoReporte,
  Reporte,
} from '@/types';

const ESTADOS: Record<
  EstadoReporte,
  { titulo: string; color: string; fondo: string }
> = {
  recibido: {
    titulo: 'Recibido',
    color: '#0369A1',
    fondo: '#E0F2FE',
  },
  en_revision: {
    titulo: 'En revisión',
    color: '#92400E',
    fondo: '#FEF3C7',
  },
  asignado: {
    titulo: 'Asignado',
    color: '#6D28D9',
    fondo: '#EDE9FE',
  },
  resuelto: {
    titulo: 'Resuelto',
    color: '#166534',
    fondo: '#DCFCE7',
  },
  rechazado: {
    titulo: 'Rechazado',
    color: '#B91C1C',
    fondo: '#FEE2E2',
  },
};

function fechaLegible(fecha: string): string {
  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return 'Fecha no disponible';
  }

  return valor.toLocaleString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DetalleReporteScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [historial, setHistorial] = useState<CambioDeEstado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const opcionesEncabezado = {
    headerShown: true,
    headerStyle: {
      backgroundColor: ColorPrimario,
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      color: '#FFFFFF',
      fontWeight: '700' as const,
    },
    headerStatusBarHeight: insets.top,
  };

  const cargarDetalle = useCallback(async () => {
    if (!id) {
      setError('No se recibió el identificador del reporte.');
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const respuesta = await obtenerReportePorId(id);
      setReporte(respuesta.datos);

      try {
        const respuestaHistorial = await obtenerHistorialReporte(id);
        setHistorial(respuestaHistorial.datos);
      } catch {
        setHistorial([]);
      }
    } catch {
      setError(
        'No pudimos cargar el reporte. Verificá tu conexión e intentá nuevamente.',
      );
    } finally {
      setCargando(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void cargarDetalle();
    }, [cargarDetalle]),
  );

  if (cargando) {
    return (
      <>
        <Stack.Screen
          options={{
            ...opcionesEncabezado,
            title: 'Detalle del reporte',
          }}
        />

        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={ColorPrimario} />
          <Text style={styles.textoAuxiliar}>
            Cargando reporte...
          </Text>
        </View>
      </>
    );
  }

  if (error || !reporte) {
    return (
      <>
        <Stack.Screen
          options={{
            ...opcionesEncabezado,
            title: 'Detalle del reporte',
          }}
        />

        <View
          style={[
            styles.centrado,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={52}
            color="#DC2626"
          />

          <Text style={styles.tituloError}>
            No pudimos mostrar el reporte
          </Text>

          <Text style={styles.textoAuxiliar}>
            {error ?? 'El reporte no está disponible.'}
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.botonReintentar}
            onPress={() => void cargarDetalle()}
          >
            <Text style={styles.textoBoton}>Reintentar</Text>
          </Pressable>
        </View>
      </>
    );
  }

  const estado = ESTADOS[reporte.estado] ?? ESTADOS.recibido;

  const fotosProblema = reporte.fotos.filter(
    (foto) => foto.momento === 'problema',
  );

  const fotosArreglo = reporte.fotos.filter(
    (foto) => foto.momento === 'arreglo',
  );

  const historialOrdenado = [...historial].sort(
    (a, b) =>
      new Date(a.fechaHora).getTime() -
      new Date(b.fechaHora).getTime(),
  );

  return (
    <>
      <Stack.Screen
        options={{
          ...opcionesEncabezado,
          title: reporte.codigo,
        }}
      />

      <ScrollView
        style={styles.pantalla}
        contentContainerStyle={[
          styles.contenido,
          {
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 24) + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tarjetaPrincipal}>
          <View style={styles.filaSuperior}>
            <Text style={styles.codigo}>{reporte.codigo}</Text>

            <View
              style={[
                styles.etiquetaEstado,
                { backgroundColor: estado.fondo },
              ]}
            >
              <Text style={[styles.textoEstado, { color: estado.color }]}>
                {estado.titulo}
              </Text>
            </View>
          </View>

          <Text style={styles.titulo}>
            {reporte.descripcion?.trim() || 'Reporte ciudadano'}
          </Text>

          <View style={styles.dato}>
            <Ionicons
              name="calendar-outline"
              size={19}
              color="#667085"
            />
            <View style={styles.datoContenido}>
              <Text style={styles.etiqueta}>Fecha de creación</Text>
              <Text style={styles.valor}>
                {fechaLegible(reporte.creadoEn)}
              </Text>
            </View>
          </View>

          <View style={styles.dato}>
            <Ionicons
              name="location-outline"
              size={19}
              color="#667085"
            />
            <View style={styles.datoContenido}>
              <Text style={styles.etiqueta}>Dirección</Text>
              <Text style={styles.valor}>
                {reporte.direccion || 'Ubicación no disponible'}
              </Text>
            </View>
          </View>

          <View style={styles.dato}>
            <Ionicons
              name="navigate-outline"
              size={19}
              color="#667085"
            />
            <View style={styles.datoContenido}>
              <Text style={styles.etiqueta}>Coordenadas</Text>
              <Text style={styles.valor}>
                {reporte.coordenadas.latitud},{' '}
                {reporte.coordenadas.longitud}
              </Text>
            </View>
          </View>

          <View style={styles.dato}>
            <Ionicons
              name="people-outline"
              size={19}
              color="#667085"
            />
            <View style={styles.datoContenido}>
              <Text style={styles.etiqueta}>Adhesiones</Text>
              <Text style={styles.valor}>{reporte.adhesiones}</Text>
            </View>
          </View>
        </View>

        {fotosProblema.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>
              Fotos del problema
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {fotosProblema.map((foto) => (
                <Image
                  key={foto.id}
                  source={{ uri: foto.url }}
                  style={styles.foto}
                  resizeMode="cover"
                  accessibilityLabel="Foto del problema reportado"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {fotosArreglo.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>
              Fotos del arreglo
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {fotosArreglo.map((foto) => (
                <Image
                  key={foto.id}
                  source={{ uri: foto.url }}
                  style={styles.foto}
                  resizeMode="cover"
                  accessibilityLabel="Foto del arreglo"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {reporte.audioUrl && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Audio adjunto</Text>

            <View style={styles.dato}>
              <Ionicons
                name="musical-notes-outline"
                size={22}
                color={ColorPrimario}
              />
              <Text style={styles.textoAuxiliar}>
                Este reporte tiene un audio adjunto.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>
            Seguimiento del reporte
          </Text>

          {historialOrdenado.length === 0 ? (
            <View style={styles.historialVacio}>
              <Ionicons
                name="time-outline"
                size={24}
                color="#667085"
              />
              <Text style={styles.textoAuxiliar}>
                Estado actual: {estado.titulo}. Todavía no hay cambios de
                estado para mostrar.
              </Text>
            </View>
          ) : (
            historialOrdenado.map((cambio) => {
              const estadoCambio = ESTADOS[cambio.estado];

              return (
                <View key={cambio.id} style={styles.evento}>
                  <View style={styles.columnaEvento}>
                    <View style={styles.puntoEvento} />
                    <View style={styles.lineaEvento} />
                  </View>

                  <View style={styles.eventoContenido}>
                    <Text style={styles.valor}>
                      {estadoCambio?.titulo ?? cambio.estado}
                    </Text>

                    <Text style={styles.textoFecha}>
                      {fechaLegible(cambio.fechaHora)}
                    </Text>

                    {cambio.comentario && (
                      <Text style={styles.comentario}>
                        {cambio.comentario}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.pie}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#667085"
          />
          <Text style={styles.textoPie}>
            Guardá el código {reporte.codigo} para identificar tu reporte.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  contenido: {
    paddingHorizontal: 16,
    gap: 16,
  },
  centrado: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tarjetaPrincipal: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
    gap: 18,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  codigo: {
    color: '#667085',
    fontSize: 13,
    fontWeight: '600',
  },
  etiquetaEstado: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  textoEstado: {
    fontSize: 12,
    fontWeight: '700',
  },
  titulo: {
    fontSize: 21,
    lineHeight: 29,
    fontWeight: '700',
    color: '#20252B',
  },
  dato: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  datoContenido: {
    flex: 1,
    gap: 3,
  },
  etiqueta: {
    color: '#667085',
    fontSize: 12,
  },
  valor: {
    color: '#20252B',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  },
  seccion: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
    gap: 12,
  },
  tituloSeccion: {
    fontSize: 17,
    fontWeight: '700',
    color: '#20252B',
  },
  foto: {
    width: 220,
    height: 180,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#E9EDF2',
  },
  historialVacio: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  evento: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
  },
  columnaEvento: {
    alignItems: 'center',
    width: 12,
  },
  puntoEvento: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ColorPrimario,
    marginTop: 5,
  },
  lineaEvento: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#DCE5EE',
    marginTop: 4,
  },
  eventoContenido: {
    flex: 1,
    gap: 5,
    paddingBottom: 18,
  },
  textoFecha: {
    color: '#667085',
    fontSize: 12,
    lineHeight: 18,
  },
  comentario: {
    color: '#475467',
    fontSize: 14,
    lineHeight: 20,
  },
  textoAuxiliar: {
    color: '#667085',
    fontSize: 14,
    lineHeight: 21,
  },
  tituloError: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#20252B',
    textAlign: 'center',
  },
  botonReintentar: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: ColorPrimario,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  textoPie: {
    flex: 1,
    textAlign: 'center',
    color: '#667085',
    fontSize: 12,
    lineHeight: 18,
  },
});

