import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import PaginaFinalPersonalizada from './PaginaFinalPersonalizada';
import "@testing-library/jest-dom";

jest.mock('axios');

describe('PaginaFinalPersonalizada', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('exibe mensagem de carregamento inicialmente', () => {
    render(
      <MemoryRouter initialEntries={['/pagina-exemplo']}>
        <Routes>
          <Route path="/:url" element={<PaginaFinalPersonalizada />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Carregando página...')).toBeInTheDocument();
  });

  test('renderiza seções retornadas da API', async () => {
    const secoesMock = [
      {
        tipo: 'sobre',
        titulo: 'Sua Empresa',
        subtitulo: 'Nosso lema é cuidar de você com excelência.',
        imagem: 'fundo.jpg',
      },
      {
        tipo: 'mapa',
        titulo: 'Localização da empresa',
      },
    ];

    axios.get.mockResolvedValueOnce({
      data: { dados: secoesMock },
    });

    render(
      <MemoryRouter initialEntries={['/pagina-exemplo']}>
        <Routes>
          <Route path="/:url" element={<PaginaFinalPersonalizada />} />
        </Routes>
      </MemoryRouter>
    );

    // Verifica se os títulos das seções aparecem na tela
    expect(await screen.findByText('Sua Empresa')).toBeInTheDocument();
    expect(await screen.findByText('Localização da empresa')).toBeInTheDocument();
  });

  test('exibe mensagem de erro se a API falhar', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erro ao buscar página'));

    render(
      <MemoryRouter initialEntries={['/pagina-exemplo']}>
        <Routes>
          <Route path="/:url" element={<PaginaFinalPersonalizada />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Página não encontrada ou erro ao carregar.')).toBeInTheDocument();
  });
});
