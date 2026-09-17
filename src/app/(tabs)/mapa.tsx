import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { listarReportes } from '@/servicios/reportes';
import { Reporte } from '@/tipos';

// TODO (Dev 2 - Mapa y creación de reportes):
// - Reemplazar esta lista por <MapView> de react-native-maps, con markers
//   coloreados por estado (ColorEstado, en src/constants/dominio.ts).
// - expo-location para centrar el mapa; usable aunque nieguen el permiso.
// - Detección de duplicados a 50m antes de crear un reporte
//   (servicios/reportes.ts -> buscarReportesCercanos, ya armada).
export default function MapaScreen() {
  const [reportes, setReportes] = useState<Reporte[] | null>(null);

  useEffect(() => {
    listarReportes().then((respuesta) => setReportes(respuesta.datos));
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', marginBottom: 8 }}>Mapa (Dev 2) — lista provisoria</Text>
      <FlatList
        data={reportes ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={{ paddingVertical: 6 }}>{item.direccion} — {item.estado}</Text>}
        ListEmptyComponent={<Text>Cargando…</Text>}
      />
    </View>
  );
}
