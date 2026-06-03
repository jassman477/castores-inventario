# Sistema de Inventario Castores

Sistema de gestión de inventario para almacén con control de roles, movimientos de entrada/salida e historial de operaciones.

## Tecnologías

| Componente | Tecnología |
|------------|------------|
| **IDE** | Cursor |
| **Lenguaje** | Java 17.0.12 |
| **Backend** | Spring Boot 3.5.14 con Maven 3.9.16 |
| **Frontend** | React con Node.js v24.15.0 |
| **DBMS** | SQL Server 2022 |
| **Patrón de diseño** | MVC |

## Arquitectura MVC

- **Modelo:** entidades JPA en el backend (`Producto`, `Usuario`, `Historico`, etc.)
- **Vista:** componentes y páginas React en `frontend/src`
- **Controlador:** servicios REST en Spring Boot y capa `frontend/src/services` que consume la API

## Requisitos previos

- Java 17+
- Maven (incluido wrapper `mvnw`)
- Node.js v24.15.0 (o compatible)
- SQL Server 2022 en ejecución

## Pasos para correr la aplicación

### 1. Base de datos

Ejecutar el script en SQL Server Management Studio (o herramienta similar):

```
SCRIPTS/inventario-sqlserver.sql
```

Esto crea la base `inventario`, tablas, roles y usuarios de prueba.

### 2. Configurar backend

Editar credenciales en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=inventario;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=TU_CONTRASEÑA
```

### 3. Iniciar backend (puerto 8080)

Desde la raíz del proyecto:

```bash
.\mvnw.cmd spring-boot:run
```

### 4. Iniciar frontend (puerto 3000)

```bash
cd frontend
npm install
npm start
```

### 5. Abrir la aplicación

Navegar a: **http://localhost:3000**

## Usuarios de prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| **Administrador** | admin@castores.com | admin123 |
| **Almacenista** | almacen@castores.com | almacen123 |

### Permisos por rol

**Administrador (idRol = 1)**

- Ver inventario
- Agregar y editar productos
- Aumentar stock (entradas)
- Dar de baja y reactivar productos
- Consultar historial

**Almacenista (idRol = 2)**

- Ver inventario (solo productos activos)
- Registrar salidas de productos

## API REST

Base URL: `http://localhost:8080/api`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Inicio de sesión |
| GET | `/productos?idUsuario=` | Listar productos |
| POST | `/productos?idUsuario=` | Crear producto |
| PUT | `/productos/{id}?idUsuario=` | Actualizar producto |
| DELETE | `/productos/{id}?idUsuario=` | Baja lógica |
| PATCH | `/productos/{id}/reactivar?idUsuario=` | Reactivar producto |
| POST | `/inventario/entrada` | Entrada de stock |
| POST | `/inventario/salida` | Salida de stock |
| GET | `/historico?idUsuario=` | Historial (filtro opcional por tipo) |

## Estructura del proyecto

```
castores-inventario/
├── src/main/java/          # Backend Spring Boot
├── src/main/resources/     # application.properties
├── frontend/src/
│   ├── services/           # Llamadas API (controlador)
│   ├── components/         # UI reutilizable (vista)
│   └── pages/              # Páginas principales (vista)
└── SCRIPTS/                # Scripts SQL Server
```

## Licencia

Proyecto de prueba técnica — Castores.
