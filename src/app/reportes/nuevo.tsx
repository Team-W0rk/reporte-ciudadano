import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorBorde, ColorPrimario } from '@/constants/dominio';
import AdjuntoFoto from '@/components/reportes/nuevo/AdjuntoFoto';
import NotaVoz from '@/components/reportes/nuevo/NotaVoz';
import ReportesCercanos from '@/components/reportes/nuevo/ReportesCercanos';
import SelectorTipoReporte from '@/components/reportes/nuevo/SelectorTipoReporte';
import UbicacionReporte from '@/components/reportes/nuevo/UbicacionReporte';
import useAdjuntoFoto from '@/hooks/reportes/useAdjuntoFoto';
import useNotaVoz from '@/hooks/reportes/useNotaVoz';
import useNuevoReporte from '@/hooks/reportes/useNuevoReporte';
import useUbicacionReporte from '@/hooks/reportes/useUbicacionReporte';

export default function NuevoReporteScreen() {
  const insets = useSafeAreaInsets();
  const ubicacion = useUbicacionReporte();
  const reporte = useNuevoReporte(ubicacion.coordenadas);
  const foto = useAdjuntoFoto();
  const audio = useNotaVoz();
  const red = Network.useNetworkState();
  const sinConexion = red.isConnected === false;
  // El mapa de la ubicación necesita el gesto de arrastre: se frena el scroll mientras se lo toca.
  const [scrollHabilitado, setScrollHabilitado] = useState(true);
  const enviarReporte = () => {
    void reporte.enviar({
      fotoUri: foto.fotoUri,
      fotoExtraUri: foto.fotoExtraUri,
      audioUri: audio.audioUri,
      direccion: ubicacion.direccion,
    });
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    void NavigationBar.setBackgroundColorAsync('#F4F7FB');
    void NavigationBar.setButtonStyleAsync('dark');
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Nuevo reporte',
          headerShown: true,
          headerBackTitle: 'Volver',
          headerStyle: {
            backgroundColor: ColorPrimario,
          },
          headerTitleStyle: {
            color: '#FFFFFF',
            fontWeight: '700',
          },
          headerTintColor: '#FFFFFF',
        }}
      />
      <KeyboardAvoidingView
        style={styles.pantalla}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.contenedor,
            { paddingBottom: Math.max(insets.bottom, 24) + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollHabilitado}
        >
          <View style={styles.encabezado}>
           <View style={styles.iconoEncabezado}>
              <View style={styles.iconoTexto}>
                <Text style={styles.emoji}>📍</Text>
              </View>
              <Text style={styles.titulo}>Reportar un problema</Text>
            </View>
            <Text style={styles.subtitulo}>
              Ayudanos a mejorar la ciudad. Completá los datos para que
              podamos identificar y resolver el inconveniente.
            </Text>
          </View>
          {sinConexion && (
            <View style={styles.avisoSinConexion}>
              <Text style={styles.textoAvisoSinConexion}>
                Sin señal. Podés completar el reporte igual: se guarda en tu
                teléfono y se envía solo cuando vuelva la conexión.
              </Text>
            </View>
          )}
          <View style={styles.tarjeta}>
            <SelectorTipoReporte
              tipos={reporte.tipos}
              tipoSeleccionado={reporte.tipoId}
              onSeleccionar={reporte.setTipoId}
            />
            {reporte.cargandoTipos && (
              <View style={styles.cargando}>
                <ActivityIndicator color={ColorPrimario} />
                <Text style={styles.textoCargando}>
                  Cargando categorías…
                </Text>
              </View>
            )}
            {reporte.errorTipos && reporte.tipos.length === 0 && (
              <View style={styles.cargando}>
                <Text style={styles.textoCargando}>
                  Todavía no descargamos las categorías. Hace falta conectarse a
                  internet una vez para guardarlas; después funcionan sin señal.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void reporte.recargarTipos()}
                  style={styles.botonReintentar}
                >
                  <Text style={styles.textoReintentar}>Reintentar</Text>
                </Pressable>
              </View>
            )}
          </View>
          <View style={styles.tarjeta}>
            <AdjuntoFoto
              fotoUri={foto.fotoUri}
              fotoExtraUri={foto.fotoExtraUri}
              onSacarFoto={() => void foto.sacarFoto()}
              onSacarFotoExtra={() => void foto.sacarFotoExtra()}
              onQuitarFotoExtra={foto.quitarFotoExtra}
            />
          </View>
          <View style={styles.tarjeta}>
            <UbicacionReporte
              coordenadas={ubicacion.coordenadas}
              direccion={ubicacion.direccion}
              ubicacionDenegada={ubicacion.ubicacionDenegada}
              cargandoUbicacion={ubicacion.cargandoUbicacion}
              regionInicial={ubicacion.regionInicial}
              modoManual={ubicacion.modoManual}
              onCambiarDireccion={ubicacion.setDireccion}
              onElegirPunto={ubicacion.elegirPunto}
              onReintentar={() => void ubicacion.obtenerUbicacion()}
              onBloquearScroll={(bloquear) => setScrollHabilitado(!bloquear)}
            />
          </View>
          <View style={styles.tarjeta}>
            <Text style={styles.tituloSeccion}>
              Contanos qué sucede
            </Text>
            <Text style={styles.descripcionSeccion}>
              Agregá detalles que puedan ayudar a resolver el problema.
            </Text>
            <TextInput
              style={styles.inputDescripcion}
              placeholder="Ej.: hay un bache grande en medio de la calle…"
              placeholderTextColor="#98A2B3"
              value={reporte.descripcion}
              onChangeText={reporte.setDescripcion}
              multiline
              textAlignVertical="top"
              maxLength={1000}
              accessibilityLabel="Descripción del problema"
            />
            <Text style={styles.contadorCaracteres}>
              {reporte.descripcion.length}/1000
            </Text>
          </View>
          <View style={styles.tarjeta}>
            <NotaVoz
              audioUri={audio.audioUri}
              grabando={audio.grabando}
              onEmpezar={() => void audio.empezarGrabacion()}
              onDetener={() => void audio.detenerGrabacion()}
              onEscuchar={audio.escucharAudio}
            />
          </View>
          <ReportesCercanos
            reportes={reporte.cercanos}
            visible={reporte.hayDuplicados}
            onSumarse={(item) => void reporte.sumarmeA(item)}
            onIgnorar={() => reporte.setIgnorarDuplicados(true)}
          />
          <View style={styles.notaObligatorios}>
            <Text style={styles.textoObligatorios}>
              * Campos obligatorios: categoría, foto y ubicación con dirección.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={enviarReporte}
            disabled={reporte.enviando || reporte.hayDuplicados}
            style={({ pressed }) => [
              styles.botonEnviar,
              (reporte.enviando || reporte.hayDuplicados) &&
                styles.botonDeshabilitado,
              pressed && styles.botonPresionado,
            ]}
          >
            {reporte.enviando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotonEnviar}>
                {sinConexion ? 'Guardar reporte' : 'Enviar reporte'}
              </Text>
            )}
          </Pressable>
          {reporte.hayDuplicados && (
            <Text style={styles.ayudaDuplicados}>
              Revisá los reportes cercanos antes de enviar uno nuevo.
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.botonCancelar}
          >
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  contenedor: {
    padding: 16,
    gap: 14,
  },
  encabezado: {
    gap: 10,
    paddingTop: 8,
    paddingBottom: 6,
  },
  iconoEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconoTexto: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#E5F1FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  titulo: {
    flex: 1,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    color: '#20252B',
  },
  subtitulo: {
    fontSize: 16,
    lineHeight: 24,
    color: '#667085',
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9EDF2',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  cargando: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  textoCargando: {
    flexShrink: 1,
    color: '#475467',
    fontSize: 16,
    lineHeight: 23,
  },
  avisoSinConexion: {
    backgroundColor: '#FFF4D6',
    borderRadius: 14,
    padding: 14,
  },
  textoAvisoSinConexion: {
    color: '#624A08',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
  },
  botonReintentar: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorPrimario,
  },
  textoReintentar: {
    color: ColorPrimario,
    fontSize: 16,
    fontWeight: '700',
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#20252B',
  },
  descripcionSeccion: {
    fontSize: 16,
    lineHeight: 23,
    color: '#667085',
  },
  inputDescripcion: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: ColorBorde,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#20252B',
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  contadorCaracteres: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#667085',
  },
  notaObligatorios: {
    paddingHorizontal: 4,
  },
  textoObligatorios: {
    fontSize: 15,
    lineHeight: 22,
    color: '#667085',
  },
  botonEnviar: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: ColorPrimario,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  textoBotonEnviar: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  ayudaDuplicados: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#8A6200',
  },
  botonCancelar: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  textoCancelar: {
    color: '#475467',
    fontSize: 16,
    fontWeight: '600',
  },
});
