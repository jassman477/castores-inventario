import { useCallback, useEffect, useState } from 'react';
import { ArrowDownCircle, Hash, AlertCircle, Info, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ApiError } from '../services/api';
import * as productoService from '../services/productoService';
import * as inventarioService from '../services/inventarioService';

const formatMoney = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

export default function SalidaPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [idProducto, setIdProducto] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [errors, setErrors] = useState({});

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productoService.listarProductos(user.idUsuario, true);
      setProductos(data.filter((p) => p.estatus === 1));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [user.idUsuario, toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const productoSel = productos.find((p) => p.idProducto === idProducto);

  const validateCantidad = (value, producto) => {
    if (!producto) return '';
    const qty = parseInt(value, 10);
    if (value === '') return '';
    if (isNaN(qty) || qty <= 0) return 'La cantidad debe ser mayor a 0';
    if (qty > producto.cantidad) {
      return `No puede sacar más del disponible (${producto.cantidad} unidades)`;
    }
    return '';
  };

  const handleSelectRow = (p) => {
    if (p.cantidad <= 0) return;
    setIdProducto(p.idProducto);
    setCantidad('');
    setErrors({});
  };

  const handleCantidadChange = (e) => {
    const value = e.target.value;
    setCantidad(value);
    if (productoSel) {
      const msg = validateCantidad(value, productoSel);
      setErrors((prev) => ({ ...prev, cantidad: msg || undefined }));
    }
  };

  const validateForm = () => {
    const next = {};
    if (!idProducto) next.producto = 'Seleccione un producto de la tabla';
    if (productoSel) {
      const msg = validateCantidad(cantidad, productoSel);
      if (msg) next.cantidad = msg;
      else if (!cantidad) next.cantidad = 'Ingrese la cantidad a retirar';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await inventarioService.registrarSalida({
        idUsuario: user.idUsuario,
        idProducto: idProducto,
        cantidad: parseInt(cantidad, 10),
      });
      toast.success('Salida registrada');
      setIdProducto(null);
      setCantidad('');
      setErrors({});
      cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al registrar salida');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout
      title="Salida de productos"
      subtitle="Registre retiros de productos activos del almacén"
    >
      <div className="page-section">
        {loading ? (
          <div className="flex justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : productos.length === 0 ? (
          <p className="py-20 text-center text-sm text-slate-500">
            No hay productos activos en inventario
          </p>
        ) : (
          <>
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Info className="h-4 w-4 shrink-0 text-slate-600" />
              Haz click en un producto o en <span className="text-slate-400">Retirar</span> para
              registrar una salida
            </p>

            <div className="overflow-hidden rounded-lg border border-surface-600/80 bg-surface-800/30">
              <table className="table-modern">
                <colgroup>
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '22%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th className="text-center">Stock</th>
                    <th className="text-center">Estado</th>
                    <th className="text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => {
                    const selected = idProducto === p.idProducto;
                    const sinStock = p.cantidad <= 0;
                    return (
                      <tr
                        key={p.idProducto}
                        onClick={() => handleSelectRow(p)}
                        className={`${
                          sinStock
                            ? 'cursor-not-allowed opacity-45'
                            : `table-row-clickable ${selected ? 'table-row-selected-salida' : ''}`
                        }`}
                      >
                        <td className="font-mono text-[11px] text-slate-500 sm:text-xs">
                          #{p.idProducto}
                        </td>
                        <td className="wrap-cell font-medium text-slate-200">{p.nombre}</td>
                        <td className="text-slate-400">{formatMoney(p.precio)}</td>
                        <td className="text-center">
                          <span
                            className={
                              sinStock ? 'text-slate-500' : 'font-medium text-slate-300'
                            }
                          >
                            {p.cantidad}
                          </span>
                        </td>
                        <td className="text-center">
                          <Badge variant={sinStock ? 'default' : 'success'} size="md">
                            {sinStock ? 'Sin stock' : 'Activo'}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            disabled={sinStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectRow(p);
                            }}
                            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                              sinStock
                                ? 'cursor-not-allowed border-slate-700/50 bg-transparent text-slate-600'
                                : selected
                                  ? 'border-[#60a5fa]/50 bg-blue-500/15 text-[#93c5fd]'
                                  : 'border-slate-600/80 bg-slate-800/50 text-[#60a5fa] hover:border-[#60a5fa]/40 hover:bg-blue-500/10 hover:text-[#93c5fd]'
                            }`}
                          >
                            {selected ? 'Seleccionado' : 'Retirar'}
                            {!sinStock && <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {productoSel && productoSel.cantidad > 0 && (
              <div className="animate-slide-up rounded-lg border border-slate-600/50 bg-[#1e2330] p-6 shadow-lg sm:p-8">
                <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-6">
                  <div className="grid gap-4 border-b border-slate-600/50 pb-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Producto seleccionado
                      </p>
                      <p className="mt-1 font-medium text-slate-100">{productoSel.nombre}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Disponible
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-200">
                        {productoSel.cantidad} uds.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cantidad-salida" className="field-label">
                      Cantidad a retirar
                    </label>
                    <div className="input-with-icon">
                      <Hash className="input-icon" />
                      <input
                        id="cantidad-salida"
                        type="number"
                        min="1"
                        max={productoSel.cantidad}
                        className={`input-field-lg ${errors.cantidad ? 'input-field-error' : ''}`}
                        placeholder={`Máximo ${productoSel.cantidad}`}
                        value={cantidad}
                        onChange={handleCantidadChange}
                        disabled={submitting}
                        autoFocus
                      />
                    </div>
                    {errors.cantidad ? (
                      <p className="field-error">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {errors.cantidad}
                      </p>
                    ) : (
                      <p className="field-hint">
                        Máximo: {productoSel.cantidad} unidades.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-accent w-full py-3.5"
                    disabled={submitting}
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                    {submitting ? 'Registrando...' : 'Confirmar salida'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
