import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Perfil from "./Perfil";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("axios");

const mockCliente = {
  nome: "Usuária Teste",
  email: "teste@exemplo.com",
};

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Perfil.jsx", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockCliente });
  });

  it("exibe o título 'Meu Perfil'", async () => {
    renderWithRouter(<Perfil />);
    expect(await screen.findByText("Meu Perfil")).toBeInTheDocument();
  });

  it("renderiza os campos de nome e e-mail corretamente", async () => {
    renderWithRouter(<Perfil />);
    expect(await screen.findByDisplayValue("Usuária Teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("teste@exemplo.com")).toBeDisabled();
  });

  it("exibe erro ao tentar excluir conta sem senha", async () => {
    renderWithRouter(<Perfil />);
    const btnExcluir = await screen.findByText("Confirmar Exclusão");
    fireEvent.click(btnExcluir);
    expect(await screen.findByText("Digite sua senha para confirmar.")).toBeInTheDocument();
  });

  it("exibe botão de salvar alterações", async () => {
    renderWithRouter(<Perfil />);
    expect(await screen.findByRole("button", { name: /salvar alterações/i })).toBeInTheDocument();
  });
});
