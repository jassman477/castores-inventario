export default function Tooltip({ children, text }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg
          border border-surface-600 bg-surface-700 px-3 py-1.5 text-xs font-medium text-slate-200 opacity-0 shadow-lg
          transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
