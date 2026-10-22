import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ColorEstado, EtiquetaEstado } from '@/constants/dominio';
import { usuarioActualMock } from '@/mocks/usuarios.mock';
import { listarReportesDeUsuario } from '@/servicios/reportes';
import { Reporte } from '@/tipos';

// TODO (Dev 1): reemplazar usuarioActualMock por el usuario real de la sesión
// una vez que el módulo de auth esté conectado.
export default function MisReportesScreen() {
  const [reportes, setReportes] = useState<Reporte[] | null>(null);

  const cargar = useCallback(() => {
    listarReportesDeUsuario(usuarioActualMock.id).then((datos) =>
      setReportes([...datos].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))),
    );
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (reportes === null) {
    return (
      <View style={styles.centrado}>
        <Text>Cargando tus reportes…</Text>
      </View>
    );
  }

  if (reportes.length === 0) {
    return (
      <View style={styles.centrado}>
        <Text>Todavía no hiciste ningún reporte.</Text>
      </View>
    );
  }

  const enCurso = reportes.filter((r) => r.estado !== 'resuelto' && r.estado !== 'rechazado');
  const finalizados = reportes.filter((r) => r.estado === 'resuelto' || r.estado === 'rechazado');

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={[...enCurso, ...finalizados]}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        enCurso.length > 0 ? <Text style={styles.seccion}>En curso</Text> : null
      }
      renderItem={({ item, index }) => (
        <>
          {index === enCurso.length && finalizados.length > 0 && (
            <Text style={styles.seccion}>Finalizados</Text>
          )}
          <Pressable style={styles.item} onPress={() => router.push(`/reportes/${item.id}`)}>
            <View style={[styles.puntoEstado, { backgroundColor: ColorEstado[item.estado] }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitulo}>{item.direccion}</Text>
              <Text style={styles.itemSubtitulo}>
                {EtiquetaEstado[item.estado]}
                {!item.sincronizado ? ' · sin sincronizar' : ''}
              </Text>
            </View>
          </Pressable>
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  seccion: { fontSize: 13, fontWeight: '700', color: '#888', marginTop: 12, marginBottom: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  puntoEstado: { width: 10, height: 10, borderRadius: 5 },
  itemTitulo: { fontSize: 15, fontWeight: '600' },
  itemSubtitulo: { fontSize: 13, color: '#666' },
});
