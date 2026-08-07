require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 

// Importación de rutas
const usuarioRutas = require('./routes/usuarioRutas');
const categoriaRutas = require('./routes/categoriaRutas'); 
const transaccionRutas = require('./routes/transaccionRutas'); 
const metasRutas = require('./routes/metasRutas'); 

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. CONFIGURACIÓN DE RED Y CORS (CORREGIDA)
// ==========================================

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',       // ✅ AGREGAMOS ESTE (Tu puerto actual de Vite)
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',       // ✅ Agregamos respaldo para el 5174
        'http://172.16.33.102:5173',   
        'http://172.16.33.102:5174',   // ✅ Agregamos para red escuela
        'http://192.168.137.1:5173',   
        'http://192.168.137.1:5174',   // ✅ Agregamos para hotspot
        'http://localhost:3000'
    ], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middlewares
app.use(express.json());
app.use(cookieParser()); 

// ==========================================
// 2. RUTAS
// ==========================================

app.use('/api', usuarioRutas);
app.use('/api', transaccionRutas);
app.use('/api', categoriaRutas); 
app.use('/api', metasRutas); 

app.get('/', (req, res) => {
    res.send('Backend Finix funcionando correctamente 🚀');
});

// ==========================================
// 3. INICIAR SERVIDOR
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`------------------------------------------------`);
    console.log(`🚀 Servidor Finix Multired Activo`);
    console.log(`🏠 Local:   http://localhost:${PORT}`);
    console.log(`------------------------------------------------`);
    console.log(`✅ Rutas de Usuarios, Transacciones, Categorías y Metas: LISTAS`);
});