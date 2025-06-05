import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Permissoes from "./Permissoes";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

const mockPermissoes = [
  { clienteId: 1, email: "colab1@teste.com", permissao: "editor" },
  { clienteId: 2, email: "adm@teste.com", permissao: "adm" },
];

const mockUseParams = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ paginaId: "123" }),
  useNavigate: () => jest.fn(),
}));

const renderComRouter = () =>
  render(
    <BrowserRouter>
      <Permissoes />
    </BrowserRouter>
  );

describe("Página Permissoes", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
  });

  it("exibe o título 'Gerenciar Permissões'", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderComRouter();
    expect(await screen.findByText("Gerenciar Permissões")).toBeInTheDocument();
  });

  it("exibe lista de permissões vinda da API", async () => {
    axios.get.mockResolvedValueOnce({ data: mockPermissoes });
    renderComRouter();

    expect(await screen.findByText("colab1@teste.com")).toBeInTheDocument();
    expect(screen.getByText("adm@teste.com")).toBeInTheDocument();
  });

  it("exibe erro se falhar o carregamento da API", async () => {
    axios.get.mockRejectedValueOnce(new Error("Erro ao carregar"));
    renderComRouter();
    expect(await screen.findByText("Erro ao carregar permissões.")).toBeInTheDocument();
  });

  it("impede adicionar permissão com e-mail vazio", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderComRouter();

    fireEvent.click(await screen.findByText("Adicionar"));
    expect(await screen.findByText("Informe um e-mail válido.")).toBeInTheDocument();
  });

  it("tem botão para voltar às Minhas Páginas", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderComRouter();

    expect(await screen.findByText("Voltar")).toBeInTheDocument();
  });
});
