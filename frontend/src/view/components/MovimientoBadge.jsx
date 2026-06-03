export default function MovimientoBadge({ tipo }) {
  const isEntrada = tipo === 'ENTRADA';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide ${
        isEntrada
          ? 'border-emerald-500/35 bg-emerald-950 text-emerald-300'
          : 'border-red-500/35 bg-red-950 text-red-300'
      }`}
    >
      {tipo}
    </span>
  );
}
