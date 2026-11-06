import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/auth/useAuth';

export default function PerfilOperador() {
  const { usuario, cerrarSesion } = useAuth();
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  async function handleCerrarSesion() {
    try {
      setCerrandoSesion(true);
      await cerrarSesion();
      // ProtectorNavegacion redirige al login al desaparecer la sesión.
    } catch {
      Alert.alert(
        'No se pudo cerrar la sesión',
        'Intentá nuevamente.',
      );
      setCerrandoSesion(false);
    }
  }

  function confirmarCerrarSesion() {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que querés cerrar tu sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => void handleCerrarSesion(),
        },
      ],
    );
  }

  const fechaRegistro = usuario?.creadoEn
    ? new Date(usuario.creadoEn).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'No disponible';

  return (
    <View style={styles.pantalla}>
      <View style={styles.encabezado}>
        <Pressable
          onPress={() => router.back()}
          style={styles.botonVolver}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Ionicons
            name="arrow-back-outline"
            size={23}
            color="#0F172A"
          />
        </Pressable>

        <Text style={styles.tituloEncabezado}>Mi perfil</Text>

        <View style={styles.espaciador} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.presentacion}>
          <View style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={42}
              color="#0284C7"
            />
          </View>

          <Text style={styles.nombre}>
            {usuario?.nombre ?? 'Usuario'}
          </Text>

          <View style={styles.etiquetaRol}>
            <Text style={styles.textoRol}>Operador municipal</Text>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>
            Información de la cuenta
          </Text>

          <View style={styles.tarjeta}>
            <FilaInformacion
              icono="person-outline"
              etiqueta="Nombre"
              valor={usuario?.nombre ?? 'No disponible'}
            />

            <Separador />

            <FilaInformacion
              icono="mail-outline"
              etiqueta="Correo electrónico"
              valor={usuario?.email ?? 'No disponible'}
            />

            <Separador />

            <FilaInformacion
              icono="call-outline"
              etiqueta="Teléfono"
              valor={usuario?.telefono || 'No informado'}
            />

            <Separador />

            <FilaInformacion
              icono="location-outline"
              etiqueta="Zona asignada"
              valor={usuario?.zonaId ?? 'Sin zona asignada'}
            />

            <Separador />

            <FilaInformacion
              icono="calendar-outline"
              etiqueta="Miembro desde"
              valor={fechaRegistro}
            />
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Seguridad</Text>

          <Pressable
            style={styles.opcion}
            onPress={() => {
              Alert.alert(
                'Seguridad',
                'La configuración biométrica se administra desde las opciones de inicio de sesión.',
              );
            }}
          >
            <View style={styles.iconoOpcion}>
              <Ionicons
                name="finger-print-outline"
                size={21}
                color="#0284C7"
              />
            </View>

            <View style={styles.textoOpcion}>
              <Text style={styles.tituloOpcion}>
                Seguridad y biometría
              </Text>

              <Text style={styles.descripcionOpcion}>
                Opciones de acceso a tu cuenta
              </Text>
            </View>

            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.botonCerrarSesion,
            pressed && styles.botonPresionado,
            cerrandoSesion && styles.botonDeshabilitado,
          ]}
          onPress={confirmarCerrarSesion}
          disabled={cerrandoSesion}
        >
          {cerrandoSesion ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#DC2626"
              />

              <Text style={styles.textoCerrarSesion}>
                Cerrar sesión
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.version}>
          Reporte Ciudadano · Operadores
        </Text>
      </ScrollView>
    </View>
  );
}

interface FilaInformacionProps {
  icono: keyof typeof Ionicons.glyphMap;
  etiqueta: string;
  valor: string;
}

function FilaInformacion({
  icono,
  etiqueta,
  valor,
}: FilaInformacionProps) {
  return (
    <View style={styles.fila}>
      <View style={styles.iconoFila}>
        <Ionicons
          name={icono}
          size={20}
          color="#64748B"
        />
      </View>

      <View style={styles.datosFila}>
        <Text style={styles.etiqueta}>{etiqueta}</Text>
        <Text style={styles.valor}>{valor}</Text>
      </View>
    </View>
  );
}

function Separador() {
  return <View style={styles.separador} />;
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  encabezado: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  botonVolver: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  tituloEncabezado: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },
  espaciador: {
    width: 40,
  },
  contenido: {
    padding: 20,
    paddingBottom: 36,
  },
  presentacion: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  nombre: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  etiquetaRol: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 9,
  },
  textoRol: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '600',
  },
  seccion: {
    marginTop: 18,
  },
  tituloSeccion: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 12,
  },
  iconoFila: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datosFila: {
    flex: 1,
    gap: 4,
  },
  etiqueta: {
    color: '#64748B',
    fontSize: 12,
  },
  valor: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  separador: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  iconoOpcion: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoOpcion: {
    flex: 1,
    gap: 4,
  },
  tituloOpcion: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
  },
  descripcionOpcion: {
    color: '#64748B',
    fontSize: 12,
  },
  botonCerrarSesion: {
    minHeight: 54,
    marginTop: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  textoCerrarSesion: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },
  botonPresionado: {
    opacity: 0.7,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  version: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
  },
});
