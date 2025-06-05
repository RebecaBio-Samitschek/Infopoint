import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RedefinirSenha from "./RedefinirSenha";
import axios from "axios";
import "@testing-library/jest-dom";

// Simula o token na URL
const mockToken = "token123";
beforeAll(() => {
  const url = `http://localhost/redefinir-senha?token=${mockToken}`;
  Object.defineProperty(window, "location", {
    value: new URL(url),
    writable: true,
  });
});

jest.mock("axios");

describe("Página RedefinirSenha", () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  it("exibe token inválido se não houver token na URL", () => {
    // Removendo token
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/redefinir-senha"),
    });

    render(<RedefinirSenha />);

    expect(screen.getByText("Token inválido ou expirado.")).toBeInTheDocument();
  });

  it("envia nova senha com sucesso", async () => {
    axios.post.mockResolvedValueOnce({});

    // Restaurando token na URL
    Object.defineProperty(window, "location", {
      value: new URL(`http://localhost/redefinir-senha?token=${mockToken}`),
    });

    render(<RedefinirSenha />);
    const input = screen.getByPlaceholderText("Nova senha");
    const botao = screen.getByText("Redefinir");

    fireEvent.change(input, { target: { value: "novaSenhaSegura123" } });
    fireEvent.click(botao);

    await waitFor(() =>
      expect(screen.getByText("Senha redefinida com sucesso! Redirecionando...")).toBeInTheDocument()
    );
  });

  it("exibe mensagem de erro se a API falhar", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { mensagem: "Token expirado ou inválido." } },
    });

    render(<RedefinirSenha />);
    const input = screen.getByPlaceholderText("Nova senha");
    const botao = screen.getByText("Redefinir");

    fireEvent.change(input, { target: { value: "qualquerSenha" } });
    fireEvent.click(botao);

    await waitFor(() =>
      expect(screen.getByText("Token expirado ou inválido.")).toBeInTheDocument()
    );
  });

  it("valida o campo obrigatório da nova senha", () => {
    render(<RedefinirSenha />);
    const input = screen.getByPlaceholderText("Nova senha");
    expect(input).toBeRequired();
  });
});
