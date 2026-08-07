class CategoriaModelo {
    constructor(datos) {
        this.nombre = datos.nombre;
        this.es_global = datos.es_global === true;
        this.palabras_clave = Array.isArray(datos.palabras_clave) ? datos.palabras_clave : [];
    }
    getDatosParaGuardar() {
        return {
            nombre: this.nombre,
            es_global: this.es_global,
            palabras_clave: this.palabras_clave
        };
    }
}
module.exports = CategoriaModelo;