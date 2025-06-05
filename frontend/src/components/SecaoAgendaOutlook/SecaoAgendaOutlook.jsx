import React, { useState } from "react";
import BarraEdicao from "../BarraEdicao";
import "./SecaoAgendaOutlook.css";

const SecaoAgendaOutlook = ({ dados, atualizarDados, modoVisualizacao = false }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [targetElement, setTargetElement] = useState(null);

  const abrirEditor = (e) => {
    if (!modoVisualizacao) {
      setShowEditor(true);
      setTargetElement(e.target);
    }
  };

  return (
    <div className={`secao-edicao secao-texto-imagem ${modoVisualizacao ? "modo-visualizacao" : ""}`}>
      <div className="overlay">
        <h2
          className={!modoVisualizacao ? "ponteado-editavel" : ""}
          contentEditable={!modoVisualizacao}
          suppressContentEditableWarning
          onBlur={(e) =>
            !modoVisualizacao &&
            atualizarDados({ ...dados, titulo: e.target.innerText })
          }
          onClick={abrirEditor}
        >
          {dados.titulo || "Confira nossa agenda no Outlook"}
        </h2>

        {!modoVisualizacao && (
          <input
            type="text"
            className="input-agenda ponteado-editavel"
            placeholder="Cole aqui o link de incorporação do Outlook Agenda..."
            value={dados.link || ""}
            onChange={(e) =>
              atualizarDados({ ...dados, link: e.target.value })
            }
          />
        )}
      </div>

      <div className="agenda-container">
        {dados.link ? (
          <iframe
            src={dados.link}
            title="Outlook Agenda"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="agenda-placeholder">
            A agenda será exibida aqui após colar o link do Outlook Agenda.
          </div>
        )}
      </div>

      {!modoVisualizacao && (
        <BarraEdicao
          aplicarEstilo={(novoEstilo) => {
            if (targetElement) Object.assign(targetElement.style, novoEstilo);
          }}
          onFechar={() => setShowEditor(false)}
          visivel={showEditor}
        />
      )}
    </div>
  );
};

export default SecaoAgendaOutlook;
