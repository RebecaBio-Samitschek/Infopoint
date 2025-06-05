import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SecaoMapa from "./SecaoMapa";
import '@testing-library/jest-dom';

describe("SecaoMapa", () => {
  const dadosBase = {
    titulo: "Localização da empresa",
    endereco: "Av. Paulista, São Paulo",
    mapa: "https://www.google.com/maps?q=Av.+Paulista,+São+Paulo&output=embed"
  };

  test("renderiza corretamente em modo de visualização", () => {
    render(
      <SecaoMapa dados={dadosBase} atualizarDados={jest.fn()} modoVisualizacao={true} />
    );

    expect(screen.getByText("Localização da empresa")).toBeInTheDocument();
    expect(screen.getByTitle("Mapa")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Digite o endereço...")).not.toBeInTheDocument();
  });

  test("renderiza input de endereço no modo de edição", () => {
    render(
      <SecaoMapa dados={dadosBase} atualizarDados={jest.fn()} modoVisualizacao={false} />
    );

    const input = screen.getByPlaceholderText("Digite o endereço...");
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Av. Paulista, São Paulo");
  });

  test("renderiza placeholder quando mapa não está disponível", () => {
    render(
      <SecaoMapa dados={{ titulo: "Teste", endereco: "" }} atualizarDados={jest.fn()} modoVisualizacao={true} />
    );

    expect(screen.getByText("Mapa será exibido aqui após inserir o endereço.")).toBeInTheDocument();
  });

  test("atualiza título ao editar", () => {
    const atualizarDadosMock = jest.fn();
    render(
      <SecaoMapa dados={dadosBase} atualizarDados={atualizarDadosMock} modoVisualizacao={false} />
    );

    const titulo = screen.getByText("Localização da empresa");
    fireEvent.blur(titulo, { target: { innerText: "Novo Título" } });

    expect(atualizarDadosMock).toHaveBeenCalledWith(expect.objectContaining({ titulo: "Novo Título" }));
  });

  test("atualiza endereço ao digitar", () => {
    const atualizarDadosMock = jest.fn();
    render(
      <SecaoMapa dados={dadosBase} atualizarDados={atualizarDadosMock} modoVisualizacao={false} />
    );

    const input = screen.getByPlaceholderText("Digite o endereço...");
    fireEvent.change(input, { target: { value: "Rua Teste 123" } });

    expect(atualizarDadosMock).toHaveBeenCalledWith(expect.objectContaining({
      endereco: "Rua Teste 123",
      mapa: expect.stringContaining("Rua%20Teste%20123")
    }));
  });
});
