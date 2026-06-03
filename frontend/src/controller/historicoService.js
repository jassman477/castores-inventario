import { apiRequest } from './api';

/** Controlador: historial */
export const listarHistorico = (idUsuario, tipoMovimiento) => {
  let url = `/historico?idUsuario=${idUsuario}`;
  if (tipoMovimiento && tipoMovimiento !== 'TODOS') {
    url += `&tipoMovimiento=${tipoMovimiento}`;
  }
  return apiRequest(url);
};
