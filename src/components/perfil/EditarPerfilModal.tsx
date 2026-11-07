import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ColorBorde, ColorPrimario } from '@/constants/dominio';
import { obtenerMensajeError } from '@/services/errores';
import { actualizarPerfil, type CambiosPerfil } from '@/services/perfil';
import type { Usuario } from '@/types';

interface EditarPerfilModalProps {
  visible: boolean;
  usuario: Usuario;
  token: string;
  onCerrar: () => void;
  onGuardado: (usuario: Usuario) => void | Promise<void>;
}

export default function EditarPerfilModal({
  visible,
  usuario,
  token,
  onCerrar,
  onGuardado,
}: EditarPerfilModalProps) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [telefono, setTelefono] = useState(usuario.telefono ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cada vez que se abre, arranca con los datos actuales.
  useEffect(() => {
    if (visible) {
      setNombre(usuario.nombre);
      setTelefono(usuario.telefono ?? '');
      setError(null);
    }
  }, [visible, usuario.nombre, usuario.telefono]);

  const guardar = async () => {
    const nombreLimpio = nombre.trim();
    const telefonoLimpio = telefono.trim();

    if (nombreLimpio.length < 2) {
      setError('Escribí tu nombre y apellido.');
      return;
    }

    // Solo se manda lo que cambió.
    const cambios: CambiosPerfil = {};
    if (nombreLimpio !== usuario.nombre) cambios.nombre = nombreLimpio;
    if (telefonoLimpio && telefonoLimpio !== (usuario.telefono ?? '')) {
      cambios.telefono = telefonoLimpio;
    }

    if (Object.keys(cambios).length === 0) {
      onCerrar();
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const actualizado = await actualizarPerfil(token, cambios);
      await onGuardado(actualizado);
      onCerrar();
    } catch (e) {
      setError(obtenerMensajeError(e));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCerrar}>
      <KeyboardAvoidingView
        style={styles.pantalla}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Editar mis datos</Text>

          <Text style={styles.label}>Nombre y apellido</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            maxLength={100}
            accessibilityLabel="Nombre y apellido"
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            placeholder="Ej.: 3446 412233"
            placeholderTextColor="#98A2B3"
            maxLength={30}
            accessibilityLabel="Teléfono"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <View style={[styles.input, styles.inputBloqueado]}>
            <Text style={styles.textoBloqueado}>{usuario.email}</Text>
          </View>
          <Text style={styles.ayuda}>
            El correo no se puede cambiar.
          </Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            accessibilityRole="button"
            onPress={() => void guardar()}
            disabled={guardando}
            style={({ pressed }) => [
              styles.botonGuardar,
              (guardando || pressed) && styles.botonApagado,
            ]}
          >
            {guardando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoGuardar}>Guardar cambios</Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onCerrar}
            disabled={guardando}
            style={styles.botonCancelar}
          >
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#F4F7FB' },
  contenido: { padding: 20, paddingTop: 56, gap: 10 },
  titulo: { fontSize: 26, fontWeight: '800', color: '#172B4D', marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '600', color: '#344054', marginTop: 8 },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: ColorBorde,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: '#20252B',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  inputBloqueado: { backgroundColor: '#EEF1F5' },
  textoBloqueado: { fontSize: 18, color: '#667085' },
  ayuda: { fontSize: 15, color: '#667085' },
  error: { fontSize: 16, color: '#B42318', fontWeight: '600', marginTop: 6 },
  botonGuardar: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: ColorPrimario,
    marginTop: 16,
  },
  botonApagado: { opacity: 0.6 },
  textoGuardar: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  botonCancelar: { alignItems: 'center', paddingVertical: 14 },
  textoCancelar: { color: '#475467', fontSize: 17, fontWeight: '600' },
});