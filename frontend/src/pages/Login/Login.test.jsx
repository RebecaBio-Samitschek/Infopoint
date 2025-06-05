import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock do axios
jest.mock('axios');

const mockLogin = jest.fn();
const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Componente Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza todos os elementos do formulário', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText(/Ainda não tem uma conta/)).toBeInTheDocument();
  });

  test('exibe erro se e-mail e senha estiverem vazios', async () => {
    renderLogin();
    fireEvent.click(screen.getByText('Entrar'));
    expect(await screen.findByText('E-mail é obrigatório.')).toBeInTheDocument();
    expect(await screen.findByText('Senha é obrigatória.')).toBeInTheDocument();
  });

  test('exibe erro se o e-mail for inválido', async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'emailinvalido' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByText('Entrar'));
    expect(await screen.findByText('E-mail inválido.')).toBeInTheDocument();
  });

  test('exibe erro se a senha for menor que 6 caracteres', async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Entrar'));
    expect(await screen.findByText('A senha deve ter pelo menos 6 caracteres.')).toBeInTheDocument();
  });

  test('chama login corretamente em caso de sucesso', async () => {
    axios.post.mockResolvedValue({
      data: {
        token: 'fake-token',
        clienteId: '123',
        nome: 'Usuário Teste',
      },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        token: 'fake-token',
        clienteId: '123',
        nome: 'Usuário Teste',
      });
    });
  });

  test('exibe alerta em caso de erro de login', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    axios.post.mockRejectedValue({
      response: { data: { mensagem: 'Credenciais inválidas' } },
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Credenciais inválidas');
    });
  });

  test('alterna visibilidade da senha ao clicar no botão', () => {
    renderLogin();

    const inputSenha = screen.getByPlaceholderText('Senha');
    const botaoOlho = screen.getByRole('button', { name: '' });

    // Padrão: tipo password
    expect(inputSenha).toHaveAttribute('type', 'password');

    fireEvent.click(botaoOlho);
    expect(inputSenha).toHaveAttribute('type', 'text');

    fireEvent.click(botaoOlho);
    expect(inputSenha).toHaveAttribute('type', 'password');
  });
});
