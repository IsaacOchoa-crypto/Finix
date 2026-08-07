class TransaccionModelo {
    constructor(datos) {
        // Asignamos valores por defecto seguros por si algo falta
        this.categoria_nombre = datos.categoria_nombre || "General";
        this.monto = Number(datos.monto) || 0; // Aseguramos que sea número
        this.tipo = datos.tipo || 'gasto'; // Ej: 'gasto', 'ingreso'
        this.uid = datos.uid;   // El ID del usuario dueño de la transacción
        
        // Si no viene fecha, usamos la fecha de hoy en formato YYYY-MM-DD
        this.fecha = datos.fecha || new Date().toISOString().split('T')[0];
    }

    getDatosParaGuardar() {
        return {
            categoria_nombre: this.categoria_nombre,
            monto: this.monto,
            tipo: this.tipo,
            uid: this.uid,
            fecha: this.fecha
        };
    }
}

module.exports = TransaccionModelo;