import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  startTransition,
} from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../controller/authService';
import { isAdministrador, isAlmacenista } from '../model/roles';
import { clearSession, getSession, setSession } from '../utils/session';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getSession());
  const navigate = useNavigate();
  const toast = useToast();
  const isLoggingOutRef = useRef(false);

  const login = useCallback(
    async (correo, contrasena) => {
      const data = await authService.login(correo, contrasena);
      const session = {
        idUsuario: data.idUsuario,
        idRol: data.idRol,
        nombre: data.nombre,
      };
      setSession(session);
      startTransition(() => {
        setUser(session);
        navigate('/inventario', { replace: true });
      });
      toast.success(`Bienvenido, ${data.nombre}`);
    },
    [navigate, toast]
  );

  const logout = useCallback(() => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    clearSession();
    startTransition(() => {
      navigate('/login', { replace: true });
      setUser(null);
      isLoggingOutRef.current = false;
    });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isAdmin: user ? isAdministrador(user.idRol) : false,
      isAlmacenista: user ? isAlmacenista(user.idRol) : false,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
