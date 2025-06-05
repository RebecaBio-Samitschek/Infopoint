import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cadastro from './Cadastro';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock do axios e do navigate
jest.mock('axios');
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

const renderComRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Cadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os campos e botões', () => {
    renderComRouter(<Cadastro />);

    expect(screen.getByPlaceholderText('Nome completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirmar Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('deve exibir erros de validação se campos estiverem vazios', async () => {
    renderComRouter(<Cadastro />);

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(await screen.findByText('Nome é obrigatório.')).toBeInTheDocument();
    expect(await screen.findByText('E-mail é obrigatório.')).toBeInTheDocument();
    expect(await screen.findByText('Senha é obrigatória.')).toBeInTheDocument();
  });

  it('deve mostrar erro se e-mail for inválido', async () => {
    renderComRouter(<Cadastro />);

    fireEvent.change(screen.getByPlaceholderText('Nome completo'), {
      target: { value: 'João' }
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'emailinvalido' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar Senha'), {
      target: { value: '123456' }
    });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(await screen.findByText('E-mail inválido.')).toBeInTheDocument();
  });

  it('deve mostrar erro se senhas forem diferentes', async () => {
    renderComRouter(<Cadastro />);

    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar Senha'), {
      target: { value: 'outraSenha' }
    });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument();
  });

  it('deve chamar axios.post ao enviar dados válidos e redirecionar', async () => {
    axios.post.mockResolvedValueOnce({ data: { mensagem: 'Cadastro feito' } });

    renderComRouter(<Cadastro />);

    fireEvent.change(screen.getByPlaceholderText('Nome completo'), {
      target: { value: 'Maria' }
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'maria@email.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar Senha'), {
      target: { value: 'senha123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/clientes', {
        nome: 'Maria',
        email: 'maria@email.com',
        senha: 'senha123'
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('deve mostrar erro geral ao falhar o cadastro', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { mensagem: 'E-mail já cadastrado' } }
    });

    renderComRouter(<Cadastro />);

    fireEvent.change(screen.getByPlaceholderText('Nome completo'), {
      target: { value: 'Ana' }
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'ana@email.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha123' }
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar Senha'), {
      target: { value: 'senha123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(await screen.findByText('E-mail já cadastrado')).toBeInTheDocument();
  });
});
