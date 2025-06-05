import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LayoutPersonalizado from './LayoutPersonalizado';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../components/EditorSecoes/EditorSecoes', () => (props) => (
  <div data-testid="editor-secoes">EditorSecoes</div>
));
jest.mock('../../components/ModelosSecao/ModelosSecao', () => (props) => (
  <div data-testid="modelos-secao">
    <button onClick={() => props.onAdicionarSecao('sobre')}>Adicionar Sobre</button>
  </div>
));
jest.mock('../../components/ModalConfirmacao/ModalConfirmacao', () => (props) =>
  props.visivel ? (
    <div data-testid="modal-confirmacao">
      <button onClick={props.onConfirmar}>Confirmar</button>
      <button onClick={props.onCancelar}>Cancelar</button>
    </div>
  ) : null
);

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockedNavigate,
    useParams: () => ({ url: 'teste-url' }),
  };
});

// Utilitário para renderizar com router
const renderComponent = (props = {}) =>
  render(
    <MemoryRouter>
      <LayoutPersonalizado {...props} />
    </MemoryRouter>
  );

describe('LayoutPersonalizado', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockReset();
  });

  test('1. Renderiza com dadosExternos como array', () => {
    renderComponent({ dadosExternos: [{ id: '1', tipo: 'sobre' }] });
    expect(screen.getByTestId('editor-secoes')).toBeInTheDocument();
  });

  test('2. Renderiza com dadosExternos.secoes', () => {
    renderComponent({ dadosExternos: { secoes: [{ id: '1', tipo: 'sobre' }] } });
    expect(screen.getByTestId('editor-secoes')).toBeInTheDocument();
  });

  test('3. Carrega seções do localStorage se não houver dadosExternos', () => {
    localStorage.setItem('secoesPersonalizadas', JSON.stringify([{ id: '1', tipo: 'sobre' }]));
    renderComponent();
    expect(screen.getByTestId('editor-secoes')).toBeInTheDocument();
  });

  test('4. Navega ao clicar em "Voltar" sem seções', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/voltar/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('5. Exibe modal de confirmação ao clicar em "Voltar" com seções', () => {
    renderComponent({ dadosExternos: [{ id: '1', tipo: 'sobre' }] });
    fireEvent.click(screen.getByText(/voltar/i));
    expect(screen.getByTestId('modal-confirmacao')).toBeInTheDocument();
  });

  test('6. Salva no localStorage e navega ao visualizar', () => {
    renderComponent({ dadosExternos: [{ id: '1', tipo: 'sobre' }] });
    fireEvent.click(screen.getByText(/visualizar página/i));
    expect(JSON.parse(localStorage.getItem('secoesPersonalizadas')).length).toBe(1);
    expect(mockedNavigate).toHaveBeenCalledWith('/visualizar-personalizado');
  });

  test('7. Adiciona nova seção ao clicar em modelo', async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/adicionar sobre/i));
    await waitFor(() => {
      expect(screen.getByTestId('editor-secoes')).toBeInTheDocument();
    });
  });

});
