export default function StatusBadge({ active }) {
  if (active) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-950/70 px-3 py-1 text-[11px] font-semibold text-emerald-300/95">
        Activo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-slate-500/30 bg-slate-800/80 px-3 py-1 text-[11px] font-semibold text-slate-400">
      Inactivo
    </span>
  );
}
