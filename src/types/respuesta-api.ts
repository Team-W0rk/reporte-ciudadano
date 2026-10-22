export interface MetaPaginacion {
  total: number;
  pagina: number;
  porPagina: number;
}

export interface RespuestaExitosa<T> {
  datos: T;
  meta: MetaPaginacion | null;
}

export interface RespuestaError {
  error: {
    codigo: string;
    mensaje: string;
  };
}