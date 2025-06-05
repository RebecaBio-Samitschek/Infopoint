import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import BarraEdicao from './BarraEdicao';

describe('BarraEdicao', () => {
  const aplicarEstiloMock = jest.fn();
  const onFecharMock = jest.fn();

  beforeEach(() => {
    aplicarEstiloMock.mockClear();
    onFecharMock.mockClear();

    render(
      <BarraEdicao
        aplicarEstilo={aplicarEstiloMock}
        onFechar={onFecharMock}
        visivel={true}
      />
    );
  });

  test('renderiza todos os controles principais', () => {
    expect(screen.getByTitle('Cor da fonte')).toBeInTheDocument();
    expect(screen.getByTitle('Tamanho da fonte')).toBeInTheDocument();
    expect(screen.getByTitle('Fonte')).toBeInTheDocument();
    expect(screen.getByTitle('Itálico')).toBeInTheDocument();
    expect(screen.getByTitle('Sublinhado')).toBeInTheDocument();
    expect(screen.getByTitle('Alinhar à esquerda')).toBeInTheDocument();
    expect(screen.getByTitle('Centralizar')).toBeInTheDocument();
    expect(screen.getByTitle('Alinhar à direita')).toBeInTheDocument();
    expect(screen.getByTitle('Fechar barra de edição')).toBeInTheDocument();
  });

  test('chama aplicarEstilo ao mudar a cor', () => {
    const colorInput = screen.getByTitle('Cor da fonte').querySelector('input[type="color"]');
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    expect(aplicarEstiloMock).toHaveBeenCalledWith({ color: '#ff0000' });
  });

  test('chama aplicarEstilo ao mudar o tamanho da fonte', () => {
    const selectTamanho = screen.getByTitle('Tamanho da fonte').querySelector('select');
    fireEvent.change(selectTamanho, { target: { value: '24px' } });
    expect(aplicarEstiloMock).toHaveBeenCalledWith({ fontSize: '24px' });
  });

  test('chama aplicarEstilo ao mudar a fonte', () => {
    const selectFonte = screen.getByTitle('Fonte').querySelector('select');
    fireEvent.change(selectFonte, { target: { value: 'Arial' } });
    expect(aplicarEstiloMock).toHaveBeenCalledWith({ fontFamily: 'Arial' });
  });

  test('chama onFechar ao clicar no botão de fechar', () => {
    fireEvent.click(screen.getByTitle('Fechar barra de edição'));
    expect(onFecharMock).toHaveBeenCalled();
  });
});
