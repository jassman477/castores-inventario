package com.castores.inventario.service;

import com.castores.inventario.dto.LoginRequest;
import com.castores.inventario.dto.LoginResponse;
import com.castores.inventario.exception.BusinessException;
import com.castores.inventario.model.Usuario;
import com.castores.inventario.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new BusinessException("Credenciales incorrectas", HttpStatus.UNAUTHORIZED));

        if (!usuario.getContrasena().equals(request.getContrasena())) {
            throw new BusinessException("Credenciales incorrectas", HttpStatus.UNAUTHORIZED);
        }

        if (usuario.getEstatus() == null || usuario.getEstatus() != 1) {
            throw new BusinessException("Usuario inactivo", HttpStatus.FORBIDDEN);
        }

        return new LoginResponse(
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().getIdRol(),
                usuario.getRol().getNombre()
        );
    }
}
