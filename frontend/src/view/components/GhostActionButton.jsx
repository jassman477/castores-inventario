export default function GhostActionButton({
  children,
  icon: Icon,
  variant = 'neutral',
  onClick,
  type = 'button',
}) {
  const variants = {
    neutral:
      'text-[#9ca3af] hover:text-[#d1d5db]',
    blue: 'text-[#60a5fa] hover:text-[#93c5fd]',
    red: 'text-[#f87171] hover:text-[#fca5a5]',
    green: 'text-[#4ade80] hover:text-[#86efac]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md bg-transparent px-2 py-1 text-[11px] font-medium transition-colors duration-150 sm:text-xs ${variants[variant]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-current" strokeWidth={2} />}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}
