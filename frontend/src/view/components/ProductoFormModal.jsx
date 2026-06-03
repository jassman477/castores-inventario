import { useEffect, useState } from 'react';
import { Package, DollarSign, Boxes, AlertCircle } from 'lucide-react';

const initialForm = { nombre: '', precio: '' };

export default function ProductoFormModal({ isOpen, onClose, onSubmit, producto, loading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(producto?.idProducto);

  useEffect(() => {
    if (producto?.idProducto) {
      setForm({
        nombre: producto.nombre || '',
        precio: String(producto.precio ?? ''),
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [producto, isOpen]);

  const validate = () => {
    const next = {};
    if (!form.nombre.trim()) next.nombre = 'El nombre del producto es obligatorio';
    if (form.nombre.length > 30) next.nombre = 'Máximo 30 caracteres';
    const precio = parseFloat(form.precio);
    if (!form.precio || isNaN(precio) || precio <= 0) {
      next.precio = 'Ingrese un precio válido mayor a $0.00';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      nombre: form.nombre.trim(),
      precio: parseFloat(form.precio),
    };
    if (!isEdit) {
      payload.cantidad = 0;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nombre-producto" className="field-label">
            Nombre del producto
          </label>
          <div className="input-with-icon">
            <Package className="input-icon" />
            <input
              id="nombre-producto"
              className={`input-field-lg ${errors.nombre ? 'input-field-error' : ''}`}
              placeholder="Ej. Tornillo hexagonal 1/4 pulgada"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              maxLength={30}
            />
          </div>
          {errors.nombre ? (
            <p className="field-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.nombre}
            </p>
          ) : (
            <p className="field-hint">Máximo 30 caracteres. Visible en inventario y movimientos.</p>
          )}
        </div>

        <div>
          <label htmlFor="precio-producto" className="field-label">
            Precio unitario (MXN)
          </label>
          <div className="input-with-icon">
            <DollarSign className="input-icon" />
            <input
              id="precio-producto"
              type="number"
              step="0.01"
              min="0.01"
              className={`input-field-lg ${errors.precio ? 'input-field-error' : ''}`}
              placeholder="Ej. 25.50"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
            />
          </div>
          {errors.precio && (
            <p className="field-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errors.precio}
            </p>
          )}
        </div>

        {!isEdit && (
          <div>
            <label htmlFor="cantidad-inicial" className="field-label">
              Cantidad inicial
            </label>
            <div className="input-with-icon">
              <Boxes className="input-icon" />
              <input
                id="cantidad-inicial"
                type="number"
                value={0}
                disabled
                readOnly
                className="input-field-lg cursor-not-allowed border-slate-600/60 bg-[#151a26] text-slate-500"
              />
            </div>
            <p className="field-hint">
              Siempre inicia en <span className="text-slate-400">0 unidades</span>. Use entrada de stock
              después de crear el producto.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-600/50 pt-8 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary min-w-[140px] py-3.5" onClick={onClose} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary-accent min-w-[200px] py-3.5" disabled={loading}>
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
