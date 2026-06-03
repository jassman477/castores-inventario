export default function Badge({ children, variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-surface-700/80 text-slate-400 border-surface-600',
    success: 'bg-emerald-500/10 text-emerald-400/90 border-emerald-500/25',
    danger: 'bg-red-500/10 text-red-400/90 border-red-500/25',
    warning: 'bg-amber-500/10 text-amber-400/90 border-amber-500/25',
    info: 'bg-blue-500/10 text-blue-400/90 border-blue-500/25',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
