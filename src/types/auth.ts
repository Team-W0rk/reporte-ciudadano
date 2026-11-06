import type { Usuario } from './usuario';

export interface Sesion {
  token: string;
  usuario: Usuario;
}

export interface DatosRegistro {
  nombre: string;
  email: string;
  contrasena: string;
  telefono?: string;
}

export interface DatosIngreso {
  email: string;
  contrasena: string;
}

export interface RespuestaAuth {
  datos: Sesion;
  meta: unknown;
}
