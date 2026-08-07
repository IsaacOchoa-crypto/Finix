class UsuarioModelo {
    constructor(datos) {
        this.username = datos.username;
        this.email = datos.email;
        this.password = datos.password;
        this.salt = datos.salt;
        this.tipoUsuario = datos.tipoUsuario || "cliente";
    }

    getDatosParaGuardar(uidGenerado) {
        return {
            perfil: {
                nombre: this.username,
                email: this.email
            },
            tipoUsuario: this.tipoUsuario,
            resumen_financiero: {
                saldo_actual: 0
            },
            password: this.password,
            salt: this.salt,
            uid: uidGenerado,
            fecha_registro: new Date().toISOString()
        };
    }
}

module.exports = UsuarioModelo;