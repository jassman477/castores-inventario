package com.castores.inventario.dto;

import com.castores.inventario.model.Historico;
import com.castores.inventario.model.TipoMovimiento;
import java.time.LocalDateTime;

public class HistoricoResponse {

    private Integer idMovimiento;
    private TipoMovimiento tipoMovimiento;
    private Integer idUsuario;
    private String nombreUsuario;
    private Integer idProducto;
    private String nombreProducto;
    private Integer cantidad;
    private LocalDateTime fecha;

    public static HistoricoResponse from(Historico h) {
        HistoricoResponse dto = new HistoricoResponse();
        dto.idMovimiento = h.getIdMovimiento();
        dto.tipoMovimiento = h.getTipoMovimiento();
        dto.idUsuario = h.getUsuario().getIdUsuario();
        dto.nombreUsuario = h.getUsuario().getNombre();
        dto.idProducto = h.getProducto().getIdProducto();
        dto.nombreProducto = h.getProducto().getNombre();
        dto.cantidad = h.getCantidad();
        dto.fecha = h.getFecha();
        return dto;
    }

    public Integer getIdMovimiento() {
        return idMovimiento;
    }

    public TipoMovimiento getTipoMovimiento() {
        return tipoMovimiento;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }
}
