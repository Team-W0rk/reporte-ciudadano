# Reporte Ciudadano

Aplicación móvil desarrollada como proyecto final de la materia **Desarrollo para Móviles** de la Universidad Nacional de Entre Ríos (UNER).
Permite que los vecinos de la ciudad de **Gualeguaychú** registren y consulten problemas urbanos, como baches, luminarias dañadas, acumulación de basura y otras incidencias en la vía pública.

## 1. Tecnologías utilizadas
- **React Native**
- **Expo**
- **Expo Router** para la navegación.
- **TypeScript**
- **Axios** para las solicitudes HTTP.
- **React Native Maps** para la visualización del mapa.
- **Expo Location** para obtener la ubicación.
- **Expo Image Picker / Camera** para adjuntar fotografías.
- **Expo Notifications** para las notificaciones.
- **EAS Build** para generar la aplicación Android.

## 2. Requisitos previos
Para ejecutar el proyecto se necesita:
- Node.js.
- npm.
- Expo CLI.
- Android Studio o un dispositivo Android para probar la aplicación.
- Acceso a la API del proyecto.

## 3. Instalación y ejecución
Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar a la carpeta:

```bash
cd reporte-ciudadano
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Configurar las variables de entorno correspondientes.

Ejecutar el proyecto:

```bash
npx expo start
```

Para abrir la aplicación en Android:

```bash
npx expo start --android
```

## 4. Arquitectura del proyecto
```text
reporte-ciudadano/
├── assets/              # Imágenes, íconos y recursos gráficos
├── scripts/             # Scripts auxiliares
├── src/
│   ├── almacenamiento/  # Persistencia y almacenamiento local
│   ├── app/             # Pantallas y navegación (Expo Router)
│   ├── components/      # Componentes reutilizables
│   ├── constants/       # Constantes y configuración
│   ├── context/         # Contextos globales
│   ├── hooks/           # Hooks personalizados
│   ├── services/        # Comunicación con la API
│   ├── types/           # Tipos e interfaces TypeScript
│   └── utils/           # Funciones auxiliares
├── _vscode/             # Configuración del editor
├── .env.example         # Ejemplo de variables de entorno
├── app.json             # Configuración de Expo
├── eas.json             # Configuración de builds EAS
├── expo-env.d.ts        # Tipos de entorno de Expo
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
└── use-color-scheme.ts  # Configuración del tema
```

## 5. Funcionalidades principales
### Para vecinos
- Visualización de reportes en el mapa de la ciudad.
- Registro de nuevos reportes urbanos.
- Selección del tipo de problema.
- Captura o selección de fotografías.
- Obtención de ubicación mediante GPS.
- Registro de dirección y descripción.
- Grabación de notas de audio.
- Consulta del estado de los reportes.
- Posibilidad de sumarse a reportes existentes.
- Gestión de reportes sin conexión mediante almacenamiento local y sincronización posterior.

### Para operadores municipales
- Visualización de reportes recibidos.
- Consulta de información y fotografías.
- Seguimiento de los estados de los reportes.
- Gestión de incidencias desde la bandeja de operadores.

## 6. Estados de los reportes
Los reportes pueden atravesar los siguientes estados:

| Estado | Descripción |
|---|---|
| Recibido | El reporte fue registrado. |
| En revisión | El municipio está evaluando el problema. |
| Asignado | El reporte fue asignado para su resolución. |
| Resuelto | El problema fue solucionado. |
| Rechazado | El reporte fue rechazado. |

## 7. Conexión con la API
La aplicación consume la API proporcionada para el proyecto.
La URL base se configura mediante la variable de entorno:

```env
EXPO_PUBLIC_API_URL=https://api-reporte-ciudadano-yvth.onrender.com
```

La aplicación utiliza Axios para centralizar las solicitudes HTTP.
La API se encuentra publicada en Render y utiliza una base de datos PostgreSQL alojada en Supabase, junto con almacenamiento de archivos externo.

**Importante:** el servicio gratuito de Render puede entrar en suspensión después de un período de inactividad. Por eso, la primera solicitud puede demorar mientras el servidor vuelve a iniciarse.

## 8. Configuración de mapas y problema en la APK
Durante el desarrollo se utilizó `react-native-maps` para mostrar el mapa de Gualeguaychú y la ubicación de los reportes.

### Funcionamiento en desarrollo
En el entorno de desarrollo, utilizando Expo Go, el mapa funciona correctamente.

### Problema en la versión APK
Al generar una APK independiente mediante EAS Build, la aplicación se cierra al ingresar a la pantalla del mapa.
El error registrado en Android es:

```text
java.lang.IllegalStateException:
API key not found.

