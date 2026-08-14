// src/api/axios.js
import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';

const clienteAxios = axios.create({
    // Si estamos en desarrollo local (Vite), apuntamos a localhost:3000
    // Si estamos en producción (AWS), usamos /api para que Nginx lo redirija
    baseURL: isDevelopment ? 'http://localhost:3000/api' : '/api', 
    
    // ESTO ES IMPORTANTE:
    // Permite que las cookies (JWT) se envíen y reciban entre frontend y backend
    withCredentials: true 
});

export default clienteAxios;