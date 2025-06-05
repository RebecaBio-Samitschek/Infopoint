import React from "react";
import "./ModalConfirmacao.css";

const ModalConfirmacao = ({
  visivel,
  onConfirmar,
  onCancelar,
  titulo = "Deseja mesmo excluir esta seção?",
  mensagem = ""
}) => {
  if (!visivel) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{titulo}</h3>
        {mensagem && <p>{mensagem}</p>}
        <div className="modal-botoes">
          <button className="confirmar" onClick={onConfirmar}>Sim</button>
          <button className="cancelar" onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
