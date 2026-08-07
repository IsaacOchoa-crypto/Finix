class CrmModelo {
    constructor(datos) {
        this.nivel_riesgo = datos.nivel_riesgo || "bajo";
        this.notas_internas = datos.notas_internas || "";
        this.status_cliente = datos.status_cliente || "nuevo";
    }

    getDatosParaGuardar() {
        return {
            nivel_riesgo: this.nivel_riesgo,
            notas_internas: this.notas_internas,
            status_cliente: this.status_cliente,
            ultima_actualizacion: new Date().toISOString()
        };
    }
}

module.exports = CrmModelo;