Check that <meta-data
android:name="com.google.android.geo.API_KEY"
android:value="your API key"/>
is in the <application> element
of AndroidManifest.xml
```

### Causa

La versión Android de `react-native-maps` utiliza Google Maps y necesita una API Key configurada en el manifiesto de Android.
Expo Go dispone de su propia configuración para los mapas, por eso funciona durante el desarrollo. Sin embargo, esa configuración no se incorpora automáticamente a una APK independiente.
Para configurar Google Maps en una aplicación propia se necesita generar una API Key desde Google Cloud y habilitar los servicios correspondientes. La configuración también requiere asociar una cuenta de facturación.

**Esta configuración no se realizó porque el equipo no desea asociar una tarjeta bancaria.**

### Alternativa pendiente
Se plantea evaluar **OpenStreetMap** como alternativa para mostrar los mapas sin depender de una API Key de Google Maps.
Esta migración queda pendiente de implementación y pruebas en una nueva APK.

## 9. Generación de APK
El proyecto utiliza EAS Build para generar una versión instalable de Android.
El perfil `preview` de `eas.json` está configurado para generar una APK:

```json
{
  "build": {
    "preview": {
      "environment": "preview",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

La variable `EXPO_PUBLIC_API_URL` debe estar configurada en el entorno `preview` de EAS.

Para generar la APK:

```bash
eas build --platform android --profile preview
```

Una vez finalizado el proceso, EAS proporciona un enlace para descargar el archivo APK.

**Aclaración:** generar correctamente la APK no garantiza que todas las funcionalidades estén operativas. La pantalla del mapa tiene el inconveniente de configuración explicado en la sección anterior.

## 10. Variables de entorno
El proyecto utiliza variables de entorno para configurar la conexión con la API.

Archivo `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Para desarrollo local se debe utilizar la dirección correspondiente al entorno de ejecución. Para la APK se debe configurar la URL pública de la API.
No se debe subir el archivo `.env` con configuraciones locales o credenciales al repositorio.

## 11. Consideraciones de desarrollo
- Se utiliza TypeScript para mejorar el tipado y mantenimiento del código.
- La navegación está implementada con Expo Router.
- Los componentes reutilizables se organizan dentro de `src/components`.
- La comunicación con la API se centraliza en `src/services`.
- Las constantes, tipos, hooks y utilidades se mantienen separados para facilitar el mantenimiento.
- Se contempla el funcionamiento sin conexión y la sincronización posterior de reportes.
- Se deben probar las funcionalidades tanto en desarrollo como en una APK independiente.

## 12. Estado actual del proyecto
| Funcionalidad | Estado |
|---|---|
| Configuración inicial de Expo | Implementada |
| Navegación con Expo Router | Implementada |
| Conexión con la API | Implementada |
| Registro de reportes | Implementado |
| Captura de fotografías | Implementada |
| Obtención de ubicación | Implementada |
| Visualización de mapas en desarrollo | Funciona |
| Visualización de mapas en APK | Pendiente de resolver |
| Seguimiento de reportes | Implementado |
| Gestión de reportes offline | Implementada |
| Generación de APK mediante EAS | Configurada |
| Migración a OpenStreetMap | Pendiente |

---

**Proyecto académico – Universidad Nacional de Entre Ríos (UNER)**  
Tecnicatura Universitaria en Desarrollo Web  
Materia: Desarrollo para Móviles
