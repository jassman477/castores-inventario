import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/session';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const session = JSON.parse(localStorage.getItem('castores_session') || '{}');
    if (!allowedRoles.includes(Number(session.idRol))) {
      return <Navigate to="/inventario" replace />;
    }
  }

  return children;
}
