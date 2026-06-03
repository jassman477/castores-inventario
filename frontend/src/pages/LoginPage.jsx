import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Boxes, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ApiError } from '../services/api';
import { isAuthenticated } from '../utils/session';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/inventario" replace />;
  }

  const validate = () => {
    const next = {};
    if (!correo.trim()) next.correo = 'Ingrese su correo';
    if (!contrasena) next.contrasena = 'Ingrese su contraseña';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(correo.trim(), contrasena);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Error al iniciar sesión';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-900 p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-success/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(51 65 85 / 0.35) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-blue-700 shadow-glow">
            <Boxes className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Castores Inventario</h1>
          <p className="mt-2 text-slate-400">Sistema de gestión de almacén</p>
        </div>

        <div className="rounded-2xl border border-surface-600 bg-surface-800/90 p-8 shadow-card backdrop-blur-xl">
          <h2 className="mb-6 text-lg font-semibold text-white">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Correo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  className={`input-field-lg ${errors.correo ? 'input-field-error' : ''}`}
                  placeholder="admin@castores.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.correo && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                  <AlertCircle className="h-3 w-3" /> {errors.correo}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  className={`input-field-lg ${errors.contrasena ? 'input-field-error' : ''}`}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.contrasena && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                  <AlertCircle className="h-3 w-3" /> {errors.contrasena}
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary-accent w-full py-3.5" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" /> Ingresando...
                </span>
              ) : (
                'Entrar al sistema'
              )}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-surface-600 bg-surface-700/50 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-400">Usuarios de prueba</p>
            <p className="mt-1">Admin: admin@castores.com / admin123</p>
            <p>Almacén: almacen@castores.com / almacen123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
