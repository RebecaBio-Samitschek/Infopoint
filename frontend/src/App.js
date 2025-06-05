import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil/Perfil';
import MinhasPaginas from './pages/MinhasPaginas';
import LayoutPersonalizado from './pages/LayoutPersonalizado';
import VisualizacaoPersonalizada from './pages/VisualizacaoPersonalizada/VisualizacaoPersonalizada';
import PaginaFinalPersonalizada from "./pages/PaginaFinalPersonalizada/PaginaFinalPersonalizada";
import EditarPagina from './pages/EditarPagina';
import Permissoes from './pages/Permissoes';
import ConfirmarEmail from './pages/ConfirmarEmail/ConfirmarEmail';
import RecuperarSenha from './pages/RecuperarSenha/RecuperarSenha';
import RedefinirSenha from './pages/RedefinirSenha/RedefinirSenha';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { usuario, carregando } = React.useContext(AuthContext);

  if (carregando) return <p>Carregando...</p>;

  const isAutenticado = !!usuario;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route path="/dashboard" element={isAutenticado ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/perfil" element={isAutenticado ? <Perfil /> : <Navigate to="/login" />} />
      <Route path="/layout-personalizado" element={isAutenticado ? <LayoutPersonalizado /> : <Navigate to="/login" />} />
      <Route path="/editar/:url" element={isAutenticado ? <EditarPagina /> : <Navigate to="/login" />} />
      <Route path="/minhas-paginas" element={isAutenticado ? <MinhasPaginas /> : <Navigate to="/login" />} />
      <Route path="/visualizar-personalizado" element={isAutenticado ? <VisualizacaoPersonalizada /> : <Navigate to="/login" />} />
      <Route path="/permissoes/:paginaId" element={isAutenticado ? <Permissoes /> : <Navigate to="/login" />} />

      {/* Rota pública (link compartilhável) */}
      <Route path="/infopoint/personalizado/:url" element={<PaginaFinalPersonalizada />} />
      <Route path="/confirmar-email" element={<ConfirmarEmail />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
    </Routes>
  );
}

export default App;
