import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SecaoAgendaOutlook from "./SecaoAgendaOutlook";
import "@testing-library/jest-dom";

describe("SecaoAgendaOutlook", () => {
  const dadosMock = {
    titulo: "Agenda Outlook",
    link: "https://outlook.office.com/owa/calendar/embed"
  };

  const atualizarDadosMock = jest.fn();

  test("renderiza corretamente em modo de edição", () => {
    render(
      <SecaoAgendaOutlook
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={false}
      />
    );

    expect(screen.getByText("Agenda Outlook")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Cole aqui o link/i)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(dadosMock.link)).toBeInTheDocument();
  });

  test("renderiza iframe corretamente com link", () => {
    render(
      <SecaoAgendaOutlook
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={true}
      />
    );

    const iframe = screen.getByTitle("Outlook Agenda");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", dadosMock.link);
  });

  test("renderiza placeholder quando link está ausente", () => {
    render(
      <SecaoAgendaOutlook
        dados={{ titulo: "Sem link" }}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={true}
      />
    );

    expect(
      screen.getByText(/A agenda será exibida aqui/i)
    ).toBeInTheDocument();
  });

  test("chama atualizarDados ao editar título", () => {
    render(
      <SecaoAgendaOutlook
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={false}
      />
    );

    const titulo = screen.getByText("Agenda Outlook");
    fireEvent.blur(titulo, { target: { innerText: "Novo Título" } });

    expect(atualizarDadosMock).toHaveBeenCalledWith({
      ...dadosMock,
      titulo: "Novo Título"
    });
  });

  test("chama atualizarDados ao digitar novo link", () => {
    render(
      <SecaoAgendaOutlook
        dados={dadosMock}
        atualizarDados={atualizarDadosMock}
        modoVisualizacao={false}
      />
    );

    const input = screen.getByPlaceholderText(/Cole aqui o link/i);
    fireEvent.change(input, { target: { value: "https://novo-link.com" } });

    expect(atualizarDadosMock).toHaveBeenCalledWith({
      ...dadosMock,
      link: "https://novo-link.com"
    });
  });
});
