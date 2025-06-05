import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlesSecao from './ControlesSecao';

describe('ControlesSecao', () => {
  const mockDuplicar = jest.fn();
  const mockMoverCima = jest.fn();
  const mockMoverBaixo = jest.fn();
  const mockRemover = jest.fn();

  beforeEach(() => {
    render(
      <ControlesSecao
        onDuplicar={mockDuplicar}
        onMoverCima={mockMoverCima}
        onMoverBaixo={mockMoverBaixo}
        onRemover={mockRemover}
      />
    );
  });

  test('renderiza botão de mais opções', () => {
    expect(screen.getByTitle('Mais opções')).toBeInTheDocument();
  });

  test('abre e exibe os botões do menu', () => {
    fireEvent.click(screen.getByTitle('Mais opções'));
    expect(screen.getByTitle('Mover para cima')).toBeInTheDocument();
    expect(screen.getByTitle('Mover para baixo')).toBeInTheDocument();
    expect(screen.getByTitle('Duplicar seção')).toBeInTheDocument();
    expect(screen.getByTitle('Remover seção')).toBeInTheDocument();
  });

  test('chama função ao clicar em "Duplicar seção"', () => {
    fireEvent.click(screen.getByTitle('Mais opções'));
    fireEvent.click(screen.getByTitle('Duplicar seção'));
    expect(mockDuplicar).toHaveBeenCalled();
  });

  test('chama função ao clicar em "Mover para cima"', () => {
    fireEvent.click(screen.getByTitle('Mais opções'));
    fireEvent.click(screen.getByTitle('Mover para cima'));
    expect(mockMoverCima).toHaveBeenCalled();
  });

  test('chama função ao clicar em "Mover para baixo"', () => {
    fireEvent.click(screen.getByTitle('Mais opções'));
    fireEvent.click(screen.getByTitle('Mover para baixo'));
    expect(mockMoverBaixo).toHaveBeenCalled();
  });

  test('chama função ao clicar em "Remover seção"', () => {
    fireEvent.click(screen.getByTitle('Mais opções'));
    fireEvent.click(screen.getByTitle('Remover seção'));
    expect(mockRemover).toHaveBeenCalled();
  });
});
