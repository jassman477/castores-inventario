package com.castores.inventario.service;

import com.castores.inventario.dto.ProductoRequest;
import com.castores.inventario.exception.BusinessException;
import com.castores.inventario.model.Producto;
import com.castores.inventario.model.Usuario;
import com.castores.inventario.repository.ProductoRepository;
import com.castores.inventario.util.RolIds;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final PermisoService permisoService;

    public ProductoService(ProductoRepository productoRepository, PermisoService permisoService) {
        this.productoRepository = productoRepository;
        this.permisoService = permisoService;
    }

    public List<Producto> listar(Integer idUsuario, boolean soloActivos) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(idUsuario);
        permisoService.validarVerInventario(usuario);

        boolean incluirInactivos = !soloActivos
                && usuario.getRol().getIdRol() == RolIds.ADMINISTRADOR;
        if (incluirInactivos) {
            return productoRepository.findAll();
        }
        return productoRepository.findByEstatus(1);
    }

    public Producto obtenerPorId(Integer id, Integer idUsuario) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(idUsuario);
        permisoService.validarVerInventario(usuario);
        return productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado", HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Producto crear(ProductoRequest request, Integer idUsuario) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(idUsuario);
        permisoService.validarAdministrador(usuario);

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setCantidad(request.getCantidad() != null ? request.getCantidad() : 0);
        producto.setEstatus(1);
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto actualizar(Integer id, ProductoRequest request, Integer idUsuario) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(idUsuario);
        permisoService.validarAdministrador(usuario);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado", HttpStatus.NOT_FOUND));

        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        return productoRepository.save(producto);
    }

    @Transactional
    public void darDeBaja(Integer id, Integer idUsuario) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(idUsuario);
        permisoService.validarAdministrador(usuario);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado", HttpStatus.NOT_FOUND));
        producto.setEstatus(0);
        productoRepository.save(producto);
    }

    @Transactional
    public Producto reactivar(Integer id, Integer idUsuario) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(idUsuario);
        permisoService.validarAdministrador(usuario);

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Producto no encontrado", HttpStatus.NOT_FOUND));
        if (producto.getEstatus() != null && producto.getEstatus() == 1) {
            throw new BusinessException("El producto ya está activo");
        }
        producto.setEstatus(1);
        return productoRepository.save(producto);
    }
}
