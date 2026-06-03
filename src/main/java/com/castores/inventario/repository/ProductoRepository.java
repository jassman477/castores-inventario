package com.castores.inventario.repository;

import com.castores.inventario.model.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByEstatus(Integer estatus);
}
