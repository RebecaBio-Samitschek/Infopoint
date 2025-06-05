import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { AuthContext } from '../../context/AuthContext';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('Dashboard', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const renderDashboard = (usuario = null, logout = jest.fn()) => {
    return render(
      <AuthContext.Provider value={{ usuario, logout }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('não deve renderizar nada se não houver usuário e deve redirecionar para /login', () => {
    renderDashboard(null);
    expect(screen.queryByText(/Bem-vindo ao Painel/i)).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('deve exibir nome do usuário e cards se usuário estiver logado', () => {
    renderDashboard({ nome: 'Maria' });

    expect(screen.getByText('Bem-vindo ao Painel, Maria!')).toBeInTheDocument();
    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
    expect(screen.getByText('Minhas Páginas')).toBeInTheDocument();
    expect(screen.getByText('Nova Página')).toBeInTheDocument();
  });

  it('deve navegar para /perfil ao clicar em "Editar Perfil"', () => {
    renderDashboard({ nome: 'Lucas' });

    fireEvent.click(screen.getByText('Editar Perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

  it('deve navegar para /minhas-paginas ao clicar em "Minhas Páginas"', () => {
    renderDashboard({ nome: 'Lucas' });

    fireEvent.click(screen.getByText('Minhas Páginas'));
    expect(mockNavigate).toHaveBeenCalledWith('/minhas-paginas');
  });

  it('deve navegar para /layout-personalizado ao clicar em "Nova Página"', () => {
    renderDashboard({ nome: 'Lucas' });

    fireEvent.click(screen.getByText('Nova Página'));
    expect(mockNavigate).toHaveBeenCalledWith('/layout-personalizado');
  });

  it('deve chamar logout e redirecionar para / ao clicar em "Sair"', () => {
    const mockLogout = jest.fn();
    renderDashboard({ nome: 'João' }, mockLogout);

    fireEvent.click(screen.getByRole('button', { name: /sair/i }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
