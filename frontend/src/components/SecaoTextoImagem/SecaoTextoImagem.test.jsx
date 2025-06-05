import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SecaoTextoImagem from "./SecaoTextoImagem";
import '@testing-library/jest-dom';

describe("SecaoTextoImagem", () => {
  const mockAtualizarDados = jest.fn();

  const dadosTeste = {
    titulo: "Título Teste",
    texto: "Texto Teste",
    imagem: "", 
    estiloTitulo: { color: "blue" },
    estiloTexto: { fontStyle: "italic" },
  };

  beforeEach(() => {
    mockAtualizarDados.mockClear();
  });

  test("renderiza corretamente no modo visualização", () => {
    render(
      <SecaoTextoImagem
        dados={dadosTeste}
        atualizarDados={mockAtualizarDados}
        modoVisualizacao={true}
      />
    );

    expect(screen.getByText("Título Teste")).toBeInTheDocument();
    expect(screen.getByText("Texto Teste")).toBeInTheDocument();
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
  });

  test("permite edição de texto e título", () => {
    render(
      <SecaoTextoImagem
        dados={dadosTeste}
        atualizarDados={mockAtualizarDados}
        modoVisualizacao={false}
      />
    );

    const titulo = screen.getByText("Título Teste");
    const texto = screen.getByText("Texto Teste");

    fireEvent.blur(titulo, { target: { innerText: "Novo Título" } });
    fireEvent.blur(texto, { target: { innerText: "Novo Texto" } });

    expect(mockAtualizarDados).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: "Novo Título" })
    );
    expect(mockAtualizarDados).toHaveBeenCalledWith(
      expect.objectContaining({ texto: "Novo Texto" })
    );
  });
test("simula troca de imagem", async () => {
  // Mock do FileReader
  const mockReadAsDataURL = jest.fn();
  const mockFileReader = {
    readAsDataURL: mockReadAsDataURL,
    onloadend: null,
    result: "data:image/png;base64,imagem-fake",
  };
  jest.spyOn(window, "FileReader").mockImplementation(() => mockFileReader);

  render(
    <SecaoTextoImagem
      dados={dadosTeste}
      atualizarDados={mockAtualizarDados}
      modoVisualizacao={false}
    />
  );

  const botao = screen.getByTitle("Editar imagem");
  expect(botao).toBeInTheDocument();

  const fileInput = document.querySelector('input[type="file"]');
  expect(fileInput).toBeInTheDocument();

  fireEvent.click(botao);

  const file = new File(["img"], "imagem-teste.png", { type: "image/png" });
  fireEvent.change(fileInput, {
    target: { files: [file] },
  });

  // Simular que a leitura terminou
  mockFileReader.onloadend();

  // Verifica se a função foi chamada com a imagem
  expect(mockAtualizarDados).toHaveBeenCalledWith(
    expect.objectContaining({
      imagem: "data:image/png;base64,imagem-fake",
    })
  );
});
});
