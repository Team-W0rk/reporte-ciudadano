import { Marker } from 'react-native-maps';
import { ColorEstado, EtiquetaEstado } from '@/constants/dominio';
import type { Reporte } from '@/types';

interface Props {
  reportes: Reporte[];
  onSeleccionar: (reporte: Reporte) => void;
}

export function MarcadoresReportes({
  reportes,
  onSeleccionar,
}: Props) {
  return (
    <>
      {reportes.map((reporte) => (
        <Marker
          key={reporte.id}
          coordinate={{
            latitude: reporte.coordenadas.latitud,
            longitude: reporte.coordenadas.longitud,
          }}
          pinColor={ColorEstado[reporte.estado]}
          title={reporte.direccion}
          description={`${EtiquetaEstado[reporte.estado]} · ${reporte.adhesiones} adhesiones`}
          onPress={() => onSeleccionar(reporte)}
        />
      ))}
    </>
  );
}