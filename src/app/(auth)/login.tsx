import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';

export default function IngresoScreen() {
  const {
    ingresar,
    ingresarConBiometria,
    requiereBiometria,
    biometriaHabilitada,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [autenticandoBiometria, setAutenticandoBiometria] =
    useState(false);

  async function handleIngresar() {
    if (!email.trim() || !contrasena) {
      Alert.alert(
        'Datos incompletos',
        'Ingresá tu email y contraseña.',
      );
      return;
    }

    try {
      setEnviando(true);

      await ingresar({
        email: email.trim().toLowerCase(),
        contrasena,
      });

      router.replace('/');
    } catch (error) {
      Alert.alert(
        'No se pudo iniciar sesión',
        error instanceof Error
          ? error.message
          : 'Intentá nuevamente.',
      );
    } finally {
      setEnviando(false);
    }
  }

  async function handleIngresarConBiometria() {
    try {
      setAutenticandoBiometria(true);

      await ingresarConBiometria();

      router.replace('/');
    } catch (error) {
      Alert.alert(
        'No se pudo validar tu identidad',
        error instanceof Error
          ? error.message
          : 'Podés ingresar con tu email y contraseña.',
      );
    } finally {
      setAutenticandoBiometria(false);
    }
  }

  const ocupado = enviando || autenticandoBiometria;

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.tarjeta}>
        <View style={styles.iconoPrincipal}>
          <Ionicons
            name="location"
            size={30}
            color="#0284C7"
          />
        </View>
        <Text style={styles.etiqueta}>REPORTE CIUDADANO</Text>
        <Text style={styles.titulo}>¡Hola de nuevo!</Text>
        <Text style={styles.subtitulo}>
          Ingresá para seguir tus reportes y contribuir con tu ciudad.
        </Text>
        {biometriaHabilitada && (
          <View style={styles.seccionBiometria}>
            <Pressable
              style={[
                styles.botonBiometria,
                ocupado && styles.botonDeshabilitado,
              ]}
              onPress={handleIngresarConBiometria}
              disabled={ocupado}
            >
              {autenticandoBiometria ? (
                <ActivityIndicator color="#0284C7" />
              ) : (
                <Ionicons
                  name="finger-print"
                  size={27}
                  color="#0284C7"
                />
              )}
              <Text style={styles.textoBotonBiometria}>
                {autenticandoBiometria
                  ? 'Verificando identidad...'
                  : 'Ingresar con huella o rostro'}
              </Text>
            </Pressable>
            <Text style={styles.textoAlternativa}>
              O ingresá con tus credenciales
            </Text>
          </View>
        )}
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!ocupado}
          returnKeyType="next"
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={contrasena}
          onChangeText={setContrasena}
          placeholder="Tu contraseña"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          autoCapitalize="none"
          editable={!ocupado}
          onSubmitEditing={handleIngresar}
          returnKeyType="go"
        />
        <Pressable
          style={[ styles.boton, ocupado && styles.botonDeshabilitado ]}
          onPress={handleIngresar}
          disabled={ocupado}
        >
          {enviando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBoton}>Ingresar</Text>
          )}
        </Pressable>
        {!requiereBiometria && (
          <View style={styles.pie}>
            <Text style={styles.textoPie}>
              ¿Todavía no tenés una cuenta?{' '}
            </Text>
            <Link href="/(auth)/registro" style={styles.enlace}>
              Registrate
            </Link>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F4F7FB',
    padding: 24,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  iconoPrincipal: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#E8F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  etiqueta: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  titulo: {
    color: '#172033',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  seccionBiometria: {
    gap: 14,
    marginBottom: 8,
  },
  botonBiometria: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  textoBotonBiometria: {
    color: '#0369A1',
    fontSize: 14,
    fontWeight: '700',
  },
  textoAlternativa: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 13,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#DCE4EE',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#172033',
    marginBottom: 8,
  },
  boton: {
    backgroundColor: '#0284C7',
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.65,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  textoPie: {
    color: '#64748B',
    fontSize: 14,
  },
  enlace: {
    color: '#0284C7',
    fontWeight: '700',
  },
});
