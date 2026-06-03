export const ROLES = {
  ADMINISTRADOR: 1,
  ALMACENISTA: 2,
};

export const isAdministrador = (idRol) => Number(idRol) === ROLES.ADMINISTRADOR;
export const isAlmacenista = (idRol) => Number(idRol) === ROLES.ALMACENISTA;
