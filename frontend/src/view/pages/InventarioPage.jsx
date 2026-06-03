import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Pencil,
  ArrowUpCircle,
  Ban,
  RotateCcw,
  Package,
  DollarSign,
  Archive,
  PackagePlus,
} from 'lucide-react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import Tooltip from '../components/Tooltip';
import Toggle from '../components/Toggle';
import GhostActionButton from '../components/GhostActionButton';
import ProductoFormModal from '../components/ProductoFormModal';
import EntradaStockModal from '../components/EntradaStockModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../controller/api';
import * as productoService from '../../controller/productoService';
import * as inventarioService from '../../controller/inventarioService';

const formatMoney = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

export default function InventarioPage() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const [productos, setProductos] = useState([]);
  const [todosProductos, setTodosProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soloActivos, setSoloActivos] = useState(true);
  const [modalProducto, setModalProducto] = useState(false);
  const [modalEntrada, setModalEntrada] = useState(false);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [tabla, todos] = await Promise.all([
          productoService.listarProductos(user.idUsuario, soloActivos),
          productoService.listarProductos(user.idUsuario, false),
        ]);
        setProductos(tabla);
        setTodosProductos(todos);
      } else {
        const data = await productoService.listarProductos(user.idUsuario, true);
        setProductos(data);
        setTodosProductos(data);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [user.idUsuario, isAdmin, soloActivos, toast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const stats = useMemo(() => {
    const activos = todosProductos.filter((p) => p.estatus === 1);
    const inactivos = todosProductos.filter((p) => p.estatus !== 1).length;
    const valorTotal = activos.reduce(
      (sum, p) => sum + Number(p.precio) * Number(p.cantidad),
      0
    );
    return {
      total: todosProductos.length,
      activos: activos.length,
      inactivos,
      valorTotal,
    };
  }, [todosProductos]);

  const handleCrearEditar = async (payload) => {
    setActionLoading(true);
    try {
      if (selected?.idProducto) {
        await productoService.actualizarProducto(selected.idProducto, user.idUsuario, payload);
        toast.success('Producto actualizado');
      } else {
        await productoService.crearProducto(user.idUsuario, payload);
        toast.success('Producto creado');
      }
      setModalProducto(false);
      setSelected(null);
      cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al guardar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEntrada = async (cantidad) => {
    setActionLoading(true);
    try {
      await inventarioService.registrarEntrada({
        idUsuario: user.idUsuario,
        idProducto: selected.idProducto,
        cantidad,
      });
      toast.success('Entrada registrada');
      setModalEntrada(false);
      setSelected(null);
      cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error en entrada');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBaja = async (producto) => {
    if (!window.confirm(`¿Dar de baja "${producto.nombre}"?`)) return;
    try {
      await productoService.darDeBajaProducto(producto.idProducto, user.idUsuario);
      toast.success('Producto dado de baja');
      cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al dar de baja');
    }
  };

  const handleReactivar = async (producto) => {
    try {
      await productoService.reactivarProducto(producto.idProducto, user.idUsuario);
      toast.success('Producto reactivado');
      cargar();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Error al reactivar');
    }
  };

  return (
    <Layout
      title="Inventario"
      subtitle={isAdmin ? 'Gestión de productos y stock' : 'Consulta de productos activos'}
    >
      <div className="page-section">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Productos" value={stats.total} icon={Package} accent="blue" />
          <StatCard title="Activos" value={stats.activos} icon={Package} accent="green" />
          <StatCard
            title="Inactivos"
            value={stats.inactivos}
            icon={Archive}
            accent="orange"
            subtitle="estatus = 0"
          />
          <StatCard
            title="Valor inventario"
            value={formatMoney(stats.valorTotal)}
            icon={DollarSign}
            accent="purple"
            subtitle="Σ precio × cantidad (activos)"
          />
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="btn-primary-accent w-full sm:w-auto"
              onClick={() => {
                setSelected(null);
                setModalProducto(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nuevo producto
            </button>
            <Toggle
              id="toggle-inactivos"
              checked={!soloActivos}
              onChange={(checked) => setSoloActivos(!checked)}
              label="Incluir inactivos en la tabla"
            />
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-surface-600/80 bg-surface-800/30">
          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="lg" />
            </div>
          ) : productos.length === 0 ? (
            <p className="py-20 text-center text-sm text-slate-500">No hay productos para mostrar</p>
          ) : (
            <table className="table-modern">
              <colgroup>
                <col style={{ width: isAdmin ? '7%' : '10%' }} />
                <col style={{ width: isAdmin ? '20%' : '32%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '11%' }} />
                {isAdmin && <col style={{ width: '38%' }} />}
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-center">Estado</th>
                  {isAdmin && <th className="text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => {
                  const inactivo = p.estatus !== 1;
                  return (
                    <tr key={p.idProducto} className={inactivo ? 'row-inactive' : ''}>
                      <td className="font-mono text-[11px] text-slate-500 sm:text-xs">
                        #{p.idProducto}
                      </td>
                      <td className="wrap-cell font-medium text-slate-200">{p.nombre}</td>
                      <td className="text-[11px] text-slate-400 sm:text-xs">{formatMoney(p.precio)}</td>
                      <td className="text-center text-slate-300">{p.cantidad}</td>
                      <td className="text-center">
                        <StatusBadge active={!inactivo} />
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="flex flex-row flex-wrap items-center justify-end gap-1">
                            {!inactivo && (
                              <>
                                <Tooltip text="Editar nombre y precio">
                                  <span>
                                    <GhostActionButton
                                      icon={Pencil}
                                      variant="neutral"
                                      onClick={() => {
                                        setSelected(p);
                                        setModalProducto(true);
                                      }}
                                    >
                                      Editar
                                    </GhostActionButton>
                                  </span>
                                </Tooltip>
                                <Tooltip text="Agregar unidades al inventario">
                                  <span>
                                    <GhostActionButton
                                      icon={ArrowUpCircle}
                                      variant="blue"
                                      onClick={() => {
                                        setSelected(p);
                                        setModalEntrada(true);
                                      }}
                                    >
                                      Entrada de stock
                                    </GhostActionButton>
                                  </span>
                                </Tooltip>
                                <Tooltip text="Desactivar producto">
                                  <span>
                                    <GhostActionButton
                                      icon={Ban}
                                      variant="red"
                                      onClick={() => handleBaja(p)}
                                    >
                                      Dar de baja
                                    </GhostActionButton>
                                  </span>
                                </Tooltip>
                              </>
                            )}
                            {inactivo && (
                              <Tooltip text="Reactivar en catálogo">
                                <span>
                                  <GhostActionButton
                                    icon={RotateCcw}
                                    variant="green"
                                    onClick={() => handleReactivar(p)}
                                  >
                                    Reactivar
                                  </GhostActionButton>
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalProducto}
        onClose={() => {
          setModalProducto(false);
          setSelected(null);
        }}
        title={selected?.idProducto ? 'Editar producto' : 'Nuevo producto'}
        icon={selected?.idProducto ? Pencil : PackagePlus}
        subtitle={
          selected?.idProducto
            ? 'Actualice nombre o precio'
            : 'Stock inicial: 0 unidades'
        }
        subtitleChip={!selected?.idProducto}
        size="xl"
      >
        <ProductoFormModal
          isOpen={modalProducto}
          producto={selected}
          onClose={() => setModalProducto(false)}
          onSubmit={handleCrearEditar}
          loading={actionLoading}
        />
      </Modal>

      <Modal
        isOpen={modalEntrada}
        onClose={() => {
          setModalEntrada(false);
          setSelected(null);
        }}
        title="Entrada de stock"
        icon={ArrowUpCircle}
        subtitle={
          selected
            ? `Stock actual: ${selected.cantidad} unidades`
            : ''
        }
        subtitleChip={Boolean(selected)}
        chipVariant="blue"
        size="xl"
      >
        <EntradaStockModal
          producto={selected}
          onClose={() => setModalEntrada(false)}
          onSubmit={handleEntrada}
          loading={actionLoading}
        />
      </Modal>
    </Layout>
  );
}
