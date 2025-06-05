import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SecaoImgfundo from "./SecaoImgfundo";
import imagemDefault from "../../assets/fundo.jpg";
import '@testing-library/jest-dom';

describe("SecaoImgfundo", () => {
  test("renderiza corretamente no modo de visualização com imagem padrão", () => {
    render(<SecaoImgfundo dados={{}} modoVisualizacao={true} />);
    const secao = screen.getByTestId("secao-img-fundo");
    expect(secao).toHaveClass("modo-visualizacao");
  });

  test("permite editar o título e chama atualizarDados", () => {
    const mockAtualizar = jest.fn();
    render(
      <SecaoImgfundo dados={{ titulo: "Título original" }} atualizarDados={mockAtualizar} />
    );

    const titulo = screen.getByText("Título original");
    fireEvent.click(titulo);
    fireEvent.blur(titulo, { target: { innerText: "Novo Título" } });

    expect(mockAtualizar).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: "Novo Título" })
    );
  });

  test("permite editar o texto e chama atualizarDados", () => {
    const mockAtualizar = jest.fn();
    render(
      <SecaoImgfundo dados={{ texto: "Texto original" }} atualizarDados={mockAtualizar} />
    );

    const texto = screen.getByText("Texto original");
    fireEvent.click(texto);
    fireEvent.blur(texto, { target: { innerText: "Novo Texto" } });

    expect(mockAtualizar).toHaveBeenCalledWith(
      expect.objectContaining({ texto: "Novo Texto" })
    );
  });
});
