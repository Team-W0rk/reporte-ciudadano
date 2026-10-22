import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ColorEstado, EtiquetaEstado } from '@/constants/dominio';
import { obtenerHistorial, obtenerReportePorId } from '@/servicios/reportes';
import { CambioDeEstado, Reporte } from '@/tipos';

export default function DetalleReporteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reporte, setReporte] = useState<Reporte | null | undefined>(undefined);
  const [historial, setHistorial] = useState<CambioDeEstado[]>([]);

  useEffect(() => {
    if (!id) return;
    obtenerReportePorId(id).then(setReporte);
    obtenerHistorial(id).then(setHistorial);
  }, [id]);

  if (reporte === undefined) {
    return (
      <View style={styles.centrado}>
        <Text>Cargando…</Text>
      </View>
    );
  }

  if (reporte === null) {
    return (
      <View style={styles.centrado}>
        <Text>No se encontró ese reporte.</Text>
      </View>
    );
  }

  const fotoProblema = reporte.fotos.find((f) => f.momento === 'problema');
  const fotoArreglo = reporte.fotos.find((f) => f.momento === 'arreglo');

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <View style={styles.encabezado}>
        <View style={{ flex: 1 }}>
          <Text style={styles.codigo}>{reporte.codigo}</Text>
          <Text style={styles.direccion}>{reporte.direccion}</Text>
        </View>
        {/* Código QR para mostrar en el mostrador municipal (PRD, sección 2) */}
        {reporte.codigo !== 'PENDIENTE-DE-SINCRONIZAR' && (
          <View style={styles.qrCaja}>
            <QRCode value={reporte.codigo} size={72} />
          </View>
        )}
      </View>

      <View style={[styles.chipEstado, { backgroundColor: ColorEstado[reporte.estado] }]}>
        <Text style={styles.chipEstadoTexto}>{EtiquetaEstado[reporte.estado]}</Text>
      </View>

      {reporte.adhesiones > 0 && (
        <Text style={styles.adhesiones}>{reporte.adhesiones} vecinos se sumaron a este reclamo</Text>
      )}

      {reporte.descripcion ? <Text style={styles.descripcion}>{reporte.descripcion}</Text> : null}

      {fotoProblema && (
        <Image source={{ uri: fotoProblema.url }} style={styles.foto} resizeMode="cover" />
      )}

      {fotoArreglo && (
        <>
          <Text style={styles.subtitulo}>Foto del arreglo</Text>
          <Image source={{ uri: fotoArreglo.url }} style={styles.foto} resizeMode="cover" />
        </>
      )}

      <Text style={styles.subtitulo}>Qué fue pasando</Text>
      {historial.length === 0 ? (
        <Text style={{ color: '#888' }}>Sin novedades todavía.</Text>
      ) : (
        historial.map((cambio) => (
          <View key={cambio.id} style={styles.eventoHistorial}>
            <View style={styles.eventoEncabezado}>
              <Text style={styles.eventoEstado}>{EtiquetaEstado[cambio.estado]}</Text>
              <Text style={styles.eventoFecha}>
                {new Date(cambio.fechaHora).toLocaleDateString('es-AR')}
              </Text>
            </View>
            {cambio.comentario ? (
              <Text style={styles.eventoComentario}>{cambio.comentario}</Text>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 16, gap: 8 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  encabezado: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  codigo: { fontSize: 13, color: '#888' },
  direccion: { fontSize: 20, fontWeight: '700' },
  qrCaja: { padding: 6, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  chipEstado: { alignSelf: 'flex-start', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, marginVertical: 8 },
  chipEstadoTexto: { color: '#fff', fontSize: 12, fontWeight: '600' },
  adhesiones: { fontSize: 13, color: '#1B6CA8', fontWeight: '600' },
  descripcion: { fontSize: 14, color: '#333', marginTop: 8 },
  foto: { width: '100%', height: 180, borderRadius: 10, marginTop: 8, backgroundColor: '#eee' },
  subtitulo: { fontSize: 15, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  eventoHistorial: { borderLeftWidth: 2, borderLeftColor: '#1B6CA8', paddingLeft: 10, marginBottom: 12 },
  eventoEncabezado: { flexDirection: 'row', justifyContent: 'space-between' },
  eventoEstado: { fontWeight: '600' },
  eventoFecha: { fontSize: 12, color: '#888' },
  eventoComentario: { fontSize: 13, color: '#444', marginTop: 4 },
});
