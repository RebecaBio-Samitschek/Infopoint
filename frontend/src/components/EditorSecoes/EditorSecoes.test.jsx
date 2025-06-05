import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditorSecoes from "./EditorSecoes";
import '@testing-library/jest-dom';

const mockAtualizarSecao = jest.fn();
const mockDuplicarSecao = jest.fn();
const mockMoverSecao = jest.fn();
const mockSetSecoes = jest.fn();

const secoesTeste = [
  {
    id: "1",
    tipo: "textoImagem",
    titulo: "Título de teste",
    texto: "Texto de teste",
    estiloTitulo: {},
    estiloTexto: {},
    nome: "Seção 1",
  },
];

describe("EditorSecoes", () => {
  it("renderiza uma seção e mostra controles ao clicar no menu", () => {
    const refsSecoes = { current: {} };

    render(
      <EditorSecoes
        secoes={secoesTeste}
        setSecoes={mockSetSecoes}
        atualizarSecao={mockAtualizarSecao}
        duplicarSecao={mockDuplicarSecao}
        moverSecao={mockMoverSecao}
        destacarTemporariamente={() => {}}
        indiceDestacado={null}
        refsSecoes={refsSecoes}
      />
    );

    // Verifica se o input do nome da seção aparece
    expect(screen.getByPlaceholderText("Nome da seção")).toBeInTheDocument();

    // Clica no botão de três pontinhos para abrir o menu
    const botaoMenu = screen.getByTitle("Mais opções");
    fireEvent.click(botaoMenu);

    // Verifica se os botões estão visíveis após abrir o menu
    expect(screen.getByTitle("Duplicar seção")).toBeInTheDocument();
    expect(screen.getByTitle("Remover seção")).toBeInTheDocument();
    expect(screen.getByTitle("Mover para cima")).toBeInTheDocument();
    expect(screen.getByTitle("Mover para baixo")).toBeInTheDocument();
  });
});