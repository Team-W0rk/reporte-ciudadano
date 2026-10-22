import { CambioDeEstado } from '@/tipos';

export const cambiosDeEstadoMock: CambioDeEstado[] = [
  { id: 'cam-1170', reporteId: 'rep-00412', estado: 'recibido', comentario: null, operadorId: null, fechaHora: '2026-09-14T10:22:00-03:00' },
  { id: 'cam-1177', reporteId: 'rep-00412', estado: 'en_revision', comentario: 'Verificado en el lugar', operadorId: 'usr-003', fechaHora: '2026-09-15T08:40:00-03:00' },
  { id: 'cam-1180', reporteId: 'rep-00412', estado: 'asignado', comentario: 'Se asigna a Cuadrilla 2', operadorId: 'usr-003', fechaHora: '2026-09-18T09:00:00-03:00' },
  {
    id: 'cam-1050', reporteId: 'rep-00399', estado: 'rechazado',
    comentario: 'Revisamos el lugar el 03/09 y la vereda corresponde a un frentista particular, no a un espacio público municipal. Le sugerimos al vecino reclamar directamente a la inmobiliaria a cargo del inmueble.',
    operadorId: 'usr-003', fechaHora: '2026-09-03T12:00:00-03:00',
  },
  { id: 'cam-1200', reporteId: 'rep-00413', estado: 'recibido', comentario: null, operadorId: null, fechaHora: '2026-09-16T08:00:00-03:00' },
];
