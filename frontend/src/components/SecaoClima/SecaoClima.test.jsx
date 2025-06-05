import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SecaoClima from "./SecaoClima";
import "@testing-library/jest-dom";

// Mock global fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("SecaoClima", () => {
  const dadosMock = {
    titulo: "Clima Atual",
    cidade: "São Paulo"
  };

  const atualizarDadosMock = jest.fn();

  const mockClimaData = {
    cod: 200,
    name: "São Paulo",
    weather: [
      { description: "céu limpo", icon: "01d" }
    ],
    main: {
      temp: 25,
      humidity: 60
    },
    wind: {
      speed: 3.6
    }
  };

  test("renderiza corretamente em modo de edição", () => {
    render(
      <SecaoClima
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={false}
      />
    );

    expect(screen.getByText("Clima Atual")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite o nome da cidade/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("São Paulo")).toBeInTheDocument();
  });

  test("exibe dados do clima quando disponíveis", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockClimaData
    });

    render(
      <SecaoClima
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("São Paulo")).toBeInTheDocument();
      expect(screen.getByText(/céu limpo/i)).toBeInTheDocument();
      expect(screen.getByText(/25°C/)).toBeInTheDocument();
      expect(screen.getByText(/Umidade: 60%/)).toBeInTheDocument();
      expect(screen.getByText(/Vento: 4 km\/h/)).toBeInTheDocument(); // Arredondado
    });
  });

  test("mostra mensagem de erro quando cidade não encontrada", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ cod: "404" })
    });

    render(
      <SecaoClima
        dados={{ ...dadosMock, cidade: "CidadeInexistente" }}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Cidade não encontrada/i)).toBeInTheDocument();
    });
  });

  test("mostra placeholder quando nenhuma cidade for fornecida", () => {
    render(
      <SecaoClima
        dados={{ titulo: "Sem Cidade", cidade: "" }}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={true}
      />
    );

    expect(screen.getByText(/O clima será exibido aqui/i)).toBeInTheDocument();
  });

  test("atualiza o título ao perder o foco", () => {
    render(
      <SecaoClima
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={false}
      />
    );

    const titulo = screen.getByText("Clima Atual");
    fireEvent.blur(titulo, { target: { innerText: "Novo Título" } });

    expect(atualizarDadosMock).toHaveBeenCalledWith({
      ...dadosMock,
      titulo: "Novo Título"
    });
  });

  test("atualiza a cidade ao digitar", () => {
    render(
      <SecaoClima
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={false}
      />
    );

    const input = screen.getByPlaceholderText(/Digite o nome da cidade/i);
    fireEvent.change(input, { target: { value: "Rio de Janeiro" } });

    expect(atualizarDadosMock).toHaveBeenCalledWith({
      ...dadosMock,
      cidade: "Rio de Janeiro"
    });
  });
});
