package com.castores.inventario.service;

import com.castores.inventario.dto.MovimientoRequest;
import com.castores.inventario.exception.BusinessException;
import com.castores.inventario.model.Historico;
import com.castores.inventario.model.Producto;
import com.castores.inventario.model.TipoMovimiento;
import com.castores.inventario.model.Usuario;
import com.castores.inventario.repository.HistoricoRepository;
import com.castores.inventario.repository.ProductoRepository;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventarioService {

    private final ProductoRepository productoRepository;
    private final HistoricoRepository historicoRepository;
    private final PermisoService permisoService;

    public InventarioService(
            ProductoRepository productoRepository,
            HistoricoRepository historicoRepository,
            PermisoService permisoService) {
        this.productoRepository = productoRepository;
        this.historicoRepository = historicoRepository;
        this.permisoService = permisoService;
    }

    @Transactional
    public Historico registrarEntrada(MovimientoRequest request) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(request.getIdUsuario());
        permisoService.validarAdministrador(usuario);

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new BusinessException("La entrada solo permite cantidades positivas");
        }

        Producto producto = obtenerProductoActivo(request.getIdProducto());
        producto.setCantidad(producto.getCantidad() + request.getCantidad());
        productoRepository.save(producto);

        return guardarHistorico(usuario, producto, request.getCantidad(), TipoMovimiento.ENTRADA);
    }

    @Transactional
    public Historico registrarSalida(MovimientoRequest request) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(request.getIdUsuario());
        permisoService.validarSalidaInventario(usuario);

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new BusinessException("La salida solo permite cantidades positivas");
        }

        Producto producto = obtenerProductoActivo(request.getIdProducto());

        if (producto.getCantidad() < request.getCantidad()) {
            throw new BusinessException(
                    "Stock insuficiente. Disponible: " + producto.getCantidad()
                            + ", solicitado: " + request.getCantidad());
        }

        producto.setCantidad(producto.getCantidad() - request.getCantidad());
        productoRepository.save(producto);

        return guardarHistorico(usuario, producto, request.getCantidad(), TipoMovimiento.SALIDA);
    }

    private Producto obtenerProductoActivo(Integer idProducto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new BusinessException("Producto no encontrado", HttpStatus.NOT_FOUND));
        if (producto.getEstatus() == null || producto.getEstatus() != 1) {
            throw new BusinessException("El producto no está activo");
        }
        return producto;
    }

    private Historico guardarHistorico(Usuario usuario, Producto producto, Integer cantidad, TipoMovimiento tipo) {
        Historico historico = new Historico();
        historico.setUsuario(usuario);
        historico.setProducto(producto);
        historico.setCantidad(cantidad);
        historico.setTipoMovimiento(tipo);
        historico.setFecha(LocalDateTime.now());
        return historicoRepository.save(historico);
    }
}
