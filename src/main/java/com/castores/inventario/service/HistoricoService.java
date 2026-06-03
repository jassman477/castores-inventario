package com.castores.inventario.service;

import com.castores.inventario.dto.HistoricoResponse;
import com.castores.inventario.exception.BusinessException;
import com.castores.inventario.model.TipoMovimiento;
import com.castores.inventario.model.Usuario;
import com.castores.inventario.repository.HistoricoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HistoricoService {

    private final HistoricoRepository historicoRepository;
    private final PermisoService permisoService;

    public HistoricoService(HistoricoRepository historicoRepository, PermisoService permisoService) {
        this.historicoRepository = historicoRepository;
        this.permisoService = permisoService;
    }

    public List<HistoricoResponse> listar(Integer idUsuario, String tipoMovimiento) {
        Usuario usuario = permisoService.obtenerUsuarioActivo(idUsuario);
        permisoService.validarAdministrador(usuario);

        if (tipoMovimiento == null || tipoMovimiento.isBlank()) {
            return historicoRepository.findAllOrderByFechaDesc().stream()
                    .map(HistoricoResponse::from)
                    .toList();
        }

        TipoMovimiento tipo;
        try {
            tipo = TipoMovimiento.valueOf(tipoMovimiento.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("Tipo de movimiento inválido. Use ENTRADA o SALIDA");
        }

        return historicoRepository.findByTipoOrderByFechaDesc(tipo).stream()
                .map(HistoricoResponse::from)
                .toList();
    }
}
