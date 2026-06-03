import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options,
  id,
  className = '',
  placeholder = 'Seleccionar',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full min-w-[200px] items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/25 ${
          open
            ? 'border-surface-500 bg-surface-900 text-white ring-2 ring-accent/20'
            : 'border-surface-600/80 bg-surface-900 text-white hover:border-surface-500'
        }`}
      >
        <span className={selected ? 'font-medium text-white' : 'text-slate-500'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-slate-300' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-surface-600/90 bg-surface-900 py-1.5 shadow-2xl shadow-black/40 animate-fade-in"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                    isSelected
                      ? 'bg-surface-700/90 font-medium text-white'
                      : 'text-slate-300 hover:bg-surface-800 hover:text-white'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-accent" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
