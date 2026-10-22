# Reporte Ciudadano

App móvil para que los vecinos de Gualeguaychú reporten problemas urbanos (baches, luminarias, basura, etc.) con foto y ubicación, y le hagan seguimiento hasta que se resuelvan.

Trabajo Integrador — Desarrollo para Móviles, UNER. Construida con **React Native + Expo + Expo Router**.

---

## 1. Antes de arrancar

- Node.js instalado (probado con Node 24 / npm 12).
- La app de **Expo Go** en tu celular (Play Store / App Store), o un emulador Android configurado.
- Todos conectados al mismo WiFi que la compu si usan Expo Go.

## 2. Puesta en marcha

```bash
git clone <url-del-repo>
cd reporte-ciudadano
npm install
cp .env.example .env
npx expo start
```

Con el servidor corriendo:
- `a` → abrir en emulador Android
- `w` → abrir en el navegador (cámara, mapa y sensores no andan bien en web; sirve solo para ver la UI general)
- Escanear el QR con **Expo Go** desde el celular

> ⚠️ **Windows:** si `npx create-expo-app` o `npx expo install` tiran `Could not parse JSON returned from "npm.cmd pack ..."`, es un bug de npm 12.x en Windows (devuelve el JSON duplicado), no un problema del proyecto. Para instalar paquetes nuevos usar `npm install <paquete>` en vez de `npx expo install <paquete>`, fijando la versión `~57.x` si hace falta.

## 3. Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm start` | Levanta el servidor de desarrollo de Expo |
| `npm run android` | Levanta directo en emulador/dispositivo Android |
| `npm run lint` | Corre ESLint sobre todo el proyecto |
| `npm run lint:fix` | Corre ESLint y corrige automáticamente lo que se pueda |
| `npm run format` | Formatea todo el código con Prettier |
| `npm run typecheck` | Corre el compilador de TypeScript sin generar archivos |

**Corré `npm run lint` y `npm run typecheck` antes de cada Pull Request.** Con las extensiones recomendadas de VS Code instaladas (se sugieren solas al abrir el proyecto), el formato se aplica automático al guardar.

---

## 4. Arquitectura del proyecto (leer antes de programar)

```
src/
  app/                 # Pantallas, con Expo Router (cada archivo = una ruta)
    (auth)/            # login, registro — sin sesión           [Dev 1]
    (tabs)/            # mapa, mis-reportes, perfil             [Dev 2 / Dev 3]
    reportes/          # nuevo.tsx, [id].tsx (detalle)          [Dev 2 / Dev 3]
    operador/          # bandeja municipal, rol operador        [Dev 3]
  types/               # Interfaces de TypeScript (entidades oficiales del PRD)
  mocks/               # Datos falsos, tipados contra src/types
  services/           # ÚNICA puerta de entrada a los datos
  almacenamiento/      # wrappers de expo-secure-store / expo-sqlite (a completar)
  constants/
    theme.ts           # viene de la plantilla de Expo (Colors, Spacing, Fonts)
    dominio.ts         # NUESTRO: colores/etiquetas por estado, radios, tamaños
  components/          # Componentes compartidos (de la plantilla)
```

### La regla más importante del proyecto

**Ninguna pantalla importa un mock directamente.** Todo pasa por `src/services/reportes.ts`. Hoy esas funciones devuelven datos de `src/mocks/`; el día que la cátedra publique la API real, ese es el único archivo que cambia (se reemplazan los `Promise.resolve(...)` por `fetch(...)`).
**Ninguna pantalla importa un mock directamente.** Todo pasa por `src/services/reportes.ts`. Hoy esas funciones devuelven datos de `src/mocks/`; el día que la cátedra publique la API real, ese es el único archivo que cambia (se reemplazan los `Promise.resolve(...)` por `fetch(...)`).

```tsx
// ❌ mal
import { reportesMock } from '@/mocks/reportes.mock';

// ✅ bien
import { listarReportes } from '@/services/reportes';
```

Los services son **asíncronos desde el día 1**, aunque hoy respondan al instante — así las pantallas ya manejan bien carga/vacío/error.

### types y estados oficiales

Los 5 estados de un reporte son los que define el PRD de la cátedra, no los inventamos nosotros: `recibido`, `en_revision`, `asignado`, `resuelto`, `rechazado`. Están en `src/types/index.ts`, y sus colores/etiquetas en `src/constants/dominio.ts` (`ColorEstado`, `EtiquetaEstado`) — usar siempre esas constantes, no hardcodear colores nuevos.

### `theme.ts` vs `dominio.ts` — para qué es cada uno

- **`theme.ts`** (de la plantilla): paleta genérica claro/oscuro (`Colors.light`/`Colors.dark`), espaciados (`Spacing`) y fuentes (`Fonts`). Es la base visual de cualquier app Expo.
- **`dominio.ts`** (nuestro): todo lo específico de "Reporte Ciudadano" — el color de cada estado del reporte, sus etiquetas en español, y algunos radios/tamaños de fuente reutilizables. Cuando necesites un color para un chip de estado o un ícono, sacalo de acá, no inventes uno nuevo.

---

