import { useEffect, useState } from 'react';
import { Package, Hash, AlertCircle } from 'lucide-react';

export default function EntradaStockModal({ producto, onSubmit, onClose, loading }) {
  const [cantidad, setCantidad] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCantidad('');
    setError('');
  }, [producto?.idProducto]);

  const validateQty = (value) => {
    const qty = parseInt(value, 10);
    if (value === '' || value === null) return '';
    if (isNaN(qty) || qty <= 0) return 'La cantidad debe ser mayor a 0';
    return '';
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCantidad(value);
    setError(validateQty(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = validateQty(cantidad);
    if (msg) {
      setError(msg);
      return;
    }
    onSubmit(parseInt(cantidad, 10));
  };

  if (!producto) return null;

  const stockDespues = producto.cantidad + (parseInt(cantidad, 10) || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="entrada-producto" className="field-label">
            Producto
          </label>
          <div className="input-with-icon">
            <Package className="input-icon" />
            <input
              id="entrada-producto"
              type="text"
              readOnly
              value={`${producto.nombre} (ID #${producto.idProducto})`}
              className="input-field-lg cursor-default border-slate-600/60 bg-[#151a26] text-slate-300"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cantidad-entrada" className="field-label">
            Cantidad a ingresar
          </label>
          <div className="input-with-icon">
            <Hash className="input-icon" />
            <input
              id="cantidad-entrada"
              type="number"
              min="1"
              className={`input-field-lg ${error ? 'input-field-error' : ''}`}
              placeholder="Ej. 50"
              value={cantidad}
              onChange={handleChange}
              autoFocus
            />
          </div>
          {error ? (
            <p className="field-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : (
            <p className="field-hint">
              {cantidad && !error
                ? `Nuevo stock tras la entrada: ${stockDespues} unidades`
                : 'Solo valores enteros mayores a cero.'}
            </p>
          )}
        </div>

        <div>
          <label className="field-label">Stock después de entrada</label>
          <div className="input-with-icon">
            <Hash className="input-icon opacity-40" />
            <input
              type="text"
              readOnly
              value={cantidad && !error ? `${stockDespues} unidades` : '—'}
              className="input-field-lg cursor-default border-slate-600/60 bg-[#151a26] text-slate-400"
            />
          </div>
          <p className="field-hint">Vista previa según la cantidad ingresada.</p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-600/50 pt-8 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="btn-secondary min-w-[140px] py-3.5"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary-accent min-w-[200px] py-3.5"
          disabled={loading || !!error || !cantidad}
        >
          {loading ? 'Registrando...' : 'Confirmar entrada'}
        </button>
      </div>
    </form>
  );
}
