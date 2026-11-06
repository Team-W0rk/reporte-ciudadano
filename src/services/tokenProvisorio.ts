// TODO (Dev 1): reemplazar por el token real de la sesión. Mientras tanto,
// pegar en .env un token de POST /auth/ingreso (EXPO_PUBLIC_TOKEN_DEMO=...).
// Está en un solo archivo para cambiarlo en un único lugar cuando exista el login.
export const obtenerToken = () => process.env.EXPO_PUBLIC_TOKEN_DEMO ?? '';