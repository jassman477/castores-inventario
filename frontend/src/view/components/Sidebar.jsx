import { NavLink } from 'react-router-dom';
import {
  Package,
  LogOut,
  History,
  ArrowDownCircle,
  Boxes,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../model/roles';

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-accent/15 text-accent shadow-glow'
      : 'text-slate-400 hover:bg-surface-700 hover:text-slate-100'
  }`;

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const links = [
    { to: '/inventario', label: 'Inventario', icon: Package, roles: [ROLES.ADMINISTRADOR, ROLES.ALMACENISTA] },
    { to: '/salida', label: 'Salida', icon: ArrowDownCircle, roles: [ROLES.ALMACENISTA] },
    { to: '/historial', label: 'Historial', icon: History, roles: [ROLES.ADMINISTRADOR] },
  ].filter((link) => link.roles.includes(Number(user?.idRol)));

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-surface-600 bg-surface-800 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-surface-600 px-5 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-muted shadow-glow">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Castores</p>
            <p className="text-xs text-slate-500">Inventario</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClass} onClick={onClose}>
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-surface-600 p-4">
          <div className="mb-3 rounded-lg bg-surface-700/80 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{user?.nombre}</p>
            <p className="text-xs text-slate-500">
              {isAdmin ? 'Administrador' : 'Almacenista'}
            </p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary w-full">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
