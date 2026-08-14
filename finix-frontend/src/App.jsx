import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages - CORREGIDO: Importar Landing y Login por separado
import LandingPage from './pages/LandingPage'; // Antes decía LoginPage aquí
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';

import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import AiAgentPage from './pages/AiAgentPage';
import NotFoundPage from './pages/NotFoundPage'; 

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSubscriptionsPage from './pages/AdminSubscriptionsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" richColors theme="dark" />
      
      <Routes>
        {/* Ruta Raíz */}
        <Route path="/" element={<LandingPage />} />
        
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- RUTAS PRIVADAS (USUARIO) --- */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/ai-agent" element={<AiAgentPage />} />
        </Route>

        {/* --- RUTAS DE ADMIN --- */}
        <Route element={<AdminLayout />}>
           {/* Redirigir la ruta raíz de admin al panel de usuarios */}
           <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
           
           {/* La ruta exacta que el sidebar intenta abrir */}
           <Route path="/admin/users" element={<AdminUsersPage />} />
           
           <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
           <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
           <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        {/* --- RUTA 404 --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;