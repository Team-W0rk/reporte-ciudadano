import { Usuario } from '@/tipos';

export const usuariosMock: Usuario[] = [
  {
    id: 'usr-084',
    nombre: 'Norma Pereyra',
    email: 'norma@mail.com',
    telefono: '3446-412233',
    rol: 'vecino',
    zonaId: null,
    avisosActivos: true,
    creadoEn: '2026-08-30T19:10:00-03:00',
  },
  {
    id: 'usr-003',
    nombre: 'Claudia Benítez',
    email: 'claudia@gualeguaychu.gob.ar',
    telefono: null,
    rol: 'operador',
    zonaId: 'zon-norte',
    avisosActivos: true,
    creadoEn: '2026-01-15T09:00:00-03:00',
  },
];
