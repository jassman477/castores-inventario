export default function Toggle({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
          checked
            ? 'border-accent/50 bg-accent/40'
            : 'border-surface-600 bg-surface-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-slate-200 shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </label>
  );
}
