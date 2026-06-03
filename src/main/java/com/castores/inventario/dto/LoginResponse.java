package com.castores.inventario.dto;

public class LoginResponse {

    private Integer idUsuario;
    private String nombre;
    private String correo;
    private Integer idRol;
    private String nombreRol;

    public LoginResponse(Integer idUsuario, String nombre, String correo, Integer idRol, String nombreRol) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.correo = correo;
        this.idRol = idRol;
        this.nombreRol = nombreRol;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public Integer getIdRol() {
        return idRol;
    }

    public String getNombreRol() {
        return nombreRol;
    }
}
