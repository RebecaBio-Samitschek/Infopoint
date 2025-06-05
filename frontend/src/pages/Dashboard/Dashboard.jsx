import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';
import logoInfoPoint from '../../assets/landing/logo-infopoint.png';

function Dashboard() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

  if (!usuario) return null;

  return (
    <div className="dashboard-container">
      <div className="navbar-dashboard">
        <img src={logoInfoPoint} alt="Logo InfoPoint" className="logo-navbar" />
          <button
            className="btn-logout"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Sair
          </button>
      </div>

      <h1>Bem-vindo ao Painel, {usuario.nome}!</h1>
      <p className="subtitulo">
        Escolha uma das opções abaixo para continuar sua experiência InfoPoint:
      </p>

      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate("/perfil")}>
          <h2>Editar Perfil</h2>
          <p>Atualize suas informações de cadastro.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/minhas-paginas")}>
          <h2>Minhas Páginas</h2>
          <p>Gerencie todas as páginas que você já criou.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/layout-personalizado")}>
          <h2>Nova Página</h2>
          <p>Comece uma nova criação de InfoPoint.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
