import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';

export default function RegistroScreen() {
  const { registrarse } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleRegistro() {
    if (!nombre.trim() || !email.trim() || !contrasena) {
      Alert.alert('Datos incompletos', 'Completá los campos obligatorios.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Email inválido', 'Revisá la dirección de correo.');
      return;
    }

    if (contrasena.length < 8) {
      Alert.alert(
        'Contraseña insegura',
        'Usá al menos 8 caracteres.',
      );
      return;
    }

    if (contrasena !== confirmacion) {
      Alert.alert('Las contraseñas no coinciden', 'Verificá ambas contraseñas.');
      return;
    }

    try {
      setEnviando(true);

      await registrarse({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        contrasena,
        ...(telefono.trim() ? { telefono: telefono.trim() } : {}),
      });

      router.replace('/(tabs)/mapa');
    } catch (error) {
      Alert.alert(
        'No se pudo crear la cuenta',
        error instanceof Error ? error.message : 'Intentá nuevamente.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.tarjeta}>
          <Text style={styles.etiqueta}>REPORTE CIUDADANO</Text>
          <Text style={styles.titulo}>Creá tu cuenta</Text>
          <Text style={styles.subtitulo}>
            Sumate para informar problemas y mejorar tu ciudad.
          </Text>
          <Text style={styles.label}>Nombre completo *</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
            autoCapitalize="words"
            editable={!enviando}
          />
          <Text style={styles.label}>Correo electrónico *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!enviando}
          />
          <Text style={styles.label}>Teléfono (opcional)</Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Tu teléfono"
            keyboardType="phone-pad"
            editable={!enviando}
          />
          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            style={styles.input}
            value={contrasena}
            onChangeText={setContrasena}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            autoCapitalize="none"
            editable={!enviando}
          />
          <Text style={styles.label}>Confirmar contraseña *</Text>
          <TextInput
            style={styles.input}
            value={confirmacion}
            onChangeText={setConfirmacion}
            placeholder="Repetí la contraseña"
            secureTextEntry
            autoCapitalize="none"
            editable={!enviando}
            onSubmitEditing={handleRegistro}
          />
          <Pressable
            style={[styles.boton, enviando && styles.deshabilitado]}
            onPress={handleRegistro}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBoton}>Crear cuenta</Text>
            )}
          </Pressable>
          <View style={styles.pie}>
            <Text style={styles.textoPie}>¿Ya tenés una cuenta? </Text>
            <Link href="/(auth)/login" style={styles.enlace}>
              Iniciá sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    gap: 10,
  },
  etiqueta: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  titulo: {
    color: '#172033',
    fontSize: 29,
    fontWeight: '800',
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
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
    marginBottom: 7,
  },
  boton: {
    backgroundColor: '#0284C7',
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  deshabilitado: {
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

