import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalConfirmacao from './ModalConfirmacao';

describe('ModalConfirmacao', () => {
  const mockConfirmar = jest.fn();
  const mockCancelar = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('não renderiza quando visivel é false', () => {
    const { container } = render(
      <ModalConfirmacao
        visivel={false}
        onConfirmar={mockConfirmar}
        onCancelar={mockCancelar}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renderiza título e mensagem quando visível', () => {
    render(
      <ModalConfirmacao
        visivel={true}
        onConfirmar={mockConfirmar}
        onCancelar={mockCancelar}
        titulo="Tem certeza?"
        mensagem="Esta ação não pode ser desfeita."
      />
    );
    expect(screen.getByText(/tem certeza/i)).toBeInTheDocument();
    expect(screen.getByText(/esta ação não pode ser desfeita/i)).toBeInTheDocument();
  });

  test('chama onConfirmar ao clicar em "Sim"', () => {
    render(
      <ModalConfirmacao
        visivel={true}
        onConfirmar={mockConfirmar}
        onCancelar={mockCancelar}
      />
    );
    fireEvent.click(screen.getByText(/sim/i));
    expect(mockConfirmar).toHaveBeenCalled();
  });

  test('chama onCancelar ao clicar em "Cancelar"', () => {
    render(
      <ModalConfirmacao
        visivel={true}
        onConfirmar={mockConfirmar}
        onCancelar={mockCancelar}
      />
    );
    fireEvent.click(screen.getByText(/cancelar/i));
    expect(mockCancelar).toHaveBeenCalled();
  });
});
