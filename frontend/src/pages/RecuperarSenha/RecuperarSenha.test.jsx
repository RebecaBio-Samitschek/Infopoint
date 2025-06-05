import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecuperarSenha from "./RecuperarSenha";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

describe("Página RecuperarSenha", () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  it("envia o e-mail com sucesso e mostra mensagem de sucesso", async () => {
    axios.post.mockResolvedValueOnce({});

    render(<RecuperarSenha />);

    const input = screen.getByPlaceholderText("Digite seu e-mail"); // ← ESTA LINHA ESTAVA FALTANDO
    const botao = screen.getByText("Enviar link");

    fireEvent.change(input, { target: { value: "teste@exemplo.com" } });
    fireEvent.click(botao);

    await waitFor(() =>
      expect(screen.getByText("Enviamos um link de recuperação para seu e-mail!")).toBeInTheDocument()
    );

    expect(screen.getByText("Enviamos um link de recuperação para seu e-mail!")).toHaveClass("sucesso");
  });

  it("exibe mensagem de erro se a API falhar", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { mensagem: "E-mail não encontrado." } },
    });

    render(<RecuperarSenha />);
    const input = screen.getByPlaceholderText("Digite seu e-mail");
    const botao = screen.getByText("Enviar link");

    fireEvent.change(input, { target: { value: "invalido@teste.com" } });
    fireEvent.click(botao);

    await waitFor(() =>
      expect(screen.getByText("E-mail não encontrado.")).toBeInTheDocument()
    );

    expect(screen.getByText("E-mail não encontrado.")).toHaveClass("erro");
  });

  it("valida o campo obrigatório do e-mail (com required)", () => {
    render(<RecuperarSenha />);
    const input = screen.getByPlaceholderText("Digite seu e-mail");
    expect(input).toBeRequired();
  });
});