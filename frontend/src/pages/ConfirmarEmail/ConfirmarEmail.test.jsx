import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ConfirmarEmail from './ConfirmarEmail';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock do axios
jest.mock('axios');

// Mock location.href
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { href: '', search: '' };
});

afterAll(() => {
  window.location = originalLocation;
});

const setUrlWithToken = (token) => {
  const url = `http://localhost/confirmar-email?token=${token}`;
  window.history.pushState({}, 'Test page', url);
  window.location.search = `?token=${token}`;
};

describe('ConfirmarEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  it('deve mostrar mensagem de token inválido se não houver token na URL', async () => {
    window.history.pushState({}, '', 'http://localhost/confirmar-email');
    window.location.search = '';
    render(<ConfirmarEmail />);
    expect(await screen.findByText('Token inválido.')).toBeInTheDocument();
  });

  it('deve confirmar email com token válido', async () => {
    axios.get.mockResolvedValueOnce({
      data: { mensagem: 'E-mail confirmado com sucesso!' }
    });

    setUrlWithToken('valid-token');
    render(<ConfirmarEmail />);

    expect(await screen.findByText('E-mail confirmado com sucesso!')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de email já confirmado', async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { mensagem: 'E-mail já confirmado.' } }
    });

    setUrlWithToken('already-confirmed');
    render(<ConfirmarEmail />);

    expect(await screen.findByText('E-mail já confirmado.')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de link inválido ou expirado', async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { mensagem: 'Token inválido ou expirado.' } }
    });

    setUrlWithToken('invalid-token');
    render(<ConfirmarEmail />);

    expect(await screen.findByText('Link inválido ou expirado.')).toBeInTheDocument();
  });

  it('deve redirecionar para login após 3 segundos se e-mail for confirmado', async () => {
    jest.useFakeTimers();

    axios.get.mockResolvedValueOnce({
      data: { mensagem: 'E-mail confirmado com sucesso!' }
    });

    setUrlWithToken('redirect-token');
    render(<ConfirmarEmail />);

    expect(await screen.findByText('E-mail confirmado com sucesso!')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(window.location.href).toBe('/login');
    });

    jest.useRealTimers();
  });
});
