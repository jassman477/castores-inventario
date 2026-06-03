import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import InventarioPage from './pages/InventarioPage';
import SalidaPage from './pages/SalidaPage';
import HistorialPage from './pages/HistorialPage';
import { ROLES } from './constants/roles';
import { isAuthenticated } from './utils/session';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated() ? '/inventario' : '/login'} replace />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/inventario"
              element={
                <ProtectedRoute>
                  <InventarioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salida"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ALMACENISTA]}>
                  <SalidaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMINISTRADOR]}>
                  <HistorialPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
