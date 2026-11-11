import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  DatosIngreso,
  DatosRegistro,
  Sesion,
} from '@/types/auth';
import type { Usuario } from '@/types';
import { ingresarUsuario, registrarUsuario } from '@/services/auth';
import {
  eliminarSesion,
  guardarSesion,
  guardarSesionBiometrica,
  recuperarSesion,
  recuperarSesionBiometrica,
  quitarProteccionBiometrica,
} from '@/services/sesions';
import { biometriaActivada, guardarPreferenciaBiometrica } from '@/services/biometria';
import { obtenerMensajeError } from '@/services/errores';
import { darDeBajaDispositivo } from '@/services/dispositivos';
import { borrarTokenPush, leerTokenPush } from '@/services/tokenPush';

interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  autenticado: boolean;
  requiereBiometria: boolean;
  biometriaHabilitada: boolean;
  ingresar: (datos: DatosIngreso) => Promise<void>;
  registrarse: (datos: DatosRegistro) => Promise<void>;
  ingresarConBiometria: () => Promise<void>;
  habilitarBiometria: () => Promise<void>;
  deshabilitarBiometria: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
  actualizarUsuario: (usuario: Usuario) => Promise<void>;
}

export const AuthContext = createContext< AuthContextValue | undefined >(undefined);
interface AuthProviderProps { children: ReactNode }

export function AuthProvider({ children }: AuthProviderProps) {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [requiereBiometria, setRequiereBiometria] = useState(false);
  const [biometriaHabilitada, setBiometriaHabilitada] =
    useState(false);

  // Recupera la sesión al iniciar la aplicación.
  useEffect(() => {
    let activo = true;
    async function cargarSesion() {
      try {
        const habilitada = await biometriaActivada();
        if (!activo) return;
        setBiometriaHabilitada(habilitada);
        if (habilitada) {
          // La sesión protegida solo se recupera tras la
          // autenticación biométrica iniciada por el usuario.
          setRequiereBiometria(true);
          return;
        }
        const sesionGuardada = await recuperarSesion();
        if (activo && sesionGuardada) {
          setSesion(sesionGuardada);
        }
      } catch {
        if (activo) {
          setSesion(null);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }
    void cargarSesion();
    return () => {
      activo = false;
    };
  }, []);

  // Si la persona ingresa con contraseña, se usa la sesión normal.
  // Si la biometría estaba activada, se desactiva para evitar que
  // la preferencia quede apuntando a una sesión que no existe.
  const guardarSesionNormal = useCallback(
    async (nuevaSesion: Sesion) => {
      await guardarPreferenciaBiometrica(false);
      await guardarSesion(nuevaSesion);
      setSesion(nuevaSesion);
      setBiometriaHabilitada(false);
      setRequiereBiometria(false);
    },
    [],
  );

  const ingresar = useCallback(
    async (datos: DatosIngreso) => {
      try {
        const nuevaSesion = await ingresarUsuario(datos);
        await guardarSesionNormal(nuevaSesion);
      } catch (error) {
        throw new Error(obtenerMensajeError(error));
      }
    },
    [guardarSesionNormal],
  );

  const registrarse = useCallback(
    async (datos: DatosRegistro) => {
      try {
        const nuevaSesion = await registrarUsuario(datos);
        await guardarSesionNormal(nuevaSesion);
      } catch (error) {
        throw new Error(obtenerMensajeError(error));
      }
    },
    [guardarSesionNormal],
  );

  // SecureStore muestra el diálogo del sistema operativo.
  // No llamamos a authenticateAsync antes para evitar dos prompts.
  const ingresarConBiometria = useCallback(async () => {
    try {
      const habilitada = await biometriaActivada();
      if (!habilitada) {
        throw new Error(
          'El acceso biométrico no está habilitado.',
        );
      }
      const sesionGuardada = await recuperarSesionBiometrica();
      if (!sesionGuardada) {
        await guardarPreferenciaBiometrica(false);
        setBiometriaHabilitada(false);
        setRequiereBiometria(false);
        throw new Error(
          'No encontramos una sesión protegida. Ingresá con tu email y contraseña.',
        );
      }

      setSesion(sesionGuardada);
      setRequiereBiometria(false);
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  }, []);

  const habilitarBiometria = useCallback(async () => {
    if (!sesion) {
      throw new Error(
        'Necesitás iniciar sesión para habilitar la biometría.',
      );
    }

    try {
      // Confirmamos la identidad antes de mover la sesión
      // al almacenamiento protegido.
      const LocalAuthentication = await import(
        'expo-local-authentication'
      );
      const resultado =
        await LocalAuthentication.authenticateAsync({
          promptMessage: 'Activá el acceso biométrico',
          cancelLabel: 'Cancelar',
          disableDeviceFallback: true,
        });
      if (!resultado.success) {
        throw new Error(
          'No se pudo validar la biometría. No se realizaron cambios.',
        );
      }
      await guardarSesionBiometrica(sesion);
      await guardarPreferenciaBiometrica(true);
      setBiometriaHabilitada(true);
      setRequiereBiometria(false);
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  }, [sesion]);

  const deshabilitarBiometria = useCallback(async () => {
    try {
      // Conserva la sesión activa en almacenamiento normal
      // antes de quitar la protegida.
      await quitarProteccionBiometrica(sesion ?? undefined);
      await guardarPreferenciaBiometrica(false);
      setBiometriaHabilitada(false);
      setRequiereBiometria(false);
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  }, [sesion]);

  const cerrarSesion = useCallback(async () => {
    try {
      const tokenExpo = await leerTokenPush();

      if (tokenExpo && sesion?.token) {
        await darDeBajaDispositivo(sesion.token, tokenExpo);
      }
    } catch (error) {
      console.warn('No se pudo dar de baja el dispositivo:', error);
    } finally {
      await borrarTokenPush();
    }

    try {
      await eliminarSesion();
      await guardarPreferenciaBiometrica(false);
      setSesion(null);
      setBiometriaHabilitada(false);
      setRequiereBiometria(false);
    } catch (error) {
      throw new Error(obtenerMensajeError(error));
    }
  }, [sesion]);

  const actualizarUsuario = useCallback(
    async (usuarioNuevo: Usuario) => {
      if (!sesion) return;

      const nueva: Sesion = { ...sesion, usuario: usuarioNuevo };
      setSesion(nueva);

      if (!biometriaHabilitada) {
        try {
          await guardarSesion(nueva);
        } catch {
          // Si no se puede guardar, igual queda actualizada en pantalla.
        }
      }
    },
    [sesion, biometriaHabilitada],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario: sesion?.usuario ?? null,
      token: sesion?.token ?? null,
      cargando,
      autenticado: Boolean(sesion?.token),
      requiereBiometria,
      biometriaHabilitada,
      ingresar,
      registrarse,
      ingresarConBiometria,
      habilitarBiometria,
      deshabilitarBiometria,
      cerrarSesion,
      actualizarUsuario,
    }),
    [
      sesion,
      cargando,
      requiereBiometria,
      biometriaHabilitada,
      ingresar,
      registrarse,
      ingresarConBiometria,
      habilitarBiometria,
      deshabilitarBiometria,
      cerrarSesion,
      actualizarUsuario,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
