import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import SecaoAgenda from "./SecaoAgenda";

describe("SecaoAgenda", () => {
  const dadosMock = {
    titulo: "Título da Agenda",
    link: "https://calendar.google.com/calendar/embed?src=example"
  };

  const atualizarDadosMock = jest.fn();

  test("renderiza corretamente em modo de edição", () => {
    render(<SecaoAgenda dados={dadosMock} atualizarDados={atualizarDadosMock} modoVisualizacao={false} />);

    expect(screen.getByText("Título da Agenda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Cole aqui o link/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(dadosMock.link)).toBeInTheDocument();
  });

  test("renderiza iframe corretamente com link", () => {
    render(<SecaoAgenda dados={dadosMock} atualizarDados={atualizarDadosMock} modoVisualizacao={true} />);
    const iframe = screen.getByTitle("Google Agenda");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", dadosMock.link);
  });

  test("renderiza placeholder quando link está ausente", () => {
    render(<SecaoAgenda dados={{ titulo: "Agenda" }} atualizarDados={atualizarDadosMock} modoVisualizacao={true} />);
    expect(screen.getByText(/A agenda será exibida aqui/i)).toBeInTheDocument();
  });

  test("chama atualizarDados ao editar título", () => {
    render(<SecaoAgenda dados={dadosMock} atualizarDados={atualizarDadosMock} modoVisualizacao={false} />);
    const titulo = screen.getByText("Título da Agenda");
    fireEvent.blur(titulo, { target: { innerText: "Novo Título" } });
    expect(atualizarDadosMock).toHaveBeenCalledWith({ ...dadosMock, titulo: "Novo Título" });
  });

  test("chama atualizarDados ao alterar o link", () => {
    render(<SecaoAgenda dados={dadosMock} atualizarDados={atualizarDadosMock} modoVisualizacao={false} />);
    const input = screen.getByPlaceholderText(/Cole aqui o link/i);
    fireEvent.change(input, { target: { value: "https://novo-link.com" } });
    expect(atualizarDadosMock).toHaveBeenCalledWith({
      ...dadosMock,
      link: "https://novo-link.com",
    });
  });
});
