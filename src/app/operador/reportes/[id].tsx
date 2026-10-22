import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ColorEstado, EtiquetaEstado } from '@/constants/dominio';
import { cuadrillasMock } from '@/mocks/zonas.mock';
import { operadorActualMock } from '@/mocks/usuarios.mock';
import {
  asignarCuadrilla,
  cambiarEstadoReporte,
  marcarComoDuplicado,
  obtenerReportePorId,
} from '@/servicios/reportes';
import { EstadoReporte, Reporte } from '@/tipos';

const ESTADOS: EstadoReporte[] = ['recibido', 'en_revision', 'asignado', 'resuelto', 'rechazado'];

export default function GestionarReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [estadoElegido, setEstadoElegido] = useState<EstadoReporte | null>(null);
  const [comentario, setComentario] = useState('');
  const [idDuplicado, setIdDuplicado] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    if (id) obtenerReportePorId(id).then(setReporte);
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (!reporte) return null;

  const cuadrillasDeLaZona = cuadrillasMock.filter((c) => c.zonaId === reporte.zonaId && c.activa);

  async function handleGuardarEstado() {
    if (!id || !estadoElegido) return;

    // El PRD es explícito: un "rechazado" sin motivo genera más enojo que
    // no contestar. Exigimos comentario para CUALQUIER cambio de estado,
    // no solo para el rechazo, así queda registrado siempre el por qué.
    if (!comentario.trim()) {
      Alert.alert('Falta el comentario', 'Contá brevemente por qué cambia el estado.');
      return;
    }

    setGuardando(true);
    await cambiarEstadoReporte(id, estadoElegido, comentario.trim(), operadorActualMock.id);
    setGuardando(false);
    setComentario('');
    setEstadoElegido(null);
    cargar();
  }

  async function handleAsignarCuadrilla(cuadrillaId: string) {
    if (!id) return;
    await asignarCuadrilla(id, cuadrillaId);
    cargar();
  }

  async function handleMarcarDuplicado() {
    if (!id || !idDuplicado.trim()) return;
    await marcarComoDuplicado(id, idDuplicado.trim());
    setIdDuplicado('');
    cargar();
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.direccion}>{reporte.direccion}</Text>
      <Text style={styles.descripcion}>{reporte.descripcion}</Text>
      <View style={[styles.chipEstadoActual, { backgroundColor: ColorEstado[reporte.estado] }]}>
        <Text style={styles.chipEstadoActualTexto}>
          Estado actual: {EtiquetaEstado[reporte.estado]}
        </Text>
      </View>
      {reporte.duplicadoDe && (
        <Text style={styles.avisoDuplicado}>Marcado como duplicado de {reporte.duplicadoDe}</Text>
      )}

      {/* --- Cambiar estado --- */}
      <Text style={styles.label}>Cambiar estado a</Text>
      <View style={styles.chips}>
        {ESTADOS.map((estado) => (
          <Pressable
            key={estado}
            style={[
              styles.chip,
              { borderColor: ColorEstado[estado] },
              estadoElegido === estado && { backgroundColor: ColorEstado[estado] },
            ]}
            onPress={() => setEstadoElegido(estado)}
          >
            <Text style={estadoElegido === estado ? styles.chipTextoActivo : { color: ColorEstado[estado] }}>
              {EtiquetaEstado[estado]}
            </Text>
          </Pressable>
        ))}
      </View>

      {estadoElegido && (
        <>
          <TextInput
            style={styles.textarea}
            placeholder="Comentario obligatorio: contá qué se verificó o por qué cambia"
            multiline
            value={comentario}
            onChangeText={setComentario}
          />
          <Pressable style={styles.boton} onPress={handleGuardarEstado} disabled={guardando}>
            <Text style={styles.botonTexto}>{guardando ? 'Guardando…' : 'Confirmar cambio de estado'}</Text>
          </Pressable>
        </>
      )}

      {/* --- Asignar cuadrilla --- */}
      <Text style={styles.label}>Asignar cuadrilla</Text>
      {cuadrillasDeLaZona.length === 0 ? (
        <Text style={{ color: '#888' }}>No hay cuadrillas activas en esta zona.</Text>
      ) : (
        <View style={styles.chips}>
          {cuadrillasDeLaZona.map((cuadrilla) => (
            <Pressable
              key={cuadrilla.id}
              style={[styles.chip, reporte.cuadrillaId === cuadrilla.id && styles.chipCuadrillaActiva]}
              onPress={() => handleAsignarCuadrilla(cuadrilla.id)}
            >
              <Text style={reporte.cuadrillaId === cuadrilla.id ? styles.chipTextoActivo : undefined}>
                {cuadrilla.nombre}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* --- Marcar como duplicado --- */}
      <Text style={styles.label}>Marcar como duplicado de otro reporte</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="ID del reporte original (ej: rep-00412)"
          value={idDuplicado}
          onChangeText={setIdDuplicado}
        />
        <Pressable style={styles.botonSecundario} onPress={handleMarcarDuplicado}>
          <Text style={styles.botonSecundarioTexto}>Marcar</Text>
        </Pressable>
      </View>

      <Pressable style={{ marginTop: 24 }} onPress={() => router.back()}>
        <Text style={{ color: '#1B6CA8', textAlign: 'center' }}>Volver a la bandeja</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 16, gap: 8 },
  direccion: { fontSize: 20, fontWeight: '700' },
  descripcion: { fontSize: 14, color: '#444', marginBottom: 8 },
  chipEstadoActual: { alignSelf: 'flex-start', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, marginBottom: 8 },
  chipEstadoActualTexto: { color: '#fff', fontSize: 12, fontWeight: '600' },
  avisoDuplicado: { color: '#B03A2E', fontSize: 12, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginTop: 20, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#ccc', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  chipTextoActivo: { color: '#fff' },
  chipCuadrillaActiva: { backgroundColor: '#1B6CA8', borderColor: '#1B6CA8' },
  textarea: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, minHeight: 70, marginTop: 10, textAlignVertical: 'top' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  boton: { backgroundColor: '#1B6CA8', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 10 },
  botonTexto: { color: '#fff', fontWeight: '600' },
  botonSecundario: { borderWidth: 1, borderColor: '#1B6CA8', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  botonSecundarioTexto: { color: '#1B6CA8', fontWeight: '600' },
});
