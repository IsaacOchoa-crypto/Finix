// src/api/axios.js
import axios from 'axios';

const clienteAxios = axios.create({
    // Agregamos el puerto :3000 que es donde escucha tu Express
    baseURL: 'http://localhost:3000/api', 
    
    // ESTO ES IMPORTANTE:
    // Permite que las cookies (JWT) se envíen y reciban entre frontend y backend
    withCredentials: true 
});

export default clienteAxios;