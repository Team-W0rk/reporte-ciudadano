# Implementación de notificaciones push – Backend

## 1. Descripción general

Como parte del desarrollo del proyecto **Reporte Ciudadano**, se realizaron modificaciones locales en el backend proporcionado por la cátedra para implementar la gestión de dispositivos móviles y las notificaciones push.

El objetivo fue completar la funcionalidad que permite registrar los tokens de notificación de los dispositivos de los usuarios, dar de baja dichos tokens y enviar notificaciones de prueba.

Debido a que el backend original pertenece a la cátedra y no contamos con acceso directo a su repositorio para incorporar estos cambios, se adjuntan en esta carpeta los archivos modificados y creados como evidencia de la implementación.

**Tecnologías involucradas:**
- NestJS.
- TypeScript.
- TypeORM.
- Expo Push Notifications.
- Vitest para pruebas automatizadas.

## 2. Funcionalidades implementadas

### 2.1. Registro de dispositivos

**Endpoint:** `POST /dispositivos`

Permite registrar el token Expo Push del dispositivo asociado al usuario autenticado.

Comportamiento:
- Registra el token del dispositivo.
- Asocia el dispositivo a la cuenta del usuario actual.
- Permite repetir el registro sin duplicar dispositivos.
- Si el token estaba asociado a otra cuenta, se transfiere a la cuenta autenticada.
- Devuelve `201 Created` cuando se registra un dispositivo nuevo.
- Devuelve `200 OK` cuando el dispositivo ya estaba registrado.

### 2.2. Baja de dispositivos

**Endpoint:** `DELETE /dispositivos/:tokenExpo`

Permite eliminar el registro del token de notificaciones de un dispositivo.

Comportamiento:
- Elimina el token asociado a la cuenta autenticada.
- No permite dar de baja tokens pertenecientes a otros usuarios.
- Si el token ya no estaba registrado, responde igualmente con `204 No Content`.
- No devuelve contenido en la respuesta.

### 2.3. Notificación de prueba

**Endpoint:** `POST /dispositivos/prueba`

Permite enviar una notificación push de prueba a los dispositivos registrados en la cuenta autenticada.

Comportamiento:
- Busca los dispositivos registrados del usuario.
- Solicita el envío de la notificación.
- Devuelve la cantidad de notificaciones enviadas.
- Si no hay dispositivos registrados o no se envían notificaciones, puede devolver cero.

Ejemplo de respuesta:

```json
{
  "datos": {
    "enviadas": 0
  },
  "meta": null
}
```

## 3. Seguridad y validaciones

Los tres endpoints requieren autenticación mediante sesión/token de usuario.

También se incorporaron validaciones para:
- Controlar los datos recibidos al registrar un dispositivo.
- Evitar registros duplicados.
- Restringir la baja de tokens a su propietario.
- Validar que el endpoint de prueba no reciba propiedades adicionales en el cuerpo de la solicitud.

## 4. Documentación de la API

Se actualizaron las descripciones Swagger de los endpoints para reflejar su comportamiento real, eliminando las referencias anteriores a funcionalidades pendientes de implementación (`501 NO_IMPLEMENTADO`).

## 5. Pruebas realizadas

Se ejecutaron las verificaciones automatizadas del backend:

| Verificación | Resultado |
|---|---|
| Tests E2E | 1096 aprobados |
| Tests omitidos | 12 |
| Tests fallidos | 0 |
| Oxlint | 0 errores y 0 advertencias |
| Prettier | Formato correcto |
| TypeScript (`tsc --noEmit`) | Sin errores |

También se actualizaron las pruebas de los endpoints de notificaciones para comprobar su funcionamiento real, incluyendo registro, baja, envío de prueba, autenticación y validaciones.

## 6. Archivos adjuntos

En la carpeta `archivos-modificados/` se incluyen las versiones de los archivos creados o modificados durante esta implementación.

Se conserva la estructura de directorios original del backend para facilitar su identificación y eventual integración.

**Importante:** estos archivos se adjuntan como evidencia y documentación del trabajo realizado localmente. No representan una modificación directa del repositorio oficial del backend de la cátedra.

## 7. Integración con la aplicación mobile

La implementación del backend permite que la aplicación mobile pueda gestionar el ciclo de vida de los tokens Expo Push:

1. Registrar el token del dispositivo después de iniciar sesión.
2. Mantener el registro asociado a la cuenta autenticada.
3. Dar de baja el token cuando corresponda, por ejemplo, al cerrar sesión.
4. Solicitar una notificación de prueba para verificar el funcionamiento del servicio.

Esta implementación complementa el desarrollo de la aplicación **Reporte Ciudadano**, proporcionando los endpoints necesarios para la gestión de dispositivos y notificaciones push.