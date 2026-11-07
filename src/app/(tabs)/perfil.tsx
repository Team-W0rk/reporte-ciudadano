import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPrimario } from '@/constants/dominio';
import EditarPerfilModal from '@/components/perfil/EditarPerfilModal';
import { actualizarPerfil } from '@/services/perfil';
import { useAuth } from '@/hooks/auth/useAuth';
import { consultarBiometria } from '@/services/biometria';

const COLORES = {
  fondo: '#F4F7FB',
  tarjeta: '#FFFFFF',
  texto: '#172B4D',
  secundario: '#667085',
  borde: '#E9EDF2',
  verde: '#16A34A',
  rojo: '#DC2626',
};

const ROLES: Record<string, string> = {
  vecino: 'Vecino/a',
  operador: 'Operador/a municipal',
  admin: 'Administrador/a',
};

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const {
    usuario,
    token,
    cerrarSesion,
    biometriaHabilitada,
    habilitarBiometria,
    deshabilitarBiometria,
    actualizarUsuario,
  } = useAuth();
  const [avisosActivos, setAvisosActivos] = useState(
    usuario?.avisosActivos ?? false,
  );
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [cambiandoBiometria, setCambiandoBiometria] = useState(false);
  const [editando, setEditando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAvisosActivos(usuario?.avisosActivos ?? false);
    }, [usuario?.avisosActivos]),
  );

  const cambiarBiometria = async (activar: boolean) => {
    if (cambiandoBiometria) return;

    setCambiandoBiometria(true);

    try {
      if (activar) {
        const disponibilidad = await consultarBiometria();

        if (!disponibilidad.disponible) {
          Alert.alert(
            'Biometría no disponible',
            'Tu dispositivo no tiene biometría configurada o no cuenta con el hardware necesario. Configurá la huella o el reconocimiento facial en los ajustes del teléfono e intentá nuevamente.',
          );
          return;
        }

        await habilitarBiometria();

        Alert.alert(
          'Acceso biométrico activado',
          'La próxima vez que abras la aplicación podrás desbloquear tu sesión con la biometría del dispositivo.',
        );
      } else {
        await deshabilitarBiometria();

        Alert.alert(
          'Acceso biométrico desactivado',
          'Vas a poder seguir ingresando con tu sesión habitual.',
        );
      }
    } catch (error) {
      Alert.alert(
        'No se pudo cambiar la configuración',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado. Intentá nuevamente.',
      );
    } finally {
      setCambiandoBiometria(false);
    }
  };

  const confirmarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás segura de que querés cerrar tu sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              setCerrandoSesion(true);
              await cerrarSesion();
              router.replace('/(auth)/login');
            } catch {
              Alert.alert(
                'Error',
                'No se pudo cerrar la sesión. Intentá nuevamente.',
              );
            } finally {
              setCerrandoSesion(false);
            }
          },
        },
      ],
    );
  };

  const cambiarAvisos = async (valor: boolean) => {
    if (!usuario || !token) return;

    const valorAnterior = avisosActivos;
    setAvisosActivos(valor);

    try {
      const actualizado = await actualizarPerfil(token, {
        avisosActivos: valor,
      });
      await actualizarUsuario(actualizado);
    } catch {
      setAvisosActivos(valorAnterior);

      Alert.alert(
        'No se pudo actualizar',
        'No pudimos guardar tu preferencia de avisos. Verificá la conexión e intentá nuevamente.',
      );
    }
  };

  if (!usuario) {
    return (
      <View style={styles.centrado}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={ColorPrimario} />
        <Text style={styles.textoCarga}>Cargando perfil...</Text>
      </View>
    );
  }

  const iniciales = usuario.nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');

  const fechaRegistro = new Date(usuario.creadoEn).toLocaleDateString(
    'es-AR',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  );

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contenido,
          {
            paddingTop: Math.max(insets.top, 16) + 8,
            paddingBottom: Math.max(insets.bottom, 20) + 24,
          },
        ]}
      >
        {/* Encabezado */}
        <View style={styles.encabezado}>
          <View>
            <Text style={styles.sobreTitulo}>REPORTE CIUDADANO</Text>
            <Text style={styles.titulo}>Mi perfil</Text>
            <Text style={styles.subtitulo}>
              Tu información y preferencias
            </Text>
          </View>

          <View style={styles.iconoEncabezado}>
            <Ionicons
              name="person-outline"
              size={25}
              color={ColorPrimario}
            />
          </View>
        </View>

        {/* Tarjeta de usuario */}
        <View style={styles.tarjetaUsuario}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>
              {iniciales || 'U'}
            </Text>
          </View>

          <Text style={styles.nombre}>{usuario.nombre}</Text>
          <Text style={styles.email}>{usuario.email}</Text>

          <View style={styles.etiquetaRol}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={ColorPrimario}
            />
            <Text style={styles.etiquetaRolTexto}>
              {ROLES[usuario.rol] ?? usuario.rol}
            </Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.datoFila}>
            <View style={styles.iconoDato}>
              <Ionicons
                name="calendar-outline"
                size={19}
                color={COLORES.secundario}
              />
            </View>

            <View style={styles.datoContenido}>
              <Text style={styles.datoEtiqueta}>Miembro desde</Text>
              <Text style={styles.datoValor}>{fechaRegistro}</Text>
            </View>
          </View>
        </View>

        {/* Información personal */}
        <Text style={styles.seccionTitulo}>Información personal</Text>

        <View style={styles.tarjeta}>
          <View style={styles.datoFila}>
            <View style={styles.iconoDato}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={ColorPrimario}
              />
            </View>

            <View style={styles.datoContenido}>
              <Text style={styles.datoEtiqueta}>
                Correo electrónico
              </Text>
              <Text style={styles.datoValor}>{usuario.email}</Text>
            </View>
          </View>

          {usuario.telefono ? (
            <>
              <View style={styles.divisor} />

              <View style={styles.datoFila}>
                <View style={styles.iconoDato}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={ColorPrimario}
                  />
                </View>

                <View style={styles.datoContenido}>
                  <Text style={styles.datoEtiqueta}>Teléfono</Text>
                  <Text style={styles.datoValor}>
                    {usuario.telefono}
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          <View style={styles.divisor} />

          <View style={styles.datoFila}>
            <View style={styles.iconoDato}>
              <Ionicons
                name="location-outline"
                size={20}
                color={ColorPrimario}
              />
            </View>

            <View style={styles.datoContenido}>
              <Text style={styles.datoEtiqueta}>Zona asignada</Text>
              <Text style={styles.datoValor}>
                {usuario.zonaId ?? 'Sin zona asignada'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.opcion}
          onPress={() => setEditando(true)}
        >
          <View style={styles.opcionIcono}>
            <Ionicons
              name="create-outline"
              size={22}
              color={ColorPrimario}
            />
          </View>

          <View style={styles.opcionContenido}>
            <Text style={styles.opcionTitulo}>Editar mis datos</Text>
            <Text style={styles.opcionDescripcion}>
              Cambiá tu nombre o tu teléfono
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORES.secundario}
          />
        </TouchableOpacity>

        {/* Accesos rápidos */}
        <Text style={styles.seccionTitulo}>Mi actividad</Text>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.opcion}
          onPress={() => router.push('/(tabs)/mis-reportes')}
        >
          <View style={styles.opcionIcono}>
            <Ionicons
              name="document-text-outline"
              size={22}
              color={ColorPrimario}
            />
          </View>

          <View style={styles.opcionContenido}>
            <Text style={styles.opcionTitulo}>Mis reportes</Text>
            <Text style={styles.opcionDescripcion}>
              Consultá el estado de tus reportes ciudadanos
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={COLORES.secundario}
          />
        </TouchableOpacity>

        {/* Preferencias */}
        <Text style={styles.seccionTitulo}>Preferencias</Text>

        <View style={styles.opcion}>
          <View style={styles.opcionIcono}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={ColorPrimario}
            />
          </View>

          <View style={styles.opcionContenido}>
            <Text style={styles.opcionTitulo}>Avisos</Text>
            <Text style={styles.opcionDescripcion}>
              Recibir notificaciones sobre tus reportes
            </Text>
          </View>

          <Switch
            value={avisosActivos}
            onValueChange={cambiarAvisos}
            trackColor={{
              false: '#D0D5DD',
              true: `${ColorPrimario}99`,
            }}
            thumbColor={
              avisosActivos ? ColorPrimario : '#F9FAFB'
            }
            accessibilityLabel="Activar o desactivar avisos"
          />
        </View>

        {/* Seguridad biométrica */}
        <Text style={styles.seccionTitulo}>Seguridad</Text>

        <View style={styles.opcion}>
          <View style={styles.opcionIcono}>
            <Ionicons
              name="finger-print-outline"
              size={24}
              color={ColorPrimario}
            />
          </View>

          <View style={styles.opcionContenido}>
            <Text style={styles.opcionTitulo}>
              Acceso biométrico
            </Text>

            <Text style={styles.opcionDescripcion}>
              {cambiandoBiometria
                ? 'Actualizando configuración...'
                : biometriaHabilitada
                  ? 'Huella o reconocimiento facial habilitado'
                  : 'Ingresá con la biometría de tu dispositivo'}
            </Text>

            {biometriaHabilitada && !cambiandoBiometria ? (
              <View style={styles.estadoBiometria}>
                <View style={styles.puntoVerde} />
                <Text style={styles.estadoBiometriaTexto}>
                  Protección activada
                </Text>
              </View>
            ) : null}
          </View>

          {cambiandoBiometria ? (
            <ActivityIndicator color={ColorPrimario} />
          ) : (
            <Switch
              value={biometriaHabilitada}
              onValueChange={cambiarBiometria}
              disabled={cambiandoBiometria}
              trackColor={{
                false: '#D0D5DD',
                true: `${ColorPrimario}99`,
              }}
              thumbColor={
                biometriaHabilitada
                  ? ColorPrimario
                  : '#F9FAFB'
              }
              accessibilityLabel="Activar o desactivar el acceso biométrico"
            />
          )}
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.botonCerrarSesion}
          onPress={confirmarCerrarSesion}
          disabled={cerrandoSesion}
        >
          {cerrandoSesion ? (
            <ActivityIndicator color={COLORES.rojo} />
          ) : (
            <Ionicons
              name="log-out-outline"
              size={21}
              color={COLORES.rojo}
            />
          )}

          <Text style={styles.textoCerrarSesion}>
            {cerrandoSesion
              ? 'Cerrando sesión...'
              : 'Cerrar sesión'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.pie}>
          Reporte Ciudadano · Tu ciudad, más cerca
        </Text>
      </ScrollView>

      {token && (
        <EditarPerfilModal
          visible={editando}
          usuario={usuario}
          token={token}
          onCerrar={() => setEditando(false)}
          onGuardado={actualizarUsuario}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    paddingHorizontal: 20,
    gap: 16,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.fondo,
  },
  textoCarga: {
    color: COLORES.secundario,
    marginTop: 12,
    fontSize: 14,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sobreTitulo: {
    color: ColorPrimario,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  titulo: {
    color: COLORES.texto,
    fontSize: 29,
    fontWeight: '800',
  },
  subtitulo: {
    color: COLORES.secundario,
    fontSize: 14,
    marginTop: 4,
  },
  iconoEncabezado: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E8F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarjetaUsuario: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#DCEEFF',
    borderWidth: 3,
    borderColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarTexto: {
    color: ColorPrimario,
    fontSize: 27,
    fontWeight: '800',
  },
  nombre: {
    color: COLORES.texto,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  email: {
    color: COLORES.secundario,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  etiquetaRol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F3FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
    marginTop: 14,
  },
  etiquetaRolTexto: {
    color: ColorPrimario,
    fontSize: 12,
    fontWeight: '700',
  },
  divisor: {
    height: 1,
    backgroundColor: COLORES.borde,
    alignSelf: 'stretch',
    marginVertical: 15,
  },
  seccionTitulo: {
    color: COLORES.texto,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 5,
  },
  tarjeta: {
    backgroundColor: COLORES.tarjeta,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  datoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  iconoDato: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datoContenido: {
    flex: 1,
    gap: 4,
  },
  datoEtiqueta: {
    color: COLORES.secundario,
    fontSize: 12,
  },
  datoValor: {
    color: COLORES.texto,
    fontSize: 14,
    fontWeight: '600',
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 16,
    borderRadius: 18,
    backgroundColor: COLORES.tarjeta,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  opcionIcono: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcionContenido: {
    flex: 1,
    gap: 5,
  },
  opcionTitulo: {
    color: COLORES.texto,
    fontSize: 15,
    fontWeight: '700',
  },
  opcionDescripcion: {
    color: COLORES.secundario,
    fontSize: 12,
    lineHeight: 18,
  },
  estadoBiometria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  puntoVerde: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORES.verde,
  },
  estadoBiometriaTexto: {
    color: COLORES.verde,
    fontSize: 11,
    fontWeight: '700',
  },
  botonCerrarSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#FFF1F0',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 8,
  },
  textoCerrarSesion: {
    color: COLORES.rojo,
    fontSize: 15,
    fontWeight: '700',
  },
  pie: {
    textAlign: 'center',
    color: '#98A2B3',
    fontSize: 11,
    marginTop: 4,
  },
});
