package com.castores.inventario.controller;

import com.castores.inventario.dto.ProductoRequest;
import com.castores.inventario.model.Producto;
import com.castores.inventario.service.ProductoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> listar(
            @RequestParam Integer idUsuario,
            @RequestParam(defaultValue = "true") boolean soloActivos) {
        return ResponseEntity.ok(productoService.listar(idUsuario, soloActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(
            @PathVariable Integer id,
            @RequestParam Integer idUsuario) {
        return ResponseEntity.ok(productoService.obtenerPorId(id, idUsuario));
    }

    @PostMapping
    public ResponseEntity<Producto> crear(
            @Valid @RequestBody ProductoRequest request,
            @RequestParam Integer idUsuario) {
        Producto creado = productoService.crear(request, idUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProductoRequest request,
            @RequestParam Integer idUsuario) {
        return ResponseEntity.ok(productoService.actualizar(id, request, idUsuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> darDeBaja(
            @PathVariable Integer id,
            @RequestParam Integer idUsuario) {
        productoService.darDeBaja(id, idUsuario);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<Producto> reactivar(
            @PathVariable Integer id,
            @RequestParam Integer idUsuario) {
        return ResponseEntity.ok(productoService.reactivar(id, idUsuario));
    }
}
