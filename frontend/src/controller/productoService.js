import { apiRequest } from './api';

/** Controlador: productos */
export const listarProductos = (idUsuario, soloActivos = true) =>
  apiRequest(`/productos?idUsuario=${idUsuario}&soloActivos=${soloActivos}`);

export const obtenerProducto = (id, idUsuario) =>
  apiRequest(`/productos/${id}?idUsuario=${idUsuario}`);

export const crearProducto = (idUsuario, data) =>
  apiRequest(`/productos?idUsuario=${idUsuario}`, {
    method: 'POST',
    body: data,
  });

export const actualizarProducto = (id, idUsuario, data) =>
  apiRequest(`/productos/${id}?idUsuario=${idUsuario}`, {
    method: 'PUT',
    body: data,
  });

export const darDeBajaProducto = (id, idUsuario) =>
  apiRequest(`/productos/${id}?idUsuario=${idUsuario}`, {
    method: 'DELETE',
  });

export const reactivarProducto = (id, idUsuario) =>
  apiRequest(`/productos/${id}/reactivar?idUsuario=${idUsuario}`, {
    method: 'PATCH',
  });
