import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  subtitleChip = false,
  chipVariant = 'emerald',
  icon: Icon,
  iconClassName = 'bg-blue-500/10 text-[#60a5fa]',
  children,
  size = 'md',
  closeOnBackdrop = true,
}) {
  const chipStyles = {
    emerald: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-300/95',
    blue: 'border-blue-500/30 bg-blue-950/80 text-blue-300/95',
  };
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div
        className="absolute inset-0 bg-black/88 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fade-in"
        onClick={closeOnBackdrop && onClose ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className={`modal-panel relative w-full ${sizes[size]} animate-slide-up overflow-hidden rounded-xl border border-slate-600/40 bg-[#1e2330] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.04)]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="border-b border-slate-600/50 px-6 py-6 sm:px-10 sm:py-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              {Icon && (
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
              )}
              <div className="min-w-0">
                <h2
                  id="modal-title"
                  className="text-xl font-bold tracking-tight text-white sm:text-2xl"
                >
                  {title}
                </h2>
                {subtitle && subtitleChip && (
                  <span
                    className={`mt-3 inline-flex max-w-full items-center truncate rounded-full border px-3 py-1 text-xs font-semibold ${chipStyles[chipVariant] || chipStyles.emerald}`}
                  >
                    {subtitle}
                  </span>
                )}
                {subtitle && !subtitleChip && (
                  <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={!onClose}
              className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors duration-150 hover:bg-slate-700/50 hover:text-slate-300 disabled:invisible"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="bg-[#1e2330] px-6 py-7 sm:px-10 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
