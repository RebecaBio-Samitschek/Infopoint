import React, { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext';
import '@testing-library/jest-dom';


describe('AuthContext', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('deve renderizar os children', () => {
    render(
      <AuthProvider>
        <div>Conteúdo Teste</div>
      </AuthProvider>
    );
    expect(screen.getByText('Conteúdo Teste')).toBeInTheDocument();
  });

  it('deve realizar login corretamente', () => {
    const TestComponent = () => {
      const { login, usuario } = React.useContext(AuthContext);

      useEffect(() => {
        login({ token: 'abc123', clienteId: '1', nome: 'Maria' });
      }, []);

      return <div>{usuario?.nome}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(localStorage.getItem('token')).toBe('abc123');
    expect(localStorage.getItem('clienteId')).toBe('1');
    expect(localStorage.getItem('nomeUsuario')).toBe('Maria');
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('deve realizar logout corretamente', async () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('clienteId', '1');
    localStorage.setItem('nomeUsuario', 'Maria');

    const TestComponent = () => {
      const { usuario, logout } = React.useContext(AuthContext);

      useEffect(() => {
        logout();
      }, []);

      return <div>{usuario ? usuario.nome : 'Deslogado'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(null);
      expect(screen.getByText('Deslogado')).toBeInTheDocument();
    });
  });

  it('deve carregar usuário automaticamente do localStorage', async () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('nomeUsuario', 'João');

    const TestComponent = () => {
      const { usuario, carregando } = React.useContext(AuthContext);
      if (carregando) return <div>Carregando...</div>;
      return <div>{usuario ? usuario.nome : 'Nenhum usuário'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText('João')).toBeInTheDocument();
  });

  it('deve alternar carregando para false após inicialização', async () => {
    const TestComponent = () => {
      const { carregando } = React.useContext(AuthContext);
      return <div>{carregando ? 'Carregando...' : 'Pronto'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await screen.findByText('Pronto')).toBeInTheDocument();
  });
});
