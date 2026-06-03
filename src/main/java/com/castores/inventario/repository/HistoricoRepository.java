package com.castores.inventario.repository;

import com.castores.inventario.model.Historico;
import com.castores.inventario.model.TipoMovimiento;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HistoricoRepository extends JpaRepository<Historico, Integer> {

    @Query("SELECT h FROM Historico h JOIN FETCH h.usuario JOIN FETCH h.producto ORDER BY h.fecha DESC")
    List<Historico> findAllOrderByFechaDesc();

    @Query("SELECT h FROM Historico h JOIN FETCH h.usuario JOIN FETCH h.producto "
            + "WHERE h.tipoMovimiento = :tipo ORDER BY h.fecha DESC")
    List<Historico> findByTipoOrderByFechaDesc(@Param("tipo") TipoMovimiento tipo);
}
