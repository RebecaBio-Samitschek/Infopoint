import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SecaoVideo from "./SecaoVideo";
import "@testing-library/jest-dom";

describe("SecaoVideo", () => {
  const mockAtualizarDados = jest.fn();

  const dadosComEmbed = {
    titulo: "Vídeo Teste",
    link: "https://www.youtube.com/watch?v=abcdefghijk",
    embed: "https://www.youtube.com/embed/abcdefghijk",
  };

  const dadosSemEmbed = {
    titulo: "Vídeo Teste",
    link: "",
    embed: "",
  };

  beforeEach(() => {
    mockAtualizarDados.mockClear();
  });

  test("renderiza corretamente no modo visualização com iframe", () => {
    render(
      <SecaoVideo
        dados={dadosComEmbed}
        atualizarDados={mockAtualizarDados}
        modoVisualizacao={true}
      />
    );

    expect(screen.getByText("Vídeo Teste")).toBeInTheDocument();
    expect(screen.getByTitle("Vídeo institucional")).toBeInTheDocument();
  });

  test("renderiza corretamente no modo edição com input e placeholder", () => {
    render(
      <SecaoVideo
        dados={dadosSemEmbed}
        atualizarDados={mockAtualizarDados}
        modoVisualizacao={false}
      />
    );

    expect(screen.getByText("Vídeo Teste")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/cole o link do youtube/i)).toBeInTheDocument();
    expect(screen.getByText(/o vídeo será exibido aqui/i)).toBeInTheDocument();
  });

  test("permite editar o título", () => {
    render(
      <SecaoVideo
        dados={dadosComEmbed}
        atualizarDados={mockAtualizarDados}
        modoVisualizacao={false}
      />
    );

    const titulo = screen.getByText("Vídeo Teste");

    fireEvent.blur(titulo, { target: { innerText: "Novo Título" } });

    expect(mockAtualizarDados).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: "Novo Título" })
    );
  });

  test("converte link do YouTube em embed", () => {
    render(
      <SecaoVideo
        dados={dadosSemEmbed}
        atualizarDados={mockAtualizarDados}
        modoVisualizacao={false}
      />
    );

    const input = screen.getByPlaceholderText(/cole o link do youtube/i);
    fireEvent.change(input, {
      target: {
        value: "https://www.youtube.com/watch?v=abcdefghijk",
      },
    });

    expect(mockAtualizarDados).toHaveBeenCalledWith(
      expect.objectContaining({
        link: "https://www.youtube.com/watch?v=abcdefghijk",
        embed: "https://www.youtube.com/embed/abcdefghijk",
      })
    );
  });

  test("exibe placeholder se embed estiver vazio", () => {
    render(
      <SecaoVideo
        dados={{ ...dadosSemEmbed }}
        atualizarDados={mockAtualizarDados}
        modoVisualizacao={true}
      />
    );

    expect(screen.getByText(/o vídeo será exibido aqui/i)).toBeInTheDocument();
  });
});
