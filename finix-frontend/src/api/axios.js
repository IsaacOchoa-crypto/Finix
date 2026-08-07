// src/api/axios.js
import axios from 'axios';

const clienteAxios = axios.create({
    // Usamos VITE_API_URL para producción, o localhost:3000 para desarrollo local
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
    
    // ESTO ES IMPORTANTE:
    // Permite que las cookies (JWT) se envíen y reciban entre frontend y backend
    withCredentials: true 
});

export default clienteAxios;