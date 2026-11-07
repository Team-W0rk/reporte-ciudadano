
import { useCallback, useState } from 'react';

import { useAuth } from '@/hooks/auth/useAuth';
import {
  obtenerMisReportes,
  obtenerReportePorId,
} from '@/services/reportes';
import {
  obtenerAdhesionesLocales,
} from '@/services/colaOffline';

import type { Reporte } from '@/types';

export type TipoListaReportes = 'creados' | 'adheridos';

interface UseMisReportesResultado {
  reportesCreados: Reporte[];
  reportesAdheridos: Reporte[];
  reportesActuales: Reporte[];
  tipoLista: TipoListaReportes;
  cargando: boolean;
  actualizando: boolean;
  error: string | null;
  cambiarTipoLista: (tipo: TipoListaReportes) => void;
  cargarReportes: (actualizar?: boolean) => Promise<void>;
}

export function useMisReportes(): UseMisReportesResultado {
  const { token, usuario } = useAuth();

  const [reportesCreados, setReportesCreados] = useState<Reporte[]>([]);
  const [reportesAdheridos, setReportesAdheridos] = useState<Reporte[]>([]);

  const [tipoLista, setTipoLista] =
    useState<TipoListaReportes>('creados');

  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiarTipoLista = useCallback(
    (tipo: TipoListaReportes) => {
      setTipoLista(tipo);
    },
    [],
  );

  const cargarReportes = useCallback(
    async (actualizar = false): Promise<void> => {
      if (!token || !usuario) {
        setReportesCreados([]);
        setReportesAdheridos([]);
        setCargando(false);
        setActualizando(false);
        return;
      }

      if (actualizar) {
        setActualizando(true);
      } else {
        setCargando(true);
      }

      setError(null);

      try {
        // Primero obtenemos los reportes creados y las adhesiones locales.
        const [respuestaCreados, idsAdheridos] = await Promise.all([
          obtenerMisReportes(token),
          obtenerAdhesionesLocales(usuario.id),
        ]);

        setReportesCreados(respuestaCreados.datos);

        // Consultamos el detalle de cada reporte adherido.
        const resultados = await Promise.allSettled(
          idsAdheridos.map((id) => obtenerReportePorId(id)),
        );

        const adheridos: Reporte[] = resultados.flatMap((resultado) => {
          if (resultado.status === 'fulfilled') {
            return [resultado.value.datos];
          }

          return [];
        });

        setReportesAdheridos(adheridos);
      } catch (errorCarga) {
        console.error(
          'Error al cargar los reportes del usuario:',
          errorCarga,
        );

        setError(
          'No pudimos cargar tus reportes. Intentá nuevamente.',
        );
      } finally {
        setCargando(false);
        setActualizando(false);
      }
    },
    [token, usuario],
  );

  const reportesActuales =
    tipoLista === 'creados'
      ? reportesCreados
      : reportesAdheridos;

  return {
    reportesCreados,
    reportesAdheridos,
    reportesActuales,
    tipoLista,
    cargando,
    actualizando,
    error,
    cambiarTipoLista,
    cargarReportes,
  };
}
