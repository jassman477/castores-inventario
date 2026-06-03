import { apiRequest } from './api';

/** Controlador: movimientos de inventario */
export const registrarEntrada = (payload) =>
  apiRequest('/inventario/entrada', {
    method: 'POST',
    body: payload,
  });

export const registrarSalida = (payload) =>
  apiRequest('/inventario/salida', {
    method: 'POST',
    body: payload,
  });