## 5. Estilo de código

- **Español para nombres de variables, funciones y archivos del dominio** (`crearReporte`, `src/types/index.ts`); inglés solo para términos técnicos estándar (`Props`, `useState`).
- Formato automático con Prettier (`.prettierrc`): comillas simples, punto y coma, ancho de línea 100.
- ESLint usa `eslint-config-expo`, la config oficial del equipo de Expo.
- Los `TODO (Dev X - ...)` en cada pantalla marcan quién sigue esa parte y qué falta — actualizalos o borralos a medida que avanzás.

## 6. Convención de Git

- Rama principal: `main`, protegida — no se pushea directo.
- Una rama por feature: `feature/nombre-corto` (ej: `feature/camara-nuevo-reporte`).
- PR chico, con descripción de qué pantalla/función toca, revisado por al menos otro del equipo.
- Correr `npm run lint` y `npm run typecheck` antes de abrir el PR.

---

## 7. División de tareas entre los 3 desarrolladores

### 🔐 Dev 1 — Auth, sesión y persistencia base
- `src/app/(auth)/` (login, registro) y `src/app/(tabs)/perfil.tsx`.
- Servicio de auth mockeado (`src/services/auth.ts`, a crear siguiendo el patrón de `services/reportes.ts`).
- `expo-secure-store` para el token + `expo-local-authentication` para reingreso con huella/rostro (con alternativa si el dispositivo no tiene).
- `expo-sqlite/kv-store` para preferencias (ej: el switch de avisos).
- `expo-network` para el estado de la conexión (lo va a necesitar también Dev 2).

### 🗺️ Dev 2 — Mapa, cámara y creación de reportes
- `src/app/(tabs)/mapa.tsx` — reemplazar la lista provisoria por `react-native-maps`, markers coloreados por `ColorEstado`.
- `expo-location` (con manejo de permiso denegado) + detección de duplicados a 50m (`services/reportes.ts` → `buscarReportesCercanos`, ya armada).
- `src/app/reportes/nuevo.tsx` — cámara (`expo-camera`/`expo-image-picker`), nota de voz (`expo-audio`), envío con `crearReporte()`.
- Cola offline con `expo-sqlite` cuando no hay red.
- Vibración (`expo-haptics`) al confirmar envío o detectar duplicado.

### 📋 Dev 3 — Seguimiento, bandeja del operador y notificaciones
- `src/app/(tabs)/mis-reportes.tsx` y `src/app/reportes/[id].tsx` (historial).
- `src/app/operador/` completo: filtros, cambio de estado con comentario obligatorio, asignación a cuadrilla.
- `expo-notifications`, disparadas por cambios reales de estado (no un botón de prueba).
- Mantenimiento de `src/mocks/` y `src/services/reportes.ts` cuando haga falta una función nueva (ej: cambiar estado) — avisar en el grupo antes de cambiar la forma de una función existente, porque la usan los otros dos.

### Puntos de integración
1. **Semana 1:** los 3 revisan `src/types/index.ts` y los mocks (ya están armados, si falta algo se agrega ahí).
2. Antes de tocar `services/reportes.ts`, avisar en el grupo.
3. **Primer build de EAS una semana antes de la entrega** (`eas build --platform android --profile preview`) — la cátedra avisa que el primer intento casi siempre falla por algo chico.

---

## 8. Build de producción (EAS)

Ya está `eas.json` en la raíz, con el perfil `preview` configurado para generar un **APK instalable** (no un `.aab`, que no sirve para instalar directo en un celular).

```bash
npm install -g eas-cli
eas login
eas build:configure   # solo la primera vez, vincula el proyecto a una cuenta de expo.dev
eas build --platform android --profile preview
```

Cualquiera del equipo con acceso al proyecto en expo.dev puede correr el build, no hace falta que sea siempre la misma persona.

---

## 9. Checklist de los 10 requisitos mínimos (antes de entregar)

- [ ] Pantallas con Expo Router cubriendo el PRD.
- [ ] Registro/login con sesión persistente (`expo-secure-store` + `expo-local-authentication`).
- [ ] Capa de services con estados de carga/vacío/error visibles.
- [ ] `expo-camera`/`expo-image-picker` + `expo-file-system` (API nueva: `File`, `Directory`, `Paths`).
- [ ] `expo-location` + `react-native-maps`, usable sin permiso de ubicación.
- [ ] `expo-notifications` disparadas por un hecho real.
- [ ] `expo-sqlite` + `expo-sqlite/kv-store`, app usable sin conexión, `expo-network`.
- [ ] Uso justificado de `expo-sensors` o `expo-haptics`.
- [ ] `expo-audio` para la nota de voz, con controles visibles.
- [ ] Ícono propio (1024×1024 sin transparencias) y splash screen.

## 10. Cosas que la documentación vieja de internet dice mal

- `expo-av` no existe más → es `expo-audio` y `expo-video`.
- La API vieja de `expo-file-system` tira error en tiempo de ejecución → usar `File`, `Directory`, `Paths`.
- Los íconos son `@react-native-vector-icons/ionicons`, no `@expo/vector-icons` (deprecado).
