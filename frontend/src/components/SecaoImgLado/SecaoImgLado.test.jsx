import React from "react";
import { render, screen } from "@testing-library/react";
import SecaoImgLado from "./SecaoImgLado";
import '@testing-library/jest-dom';

describe("SecaoImgLado", () => {
  it("renderiza corretamente com os dados fornecidos", () => {
    const dadosTeste = {
      titulo: "Título Teste",
      texto: "Texto de exemplo",
      imagem: "",
      posicaoImagem: "esquerda",
    };

    render(
      <SecaoImgLado
        dados={dadosTeste}
        atualizarDados={() => {}}
        modoVisualizacao={false}
      />
    );

    const secao = screen.getByTestId("secao-imglado");
    expect(secao).toBeInTheDocument();
    expect(screen.getByText("Título Teste")).toBeInTheDocument();
    expect(screen.getByText("Texto de exemplo")).toBeInTheDocument();
  });
});
