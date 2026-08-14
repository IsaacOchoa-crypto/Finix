class UsuarioModelo {
    constructor(datos) {
        this.username = datos.username;
        this.email = datos.email;
        this.password = datos.password;
        this.salt = datos.salt;
        this.tipoUsuario = datos.tipoUsuario || "cliente";
    }

    getDatosParaGuardar(uidGenerado) {
        const datos = {
            perfil: {
                nombre: this.username || "",
                email: this.email || ""
            },
            tipoUsuario: this.tipoUsuario || "cliente",
            resumen_financiero: {
                saldo_actual: 0
            },
            uid: uidGenerado,
            fecha_registro: new Date().toISOString()
        };

        if (this.password !== undefined) datos.password = this.password;
        if (this.salt !== undefined) datos.salt = this.salt;

        return datos;
    }
}

module.exports = UsuarioModelo;