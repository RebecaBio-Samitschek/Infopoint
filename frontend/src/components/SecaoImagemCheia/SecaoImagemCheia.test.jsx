import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import SecaoImagemCheia from "./SecaoImagemCheia";

describe("SecaoImagemCheia", () => {
  const atualizarDadosMock = jest.fn();

  test("renderiza corretamente no modo de visualização com imagem padrão", () => {
    render(<SecaoImagemCheia dados={{}} modoVisualizacao={true} />);
    const secao = document.querySelector(".secao-imagem-cheia");
    expect(secao).toHaveClass("modo-visualizacao");
  });

  test("simula upload de imagem e chama atualizarDados com base64", () => {
    const file = new File(["(⌐□_□)"], "imagem.png", { type: "image/png" });

    render(
      <SecaoImagemCheia
        dados={{}}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={false}
      />
    );

    const input = screen.getByTestId("input-imagem");

    // Mock do FileReader
    const readerMock = {
      readAsDataURL: jest.fn(),
      onloadend: null,
      result: "data:image/png;base64,simulada",
    };
    window.FileReader = jest.fn(() => readerMock);

    // Dispara o change no input
    fireEvent.change(input, {
      target: { files: [file] },
    });

    // Simula o callback do onloadend
    readerMock.onloadend();

    expect(atualizarDadosMock).toHaveBeenCalledWith({
      imagem: readerMock.result,
    });
  });
});
