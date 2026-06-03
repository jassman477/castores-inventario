export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'blue' }) {
  const accents = {
    blue: {
      border: 'border-l-blue-500',
      icon: 'text-blue-400/80',
      glow: 'from-blue-500/10',
    },
    green: {
      border: 'border-l-emerald-500',
      icon: 'text-emerald-400/80',
      glow: 'from-emerald-500/10',
    },
    orange: {
      border: 'border-l-orange-500',
      icon: 'text-orange-400/80',
      glow: 'from-orange-500/10',
    },
    purple: {
      border: 'border-l-purple-500',
      icon: 'text-purple-400/80',
      glow: 'from-purple-500/10',
    },
  };

  const style = accents[accent] || accents.blue;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-surface-600/50 bg-surface-800/40 border-l-[3px] ${style.border} p-5 transition-all duration-200 hover:border-surface-600 hover:bg-surface-800/60 sm:p-6`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.glow} to-transparent opacity-60`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            {Icon && <Icon className={`h-4 w-4 shrink-0 ${style.icon}`} strokeWidth={1.75} />}
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {title}
            </p>
          </div>

          <div className="my-4 h-px w-full bg-gradient-to-r from-surface-600/80 to-transparent" />

          <p className="truncate text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
            {value}
          </p>
          {subtitle && (
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
