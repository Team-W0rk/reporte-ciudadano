import { useCallback, useRef, useState } from 'react';
import type { Region } from 'react-native-maps';

import { obtenerMensajeError } from '@/services/errores';
import { listarReportesParaMapa } from '@/services/reportesCreacion';
import type { Reporte } from '@/types';

interface EstadoReportesMapa {
  reportes: Reporte[];
  cargando: boolean;
  error: string | null;
  cargarRegion: (region: Region) => Promise<void>;
}

export function useReportesMapa(): EstadoReportesMapa {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ultimoPedido = useRef(0);

  const cargarRegion = useCallback(async (region: Region) => {
    const pedido = ++ultimoPedido.current;

    setCargando(true);
    setError(null);

    try {
      const { datos } = await listarReportesParaMapa({
        area: {
          norte: region.latitude + region.latitudeDelta / 2,
          sur: region.latitude - region.latitudeDelta / 2,
          este: region.longitude + region.longitudeDelta / 2,
          oeste: region.longitude - region.longitudeDelta / 2,
        },
      });

      if (pedido === ultimoPedido.current) {
        setReportes(datos);
      }
    } catch (e) {
      if (pedido === ultimoPedido.current) {
        setError(obtenerMensajeError(e));
      }
    } finally {
      if (pedido === ultimoPedido.current) {
        setCargando(false);
      }
    }
  }, []);

  return { reportes, cargando, error, cargarRegion };
}