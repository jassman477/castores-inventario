const SESSION_KEY = 'castores_session';

export const getSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSession = ({ idUsuario, idRol, nombre }) => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      idUsuario: Number(idUsuario),
      idRol: Number(idRol),
      nombre,
    })
  );
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = () => {
  const session = getSession();
  return session?.idUsuario != null && session?.idRol != null;
};
