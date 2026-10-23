import axios from 'axios';

export function obtenerMensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensaje = error.response?.data?.error?.mensaje;

    if (typeof mensaje === 'string') {
      return mensaje;
    }

    if (!error.response) {
      return 'No se pudo conectar con el servidor.';
    }

    return `Error del servidor (${error.response.status}).`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
}
