-- Script SQL Server 2022 para inventario Castores
-- Roles: 1 Administrador, 2 Almacenista

IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'inventario')
BEGIN
    CREATE DATABASE inventario;
END
GO

USE inventario;
GO

IF OBJECT_ID('dbo.historico', 'U') IS NOT NULL DROP TABLE dbo.historico;
IF OBJECT_ID('dbo.productos', 'U') IS NOT NULL DROP TABLE dbo.productos;
IF OBJECT_ID('dbo.usuarios', 'U') IS NOT NULL DROP TABLE dbo.usuarios;
IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL DROP TABLE dbo.roles;
GO

CREATE TABLE roles (
    idRol INT NOT NULL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE usuarios (
    idUsuario INT NOT NULL PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(50),
    contrasena VARCHAR(25),
    idRol INT NOT NULL,
    estatus INT NOT NULL DEFAULT 1,
    CONSTRAINT FK_usuarios_roles FOREIGN KEY (idRol) REFERENCES roles(idRol)
);

CREATE TABLE productos (
    idProducto INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    precio DECIMAL(16,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    estatus INT NOT NULL DEFAULT 1
);

CREATE TABLE historico (
    idMovimiento INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    tipoMovimiento VARCHAR(20) NOT NULL,
    idUsuario INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    fecha DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_historico_usuario FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    CONSTRAINT FK_historico_producto FOREIGN KEY (idProducto) REFERENCES productos(idProducto),
    CONSTRAINT CK_historico_tipo CHECK (tipoMovimiento IN ('ENTRADA', 'SALIDA'))
);

INSERT INTO roles (idRol, nombre, descripcion) VALUES
(1, 'Administrador', 'Gestiona productos, entradas, bajas y consulta historial'),
(2, 'Almacenista', 'Consulta inventario y registra salidas');

INSERT INTO usuarios (idUsuario, nombre, correo, contrasena, idRol, estatus) VALUES
(1, 'Administrador Sistema', 'admin@castores.com', 'admin123', 1, 1),
(2, 'Almacenista Principal', 'almacen@castores.com', 'almacen123', 2, 1);
GO
