package com.castores.inventario.service;

import com.castores.inventario.exception.BusinessException;
import com.castores.inventario.model.Usuario;
import com.castores.inventario.repository.UsuarioRepository;
import com.castores.inventario.util.RolIds;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class PermisoService {

    private final UsuarioRepository usuarioRepository;

    public PermisoService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario obtenerUsuarioActivo(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        if (usuario.getEstatus() == null || usuario.getEstatus() != 1) {
            throw new BusinessException("Usuario inactivo", HttpStatus.FORBIDDEN);
        }
        if (usuario.getRol() == null) {
            throw new BusinessException("Usuario sin rol asignado", HttpStatus.FORBIDDEN);
        }
        return usuario;
    }

    /** Administrador y Almacenista pueden consultar el inventario. */
    public void validarVerInventario(Usuario usuario) {
        int idRol = usuario.getRol().getIdRol();
        if (idRol != RolIds.ADMINISTRADOR && idRol != RolIds.ALMACENISTA) {
            throw new BusinessException("No tiene permiso para ver el inventario", HttpStatus.FORBIDDEN);
        }
    }

    /** Solo Administrador: alta, edición, baja, reactivación, entradas e historial. */
    public void validarAdministrador(Usuario usuario) {
        if (usuario.getRol().getIdRol() != RolIds.ADMINISTRADOR) {
            throw new BusinessException("Solo el administrador puede realizar esta acción", HttpStatus.FORBIDDEN);
        }
    }

    /** Solo Almacenista: salida de productos. */
    public void validarSalidaInventario(Usuario usuario) {
        if (usuario.getRol().getIdRol() != RolIds.ALMACENISTA) {
            throw new BusinessException("Solo el almacenista puede registrar salidas", HttpStatus.FORBIDDEN);
        }
    }
}
