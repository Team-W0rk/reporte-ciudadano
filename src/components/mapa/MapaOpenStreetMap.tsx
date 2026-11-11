import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { ColorEstado, EtiquetaEstado } from '@/constants/dominio';
import type { Reporte } from '@/types';
import type { RegionMapa } from '@/types/mapa';

interface Props {
  regionInicial: RegionMapa;
  reportes: Reporte[];
  onSeleccionar: (reporte: Reporte) => void;
  onRegionChange: (region: RegionMapa) => void;
}

const HTML_MAPA = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', { zoomControl: false })
      .setView([-33.0089, -58.5142], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const marcadores = L.layerGroup().addTo(map);

    window.establecerRegion = function(region) {
      const zoom = Math.round(
        Math.log2(360 / region.latitudeDelta)
      );

      map.setView(
        [region.latitude, region.longitude],
        Math.max(3, Math.min(19, zoom))
      );
    };

    window.actualizarMarcadores = function(reportes) {
      marcadores.clearLayers();

      reportes.forEach(reporte => {
        const marcador = L.circleMarker(
          [reporte.latitud, reporte.longitud],
          {
            radius: 9,
            fillColor: reporte.color,
            color: '#FFFFFF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.95
          }
        );

        marcador.bindPopup(
          '<strong>' + reporte.direccion + '</strong><br>' +
          reporte.estado + '<br>' +
          reporte.adhesiones + ' adhesiones'
        );

        marcador.on('click', () => {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              tipo: 'seleccionar',
              reporteId: reporte.id
            })
          );
        });

        marcador.addTo(marcadores);
      });
    };

    map.on('moveend', () => {
      const centro = map.getCenter();
      const limites = map.getBounds();

      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          tipo: 'region',
          region: {
            latitude: centro.lat,
            longitude: centro.lng,
            latitudeDelta: Math.abs(
              limites.getNorth() - limites.getSouth()
            ),
            longitudeDelta: Math.abs(
              limites.getEast() - limites.getWest()
            )
          }
        })
      );
    });
  </script>
</body>
</html>
`;

export function MapaOpenStreetMap({
  regionInicial,
  reportes,
  onSeleccionar,
  onRegionChange,
}: Props) {
  const webViewRef = useRef<WebView>(null);
  const [mapaCargado, setMapaCargado] = useState(false);
  const regionConfigurada = useRef(false);

  useEffect(() => {
    if (!mapaCargado || regionConfigurada.current) return;

    webViewRef.current?.injectJavaScript(`
      window.establecerRegion(${JSON.stringify(regionInicial)});
      true;
    `);

    regionConfigurada.current = true;
  }, [mapaCargado, regionInicial]);

  useEffect(() => {
    if (!mapaCargado) return;

    const datos = reportes.map((reporte) => ({
      id: reporte.id,
      latitud: reporte.coordenadas.latitud,
      longitud: reporte.coordenadas.longitud,
      direccion: reporte.direccion,
      estado: EtiquetaEstado[reporte.estado],
      color: ColorEstado[reporte.estado],
      adhesiones: reporte.adhesiones,
    }));

    webViewRef.current?.injectJavaScript(`
      window.actualizarMarcadores(${JSON.stringify(datos)});
      true;
    `);
  }, [mapaCargado, reportes]);

  const manejarMensaje = (evento: { nativeEvent: { data: string } }) => {
    try {
      const mensaje = JSON.parse(evento.nativeEvent.data);

      if (mensaje.tipo === 'region') {
        onRegionChange(mensaje.region);
      }

      if (mensaje.tipo === 'seleccionar') {
        const reporte = reportes.find(
          (item) => item.id === mensaje.reporteId,
        );

        if (reporte) onSeleccionar(reporte);
      }
    } catch (error) {
      console.error('Error al procesar mensaje del mapa:', error);
    }
  };

  return (
    <View style={styles.contenedor}>
      <WebView
        ref={webViewRef}
        source={{ html: HTML_MAPA }}
        style={styles.mapa}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        onLoadEnd={() => setMapaCargado(true)}
        onMessage={manejarMensaje}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    ...StyleSheet.absoluteFillObject,
  },
  mapa: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
});