# Sistema de Inventario Castores

## Tecnologías utilizadas
- **IDE:** Cursor
- **Lenguaje:** Java 17.0.12
- **Framework Backend:** Spring Boot 3.5.14 con Maven 3.9.16
- **Framework Frontend:** React con Node.js v24.15.0
- **DBMS:** SQL Server 2022
- **Patrón de diseño:** MVC (Model-View-Controller)

## Estructura del proyecto
### Backend (Spring Boot)
- `model/` → Entidades JPA
- `controller/` → REST Controllers
- `service/` → Lógica de negocio
- `repository/` → Acceso a datos

### Frontend (React)
- `src/model/` → Estructuras de datos y constantes
- `src/view/` → Componentes y páginas
- `src/controller/` → Servicios que consumen la API REST

## Pasos para correr la aplicación
1. Ejecutar `SCRIPTS/inventario-sqlserver.sql` en SQL Server Management Studio
2. Configurar credenciales en `src/main/resources/application.properties`
3. Correr backend: `.\mvnw.cmd spring-boot:run` (puerto 8080)
4. Correr frontend: `cd frontend && npm start` (puerto 3000)
5. Abrir `http://localhost:3000`

## Usuarios de prueba
| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@castores.com | admin123 |
| Almacenista | almacen@castores.com | almacen123 |

## Diagrama relacional de BD
El diagrama relacional se encuentra en `SCRIPTS/diagrama-relacional.png`

---

## 1. Conocimientos SQL

### 1.1 ¿Cómo funciona el JOIN?
La sentencia JOIN permite combinar registros de dos o más tablas basándose en una condición de relación entre columnas, generalmente una llave foránea con una llave primaria.

### 1.2 Tipos de JOIN
- **INNER JOIN:** Retorna solo los registros que tienen coincidencia en ambas tablas.
- **LEFT JOIN:** Retorna todos los registros de la tabla izquierda y los que coincidan de la derecha. Los que no coincidan muestran NULL.
- **RIGHT JOIN:** Retorna todos los registros de la tabla derecha y los que coincidan de la izquierda. Los que no coincidan muestran NULL.
- **FULL OUTER JOIN:** Retorna todos los registros de ambas tablas, con NULL donde no hay coincidencia.

### 1.3 ¿Qué son los TRIGGERS?
Los triggers son disparadores que se ejecutan automáticamente en respuesta a un evento (INSERT, UPDATE o DELETE) sobre una tabla. Pueden ejecutarse BEFORE o AFTER del evento y sirven para automatizar acciones como registrar cambios en un historial.

### 1.4 ¿Qué es un STORED PROCEDURE?
Es un procedimiento almacenado en la base de datos que permite ejecutar lógica compleja reutilizable. Acepta parámetros de entrada y salida, mejora el rendimiento al compilarse en caché y permite manejar transacciones (COMMIT/ROLLBACK) para proteger la integridad de los datos.

### 1.5 Productos que tengan al menos una venta
```sql
SELECT p.nombre
FROM productos AS p
INNER JOIN ventas AS v ON p.idProducto = v.idProducto;
```

### 1.6 Productos con ventas y cantidad total vendida
```sql
SELECT p.nombre, SUM(v.cantidad) AS total_vendido
FROM productos AS p
INNER JOIN ventas AS v ON p.idProducto = v.idProducto
GROUP BY p.idProducto, p.nombre;
```

### 1.7 Todos los productos y suma total en dinero vendida
```sql
SELECT p.nombre, COALESCE(SUM(p.precio * v.cantidad), 0) AS total_vendido
FROM productos AS p
LEFT JOIN ventas AS v ON p.idProducto = v.idProducto
GROUP BY p.idProducto, p.nombre;
```
