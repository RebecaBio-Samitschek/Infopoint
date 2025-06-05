import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaginaCard from './PaginaCard';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

beforeEach(() => {
  localStorage.setItem('clienteId', '1');
  localStorage.setItem('token', 'fake-token');
  window.alert = jest.fn();
  window.open = jest.fn();
  window.confirm = jest.fn(() => true);
});

describe('PaginaCard', () => {
  const pagina = {
    id: 101,
    titulo: 'Página de Teste',
    layout: 'personalizado',
    url: 'pagina-de-teste',
    clienteId: 1,
    permissao: 'adm',
  };

  const onDeleteMock = jest.fn();

  test('renderiza título e layout', () => {
    render(
      <MemoryRouter>
        <PaginaCard pagina={pagina} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Página de Teste/i)).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
        return element?.textContent === 'Layout: personalizado';
    })).toBeInTheDocument();

  });

  test('renderiza botões com base nas permissões', () => {
    render(
      <MemoryRouter>
        <PaginaCard pagina={pagina} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Copiar Link/i)).toBeInTheDocument();
    expect(screen.getByText(/Visualizar/i)).toBeInTheDocument();
    expect(screen.getByText(/Editar/i)).toBeInTheDocument();
    expect(screen.getByText(/Permissões/i)).toBeInTheDocument();
    expect(screen.getByText(/Excluir/i)).toBeInTheDocument();
  });

  test('copia link ao clicar em Copiar Link', () => {
    render(
      <MemoryRouter>
        <PaginaCard pagina={pagina} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Copiar Link/i));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('/infopoint/personalizado/pagina-de-teste')
    );
  });

  test('abre nova aba ao clicar em Visualizar', () => {
    render(
      <MemoryRouter>
        <PaginaCard pagina={pagina} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Visualizar/i));
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('/infopoint/personalizado/pagina-de-teste'),
      '_blank'
    );
  });

  test('executa exclusão após confirmação e chama onDelete', async () => {
    axios.delete.mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter>
        <PaginaCard pagina={pagina} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:5000/api/paginas/101',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer fake-token',
          }),
        })
      );
      expect(onDeleteMock).toHaveBeenCalledWith(101);
    });
  });
});
