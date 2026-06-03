import { apiRequest } from './api';

/** Controlador: autenticación */
export const login = (correo, contrasena) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: { correo, contrasena },
  });
