-- Tabla roles
CREATE TABLE roles (
    idRol INT(2) PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    descripcion VARCHAR(50)
);

-- Tabla usuarios (ya existe)
CREATE TABLE usuarios (
    idUsuario INT(6) PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(50),
    contrasena VARCHAR(25),
    idRol INT(2),
    estatus INT(1)
);

-- Tabla productos
CREATE TABLE productos (
    idProducto INT(6) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    precio DECIMAL(16,2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    estatus INT(1) NOT NULL DEFAULT 1
);

-- Tabla historico
CREATE TABLE historico (
    idMovimiento INT PRIMARY KEY AUTO_INCREMENT,
    tipoMovimiento VARCHAR(20) NOT NULL,
    idUsuario INT(6) NOT NULL,
    idProducto INT(6) NOT NULL,
    cantidad INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);