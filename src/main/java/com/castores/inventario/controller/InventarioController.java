package com.castores.inventario.controller;

import com.castores.inventario.dto.MovimientoRequest;
import com.castores.inventario.model.Historico;
import com.castores.inventario.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @PostMapping("/entrada")
    public ResponseEntity<Historico> entrada(@Valid @RequestBody MovimientoRequest request) {
        Historico movimiento = inventarioService.registrarEntrada(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(movimiento);
    }

    @PostMapping("/salida")
    public ResponseEntity<Historico> salida(@Valid @RequestBody MovimientoRequest request) {
        Historico movimiento = inventarioService.registrarSalida(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(movimiento);
    }
}
