package com.castores.inventario.controller;

import com.castores.inventario.dto.HistoricoResponse;
import com.castores.inventario.service.HistoricoService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/historico")
public class HistoricoController {

    private final HistoricoService historicoService;

    public HistoricoController(HistoricoService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping
    public ResponseEntity<List<HistoricoResponse>> listar(
            @RequestParam Integer idUsuario,
            @RequestParam(required = false) String tipoMovimiento) {
        return ResponseEntity.ok(historicoService.listar(idUsuario, tipoMovimiento));
    }
}
