import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ColorEstado, EtiquetaEstado } from '@/constants/dominio';
import { tiposDeReporteMock } from '@/mocks/tiposDeReporte.mock';
import { zonasMock } from '@/mocks/zonas.mock';
import { listarReportes } from '@/servicios/reportes';
import { EstadoReporte, Reporte } from '@/tipos';

const ESTADOS: EstadoReporte[] = ['recibido', 'en_revision', 'asignado', 'resuelto', 'rechazado'];

export default function BandejaOperadorScreen() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoReporte | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroZona, setFiltroZona] = useState<string | null>(null);

  const cargar = useCallback(() => {
    listarReportes({
      estado: filtroEstado ?? undefined,
      tipoId: filtroTipo ?? undefined,
      zonaId: filtroZona ?? undefined,
    }).then((respuesta) => setReportes(respuesta.datos));
  }, [filtroEstado, filtroTipo, filtroZona]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
        <FiltroChip label="Todos" activo={!filtroEstado} onPress={() => setFiltroEstado(null)} />
        {ESTADOS.map((estado) => (
          <FiltroChip
            key={estado}
            label={EtiquetaEstado[estado]}
            activo={filtroEstado === estado}
            color={ColorEstado[estado]}
            onPress={() => setFiltroEstado(filtroEstado === estado ? null : estado)}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
        {tiposDeReporteMock.map((tipo) => (
          <FiltroChip
            key={tipo.id}
            label={tipo.nombre}
            activo={filtroTipo === tipo.id}
            onPress={() => setFiltroTipo(filtroTipo === tipo.id ? null : tipo.id)}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
        {zonasMock.map((zona) => (
          <FiltroChip
            key={zona.id}
            label={zona.nombre}
            activo={filtroZona === zona.id}
            onPress={() => setFiltroZona(filtroZona === zona.id ? null : zona.id)}
          />
        ))}
      </ScrollView>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={reportes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>Sin reportes con estos filtros.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => router.push(`/operador/reportes/${item.id}`)}>
            <View style={[styles.puntoEstado, { backgroundColor: ColorEstado[item.estado] }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitulo}>{item.direccion}</Text>
              <Text style={styles.itemSubtitulo}>
                {EtiquetaEstado[item.estado]} · {item.adhesiones} adhesiones
                {item.duplicadoDe ? ' · duplicado' : ''}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function FiltroChip({
  label,
  activo,
  onPress,
  color = '#1B6CA8',
}: {
  label: string;
  activo: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      style={[styles.chip, activo && { backgroundColor: color, borderColor: color }]}
      onPress={onPress}
    >
      <Text style={[styles.chipTexto, activo && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filtros: { paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  chip: { borderWidth: 1, borderColor: '#ccc', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, marginRight: 6 },
  chipTexto: { fontSize: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  puntoEstado: { width: 10, height: 10, borderRadius: 5 },
  itemTitulo: { fontSize: 15, fontWeight: '600' },
  itemSubtitulo: { fontSize: 13, color: '#666' },
});
