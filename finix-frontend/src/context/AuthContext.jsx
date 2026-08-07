import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificamos la sesión inicial al cargar la app
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const respuesta = await api.get('/usuarioLogueado');
        const datosUsuario = respuesta.data.datos || respuesta.data.usuario;
        
        // Obtener el rol, priorizando el nivel raíz
        const rolDetectado = datosUsuario.tipoUsuario || datosUsuario.perfil?.tipoUsuario || 'cliente';
        
        setUser(datosUsuario);
        setRole(rolDetectado);
        setIsAuthenticated(true);
      } catch (error) {
        // No hay sesión activa o el token expiró
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  // Función auxiliar para actualizar el estado tras un login manual
  const loginAction = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const logoutAction = async () => {
    try {
      await api.get('/cerrarSesion');
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
};
