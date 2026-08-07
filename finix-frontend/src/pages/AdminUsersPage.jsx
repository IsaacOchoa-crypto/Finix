import React, { useState, useEffect } from 'react';
import UserModal from '../features/admin/UserModal';
import { toast } from 'sonner';
import { Search, Plus, Pencil, Trash2, User, ShieldCheck, Frown, Loader2 } from 'lucide-react';
import api from '../api/axios';

const AdminUsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const respuesta = await api.get('/usuarios');
      if (respuesta.data.datos) {
        setUsers(respuesta.data.datos);
      }
    } catch (error) {
      toast.error("Error al cargar la lista de usuarios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveUser = async (userData) => {
    // Si tienes lógica para crear/editar en el UserModal que ya hace la petición,
    // simplemente recargamos la lista aquí. Si no, deberías hacer api.post o api.put aquí.
    setIsModalOpen(false);
    cargarUsuarios();
    toast.success('Lista de usuarios actualizada');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar a este usuario permanentemente?")) return;
    
    try {
      await api.delete(`/usuarios/${id}`);
      toast.success('Usuario eliminado exitosamente');
      cargarUsuarios();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al eliminar usuario';
      toast.error(mensaje);
    }
  };

  const openEdit = (user) => { setEditingUser(user); setIsModalOpen(true); };
  const openNew = () => { setEditingUser(null); setIsModalOpen(true); };

  const liquidStyle = "bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden";

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Gestión de Usuarios</h1>
          <p className="text-gray-400">Administra los accesos y roles de la plataforma</p>
        </div>
        <button onClick={openNew} className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center gap-2 active:scale-95">
          <Plus size={20} /> Nuevo Usuario
        </button>
      </div>

      <div className={`${liquidStyle} p-4 mb-6 flex items-center transition-all focus-within:border-red-500/50 focus-within:shadow-[0_0_20px_rgba(220,38,38,0.2)]`}>
        <Search className="text-gray-500 ml-2" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o correo..." 
          className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 ml-3 outline-none" 
        />
      </div>

      <div className={liquidStyle}>
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Saldo</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={40} className="animate-spin text-red-500" />
                    <p>Cargando base de datos de usuarios...</p>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Frown size={40} className="opacity-50" />
                    <p>No se encontraron usuarios para "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition duration-150 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-400 font-bold uppercase">
                          {(user.nombre || '?').charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.nombre}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-xs font-medium bg-blue-500/10 border-blue-500/20 text-blue-400">
                        <User size={12}/> {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      ${user.saldo_total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                        <button 
                          onClick={() => openEdit(user)} 
                          className="p-2 rounded-lg transition hover:bg-white/10 text-blue-400"
                          title="Editar usuario"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 rounded-lg transition hover:bg-red-900/20 text-red-500"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} initialData={editingUser} />}
    </>
  );
};

export default AdminUsersPage;