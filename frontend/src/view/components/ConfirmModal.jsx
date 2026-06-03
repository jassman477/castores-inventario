import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

/**
 * Modal de confirmación reutilizable (sustituto de window.confirm).
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  variant = 'danger',
  icon: Icon = AlertTriangle,
  iconClassName,
}) {
  const confirmClasses = {
    danger:
      'min-w-[140px] rounded-lg border border-red-500/40 bg-red-500/15 px-5 py-3 text-sm font-semibold text-[#f87171] transition-colors hover:border-red-500/60 hover:bg-red-500/25 hover:text-[#fca5a5] disabled:opacity-50',
    success:
      'min-w-[140px] rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-[#4ade80] transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/25 hover:text-[#86efac] disabled:opacity-50',
  };

  const confirmClass = confirmClasses[variant] ?? 'btn-primary-accent min-w-[140px] py-3';

  const defaultIconClasses = {
    danger: 'bg-red-500/10 text-[#f87171]',
    success: 'bg-emerald-500/10 text-[#4ade80]',
  };

  const iconWrapClass =
    iconClassName ?? defaultIconClasses[variant] ?? 'bg-blue-500/10 text-[#60a5fa]';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdrop={!loading}
      title={title}
      icon={Icon}
      iconClassName={iconWrapClass}
      size="md"
    >
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-slate-300">{message}</p>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-600/50 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-secondary min-w-[120px] py-3"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button type="button" className={confirmClass} onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
