import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout({ children, title, subtitle }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-900 lg:pl-64">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-surface-600 bg-surface-900/95 px-4 py-5 backdrop-blur-md lg:px-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-xl border border-surface-600 p-2.5 text-slate-400 transition-colors lg:hidden hover:bg-surface-700 hover:text-white"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm leading-relaxed text-slate-400 lg:text-base">{subtitle}</p>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 animate-fade-in lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
