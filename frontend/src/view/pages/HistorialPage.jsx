import { useCallback, useEffect, useState } from 'react';
import { useIsMounted } from '../../utils/useIsMounted';
import { History } from 'lucide-react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import MovimientoBadge from '../components/MovimientoBadge';
import CustomSelect from '../components/CustomSelect';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ApiError } from '../../controller/api';
import * as historicoService from '../../controller/historicoService';
import { FILTRO_HISTORICO_OPTIONS } from '../../model/historico';

const formatFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export default function HistorialPage() {
  const { user } = useAuth();
  const toast = useToast();
  const isMounted = useIsMounted();
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');

  const cargar = useCallback(async () => {
    if (!user?.idUsuario) return;
    setLoading(true);
    try {
      const data = await historicoService.listarHistorico(user.idUsuario, filtro);
      if (!isMounted.current) return;
      setMovimientos(data);
    } catch (err) {
      if (!isMounted.current) return;
      toast.error(err instanceof ApiError ? err.message : 'Error al cargar historial');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [user?.idUsuario, filtro, toast, isMounted]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <Layout title="Historial" subtitle="Registro de entradas y salidas del almacén">
      <div className="page-section">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-200">{movimientos.length} movimientos</p>
              <p className="text-xs text-slate-500">Más recientes primero</p>
            </div>
          </div>
          <CustomSelect
            id="filtro-historial"
            value={filtro}
            onChange={setFiltro}
            options={FILTRO_HISTORICO_OPTIONS}
            className="w-full sm:w-56"
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-surface-600/80 bg-surface-800/30">
          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="lg" />
            </div>
          ) : movimientos.length === 0 ? (
            <p className="py-20 text-center text-sm text-slate-500">Sin movimientos registrados</p>
          ) : (
            <table className="table-modern">
              <colgroup>
                <col style={{ width: '8%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '18%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Producto</th>
                  <th>Usuario</th>
                  <th className="text-center">Cant.</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m) => (
                  <tr key={m.idMovimiento}>
                    <td className="font-mono text-[11px] text-slate-500 sm:text-xs">
                      #{m.idMovimiento}
                    </td>
                    <td>
                      <MovimientoBadge tipo={m.tipoMovimiento} />
                    </td>
                    <td className="wrap-cell font-medium text-slate-200">{m.nombreProducto}</td>
                    <td className="wrap-cell text-slate-400">{m.nombreUsuario}</td>
                    <td className="text-center text-slate-300">{m.cantidad}</td>
                    <td className="text-[11px] text-slate-500 sm:text-xs">{formatFecha(m.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
