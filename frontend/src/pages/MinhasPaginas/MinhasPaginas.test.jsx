import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MinhasPaginas from './MinhasPaginas';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('MinhasPaginas - testes simples', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('redireciona para /login se não houver token', () => {
    render(
      <BrowserRouter>
        <MinhasPaginas />
      </BrowserRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('exibe título e botão voltar se houver token', async () => {
    localStorage.setItem('token', 'fake-token');
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <MinhasPaginas />
      </BrowserRouter>
    );

    expect(await screen.findByText('Minhas Páginas InfoPoint')).toBeInTheDocument();
    expect(screen.getByText('Voltar para o Dashboard')).toBeInTheDocument();
  });

  test('exibe mensagem de vazio quando não há páginas', async () => {
    localStorage.setItem('token', 'fake-token');
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <MinhasPaginas />
      </BrowserRouter>
    );

    expect(await screen.findByText('Você ainda não criou nenhuma página.')).toBeInTheDocument();
  });

  test('exibe páginas recebidas da API', async () => {
    localStorage.setItem('token', 'fake-token');
    const paginasMock = [
      { id: 1, titulo: 'Página 1', url: 'url-1' },
      { id: 2, titulo: 'Página 2', url: 'url-2' },
    ];
    axios.get.mockResolvedValueOnce({ data: paginasMock });

    render(
      <BrowserRouter>
        <MinhasPaginas />
      </BrowserRouter>
    );

    expect(await screen.findByText('Página 1')).toBeInTheDocument();
    expect(await screen.findByText('Página 2')).toBeInTheDocument();
  });
});
