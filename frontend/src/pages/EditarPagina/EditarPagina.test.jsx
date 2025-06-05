import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EditarPagina from './EditarPagina';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

// Mock do componente LayoutPersonalizado
jest.mock('../LayoutPersonalizado', () => () => <div>LayoutPersonalizado Mock</div>);

describe('EditarPagina', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renderiza "Carregando..." inicialmente', () => {
    render(
      <MemoryRouter initialEntries={['/editar/teste-url']}>
        <Routes>
          <Route path="/editar/:url" element={<EditarPagina />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('carrega e exibe LayoutPersonalizado ao obter os dados da página', async () => {
    const mockPagina = {
      dados: { titulo: 'Minha Página' },
      url: 'teste-url'
    };

    axios.get.mockResolvedValueOnce({ data: mockPagina });

    render(
      <MemoryRouter initialEntries={['/editar/teste-url']}>
        <Routes>
          <Route path="/editar/:url" element={<EditarPagina />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('LayoutPersonalizado Mock')).toBeInTheDocument();
    });

    expect(localStorage.getItem('urlPaginaPersonalizada')).toBe('teste-url');
  });

  it('exibe mensagem de erro se a requisição falhar', async () => {
    axios.get.mockRejectedValueOnce(new Error('Falha'));

    render(
      <MemoryRouter initialEntries={['/editar/erro-url']}>
        <Routes>
          <Route path="/editar/:url" element={<EditarPagina />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar a página.')).toBeInTheDocument();
    });
  });
});
